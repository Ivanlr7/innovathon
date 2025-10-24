import React, { useState } from 'react';
import EnergyDemandChart from './charts/EnergyDemandChart';
import BiomassConsumptionChart from './charts/BiomassConsumptionChart';
import HDDChart from './charts/HDDChart';
import SummaryCard from './cards/SummaryCard';
import AlertCard from './cards/AlertCard';
import { 
  mockInstallations, 
  mockEnergyData, 
  mockBiomassData, 
  mockHDDData, 
  mockAlerts, 
  summaryData 
} from '../data/mockData';

const Dashboard = () => {
  const [selectedInstallation, setSelectedInstallation] = useState('INST_001');

  return (
    <div className="moderate-container">
      {/* Header */}
      <header className="moderate-header">
        <div className="header-content">
          <div className="moderate-logo">
            <div className="logo-icon">🌿</div>
            <div>
              <div className="logo-text">MODERATE</div>
              <div className="logo-subtitle">
                Herbelsible Open Data Solution for Optimized Building-related Energy Services
              </div>
            </div>
          </div>
          <div className="eu-funding">
            Financiado por la Unión Europea<br />
            Innovation Project
          </div>
        </div>
      </header>

      {/* Selector de Instalación */}
      <div className="installation-selector">
        <div className="selector-label">Seleccionar Instalación:</div>
        <div className="selector-buttons">
          {mockInstallations.map(install => (
            <button
              key={install.id}
              className={`install-btn ${selectedInstallation === install.id ? 'active' : ''}`}
              onClick={() => setSelectedInstallation(install.id)}
            >
              {install.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="summary-grid">
        <SummaryCard 
          title="Consumo Energético Total"
          value={summaryData.totalConsumption}
          subtitle="Semana actual"
          trend="+2.3% vs semana anterior"
          trendType="negative"
        />
        <SummaryCard 
          title="Uso de Biomasa"
          value={summaryData.biomassUsage}
          subtitle="Consumo semanal"
          trend="-1.5% vs semana anterior"
          trendType="positive"
        />
        <SummaryCard 
          title="Eficiencia del Sistema"
          value={summaryData.efficiency}
          subtitle="Rendimiento general"
          trend="+0.8%"
          trendType="positive"
        />
        <SummaryCard 
          title="Ahorro Estimado"
          value={summaryData.costSavings}
          subtitle="Vs sistema convencional"
          trend="+5.2%"
          trendType="positive"
        />
        <SummaryCard 
          title="HDD Semanal"
          value={summaryData.hddWeekly}
          subtitle="Grados día de calefacción"
          trend="+3.1°C vs promedio"
          trendType="negative"
        />
        <SummaryCard 
          title="Precisión Predicciones"
          value={summaryData.predictionsAccuracy}
          subtitle="Tasa de acierto"
          trend="+2.1%"
          trendType="positive"
        />
      </div>

      {/* Grid Principal */}
      <div className="dashboard-grid">
        {/* Gráficas */}
        <div>
          <div className="charts-grid">
            <EnergyDemandChart data={mockEnergyData} />
            <BiomassConsumptionChart data={mockBiomassData} />
          </div>
          <HDDChart data={mockHDDData} />
        </div>

        {/* Panel Lateral */}
        <div>
          <AlertCard alerts={mockAlerts} />
          <div className="moderate-card" style={{ marginTop: '1rem' }}>
            <div className="card-header">
              <span>🏢</span>
              Información de la Instalación
            </div>
            <div style={{ lineHeight: '1.8' }}>
              <strong>Nombre:</strong> {mockInstallations.find(i => i.id === selectedInstallation)?.name}<br />
              <strong>Ubicación:</strong> Salamanca<br />
              <strong>ID:</strong> {selectedInstallation}<br />
              <strong>Tipo:</strong> Residencial<br />
              <strong>Capacidad:</strong> 120 viviendas<br />
              <strong>Última actualización:</strong> Hoy, 09:30
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        padding: '2rem', 
        color: 'var(--moderate-gray)',
        borderTop: '1px solid var(--moderate-light)'
      }}>
        <div>MODERATE Platform - Herbelsible Open Data Solution</div>
        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or CNEA.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;