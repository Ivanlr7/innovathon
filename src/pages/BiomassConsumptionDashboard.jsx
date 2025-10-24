import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AlertCircle, TrendingUp, Activity, Flame } from 'lucide-react';
import './BiomassConsumptionDashboard.css';

/* Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api'; */

const BiomassConsumptionDashboard = () => {
  const [installations, setInstallations] = useState([]);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);

  // Simulación de carga de datos
  useEffect(() => {
    // Mock: simulamos 3 instalaciones
    const fakeInstallations = [
      { id: 1, name: 'Edificio Norte' },
      { id: 2, name: 'Residencia Central' },
      { id: 3, name: 'Centro Sur' }
    ];
    setInstallations(fakeInstallations);
    setSelectedInstallation(fakeInstallations[0].id);

    // Mock: generamos datos históricos (últimos 30 días)
    const today = new Date();
    const mockHistorical = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (30 - i));
      const demanda_real = Math.random() * 500 + 500;
      const demanda_predicha = demanda_real * (0.9 + Math.random() * 0.2);
      const biomasa_real = Math.random() * 300 + 200;
      const biomasa_predicha = biomasa_real * (0.9 + Math.random() * 0.15);
      return {
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        demanda_real,
        demanda_predicha,
        biomasa_real,
        biomasa_predicha
      };
    });
    setHistoricalData(mockHistorical);

    // Mock: generamos predicciones semanales
    const daysOfWeek = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
    const mockWeekly = daysOfWeek.map((d, i) => ({
      day: new Date(today.setDate(today.getDate() + 1)).toISOString(),
      dayName: d,
      hdd: Math.random() * 8 + 2,
      demanda: Math.random() * 700 + 400,
      biomasa: Math.random() * 400 + 150
    }));
    setWeeklyForecast(mockWeekly);

    // Simulamos un pequeño retardo de carga
    setTimeout(() => setLoading(false), 800);
  }, []);

  const calculateStats = () => {
    if (!weeklyForecast.length) return null;
    const totalBiomass = weeklyForecast.reduce((s, i) => s + i.biomasa, 0);
    const avgDemand = weeklyForecast.reduce((s, i) => s + i.demanda, 0) / weeklyForecast.length;
    const maxBiomass = Math.max(...weeklyForecast.map(i => i.biomasa));
    const peakDay = weeklyForecast.find(i => i.biomasa === maxBiomass);
    return {
      totalBiomass: totalBiomass.toFixed(2),
      avgDemand: avgDemand.toFixed(2),
      maxBiomass: maxBiomass.toFixed(2),
      peakDay: peakDay?.dayName || 'N/A'
    };
  };

  const stats = calculateStats();

  const hasHighConsumptionAlert = () => {
    if (!stats || !historicalData.length) return false;
    const maxHistorical = Math.max(...historicalData.map(item => item.biomasa_real || 0));
    return parseFloat(stats.maxBiomass) > maxHistorical * 0.8;
  };

  /*useEffect(() => {
    fetchInstallations();
  }, []);

  useEffect(() => {
    if (selectedInstallation) {
      fetchPredictions(selectedInstallation);
      fetchHistoricalData(selectedInstallation);
    }
  }, [selectedInstallation]);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/installations`);
      if (!response.ok) throw new Error('Error al cargar instalaciones');
      const data = await response.json();
      setInstallations(data);
      if (data.length > 0) setSelectedInstallation(data[0].id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async (installationId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/predict/${installationId}`);
      if (!response.ok) throw new Error('Error al cargar predicciones');
      const data = await response.json();
      setPredictionData(data);
      
      const forecast = data.weekly_forecast.map((item, index) => ({
        day: item.date,
        hdd: item.hdd,
        demanda: item.predicted_demand,
        biomasa: item.predicted_biomass,
        dayName: new Date(item.date).toLocaleDateString('es-ES', { weekday: 'short' })
      }));
      setWeeklyForecast(forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async (installationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/historical/${installationId}`);
      if (!response.ok) throw new Error('Error al cargar histórico');
      const data = await response.json();
      
      const formattedData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        demanda_real: item.actual_demand,
        demanda_predicha: item.predicted_demand,
        biomasa_real: item.actual_biomass,
        biomasa_predicha: item.predicted_biomass
      }));
      setHistoricalData(formattedData.slice(-30));
    } catch (err) {
      console.error('Error cargando histórico:', err);
    }
  }; 

  const calculateStats = () => {
    if (!weeklyForecast.length) return null;
    
    const totalBiomass = weeklyForecast.reduce((sum, item) => sum + item.biomasa, 0);
    const avgDemand = weeklyForecast.reduce((sum, item) => sum + item.demanda, 0) / weeklyForecast.length;
    const maxBiomass = Math.max(...weeklyForecast.map(item => item.biomasa));
    const peakDay = weeklyForecast.find(item => item.biomasa === maxBiomass);

    return {
      totalBiomass: totalBiomass.toFixed(2),
      avgDemand: avgDemand.toFixed(2),
      maxBiomass: maxBiomass.toFixed(2),
      peakDay: peakDay?.dayName || 'N/A'
    };
  };

  const stats = calculateStats();

  const hasHighConsumptionAlert = () => {
    if (!stats || !historicalData.length) return false;
    const maxHistorical = Math.max(...historicalData.map(item => item.biomasa_real || 0));
    return parseFloat(stats.maxBiomass) > maxHistorical * 0.8;
  }; */

  if (loading && !predictionData) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="title-section">
          <h1>Predicción de biomasa</h1>
          <p>Proyecto MODERATE - Innovathon 2025</p>
        </div>

        <select
          value={selectedInstallation || ''}
          onChange={(e) => setSelectedInstallation(e.target.value)}
          className="installation-select"
        >
          {installations.map(inst => (
            <option key={inst.id} value={inst.id}>{inst.name}</option>
          ))}
        </select>
      </header>

      {hasHighConsumptionAlert() && (
        <div className="alert warning">
          <AlertCircle className="icon" />
          <div>
            <p><strong>Alerta: Consumo Elevado Previsto</strong></p>
            <p>Se espera un consumo superior al 80% del máximo histórico el {stats?.peakDay}</p>
          </div>
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <StatCard icon={<Flame />} title="Biomasa Semanal" value={`${stats.totalBiomass} kg`} color="red" />
          <StatCard icon={<Activity />} title="Demanda Promedio" value={`${stats.avgDemand} kWh`} color="blue" />
          <StatCard icon={<TrendingUp />} title="Pico de Consumo" value={`${stats.maxBiomass} kg`} color="orange" />
          <StatCard icon={<AlertCircle />} title="Día Pico" value={stats.peakDay} color="purple" />
        </div>
      )}

      {/* Gráfica 1: Comparativa de Demanda (Real vs Predicción) */}
      <section className="chart-section">
        <h2>Demanda real vs Predicción</h2>
        <p>(Últimos 30 días)</p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe6fd" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="demanda_real" 
              stroke="#104881" 
              strokeWidth={2.5}
              name="Demanda Real"
              dot={{ fill: '#104881', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="demanda_predicha" 
              stroke="#57d1f0" 
              strokeWidth={2.5}
              strokeDasharray="5 5"
              name="Demanda Predicha"
              dot={{ fill: '#57d1f0', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Gráfica 2: Comparativa de Consumo de Biomasa (Real vs Predicción) */}
      <section className="chart-section">
        <h2>Consumo de biomasa real vs Predicción</h2>
        <p>(Últimos 30 días)</p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe6fd" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="biomasa_real" 
              fill="#ef4444" 
              name="Biomasa Real"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="biomasa_predicha" 
              fill="#fb923c" 
              name="Biomasa Predicha"
              radius={[8, 8, 0, 0]}
              opacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Gráfica de predicción semanal */}
      <section className="chart-section">
        <h2>Predicción semanal de consumo de biomasa</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyForecast}>
            <defs>
              <linearGradient id="colorBiomasa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="dayName" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="biomasa" stroke="#f97316" fillOpacity={1} fill="url(#colorBiomasa)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* Tabla resumen */}
      <section className="table-section">
        <h2>Resumen semanal por día</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Fecha</th>
                <th>HDD (°C)</th>
                <th>Demanda (kWh)</th>
                <th>Biomasa (kg)</th>
              </tr>
            </thead>
            <tbody>
              {weeklyForecast.map((day, index) => (
                <tr key={index}>
                  <td>{day.dayName}</td>
                  <td>{new Date(day.day).toLocaleDateString('es-ES')}</td>
                  <td>{day.hdd.toFixed(1)}</td>
                  <td>{day.demanda.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${day.biomasa > parseFloat(stats?.maxBiomass) * 0.8 ? 'danger' : 'success'}`}>
                      {day.biomasa.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="dashboard-footer">
        © 2025 Proyecto MODERATE - Innovathon | Powered by CTIC, Veolia, Universidad de Oviedo | Propuesta grupo 3
      </footer>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div>
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

export default BiomassConsumptionDashboard;