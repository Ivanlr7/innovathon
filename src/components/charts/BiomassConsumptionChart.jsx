import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BiomassConsumptionChart = ({ data }) => {
  return (
    <div className="chart-container">
      <div className="chart-title">
        <span>🌱</span>
        Consumo de Biomasa Semanal
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            label={{ 
              value: 'kg', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10 
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value} kg`, 'Biomasa']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="actual" 
            fill="#4A7C59" 
            name="Consumo Real"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="predicted" 
            fill="#8FB996" 
            name="Consumo Predicho"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiomassConsumptionChart;