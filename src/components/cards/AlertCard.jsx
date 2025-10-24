import React from 'react';

const AlertCard = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'error': return '🚨';
      default: return '📢';
    }
  };

  return (
    <div className="moderate-card alert-card">
      <div className="card-header alert-header">
        <span>🚨</span>
        Alertas del Sistema
      </div>
      <ul className="alert-list">
        {alerts.map(alert => (
          <li key={alert.id} className="alert-item">
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <span>{alert.message}</span>
            <small style={{ marginLeft: 'auto', opacity: 0.7 }}>
              {alert.installation === 'ALL' ? 'General' : alert.installation}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertCard;