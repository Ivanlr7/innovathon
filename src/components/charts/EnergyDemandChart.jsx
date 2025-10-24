import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnergyDemandChart = ({ data }) => {
  return (
    <div className="chart-container">
      <div className="chart-title">
        <span>📊</span>
        Demanda Energética Semanal
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
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
              value: 'kWh', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10 
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value} kWh`, 'Demanda']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#2C5530" 
            strokeWidth={3}
            dot={{ fill: '#2C5530', strokeWidth: 2, r: 4 }}
            name="Demanda Real"
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#8FB996" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#8FB996', strokeWidth: 2, r: 3 }}
            name="Demanda Predicha"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyDemandChart;