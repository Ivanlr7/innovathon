// Datos de ejemplo para el frontend
export const mockInstallations = [
  { id: 'INST_001', name: 'Residencial Norte', location: 'Salamanca' },
  { id: 'INST_002', name: 'Complejo Sur', location: 'Salamanca' },
  { id: 'INST_003', name: 'Edificio Central', location: 'Salamanca' },
  { id: 'INST_004', name: 'Residencial Este', location: 'Salamanca' },
];

export const mockEnergyData = [
  { date: '2024-01-01', actual: 1250, predicted: 1280, hdd: 18.5 },
  { date: '2024-01-02', actual: 1320, predicted: 1300, hdd: 19.2 },
  { date: '2024-01-03', actual: 1280, predicted: 1310, hdd: 18.8 },
  { date: '2024-01-04', actual: 1350, predicted: 1330, hdd: 20.1 },
  { date: '2024-01-05', actual: 1400, predicted: 1380, hdd: 21.5 },
  { date: '2024-01-06', actual: 1380, predicted: 1360, hdd: 20.8 },
  { date: '2024-01-07', actual: 1300, predicted: 1320, hdd: 19.0 },
];

export const mockBiomassData = [
  { date: '2024-01-01', actual: 850, predicted: 870 },
  { date: '2024-01-02', actual: 890, predicted: 880 },
  { date: '2024-01-03', actual: 870, predicted: 875 },
  { date: '2024-01-04', actual: 910, predicted: 900 },
  { date: '2024-01-05', actual: 950, predicted: 930 },
  { date: '2024-01-06', actual: 920, predicted: 910 },
  { date: '2024-01-07', actual: 880, predicted: 890 },
];

export const mockHDDData = [
  { date: '2024-01-01', hdd: 18.5, tmax: 12, tmin: 6 },
  { date: '2024-01-02', hdd: 19.2, tmax: 11, tmin: 5 },
  { date: '2024-01-03', hdd: 18.8, tmax: 12, tmin: 6 },
  { date: '2024-01-04', hdd: 20.1, tmax: 10, tmin: 4 },
  { date: '2024-01-05', hdd: 21.5, tmax: 9, tmin: 3 },
  { date: '2024-01-06', hdd: 20.8, tmax: 10, tmin: 4 },
  { date: '2024-01-07', hdd: 19.0, tmax: 13, tmin: 7 },
];

export const mockAlerts = [
  { id: 1, type: 'warning', message: 'Consumo elevado detectado en Residencial Norte', installation: 'INST_001' },
  { id: 2, type: 'info', message: 'Predicción actualizada con nuevos datos meteorológicos', installation: 'ALL' },
  { id: 3, type: 'warning', message: 'HDD superior al promedio histórico', installation: 'INST_003' },
];

export const summaryData = {
  totalConsumption: '4,280 kWh',
  biomassUsage: '2,950 kg',
  efficiency: '89%',
  costSavings: '€320',
  hddWeekly: '138.9',
  predictionsAccuracy: '94%'
};