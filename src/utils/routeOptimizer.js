import { FUEL_CONSUMPTION_PER_100KM } from '../data/kyzylorda';

function haversine(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function binPriority(status) {
  if (status === 'full') return 3;
  if (status === 'half') return 1.5;
  return 0;
}

function distToSegment(point, segA, segB) {
  const [px, py] = point;
  const [ax, ay] = segA;
  const [bx, by] = segB;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1e-9;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (len * len)));
  const proj = [ax + t * dx, ay + t * dy];
  return haversine(point, proj);
}

export function buildOptimalRoute({ start, bins, capacity = 12, landfillCoord, fuelLevel = 100 }) {
  const fullBins = bins.filter(b => b.status === 'full').map(b => ({ ...b }));
  const halfBins = bins.filter(b => b.status === 'half').map(b => ({ ...b }));

  const route = [];
  let currentPos = start;
  let loaded = 0;
  let totalDistance = 0;
  let fuel = fuelLevel;

  while (fullBins.length > 0 && loaded < capacity) {
    let bestIdx = -1;
    let bestDist = Infinity;

    for (let i = 0; i < fullBins.length; i++) {
      const dist = haversine(currentPos, fullBins[i].coordinates);
      const fuelNeeded = dist * (FUEL_CONSUMPTION_PER_100KM / 100);
      const fuelToLandfill = landfillCoord
        ? haversine(fullBins[i].coordinates, landfillCoord) * (FUEL_CONSUMPTION_PER_100KM / 100)
        : 0;
      if (fuel - fuelNeeded - fuelToLandfill < 5) continue;
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    }

    if (bestIdx === -1) break;

    const next = fullBins.splice(bestIdx, 1)[0];
    const dist = haversine(currentPos, next.coordinates);
    totalDistance += dist;
    fuel -= dist * (FUEL_CONSUMPTION_PER_100KM / 100);
    currentPos = next.coordinates;
    loaded++;

    route.push({ ...next, distFromPrev: dist, stopNumber: loaded, fuelAtArrival: Math.round(fuel * 10) / 10 });
  }

  const ON_PATH_KM = 0.12;
  const usedHalf = new Set();
  const finalRoute = [];
  let pos = start;
  loaded = 0;
  totalDistance = 0;
  fuel = fuelLevel;
  const fullRoute = [...route];
  route.length = 0;

  for (const next of fullRoute) {
    if (loaded >= capacity) break;
    const distToNext = haversine(pos, next.coordinates);
    let bestHalf = null;
    let bestHalfDist = Infinity;
    for (const half of halfBins) {
      if (usedHalf.has(half.id)) continue;
      const d = distToSegment(half.coordinates, pos, next.coordinates);
      if (d <= ON_PATH_KM && d < bestHalfDist) {
        bestHalfDist = d;
        bestHalf = half;
      }
    }
    if (bestHalf && loaded < capacity) {
      const distToHalf = haversine(pos, bestHalf.coordinates);
      const fuelNeeded = distToHalf * (FUEL_CONSUMPTION_PER_100KM / 100);
      const fuelToLandfill = landfillCoord
        ? haversine(bestHalf.coordinates, landfillCoord) * (FUEL_CONSUMPTION_PER_100KM / 100)
        : 0;
      if (fuel - fuelNeeded - fuelToLandfill >= 5) {
        totalDistance += distToHalf;
        fuel -= distToHalf * (FUEL_CONSUMPTION_PER_100KM / 100);
        pos = bestHalf.coordinates;
        loaded++;
        finalRoute.push({ ...bestHalf, distFromPrev: distToHalf, stopNumber: loaded, fuelAtArrival: Math.round(fuel * 10) / 10 });
        usedHalf.add(bestHalf.id);
      }
    }
    totalDistance += distToNext;
    fuel -= distToNext * (FUEL_CONSUMPTION_PER_100KM / 100);
    pos = next.coordinates;
    loaded++;
    finalRoute.push({ ...next, distFromPrev: distToNext, stopNumber: loaded, fuelAtArrival: Math.round(fuel * 10) / 10 });
  }
  route.length = 0;
  route.push(...finalRoute);

  if (landfillCoord && loaded >= capacity) {
    const dist = haversine(pos, landfillCoord);
    totalDistance += dist;
    fuel -= dist * (FUEL_CONSUMPTION_PER_100KM / 100);
    route.push({
      id: 'landfill',
      coordinates: landfillCoord,
      type: 'landfill',
      distFromPrev: dist,
      stopNumber: loaded + 1,
      fuelAtArrival: Math.round(fuel * 10) / 10,
    });
  }

  const estimatedMinutes = (totalDistance / 25) * 60 + loaded * 3;
  const fuelUsed = fuelLevel - fuel;
  const naiveDistance = computeNaiveDistance(start, route.filter(r => r.type !== 'landfill'), landfillCoord);

  return {
    route,
    totalDistance: Math.round(totalDistance * 100) / 100,
    estimatedMinutes: Math.round(estimatedMinutes),
    binsToService: loaded,
    fuelUsed: Math.round(fuelUsed * 10) / 10,
    fuelRemaining: Math.round(fuel * 10) / 10,
    naiveDistance: Math.round(naiveDistance * 100) / 100,
    distanceSaved: Math.round((naiveDistance - totalDistance) * 100) / 100,
    fuelSaved: Math.round((naiveDistance - totalDistance) * (FUEL_CONSUMPTION_PER_100KM / 100) * 10) / 10,
    efficiencyGain: naiveDistance > 0 ? Math.round(((naiveDistance - totalDistance) / naiveDistance) * 100) : 0,
  };
}

