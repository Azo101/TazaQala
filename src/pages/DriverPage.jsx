import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import YandexMap from '../components/YandexMap';
import { useSimulation } from '../context/SimulationContext';
import { getNextTarget } from '../utils/driverMovementLogic';
import { fetchRoadRouteWaypoints, clearRouteCache } from '../utils/roadRoute';
import { TAZAQALA_BASE, LANDFILL, ORDERS, TRUCK_BIN_CAPACITY } from '../data/kyzylorda';
import './DriverPage.css';

export default function DriverPage() {
  const navigate = useNavigate();
  const sim = useSimulation();
  const [showRoute, setShowRoute] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [roadRouteWaypoints, setRoadRouteWaypoints] = useState([]);
  const [route, setRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeVersion, setRouteVersion] = useState(0);
  const [driverPos, setDriverPos] = useState(0);
  const [driverLoad, setDriverLoad] = useState(0);
  const [driverBinsServiced, setDriverBinsServiced] = useState(0);
  const [lastRouteEndPosition, setLastRouteEndPosition] = useState(null);

  const driverLoadRef = useRef(0);
  const driverBinsServicedRef = useRef(0);
  const collectedIdsRef = useRef(new Set());
  const currentPositionRef = useRef(null);
  const simBinsRef = useRef(sim.bins);
  simBinsRef.current = sim.bins;
  const segmentTransitionRef = useRef(false);
  const routeCompletedRef = useRef(false);
  const fetchingNextRef = useRef(false);
  const hasCollectedForSegmentRef = useRef(false);
  const driverDoneRef = useRef(false);

  const myTruck = useMemo(() => sim.trucks.find(t => t.id === 'TQ-001') || sim.trucks[0], [sim.trucks]);
  const routeStartPosition = lastRouteEndPosition ?? myTruck?.coordinates;

  const myOrders = ORDERS.filter(o => o.truckId === myTruck?.id);
  const currentOrders = myOrders.filter(o => o.status === 'in_progress');
  const upcomingOrders = myOrders.filter(o => o.status === 'upcoming');
  const completedOrders = myOrders.filter(o => o.status === 'completed');

  const startDriver = useCallback(async () => {
    if (!myTruck || !routeStartPosition) return;
    setLoadingRoute(true);
    clearRouteCache();
    collectedIdsRef.current = new Set();
    driverLoadRef.current = 0;
    driverBinsServicedRef.current = 0;
    currentPositionRef.current = [...routeStartPosition];
    segmentTransitionRef.current = false;
    routeCompletedRef.current = false;
    driverDoneRef.current = false;
    setDriverLoad(0);
    setDriverBinsServiced(0);

    const { target, type } = getNextTarget(
      currentPositionRef.current,
      sim.bins,
      collectedIdsRef.current,
      0,
      TRUCK_BIN_CAPACITY,
      LANDFILL.coordinates,
    );

    if (!target) {
      setRoute({ route: [], binsToService: 0, totalDistance: 0, estimatedMinutes: 0, fuelUsed: 0 });
      setRoadRouteWaypoints([...routeStartPosition]);
      setLoadingRoute(false);
      return;
    }

    try {
      const seg = await fetchRoadRouteWaypoints([currentPositionRef.current, target.coordinates]);
      const wp = seg && seg.length >= 2 ? seg : [currentPositionRef.current, target.coordinates];
      setRoadRouteWaypoints(wp);
      setRoute({
        route: [target],
        binsToService: 1,
        totalDistance: 0,
        estimatedMinutes: 0,
        fuelUsed: 0,
      });
      setRouteVersion(v => v + 1);
    } catch (e) {
      setRoadRouteWaypoints([currentPositionRef.current, target.coordinates]);
      setRoute({ route: [target], binsToService: 1, totalDistance: 0, estimatedMinutes: 0, fuelUsed: 0 });
    } finally {
      setLoadingRoute(false);
    }
  }, [myTruck, routeStartPosition, sim.bins]);

  useEffect(() => {
    if (showRoute) startDriver();
    else {
      setRoute(null);
      setRoadRouteWaypoints([]);
      setDriverPos(0);
      setDriverLoad(0);
      setDriverBinsServiced(0);
      driverLoadRef.current = 0;
      driverBinsServicedRef.current = 0;
      collectedIdsRef.current = new Set();
    }
  }, [showRoute]);

  useEffect(() => {
    if (!showRoute || !roadRouteWaypoints.length || roadRouteWaypoints.length < 2) return;

    const isSegmentTransition = segmentTransitionRef.current;
    if (isSegmentTransition) {
      segmentTransitionRef.current = false;
      hasCollectedForSegmentRef.current = false;
      setDriverPos(0);
    } else {
      setDriverPos(0);
      hasCollectedForSegmentRef.current = false;
      driverLoadRef.current = 0;
      driverBinsServicedRef.current = 0;
    }

    const wp = roadRouteWaypoints;
    const SERVICE_MS = 1800;

    let pos = isSegmentTransition ? 0 : 0;
    const speed = 0.105;
    let rafId;
    let frame = 0;
    let servicingUntil = 0;

    const fetchNextSegment = async () => {
      if (fetchingNextRef.current) return;
      const endCoord = wp[wp.length - 1];
      currentPositionRef.current = [...endCoord];

      const load = driverLoadRef.current;
      const collectedIds = collectedIdsRef.current;

      const { target: nextTarget } = getNextTarget(
        currentPositionRef.current,
        simBinsRef.current,
        collectedIds,
        load,
        TRUCK_BIN_CAPACITY,
        LANDFILL.coordinates,
      );

      if (!nextTarget) {
        routeCompletedRef.current = true;
        driverDoneRef.current = true;
        setLastRouteEndPosition([...endCoord]);
        return;
      }

      fetchingNextRef.current = true;
      try {
        const seg = await fetchRoadRouteWaypoints([currentPositionRef.current, nextTarget.coordinates]);
        const newWp = seg && seg.length >= 2 ? seg : [currentPositionRef.current, nextTarget.coordinates];
        segmentTransitionRef.current = true;
        setRoute(prev => ({
          ...prev,
          route: [...(prev?.route || []), nextTarget],
          binsToService: (prev?.binsToService || 0) + 1,
        }));
        setRoadRouteWaypoints(newWp);
        setRouteVersion(v => v + 1);
      } catch (e) {
        const newWp = [currentPositionRef.current, nextTarget.coordinates];
        segmentTransitionRef.current = true;
        setRoute(prev => ({
          ...prev,
          route: [...(prev?.route || []), nextTarget],
          binsToService: (prev?.binsToService || 0) + 1,
        }));
        setRoadRouteWaypoints(newWp);
      } finally {
        fetchingNextRef.current = false;
      }
    };

    const tick = (now = 0) => {
      if (driverDoneRef.current) return;
      if (servicingUntil > 0) {
        if (now < servicingUntil) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        servicingUntil = 0;
        fetchNextSegment();
        rafId = requestAnimationFrame(tick);
        return;
      }

      pos += speed;
      if (pos >= wp.length - 1) pos = wp.length - 1;

      if (pos >= wp.length - 1) {
        if (!hasCollectedForSegmentRef.current) {
          const target = route?.route?.[route.route.length - 1];
          if (target) {
            if (target.type === 'landfill') {
              driverLoadRef.current = 0;
              setDriverLoad(0);
            } else if (target.id) {
              sim.updateBin(target.id, { status: 'empty', fillLevel: 0 });
              collectedIdsRef.current.add(target.id);
              driverLoadRef.current = Math.min(TRUCK_BIN_CAPACITY, driverLoadRef.current + 1);
              driverBinsServicedRef.current++;
              setDriverLoad(driverLoadRef.current);
              setDriverBinsServiced(driverBinsServicedRef.current);
            }
            hasCollectedForSegmentRef.current = true;
            servicingUntil = performance.now() + SERVICE_MS;
          } else {
            fetchNextSegment();
          }
        }
        rafId = requestAnimationFrame(tick);
        if (frame % 4 === 0) setDriverPos(pos);
        return;
      }

      frame++;
      if (frame % 4 === 0) setDriverPos(pos);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [showRoute, roadRouteWaypoints, route, sim.updateBin]);

  const myLiveRoute = useMemo(() => {
    if (!myTruck || !myTruck.waypoints || myTruck.waypoints.length < 2) return [];
    return [{ truckId: myTruck.id, waypoints: myTruck.waypoints.slice(myTruck.waypointIdx || 0), color: '#16a34a' }];
  }, [myTruck]);

  const mapTrucks = useMemo(() => sim.trucks.filter(t => t.status === 'active' || t.state), [sim.trucks]);
  const allTruckRoutes = useMemo(() => {
    return sim.trucks
      .filter(t => t.waypoints && t.waypoints.length > 1 && (t.status === 'active' || t.state))
      .map(t => ({
        truckId: t.id,
        waypoints: t.waypoints.slice(t.waypointIdx || 0),
        color: t.id === myTruck?.id ? '#16a34a' : 'rgba(67,56,202,0.2)',
      }));
  }, [sim.trucks, myTruck]);

  const displayRoute = useMemo(() => {
    if (!showRoute || roadRouteWaypoints.length < 2) return [];
    const start = Math.floor(driverPos);
    return roadRouteWaypoints.slice(start);
  }, [showRoute, roadRouteWaypoints, driverPos]);
  const displayTruckRoutes = showRoute ? [] : (sim.simRunning ? allTruckRoutes : myLiveRoute);

  const firstSegmentWaypoints = useMemo(() => {
    if (!showRoute || roadRouteWaypoints.length < 2) return [];
    const startWp = Math.floor(driverPos);
    const slice = roadRouteWaypoints.slice(startWp);
    return slice.length >= 2 ? slice : [];
  }, [showRoute, roadRouteWaypoints, driverPos]);

  const driverTruck = useMemo(() => {
    if (!showRoute || !roadRouteWaypoints.length || !myTruck) return null;
    const wp = roadRouteWaypoints;
    const pos = Math.min(driverPos, wp.length - 1);
    const i = Math.floor(pos);
    const frac = pos - i;
    const from = wp[i];
    const to = wp[Math.min(i + 1, wp.length - 1)];
    const lat = from[0] + (to[0] - from[0]) * frac;
    const lng = from[1] + (to[1] - from[1]) * frac;
    return {
      id: myTruck.id,
      driver: myTruck.driver,
      coordinates: [lat, lng],
      status: 'active',
      state: 'driving',
    };
  }, [showRoute, roadRouteWaypoints, driverPos, myTruck]);

  const displayTrucks = showRoute && driverTruck ? [driverTruck] : mapTrucks;
  const urgentBins = useMemo(() => sim.bins.filter(b => b.status === 'full').slice(0, 8), [sim.bins]);
  const tabOrders = activeTab === 'current' ? currentOrders : activeTab === 'upcoming' ? upcomingOrders : completedOrders;
  const currentStopIndex = route?.route?.length ? route.route.length - 1 : 0;

  if (!myTruck) return <div style={{ padding: 40, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="drv">
      <header className="drv-header">
        <div className="drv-header__left">
          <span className="drv-header__logo" onClick={() => navigate('/')}>TazaQala</span>
          <span className="drv-header__badge">Водитель</span>
          {sim.simRunning && <span className="drv-header__live">LIVE</span>}
        </div>
        <div className="drv-header__right">
          <div className="drv-header__profile">
            <div className="drv-avatar">{myTruck.driver.split(' ').map(n=>n[0]).join('')}</div>
            <div><div className="drv-name">{myTruck.driver}</div><div className="drv-id">{myTruck.id}</div></div>
          </div>
          <button className="drv-header__exit" onClick={() => navigate('/')}>Выйти</button>
        </div>
      </header>

      <div className="drv-body">
        <section className="drv-status">
          <div className="drv-sc"><div className="drv-sc__label">Статус</div><div className="drv-sc__val drv-sc__val--green">{showRoute ? 'На маршруте' : (sim.simRunning ? 'На маршруте' : 'Активен')}</div></div>
          <div className="drv-sc"><div className="drv-sc__label">Топливо</div><div className="drv-sc__val">{Math.round(myTruck.fuelLevel)}%</div><div className="drv-bar"><div style={{width:`${Math.min(100,myTruck.fuelLevel)}%`,background:myTruck.fuelLevel>50?'#22c55e':'#eab308'}}/></div></div>
          <div className="drv-sc"><div className="drv-sc__label">Загрузка</div><div className="drv-sc__val">{showRoute ? driverLoad : (myTruck.currentLoad||0)}/{myTruck.capacity}</div><div className="drv-bar"><div style={{width:`${((showRoute ? driverLoad : (myTruck.currentLoad||0))/myTruck.capacity)*100}%`,background:'#6366f1'}}/></div></div>
          <div className="drv-sc"><div className="drv-sc__label">Баков обслужено</div><div className="drv-sc__val">{showRoute ? driverBinsServiced : (myTruck.binsServiced||0)}</div></div>
        </section>

        <section className="drv-map-section">
          <div className="drv-map-section__head">
            <h2>Карта маршрута</h2>
            <div className="drv-map-section__actions">
              <button
                className={`drv-route-btn ${showRoute ? 'drv-route-btn--active' : ''}`}
                onClick={() => setShowRoute((prev) => !prev)}
                disabled={loadingRoute}
              >
                {loadingRoute ? 'Расчёт...' : showRoute ? 'Скрыть маршрут' : 'Построить маршрут'}
              </button>
            </div>
          </div>
          {showRoute && route && (
            <div className="drv-route-summary">
              <span className="drv-route-source">Логика: ближайший → по пути</span>
              <div><span>Остановок:</span><strong>{route.binsToService || route.route?.length || 0}</strong></div>
            </div>
          )}
          {showRoute && route && route.route?.length > 0 && (
            <div className="drv-first-stop">
              <span className="drv-first-stop__label">Текущая цель</span>
              <strong className="drv-first-stop__addr">
                {route.route[currentStopIndex]?.type === 'landfill' ? 'Свалка (разгрузка)' : route.route[currentStopIndex]?.address || route.route[currentStopIndex]?.id}
              </strong>
              <span className="drv-first-stop__id">{route.route[currentStopIndex]?.id}</span>
            </div>
          )}
          <YandexMap
            center={showRoute ? (routeStartPosition || myTruck.coordinates) : myTruck.coordinates} zoom={14}
            bins={sim.bins}
            trucks={displayTrucks}
            routeVersion={routeVersion}
            houses={[]}
            base={TAZAQALA_BASE}
            landfill={LANDFILL}
            route={displayRoute}
            routeFirstSegment={firstSegmentWaypoints}
            truckRoutes={displayTruckRoutes}
            showBins={true}
            showTrucks={true}
            showHouses={false}
            showBase={true}
            showLandfill={true}
            showRoute={showRoute}
            style={{ height: '450px' }}
          />
        </section>

        <section className="drv-urgent">
          <h2>Приоритетные баки (заполненные)</h2>
          <div className="drv-urgent-list">
            {urgentBins.map((bin, i) => (
              <div key={bin.id} className="drv-urgent-item">
                <div className="drv-urgent-item__num">{i+1}</div>
                <div className="drv-urgent-item__info"><div className="drv-urgent-item__addr">{bin.address}</div><div className="drv-urgent-item__id">{bin.id}</div></div>
                <span className="drv-urgent-item__status">Заполнен</span>
              </div>
            ))}
          </div>
        </section>

        {showRoute && route && route.route?.length > 0 && (
          <section className="drv-steps">
            <h2>Порядок маршрута (по логике)</h2>
            <div className="drv-steps-list">
              <div className="drv-step drv-step--start">
                <div className="drv-step__dot drv-step__dot--blue"/>
                <div className="drv-step__line"/>
                <div className="drv-step__body">
                  <strong>Старт</strong>
                  <span>Текущая позиция</span>
                </div>
                <div className="drv-step__num">0</div>
              </div>
              {route.route.map((stop, i) => (
                <div key={i} className={`drv-step ${i === currentStopIndex ? 'drv-step--first' : ''}`}>
                  <div className={`drv-step__dot drv-step__dot--${stop.type === 'landfill' ? 'blue' : stop.status === 'full' ? 'red' : stop.status === 'half' ? 'yellow' : 'green'}`}/>
                  {i < route.route.length - 1 && <div className="drv-step__line"/>}
                  <div className="drv-step__body">
                    <strong>{stop.type === 'landfill' ? 'Свалка (разгрузка)' : stop.address || stop.id}</strong>
                  </div>
                  <div className="drv-step__num">{i + 1}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="drv-orders">
          <h2>Заказы</h2>
          <div className="drv-tabs">
            {['current','upcoming','completed'].map(t => (
              <button key={t} className={`drv-tab ${activeTab === t ? 'drv-tab--active' : ''}`} onClick={() => setActiveTab(t)}>
                {t === 'current' ? `Текущие (${currentOrders.length})` : t === 'upcoming' ? `Предстоящие (${upcomingOrders.length})` : `Выполненные (${completedOrders.length})`}
              </button>
            ))}
          </div>
          {tabOrders.length === 0 ? (<div className="drv-empty">Нет заказов</div>) : tabOrders.map(o => (
            <div key={o.id} className="drv-order">
              <div className="drv-order__top"><span className="fw700">{o.id}</span><span className={`drv-order-status drv-order-status--${o.status}`}>{o.status === 'in_progress' ? 'В работе' : o.status === 'upcoming' ? 'Ожидает' : 'Выполнен'}</span></div>
              <div className="drv-order__resident">{o.resident}</div>
              <div className="drv-order__meta"><span>{o.date} {o.time}</span><span>{o.price.toLocaleString()} &#8376;</span></div>
              {o.status === 'in_progress' && <button className="drv-complete-btn" onClick={() => alert(`Заказ ${o.id} завершён`)}>Завершить</button>}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
