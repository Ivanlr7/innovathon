import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AlertCircle, TrendingUp, Activity, Flame } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard de Predicción de Biomasa</h1>
              <p className="text-gray-600">Proyecto MODERATE - Innovathon 2025</p>
            </div>
          </div>
          
          {/* Selector de instalación */}
          <select
            value={selectedInstallation || ''}
            onChange={(e) => setSelectedInstallation(e.target.value)}
            className="px-4 py-2 border-2 border-blue-200 rounded-lg bg-white font-medium focus:outline-none focus:border-blue-500 transition"
          >
            {installations.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        {/* Alerta de consumo elevado */}
        {hasHighConsumptionAlert() && (
          <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-800">Alerta: Consumo Elevado Previsto</p>
              <p className="text-sm text-orange-700">
                Se espera un consumo superior al 80% del máximo histórico el {stats?.peakDay}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tarjetas de estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Flame className="w-6 h-6" />}
              title="Biomasa Semanal"
              value={`${stats.totalBiomass} kg`}
              color="bg-red-500"
            />
            <StatCard
              icon={<Activity className="w-6 h-6" />}
              title="Demanda Promedio"
              value={`${stats.avgDemand} kWh`}
              color="bg-blue-500"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Pico de Consumo"
              value={`${stats.maxBiomass} kg`}
              color="bg-orange-500"
            />
            <StatCard
              icon={<AlertCircle className="w-6 h-6" />}
              title="Día Pico"
              value={stats.peakDay}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Gráfica de predicción semanal */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Predicción Semanal de Consumo de Biomasa
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyForecast}>
              <defs>
                <linearGradient id="colorBiomasa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="dayName" 
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: '500' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: '500' }}
                label={{ value: 'Biomasa (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="biomasa" 
                stroke="#f97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBiomasa)"
                name="Consumo de Biomasa (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráficas combinadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfica HDD y Demanda */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">HDD vs Demanda Energética</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dayName" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="hdd" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="HDD (°C)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="demanda" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Demanda (kWh)"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de barras de consumo diario */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Consumo Diario de Biomasa</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dayName" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="biomasa" 
                  fill="#f97316" 
                  name="Biomasa (kg)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparación con datos históricos */}
        {historicalData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Precisión del Modelo (Últimos 30 días)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="biomasa_real" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Biomasa Real (kg)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="biomasa_predicha" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Biomasa Predicha (kg)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tabla resumen */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen Semanal por Día</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HDD (°C)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demanda (kWh)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biomasa (kg)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weeklyForecast.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.dayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(day.day).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {day.hdd.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {day.demanda.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        day.biomasa > parseFloat(stats?.maxBiomass) * 0.8 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {day.biomasa.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-600 text-sm">
        <p>© 2025 Proyecto MODERATE - Innovathon | Powered by CTIC, Veolia, Universidad de Oviedo</p>
      </div>
    </div>
  );
};

// Componente de tarjeta de estadística
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 transition transform hover:scale-105">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg text-white`}>
        {icon}
      </div>
    </div>
  </div>
);

export default BiomassConsumptionDashboard;
