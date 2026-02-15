import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import YandexMap from '../components/YandexMap';
import { useSimulation } from '../context/SimulationContext';
import { buildOptimalRoute, generateAlgorithmSteps } from '../utils/routeOptimizer';
import { optimizeRouteWithGemini } from '../utils/geminiRoute';
import { VehicleState } from '../utils/simulation';
import {
  TRASH_BINS, TRUCKS, TAZAQALA_BASE, LANDFILL,
  RESIDENT_HOUSES, ORDERS, CITY_CENTER,
  FUEL_CONSUMPTION_PER_100KM, BIN_CAPACITY_LITERS, TRUCK_BIN_CAPACITY,
  computeStats,
} from '../data/kyzylorda';
import './DispatcherPage.css';

const STATE_LABELS = {
  [VehicleState.IDLE]: 'Ожидание',
  [VehicleState.FETCHING_ROUTE]: 'Расчёт маршрута',
  [VehicleState.DRIVING_TO_BIN]: 'Едет к баку',
  [VehicleState.SERVICING]: 'Обслуживание',
  [VehicleState.FETCHING_TO_LANDFILL]: 'Расчёт до свалки',
  [VehicleState.DRIVING_TO_LANDFILL]: 'Едет на свалку',
  [VehicleState.DUMPING]: 'Разгрузка',
  [VehicleState.FETCHING_TO_BASE]: 'Расчёт до базы',
  [VehicleState.DRIVING_TO_BASE]: 'Возврат на базу',
  [VehicleState.FETCHING_EXPRESS_ROUTE]: 'Экспресс: маршрут',
  [VehicleState.DRIVING_EXPRESS]: 'Экспресс: едет',
  [VehicleState.SERVICING_EXPRESS]: 'Экспресс: вывоз',
};

function getStateLabel(t) {
  if (t.state && STATE_LABELS[t.state]) return STATE_LABELS[t.state];
  if (t.status === 'active') return 'Активен';
  if (t.status === 'maintenance') return 'На ремонте';
  if (t.status === 'on_break') return 'Перерыв';
  return t.status || '—';
}

