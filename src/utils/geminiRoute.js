const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function haversine(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export async function optimizeRouteWithGemini({ start, bins, capacity = 12, landfillCoord }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY not set');
  }

  const serviceable = bins
    .filter(b => b.status === 'full' || b.status === 'half')
    .slice(0, capacity * 2)
    .map((b, i) => ({
      idx: i,
      id: b.id,
      lat: b.coordinates[0].toFixed(5),
      lng: b.coordinates[1].toFixed(5),
      status: b.status,
      addr: (b.address || b.id).slice(0, 50),
    }));

  if (serviceable.length === 0) {
    return { route: [], totalDistance: 0, binsToService: 0, source: 'gemini_empty' };
  }

  const prompt = `Ты оптимизатор маршрутов вывоза мусора. Порядок: strict nearest-neighbor — всегда следующий ближайший.

Старт: [${start[0].toFixed(5)}, ${start[1].toFixed(5)}]
Свалка: [${landfillCoord[0].toFixed(5)}, ${landfillCoord[1].toFixed(5)}]
Вместимость: ${capacity} контейнеров (после — на свалку).

Контейнеры (id, lat, lng, status):
${serviceable.map(b => `${b.id}|${b.lat},${b.lng}|${b.status}`).join('\n')}

Правила: ТОЛЬКО full и half (empty игнорируй). Строгий nearest-neighbor: каждый следующий — ближайший к текущей позиции. НЕ делать крюки. Ответь ТОЛЬКО списком id через запятую, например: BIN-001,BIN-042,BIN-018`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const ids = text
      .replace(/\n/g, ',')
      .split(',')
      .map(s => s.trim().replace(/^[#\d.]+\.?\s*/, ''))
      .filter(Boolean);

    const fullBins = bins.filter(b => b.status === 'full' || b.status === 'half');
    const binById = new Map(fullBins.map(b => [b.id, b]));
    const usedIds = new Set();

    const route = [];
    let currentPos = start;
    let totalDistance = 0;
    let loaded = 0;

    const findBin = (id) => {
      const norm = (s) => String(s).replace(/\s/g, '').toUpperCase();
      const n = norm(id);
      for (const b of fullBins) {
        if (usedIds.has(b.id)) continue;
        if (norm(b.id) === n || norm(b.id).endsWith(n) || norm(b.id).includes(n)) return b;
      }
      return binById.get(id);
    };

    for (const id of ids) {
      if (loaded >= capacity) break;
      const bin = findBin(id);
      if (!bin) continue;
      usedIds.add(bin.id);

      const dist = haversine(currentPos, bin.coordinates);
      totalDistance += dist;
      currentPos = bin.coordinates;
      loaded++;

      route.push({
        ...bin,
        distFromPrev: dist,
        stopNumber: loaded,
      });
    }

    if (loaded >= capacity && landfillCoord) {
      const dist = haversine(currentPos, landfillCoord);
      totalDistance += dist;
      route.push({
        id: 'landfill',
        coordinates: landfillCoord,
        type: 'landfill',
        distFromPrev: dist,
        stopNumber: loaded + 1,
      });
    }

    const estimatedMinutes = Math.round((totalDistance / 25) * 60 + loaded * 3);

    return {
      route,
      totalDistance: Math.round(totalDistance * 100) / 100,
      estimatedMinutes,
      binsToService: loaded,
      fuelUsed: Math.round(totalDistance * 0.35 * 10) / 10,
      source: 'gemini',
    };
  } catch (e) {
    console.warn('Gemini route optimization failed:', e.message);
    throw e;
  }
}
