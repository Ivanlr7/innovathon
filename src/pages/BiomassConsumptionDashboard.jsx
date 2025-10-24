import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AlertCircle, TrendingUp, Activity, Flame } from 'lucide-react';
import './BiomassConsumptionDashboard.css'

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api'; // Cambiar según tu backend

const BiomassConsumptionDashboard = () => {
  // Estados
  const [installations, setInstallations] = useState([]);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);

  // Cargar lista de instalaciones al montar el componente
  useEffect(() => {
    fetchInstallations();
  }, []);

  // Cargar predicciones cuando se selecciona una instalación
  useEffect(() => {
    if (selectedInstallation) {
      fetchPredictions(selectedInstallation);
      fetchHistoricalData(selectedInstallation);
    }
  }, [selectedInstallation]);

  // Función para obtener lista de instalaciones
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

  // Función para obtener predicciones
  const fetchPredictions = async (installationId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/predict/${installationId}`);
      if (!response.ok) throw new Error('Error al cargar predicciones');
      const data = await response.json();
      setPredictionData(data);
      
      // Formatear datos para el forecast semanal
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

  // Función para obtener datos históricos
  const fetchHistoricalData = async (installationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/historical/${installationId}`);
      if (!response.ok) throw new Error('Error al cargar histórico');
      const data = await response.json();
      
      // Formatear datos históricos
      const formattedData = data.map(item => ({
        date: item.date,
        demanda_real: item.actual_demand,
        demanda_predicha: item.predicted_demand,
        biomasa_real: item.actual_biomass,
        biomasa_predicha: item.predicted_biomass
      }));
      setHistoricalData(formattedData.slice(-30)); // Últimos 30 días
    } catch (err) {
      console.error('Error cargando histórico:', err);
    }
  };

  // Calcular estadísticas
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

  // Detectar alertas (consumo > 80% del máximo histórico)
  const hasHighConsumptionAlert = () => {
    if (!stats || !historicalData.length) return false;
    const maxHistorical = Math.max(...historicalData.map(item => item.biomasa_real || 0));
    return parseFloat(stats.maxBiomass) > maxHistorical * 0.8;
  };

  if (loading && !predictionData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="title-section">
          <h1>Dashboard de Predicción de Biomasa</h1>
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

      {/* Gráficas principales */}
      <section className="chart-section">
        <h2>Predicción Semanal de Consumo de Biomasa</h2>
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
        <h2>Resumen Semanal por Día</h2>
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
        © 2025 Proyecto MODERATE - Innovathon | Powered by CTIC, Veolia, Universidad de Oviedo
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