export default function DispatcherPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('main');
  const sim = useSimulation();

  const [aiSteps, setAiSteps] = useState([]);
  const [aiCurrentStep, setAiCurrentStep] = useState(0);
  const [aiPlaying, setAiPlaying] = useState(false);
  const aiTimerRef = useRef(null);

  const liveStats = useMemo(() => computeStats(sim.bins, sim.trucks, ORDERS), [sim.bins, sim.trucks]);
  const binStats = useMemo(() => ({
    total: sim.bins.length, full: sim.bins.filter(b => b.status === 'full').length,
    half: sim.bins.filter(b => b.status === 'half').length, empty: sim.bins.filter(b => b.status === 'empty').length,
  }), [sim.bins]);

  const truckStats = useMemo(() => sim.trucks.map(t => ({
    ...t, ordersCount: ORDERS.filter(o => o.truckId === t.id).length,
    completedCount: ORDERS.filter(o => o.truckId === t.id && o.status === 'completed').length,
    revenue: ORDERS.filter(o => o.truckId === t.id && o.paid).reduce((s, o) => s + o.price, 0),
    stateLabel: getStateLabel(t),
  })), [sim.trucks]);

  const [selectedTruck, setSelectedTruck] = useState(null);
  const [optRoute, setOptRoute] = useState(null);
  const [optRouteLoading, setOptRouteLoading] = useState(false);
  const [useGemini, setUseGemini] = useState(true);
  const [optRouteSource, setOptRouteSource] = useState(null);

  const localOptRoute = useMemo(() => {
    if (!selectedTruck) return null;
    return buildOptimalRoute({ start: selectedTruck.coordinates, bins: sim.bins, capacity: TRUCK_BIN_CAPACITY - (selectedTruck.currentLoad || 0), landfillCoord: LANDFILL.coordinates, fuelLevel: selectedTruck.fuelLevel || 80 });
  }, [selectedTruck, sim.tickCount]);

  const fetchOptRoute = useCallback(async () => {
    if (!selectedTruck) { setOptRoute(null); return; }
    setOptRouteLoading(true);
    try {
      if (useGemini && import.meta.env.VITE_GEMINI_API_KEY) {
        try {
          const r = await optimizeRouteWithGemini({
            start: selectedTruck.coordinates, bins: sim.bins,
            capacity: TRUCK_BIN_CAPACITY - (selectedTruck.currentLoad || 0),
            landfillCoord: LANDFILL.coordinates,
          });
          setOptRoute(r);
          setOptRouteSource('gemini');
        } catch (e) {
          setOptRoute(localOptRoute);
          setOptRouteSource('local');
        }
      } else {
        setOptRoute(localOptRoute);
        setOptRouteSource('local');
      }
    } finally {
      setOptRouteLoading(false);
    }
  }, [selectedTruck, sim.bins, useGemini, localOptRoute]);

  useEffect(() => {
    if (selectedTruck) fetchOptRoute();
    else { setOptRoute(null); setOptRouteSource(null); }
  }, [selectedTruck?.id, useGemini]);

  const truckRouteLines = useMemo(() => {
    return sim.trucks
      .filter(t => t.waypoints && t.waypoints.length > 1 && (t.status === 'active' || t.state))
      .map(t => ({
        truckId: t.id,
        waypoints: t.waypoints.slice(t.waypointIdx || 0),
        color: '#4338ca',
      }));
  }, [sim.trucks]);

  const mapTrucks = useMemo(() => sim.trucks.filter(t => t.status === 'active' || t.state), [sim.trucks]);

  const startAI = () => {
    const steps = generateAlgorithmSteps({ start: TAZAQALA_BASE.coordinates, bins: TRASH_BINS, capacity: TRUCK_BIN_CAPACITY });
    setAiSteps(steps); setAiCurrentStep(0); setAiPlaying(true);
  };
  useEffect(() => {
    if (aiPlaying && aiCurrentStep < aiSteps.length - 1) {
      aiTimerRef.current = setTimeout(() => setAiCurrentStep(s => s + 1), 1200);
      return () => clearTimeout(aiTimerRef.current);
    } else if (aiCurrentStep >= aiSteps.length - 1) setAiPlaying(false);
  }, [aiPlaying, aiCurrentStep, aiSteps.length]);

  const aiRoute = useMemo(() => buildOptimalRoute({
    start: TAZAQALA_BASE.coordinates, bins: TRASH_BINS, capacity: TRUCK_BIN_CAPACITY,
    landfillCoord: LANDFILL.coordinates, fuelLevel: 100,
  }), []);

  return (
    <div className="disp">
      <aside className="disp-side">
        <div className="disp-side__logo" onClick={() => navigate('/')}>TazaQala</div>
        <div className="disp-side__role">Диспетчер</div>
        <nav className="disp-side__nav">
          {[
            { key:'main', icon:'M3 3h7v7H3zM13 3h7v7h-7zM3 13h7v7H3z', label:'Основная' },
            { key:'stats', icon:'M4 20h4V10H4zM10 20h4V4h-4zM16 20h4v-8h-4z', label:'Статистика' },
            { key:'workers', icon:'M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-3.3 0-8 1.7-8 5v2h16v-2c0-3.3-4.7-5-8-5z', label:'Рабочие' },
            { key:'ai', icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', label:'AI Анализ' },
          ].map(item => (
            <button key={item.key} className={`disp-side__btn ${tab === item.key ? 'disp-side__btn--active' : ''}`} onClick={() => setTab(item.key)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="disp-side__btn disp-side__btn--exit" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          <span>Выйти</span>
        </button>
      </aside>

      <main className="disp-main">
        {tab === 'main' && (<>
          <div className="disp-top"><h1>Панель диспетчера</h1>
            <div className="disp-top__right">
              <button className={`disp-sim-btn ${sim.simRunning ? 'disp-sim-btn--stop' : ''}`} onClick={sim.simRunning ? sim.stopSim : sim.startSim}>
                {sim.simRunning ? 'Остановить симуляцию' : 'Запустить симуляцию'}
              </button>
              <span className={`disp-badge ${sim.simRunning ? 'disp-badge--live' : ''}`}>{sim.simRunning ? 'LIVE' : 'Оффлайн'}</span>
            </div>
          </div>
          <div className="disp-metrics">
            {[
              { label:'Заказов', value: liveStats.totalOrders },
              { label:'Активных машин', value:`${liveStats.activeTrucks}/${liveStats.totalTrucks}` },
              { label:'Выручка', value:`${liveStats.totalRevenue.toLocaleString()} \u20B8` },
              { label:'Заполненных баков', value: binStats.full },
              { label:'Ожидают', value: liveStats.upcomingOrders },
            ].map((m,i) => (<div key={i} className="disp-metric"><div className="disp-metric__val">{m.value}</div><div className="disp-metric__label">{m.label}</div></div>))}
          </div>
          <div className="disp-sec">
            <div className="disp-sec__head">
              <h2>Карта Кызылорды</h2>
              <div className="disp-legend"><span><i className="dd dd--g"/>Пустой</span><span><i className="dd dd--y"/>Наполовину</span><span><i className="dd dd--r"/>Заполнен</span><span><i className="dd dd--p"/>Машина</span></div>
            </div>
            <YandexMap center={CITY_CENTER} zoom={14} bins={sim.bins} trucks={mapTrucks} houses={RESIDENT_HOUSES} base={TAZAQALA_BASE} landfill={LANDFILL} truckRoutes={truckRouteLines} showBins showTrucks showHouses showBase showLandfill onTruckClick={setSelectedTruck} style={{ height:'500px' }} />
          </div>
          {selectedTruck && (
            <div className="disp-sec">
              <div className="disp-sec__route-head">
                <h2>Маршрут для {selectedTruck.id}</h2>
                <label className="disp-gemini-toggle">
                  <input type="checkbox" checked={useGemini} onChange={(e) => setUseGemini(e.target.checked)} />
                  <span>Gemini AI</span>
                </label>
              </div>
              {optRouteLoading && <div className="disp-route-loading">Расчёт маршрута...</div>}
              {optRoute && !optRouteLoading && (
              <div className="disp-route-info">
                {optRouteSource && <span className="disp-route-source">{optRouteSource === 'gemini' ? 'Gemini AI' : 'Локальный'}</span>}
                <div><span>Остановок</span><strong>{optRoute.binsToService}</strong></div>
                <div><span>Дистанция</span><strong>{optRoute.totalDistance} км</strong></div>
                <div><span>Время</span><strong>~{optRoute.estimatedMinutes} мин</strong></div>
                <div><span>Расход</span><strong>{optRoute.fuelUsed} л</strong></div>
              </div>
              )}
            </div>
          )}
          <div className="disp-sec"><h2>Мусоровозы ({sim.trucks.length})</h2>
            <div className="disp-table disp-table--trucks">
              <div className="disp-table__head"><span>ID</span><span>Водитель</span><span>Состояние</span><span>Топливо</span><span>Загрузка</span><span>Телефон</span></div>
              {sim.trucks.map(t => (
                <div key={t.id} className={`disp-table__row ${selectedTruck?.id === t.id ? 'disp-table__row--sel' : ''}`} onClick={() => setSelectedTruck(t)}>
                  <span className="fw700">{t.id}</span><span>{t.driver}</span>
                  <span><span className={`disp-badge-sm disp-badge-sm--${t.status}`}>{getStateLabel(t)}</span></span>
                  <span><div className="disp-fuel-bar"><div style={{width:`${Math.min(100,t.fuelLevel)}%`}}/></div>{Math.round(t.fuelLevel)}%</span>
                  <span>{t.currentLoad||0}/{t.capacity}</span><span className="c888">{t.phone}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="disp-sec"><h2>Заказы</h2>
            <div className="disp-table disp-table--orders">
              <div className="disp-table__head"><span>ID</span><span>Житель</span><span>Тип</span><span>Дата</span><span>Сумма</span><span>Статус</span></div>
              {ORDERS.map(o => (
                <div key={o.id} className="disp-table__row">
                  <span className="fw700">{o.id}</span><span>{o.resident}</span><span>{o.type}</span>
                  <span>{o.date} {o.time}</span><span className="fw700">{o.price.toLocaleString()} &#8376;</span>
                  <span><span className={`disp-badge-sm disp-badge-sm--order-${o.status}`}>{o.status === 'completed' ? 'Выполнен' : o.status === 'in_progress' ? 'В процессе' : 'Ожидает'}</span></span>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {tab === 'stats' && (<>
          <div className="disp-top"><h1>Полная статистика</h1></div>
          <div className="disp-stats-grid">
            <div className="disp-stat-block"><h3>Финансы</h3><div className="dsb-rows"><div className="dsb-row"><span>Общая выручка</span><strong>{liveStats.totalRevenue.toLocaleString()} &#8376;</strong></div><div className="dsb-row"><span>Выручка за сегодня</span><strong>{liveStats.todayRevenue.toLocaleString()} &#8376;</strong></div><div className="dsb-row"><span>Средний чек</span><strong>{liveStats.averageCheck.toLocaleString()} &#8376;</strong></div><div className="dsb-row"><span>Оплачено / Всего</span><strong>{ORDERS.filter(o=>o.paid).length}/{ORDERS.length}</strong></div></div></div>
            <div className="disp-stat-block"><h3>Заказы</h3><div className="dsb-rows"><div className="dsb-row"><span>Всего</span><strong>{liveStats.totalOrders}</strong></div><div className="dsb-row"><span>Выполнено</span><strong className="cg">{liveStats.completedOrders}</strong></div><div className="dsb-row"><span>В процессе</span><strong className="cb">{liveStats.inProgressOrders}</strong></div><div className="dsb-row"><span>Ожидают</span><strong className="co">{liveStats.upcomingOrders}</strong></div></div></div>
            <div className="disp-stat-block"><h3>Мусорные баки ({binStats.total})</h3><div className="dsb-rows"><div className="dsb-row"><span>Заполнены</span><strong className="cr">{binStats.full}</strong></div><div className="dsb-row"><span>Наполовину</span><strong className="co">{binStats.half}</strong></div><div className="dsb-row"><span>Пустые</span><strong className="cg">{binStats.empty}</strong></div></div><div className="dsb-bar"><div className="dsb-bar__r" style={{width:`${(binStats.full/binStats.total)*100}%`}}/><div className="dsb-bar__y" style={{width:`${(binStats.half/binStats.total)*100}%`}}/><div className="dsb-bar__g" style={{width:`${(binStats.empty/binStats.total)*100}%`}}/></div></div>
            <div className="disp-stat-block"><h3>Мусоровозы ({liveStats.totalTrucks})</h3><div className="dsb-rows"><div className="dsb-row"><span>Активны</span><strong className="cg">{liveStats.activeTrucks}</strong></div><div className="dsb-row"><span>На ремонте</span><strong className="cr">{liveStats.maintenanceTrucks}</strong></div><div className="dsb-row"><span>Расход</span><strong>{FUEL_CONSUMPTION_PER_100KM} л/100км</strong></div><div className="dsb-row"><span>Вместимость</span><strong>{TRUCK_BIN_CAPACITY} баков</strong></div></div></div>
            <div className="disp-stat-block disp-stat-block--wide"><h3>Утилизация</h3><div className="dsb-rows"><div className="dsb-row"><span>Собрано сегодня</span><strong>{liveStats.wasteCollectedToday} кг</strong></div><div className="dsb-row"><span>Утилизировано сегодня</span><strong>{liveStats.wasteProcessedToday} кг</strong></div><div className="dsb-row"><span>Собрано всего</span><strong>{liveStats.wasteCollectedTotal.toLocaleString()} кг</strong></div><div className="dsb-row"><span>Утилизировано всего</span><strong>{liveStats.wasteProcessedTotal.toLocaleString()} кг</strong></div></div></div>
          </div>
        </>)}

        {tab === 'workers' && (<>
          <div className="disp-top"><h1>Статистика рабочих ({truckStats.length})</h1></div>
          <div className="disp-workers">
            {truckStats.map(t => (
              <div key={t.id} className="disp-worker">
                <div className="disp-worker__head"><div className="disp-worker__avatar">{t.driver.split(' ').map(n=>n[0]).join('')}</div><div><div className="disp-worker__name">{t.driver}</div><div className="disp-worker__id">{t.id}</div></div><span className={`disp-badge-sm disp-badge-sm--${t.status}`}>{t.stateLabel}</span></div>
                <div className="disp-worker__grid">
                  <div><span>Заказов</span><strong>{t.ordersCount}</strong></div><div><span>Выполнено</span><strong className="cg">{t.completedCount}</strong></div>
                  <div><span>Выручка</span><strong>{t.revenue.toLocaleString()} &#8376;</strong></div><div><span>Топливо</span><strong>{Math.round(t.fuelLevel)}%</strong></div>
                  <div><span>Баков (сессия)</span><strong>{t.binsServiced||0}</strong></div><div><span>Баков (всего)</span><strong>{t.totalBinsServiced||0}</strong></div>
                </div>
                <div className="disp-worker__bars"><div className="disp-worker__bar-label">Топливо</div><div className="disp-mini-bar"><div style={{width:`${Math.min(100,t.fuelLevel)}%`,background:t.fuelLevel>50?'#22c55e':t.fuelLevel>25?'#eab308':'#ef4444'}}/></div><div className="disp-worker__bar-label">Загрузка ({t.currentLoad||0}/{t.capacity})</div><div className="disp-mini-bar"><div style={{width:`${((t.currentLoad||0)/t.capacity)*100}%`,background:'#6366f1'}}/></div></div>
                <div className="disp-worker__phone">{t.phone}</div>
              </div>
            ))}
          </div>
        </>)}

        {tab === 'ai' && (<>
          <div className="disp-top"><h1>AI Анализ маршрутов</h1></div>
          <div className="ai-intro">
            <h2>Как работает оптимизация</h2>
            <p>Система TazaQala использует приоритетный алгоритм ближайшего соседа с весовой функцией. Красные баки (приоритет 3x) обслуживаются первыми. Перед каждым перемещением проверяется запас топлива.</p>
            <div className="ai-algo-steps">
              {[{n:'1',title:'Сканирование',text:'Анализ всех баков. Красные получают приоритет 3x, жёлтые 1.5x.'},{n:'2',title:'Оценка кандидатов',text:'Оценка = расстояние / приоритет. Ближайшие и самые полные обслуживаются первыми.'},{n:'3',title:'Проверка топлива',text:'Проверка: хватит ли топлива до бака + до свалки. Резерв 5 литров.'},{n:'4',title:'Цикл',text:`После ${TRUCK_BIN_CAPACITY} баков — на свалку, разгрузка, возврат на базу.`}].map((s,i)=>(
                <div key={i} className="ai-algo-step"><div className="ai-algo-step__num">{s.n}</div><div><strong>{s.title}</strong><p>{s.text}</p></div></div>
              ))}
            </div>
          </div>

          <div className="ai-map-section">
            <h2>Визуальное сравнение маршрутов</h2>
            <p className="ai-map-section__sub">Серый — наивный маршрут (произвольный порядок). Зелёный — оптимизированный.</p>
            <AiComparisonMap aiRoute={aiRoute} />
          </div>

          <div className="ai-comparison"><h2>Числовое сравнение</h2>
            <div className="ai-compare-cards">
              <div className="ai-compare-card ai-compare-card--naive"><h3>Наивный</h3><p>Произвольный порядок</p><div className="ai-compare-val">{aiRoute.naiveDistance} км</div><div className="ai-compare-sub">расход: {(aiRoute.naiveDistance*FUEL_CONSUMPTION_PER_100KM/100).toFixed(1)} л</div></div>
              <div className="ai-compare-card ai-compare-card--opt"><h3>Оптимизированный</h3><p>Приоритетный сосед</p><div className="ai-compare-val">{aiRoute.totalDistance} км</div><div className="ai-compare-sub">расход: {aiRoute.fuelUsed} л</div></div>
              <div className="ai-compare-card ai-compare-card--save"><h3>Экономия</h3><p>Преимущество</p><div className="ai-compare-val">{aiRoute.efficiencyGain}%</div><div className="ai-compare-sub">{aiRoute.distanceSaved} км / {aiRoute.fuelSaved} л</div></div>
            </div>
          </div>

          <div className="ai-viz">
            <div className="ai-viz__head"><h2>Пошаговая визуализация</h2><button className="ai-play-btn" onClick={startAI} disabled={aiPlaying}>{aiPlaying ? 'Визуализация...' : 'Запустить'}</button></div>
            {aiSteps.length > 0 && (
              <div className="ai-steps-list">
                {aiSteps.map((step,i) => (
                  <div key={i} className={`ai-step ${i <= aiCurrentStep ? 'ai-step--done' : ''} ${i === aiCurrentStep ? 'ai-step--current' : ''}`}>
                    <div className={`ai-step__dot ai-step__dot--${step.type}`} />
                    <div className="ai-step__content">
                      <div className="ai-step__type">{step.type === 'init' ? 'Инициализация' : step.type === 'evaluate' ? 'Оценка' : step.type === 'move' ? 'Перемещение' : 'Завершение'}</div>
                      <div className="ai-step__desc">{step.description}</div>
                      {step.type === 'evaluate' && step.candidates && (<div className="ai-step__candidates">{step.candidates.slice(0,3).map((c,j)=>(<span key={j} className={j===0?'ai-cand--best':''}>{c.bin.id}: {c.dist.toFixed(2)}km</span>))}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ai-metrics"><h2>Метрики</h2>
            <div className="ai-metrics-grid">
              {[{label:'Топливо сэкономлено',value:`${aiRoute.fuelSaved} л`,sub:'за рейс'},{label:'Эффективность',value:`${aiRoute.efficiencyGain}%`,sub:'лучше наивного'},{label:'Баков за рейс',value:aiRoute.binsToService,sub:`из ${TRUCK_BIN_CAPACITY}`},{label:'Время рейса',value:`~${aiRoute.estimatedMinutes} мин`,sub:'с обслуживанием'}].map((m,i)=>(
                <div key={i} className="ai-metric-card"><div className="ai-metric-card__label">{m.label}</div><div className="ai-metric-card__value">{m.value}</div><div className="ai-metric-card__sub">{m.sub}</div></div>
              ))}
            </div>
          </div>
        </>)}
      </main>
    </div>
  );
}

function AiComparisonMap({ aiRoute }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const check = () => {
      if (!window.ymaps || !containerRef.current) { setTimeout(check, 300); return; }
      window.ymaps.ready(() => {
        if (mapRef.current) { mapRef.current.destroy(); }
        const map = new window.ymaps.Map(containerRef.current, {
          center: CITY_CENTER, zoom: 13,
          controls: ['zoomControl'],
        }, { suppressMapOpenBlock: true });
        mapRef.current = map;

        map.geoObjects.add(new window.ymaps.Placemark(TAZAQALA_BASE.coordinates, { hintContent: 'Штаб TazaQala' }, {
          preset: 'islands#blueHomeIcon',
        }));

        if (!aiRoute || !aiRoute.route || aiRoute.route.length === 0) return;

        const optCoords = [TAZAQALA_BASE.coordinates, ...aiRoute.route.map(s => s.coordinates)];
        map.geoObjects.add(new window.ymaps.Polyline(optCoords, { hintContent: 'Оптимизированный маршрут' }, {
          strokeColor: '#16a34a', strokeWidth: 4, strokeOpacity: 0.8,
        }));

        const naiveBins = TRASH_BINS.filter(b => b.status === 'full' || b.status === 'half').slice(0, aiRoute.binsToService);
        if (naiveBins.length > 0) {
          const naiveCoords = [TAZAQALA_BASE.coordinates, ...naiveBins.map(b => b.coordinates)];
          map.geoObjects.add(new window.ymaps.Polyline(naiveCoords, { hintContent: 'Наивный маршрут' }, {
            strokeColor: '#9ca3af', strokeWidth: 3, strokeOpacity: 0.6, strokeStyle: 'shortdash',
          }));
        }

        aiRoute.route.forEach((stop, i) => {
          if (stop.type === 'landfill') return;
          map.geoObjects.add(new window.ymaps.Placemark(stop.coordinates, {
            hintContent: `#${i + 1}: ${stop.address || stop.id}`,
          }, { preset: 'islands#darkGreenCircleDotIcon' }));
        });
      });
    };
    check();
    return () => { if (mapRef.current) { mapRef.current.destroy(); mapRef.current = null; } };
  }, [aiRoute]);

  return <div ref={containerRef} className="ymap" style={{ width: '100%', height: '400px', borderRadius: '10px' }} />;
}
