import { FUEL_CONSUMPTION_PER_100KM, TRUCK_BIN_CAPACITY } from '../data/kyzylorda';
import { fetchRoadRouteWaypoints } from './roadRoute';

export const VehicleState = {
  IDLE: 'idle',
  FETCHING_ROUTE: 'fetching_route',
  DRIVING_TO_BIN: 'driving_to_bin',
  SERVICING: 'servicing',
  FETCHING_TO_LANDFILL: 'fetching_to_landfill',
  DRIVING_TO_LANDFILL: 'driving_to_landfill',
  DUMPING: 'dumping',
  FETCHING_TO_BASE: 'fetching_to_base',
  DRIVING_TO_BASE: 'driving_to_base',
  FETCHING_EXPRESS_ROUTE: 'fetching_express_route',
  DRIVING_EXPRESS: 'driving_express',
  SERVICING_EXPRESS: 'servicing_express',
};

function haversine(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

const routeCache = new Map();

function cacheKey(from, to) {
  return `${from[0].toFixed(4)},${from[1].toFixed(4)}->${to[0].toFixed(4)},${to[1].toFixed(4)}`;
}

async function fetchRoadWaypoints(from, to) {
  const key = cacheKey(from, to);
  if (routeCache.has(key)) return routeCache.get(key);

  try {
    if (window.ymaps) {
      const result = await new Promise((resolve, reject) => {
        window.ymaps.route([from, to], {
          mapStateAutoApply: false,
          avoidTrafficJams: false,
        }).then(resolve, reject);
      });

      const paths = result.getPaths();
      const waypoints = [];

      for (let p = 0; p < paths.getLength(); p++) {
        const path = paths.get(p);
        const coords = path.geometry.getCoordinates();
        for (const c of coords) {
          waypoints.push([c[0], c[1]]);
        }
      }

      if (waypoints.length >= 2) {
        const dense = densifyPath(waypoints, 0.00005);
        routeCache.set(key, dense);
        return dense;
      }
    }
  } catch (e) {
    console.warn('Route API fallback:', e.message || e);
  }

  const dense = createGridPath(from, to);
  routeCache.set(key, dense);
  return dense;
}

function densifyPath(points, maxGap) {
  if (points.length < 2) return points;
  const result = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dist = Math.hypot(curr[0] - prev[0], curr[1] - prev[1]);
    const steps = Math.ceil(dist / maxGap);
    for (let s = 1; s <= steps; s++) {
      result.push(lerp(prev, curr, s / steps));
    }
  }
  return result;
}

function createGridPath(from, to) {
  const steps = 60;
  const mid = [from[0], to[1]];
  const half = Math.floor(steps / 2);
  const points = [];
  for (let i = 0; i <= half; i++) {
    points.push(lerp(from, mid, i / half));
  }
  for (let i = 1; i <= steps - half; i++) {
    points.push(lerp(mid, to, i / (steps - half)));
  }
  return points;
}

export class SimulationEngine {
  constructor({ bins, trucks, base, landfill, onUpdate }) {
    this.bins = bins.map(b => ({ ...b }));
    this.activeTrucks = trucks
      .filter(t => t.status === 'active')
      .map(t => ({
        ...t,
        state: VehicleState.IDLE,
        targetBinId: null,
        currentLoad: 0,
        binsServiced: 0,
        servicingTimer: 0,
        dumpingTimer: 0,
        totalKm: t.totalKmDriven || 0,
        fuelUsed: 0,
        fuelLevel: (t.fuelLevel / 100) * (t.fuelCapacity || 120),
        fuelCapacity: t.fuelCapacity || 120,
        totalBinsServiced: t.totalBinsServiced || 0,
        waypoints: [],
        waypointIdx: 0,
        waypointFrac: 0,
      }));
    this.inactiveTrucks = trucks
      .filter(t => t.status !== 'active')
      .map(t => ({ ...t, state: null, waypoints: [] }));

    this.claimedBins = new Set();
    this.base = base;
    this.landfill = landfill;
    this.onUpdate = onUpdate;
    this.expressOrders = new Map();
    this.rafId = null;
    this.lastTime = 0;
    this.tickAccum = 0;
    this.tickCount = 0;
    this.waypointSpeed = 15;
    this.serviceTime = 90;
    this.dumpTime = 120;
  }

  start() {
    if (this.rafId) return;
    this.lastTime = performance.now();
    const loop = (now) => {
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      this.update(dt);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
  }

  addExpressOrder(truckId, orderId, bins, onComplete) {
    if (!bins || bins.length === 0) return;
    const truck = this.activeTrucks.find(t => t.id === truckId);
    if (!truck) return;
    if (truck.targetBinId) this.claimedBins.delete(truck.targetBinId);
    truck.targetBinId = null;
    truck.waypoints = [];
    truck.expressOrder = {
      orderId,
      bins: bins.map(b => ({ id: b.id, coordinates: [...b.coordinates] })),
      currentIdx: 0,
      onComplete,
    };
    truck.state = VehicleState.FETCHING_EXPRESS_ROUTE;
    bins.forEach(b => this.claimedBins.add(b.id));
    fetchRoadRouteWaypoints([truck.coordinates, bins[0].coordinates]).then(wp => {
      if (truck.expressOrder && truck.expressOrder.orderId === orderId && truck.state === VehicleState.FETCHING_EXPRESS_ROUTE) {
        truck.waypoints = wp;
        truck.waypointIdx = 0;
        truck.waypointFrac = 0;
        truck.targetBinId = bins[0].id;
        truck.state = VehicleState.DRIVING_EXPRESS;
      }
    });
  }

  getState() {
    return {
      bins: this.bins.map(b => ({ ...b })),
      trucks: [
        ...this.activeTrucks.map(t => ({
          ...t,
          fuelLevel: Math.round((t.fuelLevel / t.fuelCapacity) * 100),
          coordinates: [...t.coordinates],
          waypoints: t.waypoints ? t.waypoints.slice(t.waypointIdx) : [],
        })),
        ...this.inactiveTrucks.map(t => ({ ...t })),
      ],
      tickCount: this.tickCount,
    };
  }

  findNearestFullBin(truckCoords) {
    let best = null, bestScore = Infinity;
    for (const bin of this.bins) {
      if (bin.status !== 'full' && bin.status !== 'half') continue;
      if (this.claimedBins.has(bin.id)) continue;
      const dist = haversine(truckCoords, bin.coordinates);
      const prio = bin.status === 'full' ? 1 : 2.5;
      const score = dist * prio;
      if (score < bestScore) { bestScore = score; best = bin; }
    }
    return best;
  }

  consumeFuel(truck, distKm) {
    truck.fuelLevel = Math.max(0, truck.fuelLevel - distKm * (FUEL_CONSUMPTION_PER_100KM / 100));
    truck.fuelUsed += distKm * (FUEL_CONSUMPTION_PER_100KM / 100);
  }

  advanceTruck(truck, steps) {
    if (!truck.waypoints || truck.waypoints.length < 2) return true;
    truck.waypointFrac += steps;
    while (truck.waypointFrac >= 1 && truck.waypointIdx < truck.waypoints.length - 1) {
      truck.waypointFrac -= 1;
      const from = truck.waypoints[truck.waypointIdx];
      truck.waypointIdx++;
      const to = truck.waypoints[truck.waypointIdx];
      const dist = haversine(from, to);
      truck.totalKm += dist;
      this.consumeFuel(truck, dist);
    }
    if (truck.waypointIdx < truck.waypoints.length - 1) {
      const a = truck.waypoints[truck.waypointIdx];
      const b = truck.waypoints[truck.waypointIdx + 1];
      const frac = Math.min(truck.waypointFrac, 1);
      truck.coordinates = lerp(a, b, frac);
      return false;
    }
    truck.coordinates = [...truck.waypoints[truck.waypoints.length - 1]];
    return true;
  }

  update(dt) {
    this.tickCount++;

    if (this.tickCount % 100 === 0) {
      for (const bin of this.bins) {
        if (bin.status === 'empty' && Math.random() < 0.15) {
          bin.status = 'half'; bin.fillLevel = 140;
        } else if (bin.status === 'half' && Math.random() < 0.08) {
          bin.status = 'full'; bin.fillLevel = 275;
        }
      }
    }

    const steps = dt * this.waypointSpeed;

    for (const truck of this.activeTrucks) {
      switch (truck.state) {
        case VehicleState.IDLE: {
          const target = this.findNearestFullBin(truck.coordinates);
          if (target) {
            truck.targetBinId = target.id;
            this.claimedBins.add(target.id);
            truck.state = VehicleState.FETCHING_ROUTE;
            fetchRoadWaypoints(truck.coordinates, target.coordinates).then(wp => {
              if (truck.state === VehicleState.FETCHING_ROUTE && truck.targetBinId === target.id) {
                truck.waypoints = wp;
                truck.waypointIdx = 0;
                truck.waypointFrac = 0;
                truck.state = VehicleState.DRIVING_TO_BIN;
              }
            });
          }
          break;
        }

        case VehicleState.FETCHING_ROUTE:
        case VehicleState.FETCHING_TO_LANDFILL:
        case VehicleState.FETCHING_TO_BASE:
        case VehicleState.FETCHING_EXPRESS_ROUTE:
          break;

        case VehicleState.DRIVING_EXPRESS: {
          if (this.advanceTruck(truck, steps)) {
            truck.state = VehicleState.SERVICING_EXPRESS;
            truck.servicingTimer = 0;
          }
          break;
        }

        case VehicleState.SERVICING_EXPRESS: {
          truck.servicingTimer++;
          if (truck.servicingTimer >= this.serviceTime) {
            const exp = truck.expressOrder;
            const bin = this.bins.find(b => b.id === truck.targetBinId);
            if (bin) { bin.status = 'empty'; bin.fillLevel = 0; }
            this.claimedBins.delete(truck.targetBinId);
            truck.currentLoad++;
            truck.binsServiced++;
            truck.totalBinsServiced++;
            exp.currentIdx++;
            if (exp.currentIdx >= exp.bins.length) {
              exp.bins.forEach(b => this.claimedBins.delete(b.id));
              truck.expressOrder = null;
              truck.targetBinId = null;
              truck.waypoints = [];
              truck.state = VehicleState.IDLE;
              exp.onComplete?.(exp.orderId);
            } else {
              const nextBin = exp.bins[exp.currentIdx];
              truck.targetBinId = nextBin.id;
              truck.state = VehicleState.FETCHING_EXPRESS_ROUTE;
              fetchRoadRouteWaypoints([truck.coordinates, nextBin.coordinates]).then(wp => {
                if (truck.expressOrder && truck.expressOrder.orderId === exp.orderId && truck.state === VehicleState.FETCHING_EXPRESS_ROUTE) {
                  truck.waypoints = wp;
                  truck.waypointIdx = 0;
                  truck.waypointFrac = 0;
                  truck.state = VehicleState.DRIVING_EXPRESS;
                }
              });
            }
          }
          break;
        }

        case VehicleState.DRIVING_TO_BIN: {
          if (this.advanceTruck(truck, steps)) {
            truck.state = VehicleState.SERVICING;
            truck.servicingTimer = 0;
          }
          break;
        }

        case VehicleState.SERVICING: {
          truck.servicingTimer++;
          if (truck.servicingTimer >= this.serviceTime) {
            const bin = this.bins.find(b => b.id === truck.targetBinId);
            if (bin) { bin.status = 'empty'; bin.fillLevel = 0; }
            this.claimedBins.delete(truck.targetBinId);
            truck.targetBinId = null;
            truck.waypoints = [];
            truck.currentLoad++;
            truck.binsServiced++;
            truck.totalBinsServiced++;

            if (truck.currentLoad >= TRUCK_BIN_CAPACITY) {
              truck.state = VehicleState.FETCHING_TO_LANDFILL;
              fetchRoadWaypoints(truck.coordinates, this.landfill.coordinates).then(wp => {
                if (truck.state === VehicleState.FETCHING_TO_LANDFILL) {
                  truck.waypoints = wp; truck.waypointIdx = 0; truck.waypointFrac = 0;
                  truck.state = VehicleState.DRIVING_TO_LANDFILL;
                }
              });
            } else {
              truck.state = VehicleState.IDLE;
            }
          }
          break;
        }

        case VehicleState.DRIVING_TO_LANDFILL: {
          if (this.advanceTruck(truck, steps)) {
            truck.state = VehicleState.DUMPING;
            truck.dumpingTimer = 0;
          }
          break;
        }

        case VehicleState.DUMPING: {
          truck.dumpingTimer++;
          if (truck.dumpingTimer >= this.dumpTime) {
            truck.currentLoad = 0;
            truck.waypoints = [];
            truck.state = VehicleState.FETCHING_TO_BASE;
            fetchRoadWaypoints(truck.coordinates, this.base.coordinates).then(wp => {
              if (truck.state === VehicleState.FETCHING_TO_BASE) {
                truck.waypoints = wp; truck.waypointIdx = 0; truck.waypointFrac = 0;
                truck.state = VehicleState.DRIVING_TO_BASE;
              }
            });
          }
          break;
        }

        case VehicleState.DRIVING_TO_BASE: {
          if (this.advanceTruck(truck, steps)) {
            truck.fuelLevel = truck.fuelCapacity;
            truck.waypoints = [];
            truck.state = VehicleState.IDLE;
          }
          break;
        }

        default:
          truck.state = VehicleState.IDLE;
      }
    }

    if (this.tickCount % 3 === 0) {
      this.onUpdate?.(this.getState());
    }
  }
}
