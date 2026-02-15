function haversine(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
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

export function getNextTarget(currentPosition, bins, collectedIds, load, capacity, landfillCoord) {
  if (load >= capacity && landfillCoord) {
    return {
      target: { id: 'landfill', coordinates: [...landfillCoord], type: 'landfill' },
      type: 'landfill',
    };
  }

  const fullBins = bins.filter(
    b => b.status === 'full' && !collectedIds.has(b.id) && b.coordinates
  );

  if (fullBins.length === 0) {
    if (load > 0 && landfillCoord) {
      return {
        target: { id: 'landfill', coordinates: [...landfillCoord], type: 'landfill' },
        type: 'landfill',
      };
    }
    return { target: null, type: null };
  }

  let nearestFull = null;
  let nearestDist = Infinity;
  for (const b of fullBins) {
    const d = haversine(currentPosition, b.coordinates);
    if (d < nearestDist) { nearestDist = d; nearestFull = b; }
  }
  if (!nearestFull) return { target: null, type: null };

  const halfBins = bins.filter(
    b => b.status === 'half' && !collectedIds.has(b.id) && b.coordinates
  );
  const ON_PATH_KM = 0.12;
  let bestHalf = null;
  let bestHalfDist = Infinity;
  for (const h of halfBins) {
    const d = distToSegment(h.coordinates, currentPosition, nearestFull.coordinates);
    if (d <= ON_PATH_KM && d < bestHalfDist) {
      bestHalfDist = d;
      bestHalf = h;
    }
  }

  if (bestHalf && load < capacity) {
    return {
      target: { ...bestHalf, type: 'bin' },
      type: 'bin',
    };
  }

  return {
    target: { ...nearestFull, type: 'bin' },
    type: 'bin',
  };
}
