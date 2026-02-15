const routeCache = new Map();

export function clearRouteCache() {
  routeCache.clear();
}

function cacheKeyMulti(points) {
  return points.map(p => `${p[0].toFixed(4)},${p[1].toFixed(4)}`).join('|');
}

function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function densifyPath(points, maxGap = 0.00005) {
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

export async function fetchRoadRouteWaypoints(points) {
  if (!points || points.length < 2) return points || [];

  const key = cacheKeyMulti(points);
  if (routeCache.has(key)) return routeCache.get(key);

  try {
    if (window.ymaps) {
      await new Promise((res) => { if (window.ymaps.ready) window.ymaps.ready(res); else res(); });
      const result = await new Promise((resolve, reject) => {
        window.ymaps.route(points, {
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
    console.warn('Road route API fallback:', e.message || e);
  }

  const allWaypoints = [];
  for (let i = 0; i < points.length - 1; i++) {
    const seg = createGridPath(points[i], points[i + 1]);
    if (i === 0) allWaypoints.push(...seg);
    else allWaypoints.push(...seg.slice(1));
  }
  routeCache.set(key, allWaypoints);
  return allWaypoints;
}
