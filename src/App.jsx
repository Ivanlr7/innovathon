
import './App.css'
import BiomassConsumptionDashboard from './pages/BiomassConsumptionDashboard';

function App() {
  const datos = [
    { fecha: "Lunes", historico: 120, prediccion: 130 },
    { fecha: "Martes", historico: 100, prediccion: 110 },
    { fecha: "Miércoles", historico: 140, prediccion: 150 },
    { fecha: "Jueves", historico: 160, prediccion: 155 },
    { fecha: "Viernes", historico: 130, prediccion: 140 },
    { fecha: "Sábado", historico: 110, prediccion: 120 },
    { fecha: "Domingo", historico: 100, prediccion: 105 },
  ];

  return (
    <div>
      <BiomassConsumptionDashboard />
    </div>
  );
}

export default App
