import React, { useEffect, useRef } from 'react';
import { CITY_CENTER, DEFAULT_ZOOM, getBinIcon, MAP_ICONS } from '../data/kyzylorda';
import './YandexMap.css';

export default function YandexMap({
  center = CITY_CENTER,
  zoom = DEFAULT_ZOOM,
  bins = [],
  trucks = [],
  houses = [],
  base = null,
  landfill = null,
  route = [],
  truckRoutes = [],
  onBinClick,
  onTruckClick,
  showBins = true,
  showTrucks = true,
  showHouses = false,
  showBase = true,
  showLandfill = true,
  showRoute = false,
  routeColor,
  routeFirstSegment,
  routeVersion = 0,
  houseIconSize,
  truckIconSize,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const readyRef = useRef(false);

  const clustererRef = useRef(null);
  const truckMarksRef = useRef({});
  const houseMarksRef = useRef([]);
  const baseMarkRef = useRef(null);
  const landfillMarkRef = useRef(null);
  const routeLineRef = useRef(null);
  const routeFirstSegmentRef = useRef(null);
  const truckRouteLinesRef = useRef({});
  const prevTruckRouteKeysRef = useRef('');
  const prevRouteKeyRef = useRef('');
  const prevBaseRef = useRef(null);
  const prevLandfillRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = { bins, trucks, houses, base, landfill, route, truckRoutes, showBins, showTrucks, showHouses, showBase, showLandfill, showRoute, routeColor, routeFirstSegment, routeVersion, houseIconSize, truckIconSize, onBinClick, onTruckClick };

  const prevBinsKeyRef = useRef('');
  const prevHousesRef = useRef(null);

  useEffect(() => {
    const check = () => {
      if (!window.ymaps || !containerRef.current) { setTimeout(check, 300); return; }
      window.ymaps.ready(() => {
        if (mapRef.current) return;
        const map = new window.ymaps.Map(containerRef.current, {
          center, zoom,
          controls: ['zoomControl', 'fullscreenControl'],
        }, { suppressMapOpenBlock: true });
        map.behaviors.enable(['scrollZoom', 'multiTouch', 'drag']);
        mapRef.current = map;
        readyRef.current = true;
        fullUpdate();
      });
    };
    check();
    return () => {
      if (mapRef.current) { mapRef.current.destroy(); mapRef.current = null; readyRef.current = false; }
    };
  }, []);

  useEffect(() => {
    if (!readyRef.current) return;
    const p = propsRef.current;

    updateTruckPositions(p);
    const routeKey = p.showRoute ? `${p.routeVersion}` : '';
    if (routeKey !== prevRouteKeyRef.current) {
      prevRouteKeyRef.current = routeKey;
      updateRouteLines(p);
    } else if (p.showRoute && p.route?.length >= 2) {
      const coords = p.route.map(pt => {
        const c = Array.isArray(pt) ? pt : (pt && pt.coordinates);
        return c && c.length >= 2 ? [Number(c[0]), Number(c[1])] : null;
      }).filter(Boolean);
      if (coords.length >= 2 && routeLineRef.current) routeLineRef.current.geometry.setCoordinates(coords);
      if (p.routeFirstSegment?.length >= 2 && routeFirstSegmentRef.current) {
        const segCoords = p.routeFirstSegment.map(pt => {
          const c = Array.isArray(pt) ? pt : (pt && pt.coordinates);
          return c && c.length >= 2 ? [Number(c[0]), Number(c[1])] : null;
        }).filter(Boolean);
        if (segCoords.length >= 2) routeFirstSegmentRef.current.geometry.setCoordinates(segCoords);
      } else if (routeFirstSegmentRef.current && mapRef.current) {
        mapRef.current.geoObjects.remove(routeFirstSegmentRef.current);
        routeFirstSegmentRef.current = null;
      }
    }

    const binsKey = p.bins?.map(b => `${b.id}:${b.status}`).join('|') ?? '';
    if (binsKey !== prevBinsKeyRef.current) {
      prevBinsKeyRef.current = binsKey;
      rebuildBins(p);
    }

    if (p.houses !== prevHousesRef.current) {
      prevHousesRef.current = p.houses;
      rebuildHouses(p);
    }

    if (p.base !== prevBaseRef.current || p.landfill !== prevLandfillRef.current) {
      prevBaseRef.current = p.base;
      prevLandfillRef.current = p.landfill;
      updateStaticMarkers(p);
    }
  }, [bins, trucks, houses, base, landfill, route, truckRoutes, routeColor, routeFirstSegment, routeVersion, showBins, showTrucks, showHouses, showBase, showLandfill, showRoute]);

  function fullUpdate() {
    const p = propsRef.current;
    rebuildBins(p);
    rebuildHouses(p);
    updateTruckPositions(p);
    updateStaticMarkers(p);
    updateRouteLines(p);
    prevBinsKeyRef.current = p.bins?.map(b => `${b.id}:${b.status}`).join('|') ?? '';
    prevHousesRef.current = p.houses;
    prevBaseRef.current = p.base;
    prevLandfillRef.current = p.landfill;
  }

  function rebuildBins(p) {
    const map = mapRef.current;
    if (!map) return;
    if (clustererRef.current) { map.geoObjects.remove(clustererRef.current); clustererRef.current = null; }
    if (!p.showBins || p.bins.length === 0) return;

    const cl = new window.ymaps.Clusterer({ clusterDisableClickZoom: false, clusterIconColor: '#4338ca' });
    const marks = p.bins.map(bin => {
      const sText = bin.status === 'full' ? 'Заполнен' : bin.status === 'half' ? 'Наполовину' : 'Пустой';
      const sColor = bin.status === 'full' ? '#F44336' : bin.status === 'half' ? '#FF9800' : '#4CAF50';
      const pm = new window.ymaps.Placemark(bin.coordinates, {
        hintContent: bin.address,
        balloonContentHeader: `<b>${bin.id}</b>`,
        balloonContentBody: `<div style="font-family:Inter,sans-serif;font-size:12px"><span style="color:${sColor};font-weight:600">${sText}</span><br/>${bin.address}<br/>${bin.capacity || 275} л</div>`,
      }, {
        iconLayout: 'default#image', iconImageHref: getBinIcon(bin.status),
        iconImageSize: [20, 20], iconImageOffset: [-10, -10],
      });
      if (p.onBinClick) pm.events.add('click', () => p.onBinClick(bin));
      return pm;
    });
    cl.add(marks);
    map.geoObjects.add(cl);
    clustererRef.current = cl;
  }

  function updateTruckPositions(p) {
    const map = mapRef.current;
    if (!map) return;
    if (!p.showTrucks) {
      Object.values(truckMarksRef.current).forEach(pm => map.geoObjects.remove(pm));
      truckMarksRef.current = {};
      return;
    }

    const currentIds = new Set();
    for (const truck of p.trucks) {
      if (truck.status !== 'active' && !truck.state) continue;
      currentIds.add(truck.id);
      const existing = truckMarksRef.current[truck.id];

      if (existing) {
        existing.geometry.setCoordinates(truck.coordinates);
      } else {
        const isActive = truck.status === 'active' || truck.state;
        const tSize = p.truckIconSize || 30;
        const tOff = Math.round(tSize / 2);
        const pm = new window.ymaps.Placemark(truck.coordinates, {
          hintContent: `${truck.id} — ${truck.driver}`,
          balloonContentHeader: `<b>${truck.id}</b>`,
          balloonContentBody: `<div style="font-family:Inter,sans-serif;font-size:12px">${truck.driver}</div>`,
        }, {
          iconLayout: 'default#image',
          iconImageHref: isActive ? MAP_ICONS.truck : MAP_ICONS.truckInactive,
          iconImageSize: [tSize, tSize], iconImageOffset: [-tOff, -tOff], zIndex: 1000,
        });
        if (p.onTruckClick) pm.events.add('click', () => p.onTruckClick(truck));
        map.geoObjects.add(pm);
        truckMarksRef.current[truck.id] = pm;
      }
    }

    for (const id of Object.keys(truckMarksRef.current)) {
      if (!currentIds.has(id)) {
        map.geoObjects.remove(truckMarksRef.current[id]);
        delete truckMarksRef.current[id];
      }
    }
  }

  function rebuildHouses(p) {
    const map = mapRef.current;
    if (!map) return;
    houseMarksRef.current.forEach(pm => map.geoObjects.remove(pm));
    houseMarksRef.current = [];
    if (!p.showHouses || p.houses.length === 0) return;

    const hSize = p.houseIconSize || 16;
    const hOff = Math.round(hSize / 2);
    for (const house of p.houses) {
      const pm = new window.ymaps.Placemark(house.coordinates, {
        hintContent: house.name,
        balloonContentBody: `<div style="font-family:Inter,sans-serif;font-size:12px">${house.name}${house.residents ? `<br/>Жителей: ${house.residents}` : ''}</div>`,
      }, {
        iconLayout: 'default#image', iconImageHref: MAP_ICONS.house,
        iconImageSize: [hSize, hSize], iconImageOffset: [-hOff, -hOff],
      });
      map.geoObjects.add(pm);
      houseMarksRef.current.push(pm);
    }
  }

  function updateStaticMarkers(p) {
    const map = mapRef.current;
    if (!map) return;

    if (baseMarkRef.current) { map.geoObjects.remove(baseMarkRef.current); baseMarkRef.current = null; }
    if (p.showBase && p.base) {
      baseMarkRef.current = new window.ymaps.Placemark(p.base.coordinates, {
        hintContent: p.base.name,
        balloonContentBody: `<div style="font-family:Inter,sans-serif;font-size:12px"><b>${p.base.name}</b><br/>${p.base.address}</div>`,
      }, { iconLayout: 'default#image', iconImageHref: MAP_ICONS.base, iconImageSize: [36, 36], iconImageOffset: [-18, -18], zIndex: 2000 });
      map.geoObjects.add(baseMarkRef.current);
    }

    if (landfillMarkRef.current) { map.geoObjects.remove(landfillMarkRef.current); landfillMarkRef.current = null; }
    if (p.showLandfill && p.landfill) {
      landfillMarkRef.current = new window.ymaps.Placemark(p.landfill.coordinates, {
        hintContent: p.landfill.name,
        balloonContentBody: `<div style="font-family:Inter,sans-serif;font-size:12px"><b>${p.landfill.name}</b><br/>${p.landfill.address}</div>`,
      }, { iconLayout: 'default#image', iconImageHref: MAP_ICONS.landfill, iconImageSize: [36, 36], iconImageOffset: [-18, -18], zIndex: 2000 });
      map.geoObjects.add(landfillMarkRef.current);
    }
  }

  function updateRouteLines(p) {
    const map = mapRef.current;
    if (!map) return;

    if (routeLineRef.current) { map.geoObjects.remove(routeLineRef.current); routeLineRef.current = null; }
    if (routeFirstSegmentRef.current) { map.geoObjects.remove(routeFirstSegmentRef.current); routeFirstSegmentRef.current = null; }
    if (p.showRoute && p.route && p.route.length > 1) {
      const coords = p.route.map(pt => {
        const c = Array.isArray(pt) ? pt : (pt && pt.coordinates);
        return c && c.length >= 2 ? [Number(c[0]), Number(c[1])] : null;
      }).filter(Boolean);
      if (coords.length >= 2) {
        const fullColor = p.routeColor || '#6b7280';
        routeLineRef.current = new window.ymaps.Polyline(coords, { hintContent: 'Весь маршрут' }, {
          strokeColor: fullColor, strokeWidth: 3, strokeOpacity: 0.7, strokeStyle: 'shortdash',
          zIndex: 50,
        });
        map.geoObjects.add(routeLineRef.current);
        if (p.routeFirstSegment && p.routeFirstSegment.length > 1) {
          const segCoords = p.routeFirstSegment.map(pt => {
            const c = Array.isArray(pt) ? pt : (pt && pt.coordinates);
            return c && c.length >= 2 ? [Number(c[0]), Number(c[1])] : null;
          }).filter(Boolean);
          if (segCoords.length >= 2) {
            routeFirstSegmentRef.current = new window.ymaps.Polyline(segCoords, { hintContent: 'Кратчайший путь до ближайшей мусорки' }, {
              strokeColor: '#16a34a', strokeWidth: 5, strokeOpacity: 1, strokeStyle: 'solid',
              zIndex: 100,
            });
            map.geoObjects.add(routeFirstSegmentRef.current);
          }
        }
      }
    }

    if (p.truckRoutes) {
      const newKey = p.truckRoutes.map(tr => `${tr.truckId}:${tr.waypoints?.length || 0}`).join(',');
      if (newKey !== prevTruckRouteKeysRef.current) {
        prevTruckRouteKeysRef.current = newKey;
        Object.values(truckRouteLinesRef.current).forEach(l => map.geoObjects.remove(l));
        truckRouteLinesRef.current = {};
        for (const tr of p.truckRoutes) {
          if (!tr.waypoints || tr.waypoints.length < 2) continue;
          const line = new window.ymaps.Polyline(tr.waypoints, {
            hintContent: `Маршрут ${tr.truckId}`,
          }, {
            strokeColor: tr.color || '#4338ca', strokeWidth: 2, strokeOpacity: 0.4,
          });
          map.geoObjects.add(line);
          truckRouteLinesRef.current[tr.truckId] = line;
        }
      }
    } else if (Object.keys(truckRouteLinesRef.current).length > 0) {
      Object.values(truckRouteLinesRef.current).forEach(l => map.geoObjects.remove(l));
      truckRouteLinesRef.current = {};
      prevTruckRouteKeysRef.current = '';
    }
  }

  return (
    <div ref={containerRef} className={`ymap ${className}`}
      style={{ width: '100%', height: '400px', borderRadius: '10px', ...style }} />
  );
}
