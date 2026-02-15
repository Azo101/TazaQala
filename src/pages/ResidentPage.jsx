import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import YandexMap from '../components/YandexMap';
import { useSimulation } from '../context/SimulationContext';
import { ORDERS, TAZAQALA_BASE, RESIDENT_HOUSES } from '../data/kyzylorda';
import './ResidentPage.css';

const RESIDENT = {
  name: 'Айгүл Нурланова', initials: 'АН',
  address: 'пр. Коркыт-Ата, 24, кв. 42',
  phone: '+7 (705) 888-99-00', email: 'aigul@mail.kz',
  balance: 12500, id: 'user-001', houseId: 'H-012',
};

function haversineM(a, b) {
  const R = 6371000;
  const dLat = (b[0]-a[0])*Math.PI/180, dLon = (b[1]-a[1])*Math.PI/180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
}

export default function ResidentPage() {
  const navigate = useNavigate();
  const sim = useSimulation();
  const [showProfile, setShowProfile] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [assignedTruck, setAssignedTruck] = useState(null);
  const [notification, setNotification] = useState(null);

  const myHouse = useMemo(() => RESIDENT_HOUSES.find(h => h.id === RESIDENT.houseId) || { id: RESIDENT.houseId, coordinates: [44.8490, 65.5035], name: RESIDENT.address, residents: 1 }, []);
  const houseCoords = myHouse.coordinates;

  const nearbyBins = useMemo(() => sim.bins.filter(b => haversineM(houseCoords, b.coordinates) < 150), [sim.bins, houseCoords]);

  const staticOrders = ORDERS.filter(o => o.residentId === RESIDENT.id);
  const allOrders = useMemo(() => [...staticOrders, ...sim.manualOrders.filter(o => o.residentId === RESIDENT.id)], [staticOrders, sim.manualOrders]);
  const paidOrders = allOrders.filter(o => o.paid);
  const totalSpent = paidOrders.reduce((s, o) => s + o.price, 0);
  const avgCheck = paidOrders.length > 0 ? Math.round(totalSpent / paidOrders.length) : 0;
  const completedCount = allOrders.filter(o => o.status === 'completed').length;
  const activeCount = allOrders.filter(o => o.status === 'in_progress').length;

  const liveTruck = useMemo(() => assignedTruck ? sim.trucks.find(t => t.id === assignedTruck.id) || assignedTruck : null, [assignedTruck, sim.trucks]);

  useEffect(() => {
    if (!activeOrder) return;
    const completed = sim.manualOrders.find(o => o.id === activeOrder.id && o.status === 'completed');
    if (completed) {
      setActiveOrder(prev => prev ? { ...prev, status: 'completed', paid: true } : null);
      setAssignedTruck(null);
      setNotification({ type: 'success', text: `Мусор вывезен! Заказ ${activeOrder.id} выполнен. Оплата: ${activeOrder.price?.toLocaleString()} \u20B8` });
      setTimeout(() => setNotification(null), 8000);
    }
  }, [sim.manualOrders, activeOrder]);

  const truckRouteLines = useMemo(() => {
    if (!liveTruck || !activeOrder || activeOrder.status !== 'in_progress') return [];
    if (liveTruck.waypoints && liveTruck.waypoints.length > 1) {
      return [{ truckId: liveTruck.id, waypoints: liveTruck.waypoints, color: '#4338ca' }];
    }
    return [];
  }, [liveTruck, activeOrder]);

  const handleManualOrder = () => {
    setShowOrderModal(false);
    if (!sim.simRunning) sim.startSim();
    const result = sim.createManualOrder(RESIDENT.id, houseCoords, 'Вывоз мусора', 2500, nearbyBins);
    if (result) { setActiveOrder(result.order); setAssignedTruck(result.truck); }
  };

  const myHouseArr = useMemo(() => [{ ...myHouse, name: 'Ваш дом' }], [myHouse]);

  return (
    <div className="res">
      {notification && (
        <div className={`res-notification res-notification--${notification.type}`}>
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)}>x</button>
        </div>
      )}

      <header className="res-header">
        <div className="res-header__left">
          <span className="res-header__logo" onClick={() => navigate('/')}>TazaQala</span>
          <span className="res-header__badge">Панель жителя</span>
        </div>
        <div className="res-header__right">
          <button className="res-header__order-btn" onClick={() => setShowOrderModal(true)} disabled={!!activeOrder && activeOrder.status === 'in_progress'}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            {activeOrder && activeOrder.status === 'in_progress' ? 'Заказ в пути...' : 'Ручной заказ'}
          </button>
          <button className="res-header__profile-btn" onClick={() => setShowProfile(!showProfile)}>
            <span className="res-avatar">{RESIDENT.initials}</span>
            <span className="res-profile-name">{RESIDENT.name}</span>
          </button>
        </div>
      </header>

      {showProfile && (<>
        <div className="res-overlay" onClick={() => setShowProfile(false)} />
        <div className="res-profile-dropdown">
          <div className="res-profile-dropdown__top"><div className="res-profile-dropdown__avatar">{RESIDENT.initials}</div><div><div className="res-profile-dropdown__name">{RESIDENT.name}</div><div className="res-profile-dropdown__sub">{RESIDENT.address}</div></div></div>
          <div className="res-profile-dropdown__rows">
            <div className="res-pd-row"><span>Телефон</span><strong>{RESIDENT.phone}</strong></div>
            <div className="res-pd-row"><span>Email</span><strong>{RESIDENT.email}</strong></div>
            <div className="res-pd-row"><span>Баланс</span><strong>{RESIDENT.balance.toLocaleString()} &#8376;</strong></div>
            <div className="res-pd-row"><span>Заказов</span><strong>{allOrders.length}</strong></div>
          </div>
          <button className="res-profile-dropdown__logout" onClick={() => navigate('/')}>Выйти</button>
        </div>
      </>)}

      <div className="res-body">
        <section className="res-stats">
          <div className="res-stat-card"><div className="res-stat-card__label">Всего заказов</div><div className="res-stat-card__value">{allOrders.length}</div><div className="res-stat-card__sub">{completedCount} выполнено</div></div>
          <div className="res-stat-card"><div className="res-stat-card__label">Потрачено</div><div className="res-stat-card__value">{totalSpent.toLocaleString()} &#8376;</div><div className="res-stat-card__sub">Средний чек: {avgCheck.toLocaleString()} &#8376;</div></div>
          <div className="res-stat-card"><div className="res-stat-card__label">Активные</div><div className="res-stat-card__value">{activeCount}</div><div className="res-stat-card__sub">в процессе</div></div>
        </section>

        {activeOrder && activeOrder.status === 'in_progress' && liveTruck && (
          <div className="res-active-order">
            <div className="res-active-order__left"><strong>Заказ {activeOrder.id}</strong><span>Мусоровоз {liveTruck.id} ({liveTruck.driver}) едет к вам</span></div>
            <div className="res-active-order__right"><span className="res-active-order__badge">В пути</span></div>
          </div>
        )}

        <section className="res-map-section">
          <div className="res-map-section__header">
            <h2>Ваш район</h2>
            <span className="res-map-section__info">Контейнеров рядом: {nearbyBins.length}</span>
          </div>
          <YandexMap
            center={houseCoords} zoom={16}
            bins={nearbyBins}
            trucks={activeOrder && activeOrder.status === 'in_progress' && liveTruck ? [liveTruck] : []}
            houses={myHouseArr}
            truckRoutes={truckRouteLines}
            showBins={true}
            showTrucks={!!activeOrder && activeOrder.status === 'in_progress'}
            showHouses={true}
            showBase={false}
            showLandfill={false}
            houseIconSize={40}
            truckIconSize={48}
            style={{ height: '400px' }}
          />
        </section>

        <section className="res-history">
          <h2>История заказов</h2>
          {allOrders.length === 0 ? (<div className="res-empty">У вас пока нет заказов</div>) : (
            <div className="res-history__table">
              <div className="res-history__header"><span>ID</span><span>Тип</span><span>Дата</span><span>Сумма</span><span>Статус</span></div>
              {allOrders.map(order => (
                <div key={order.id} className="res-history__row">
                  <span className="res-history__id">{order.id}</span><span>{order.type}</span><span>{order.date} {order.time}</span>
                  <span className="res-history__price">{(order.price||0).toLocaleString()} &#8376;</span>
                  <span><span className={`res-status res-status--${order.status}`}>{order.status === 'completed' ? 'Выполнен' : order.status === 'in_progress' ? 'В процессе' : 'Ожидает'}</span></span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="res-personal-stats">
          <h2>Статистика расходов</h2>
          <div className="res-ps-grid">
            <div className="res-ps-item"><span>Общие траты</span><strong>{totalSpent.toLocaleString()} &#8376;</strong></div>
            <div className="res-ps-item"><span>Средний чек</span><strong>{avgCheck.toLocaleString()} &#8376;</strong></div>
            <div className="res-ps-item"><span>Всего заказов</span><strong>{allOrders.length}</strong></div>
            <div className="res-ps-item"><span>Выполнено</span><strong>{completedCount}</strong></div>
            <div className="res-ps-item"><span>В процессе</span><strong>{activeCount}</strong></div>
            <div className="res-ps-item"><span>Ожидают</span><strong>{allOrders.filter(o => o.status === 'upcoming').length}</strong></div>
          </div>
        </section>
      </div>

      {showOrderModal && (
        <div className="res-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="res-modal" onClick={e => e.stopPropagation()}>
            <button className="res-modal__close" onClick={() => setShowOrderModal(false)}><svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg></button>
            <h2>Новый заказ</h2>
            <p className="res-modal__sub">Создайте запрос на вывоз мусора</p>
            <form className="res-order-form" onSubmit={e => { e.preventDefault(); handleManualOrder(); }}>
              <div className="form-field"><label>Тип вывоза</label><select><option>Вывоз мусора (2 500 &#8376;)</option><option>Крупногабарит (3 500 &#8376;)</option><option>Срочный вывоз (4 000 &#8376;)</option></select></div>
              <div className="form-field"><label>Дата</label><input type="date" defaultValue="2026-02-16" /></div>
              <div className="form-field"><label>Время</label><select><option>09:00 — 12:00</option><option>12:00 — 15:00</option><option>15:00 — 18:00</option></select></div>
              <div className="form-field"><label>Комментарий</label><textarea placeholder="Дополнительная информация..." rows={3}></textarea></div>
              <button type="submit" className="res-order-form__submit">Создать заказ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
