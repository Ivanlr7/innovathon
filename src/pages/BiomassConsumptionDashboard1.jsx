import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './BiomassConsumptionDashboard.css';

const API_BASE_URL = 'http://localhost:5000';

const BiomassConsumptionDashboard1 = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAemetAndPredict = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener HDD desde AEMET
      const hddRes = await fetch(`${API_BASE_URL}/hdd_aemet`);
      const hddData = await hddRes.json();
      const hddArray = hddData.hdd;

      // 2. Predecir biomasa usando los HDD
      const predRes = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hdd: hddArray })
      });
      const predData = await predRes.json();

      // 3. Preparar datos para la gráfica
      const chartArray = hddArray.map((hddValue, idx) => ({
        dia: `Día ${idx + 1}`,
        hdd: hddValue,
        consumo_biomasa: predData.consumo_biomasa[idx]
      }));
      setChartData(chartArray);
    } catch (err) {
      setError(err.message);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="title-section">
          <h1>Predicción de biomasa con datos AEMET</h1>
        </div>
      </header>
      <button onClick={fetchAemetAndPredict} disabled={loading} className="predecir">
        Obtener predicción próxima semana (AEMET)
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Cargando...</p>}
      <section className="chart-section">
        <h2>Consumo de biomasa previsto</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe6fd" />
            <XAxis dataKey="dia" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="consumo_biomasa" 
              stroke="#104881" 
              strokeWidth={2.5}
              name="Consumo Biomasa"
              dot={{ fill: '#104881', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
      {chartData.length > 0 && (
        <section className="table-section">
          <h2>Resumen de predicción</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>HDD</th>
                  <th>Consumo Biomasa (kg)</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.dia}</td>
                    <td>{row.hdd.toFixed(2)}</td>
                    <td>{row.consumo_biomasa.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default BiomassConsumptionDashboard1;