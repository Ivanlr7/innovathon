import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ConsumeChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Consumo de biomasa: histórico vs predicción</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="historico" stroke="#8884d8" name="Histórico" />
          <Line type="monotone" dataKey="prediccion" stroke="#82ca9d" name="Predicción" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumeChart;
