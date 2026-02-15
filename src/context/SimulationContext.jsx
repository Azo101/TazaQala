import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { SimulationEngine } from '../utils/simulation';
import { TRASH_BINS, TRUCKS, TAZAQALA_BASE, LANDFILL, RESIDENT_HOUSES } from '../data/kyzylorda';

const SimulationContext = createContext(null);

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be inside SimulationProvider');
  return ctx;
}

export function SimulationProvider({ children }) {
  const [simState, setSimState] = useState({
    bins: TRASH_BINS,
    trucks: TRUCKS,
    tickCount: 0,
  });
  const [simRunning, setSimRunning] = useState(false);
  const [manualOrders, setManualOrders] = useState([]);
  const simRef = useRef(null);
  const orderIdRef = useRef(100);

  const startSim = useCallback(() => {
    if (simRef.current) simRef.current.stop();
    simRef.current = new SimulationEngine({
      bins: TRASH_BINS.map(b => ({ ...b })),
      trucks: TRUCKS,
      base: TAZAQALA_BASE,
      landfill: LANDFILL,
      onUpdate: (state) => setSimState(state),
    });
    simRef.current.start();
    setSimRunning(true);
  }, []);

  const stopSim = useCallback(() => {
    if (simRef.current) simRef.current.stop();
    setSimRunning(false);
  }, []);

  const createManualOrder = useCallback((residentId, houseCoordinates, orderType, price, nearbyBins = []) => {
    const activeTrucks = simState.trucks.filter(t => t.status === 'active' || t.state);
    if (activeTrucks.length === 0) return null;

    const truck = activeTrucks.reduce((best, t) => {
      const bestIdle = best.state === 'idle' ? 1 : 0;
      const tIdle = t.state === 'idle' ? 1 : 0;
      if (tIdle !== bestIdle) return tIdle > bestIdle ? t : best;
      return (t.currentLoad || 0) < (best.currentLoad || 0) ? t : best;
    }, activeTrucks[0]);

    const orderId = `ORD-M${String(++orderIdRef.current).padStart(3, '0')}`;

    const order = {
      id: orderId,
      residentId,
      truckId: truck.id,
      truckCoordinates: [...truck.coordinates],
      destination: houseCoordinates,
      status: 'in_progress',
      type: orderType || 'Вывоз мусора',
      price: price || 2500,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      paid: false,
      startedAt: Date.now(),
    };

    setManualOrders(prev => [...prev, order]);

    const binsToVisit = nearbyBins.length > 0
      ? nearbyBins.sort((a, b) => {
          const da = Math.hypot(a.coordinates[0] - truck.coordinates[0], a.coordinates[1] - truck.coordinates[1]);
          const db = Math.hypot(b.coordinates[0] - truck.coordinates[0], b.coordinates[1] - truck.coordinates[1]);
          return da - db;
        })
      : [{ id: 'fallback', coordinates: houseCoordinates }];

    simRef.current?.addExpressOrder?.(truck.id, orderId, binsToVisit, (oid) => {
      setManualOrders(prev => prev.map(o => o.id === oid ? { ...o, status: 'completed', paid: true } : o));
    });

    return { order, truck };
  }, [simState.trucks]);

  const completeManualOrder = useCallback((orderId) => {
    setManualOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'completed', paid: true } : o
    ));
  }, []);

  const updateBin = useCallback((binId, updates) => {
    setSimState(prev => ({
      ...prev,
      bins: prev.bins.map(b => b.id === binId ? { ...b, ...updates } : b),
    }));
  }, []);

  const value = {
    bins: simState.bins,
    trucks: simState.trucks,
    houses: RESIDENT_HOUSES,
    tickCount: simState.tickCount,
    simRunning,
    startSim,
    stopSim,
    manualOrders,
    createManualOrder,
    completeManualOrder,
    updateBin,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}
