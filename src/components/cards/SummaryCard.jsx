import React from 'react';

const SummaryCard = ({ title, value, subtitle, trend, trendType }) => {
  return (
    <div className="summary-card">
      <div className="summary-label">{title}</div>
      <div className="summary-value">{value}</div>
      <div className="summary-subtitle">{subtitle}</div>
      {trend && (
        <div className={`summary-trend ${trendType === 'positive' ? 'trend-positive' : 'trend-negative'}`}>
          {trend}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;