function computeNaiveDistance(start, bins, landfillCoord) {
  if (!bins || bins.length === 0) return 0;
  let dist = 0;
  let pos = start;
  for (const bin of bins) {
    if (bin.coordinates) {
      dist += haversine(pos, bin.coordinates);
      pos = bin.coordinates;
    }
  }
  if (landfillCoord) dist += haversine(pos, landfillCoord);
  return dist;
}

export function generateAlgorithmSteps({ start, bins, capacity = 12 }) {
  const steps = [];
  const serviceable = bins.filter(b => (b.status === 'full' || b.status === 'half') && b.coordinates).map(b => ({ ...b }));
  let currentPos = start;
  let loaded = 0;

  steps.push({
    type: 'init',
    description: 'Инициализация: определение текущей позиции и доступных баков',
    evaluated: serviceable.length,
    position: currentPos,
  });

  while (serviceable.length > 0 && loaded < capacity) {
    const candidates = [];
    for (let i = 0; i < serviceable.length; i++) {
      const dist = haversine(currentPos, serviceable[i].coordinates);
      const prio = binPriority(serviceable[i].status);
      if (prio === 0) continue;
      candidates.push({ index: i, dist, prio, score: dist / prio, bin: serviceable[i] });
    }

    if (candidates.length === 0) break;

    candidates.sort((a, b) => a.score - b.score);

    steps.push({
      type: 'evaluate',
      description: `Оценка ${candidates.length} кандидатов. Лучший: ${candidates[0].bin.address} (расст: ${candidates[0].dist.toFixed(2)} км, приоритет: ${candidates[0].prio})`,
      candidates: candidates.slice(0, 5),
      chosen: candidates[0],
      position: currentPos,
    });

    const chosen = candidates[0];
    serviceable.splice(chosen.index, 1);
    currentPos = chosen.bin.coordinates;
    loaded++;

    steps.push({
      type: 'move',
      description: `Перемещение к ${chosen.bin.address}. Обслуживание бака. Загрузка: ${loaded}/${capacity}`,
      position: currentPos,
      loaded,
    });
  }

  steps.push({
    type: 'complete',
    description: `Маршрут завершён. Обслужено ${loaded} баков.`,
    totalStops: loaded,
  });

  return steps;
}
