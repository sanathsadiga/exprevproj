import { formatCurrency, formatNumber } from '../utils/constants';

const StatCard = ({ label, value, type = 'default', isLoading = false }) => {
  const cardClass = `stat-card ${type}`;

  return (
    <div className={cardClass}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {isLoading ? (
          <div className="spinner"></div>
        ) : type === 'currency' ? (
          formatCurrency(value || 0)
        ) : (
          formatNumber(value || 0)
        )}
      </div>
    </div>
  );
};

export default StatCard;
