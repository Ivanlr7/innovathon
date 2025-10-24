import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HDDChart = ({ data }) => {
  return (
    <div className="chart-container">
      <div className="chart-title">
        <span>🌡️</span>
        Heating Degree Days (HDD) y Temperaturas
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            yAxisId="left"
            label={{ 
              value: 'HDD', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10 
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ 
              value: '°C', 
              angle: -90, 
              position: 'insideRight',
              offset: -10 
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'hdd') return [`${value} HDD`, 'Grados Día'];
              return [`${value}°C`, name === 'tmax' ? 'Temperatura Máxima' : 'Temperatura Mínima'];
            }}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="hdd" 
            stroke="#E74C3C" 
            fill="#E74C3C"
            fillOpacity={0.3}
            strokeWidth={2}
            name="Grados Día (HDD)"
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="tmax" 
            stroke="#3498DB" 
            fill="none"
            strokeWidth={2}
            name="Temperatura Máxima"
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="tmin" 
            stroke="#9B59B6" 
            fill="none"
            strokeWidth={2}
            name="Temperatura Mínima"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HDDChart;