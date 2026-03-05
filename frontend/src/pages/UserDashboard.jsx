import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { BarChartComponent, LineChartComponent, PieChartComponent } from '../components/Charts';
import { dataAPI, locationAPI } from '../api/client';
import { formatNumber, getCurrentFiscalYear } from '../utils/constants';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [locations, setLocations] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(getCurrentFiscalYear());
  const [locationChartType, setLocationChartType] = useState('yearly');
  const [locationChartMonth, setLocationChartMonth] = useState(1);

  useEffect(() => {
    fetchData();
    fetchLocations();
  }, [selectedLocation, selectedFiscalYear]);

  useEffect(() => {
    // When fiscal year changes, switch to yearly view for location chart
    setLocationChartType('yearly');
  }, [selectedFiscalYear]);

  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getLocations();
      setLocations(response.data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryParams = { fiscal_year: selectedFiscalYear };
      const summaryResponse = await dataAPI.getDashboardSummary(summaryParams);
      setSummary(summaryResponse.data);

      const params = { fiscal_year: selectedFiscalYear };
      if (selectedLocation !== 'all') {
        params.location_id = selectedLocation;
      }

      const monthlyResponse = await dataAPI.getMonthlyData(params);
      const processed = processMonthlyData(monthlyResponse.data.data);
      setMonthlyData(processed);

      const yearlyResponse = await dataAPI.getYearlyData(params);
      setYearlyData(yearlyResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (data) => {
    const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, monthName: monthNames[i], expense: 0, revenue: 0 }));

    data.forEach((item) => {
      const monthIndex = item.month - 1;
      if (monthIndex >= 0 && monthIndex < months.length) {
        months[monthIndex].expense = parseFloat(item.expense) || 0;
        months[monthIndex].revenue = parseFloat(item.revenue) || 0;
      }
    });

    return months;
  };

  const getLocationChartData = () => {
    if (locationChartType === 'yearly') {
      // Use the summary byLocation data (yearly)
      return (
        summary?.byLocation?.map((loc) => ({
          name: loc.name,
          revenue: parseFloat(loc.total_revenue) || 0,
          expense: parseFloat(loc.total_expense) || 0,
        })) || []
      );
    }
    // Monthly view - filter for selected month
    const filteredData = monthlyData.filter((item) => item.month === locationChartMonth);
    return [filteredData[0] || { monthName: 'N/A', expense: 0, revenue: 0 }];
  };

  const locationChartData = getLocationChartData();

  return (
    <div className="layout">
      <Sidebar role={user?.role} />
      <div className="main-content">
        <div className="header">
          <h1>User Dashboard</h1>
          <div className="header-actions">
            <div className="filter-group">
              <label>Location</label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Fiscal Year</label>
              <select value={selectedFiscalYear} onChange={(e) => setSelectedFiscalYear(e.target.value)}>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return `${year}-${year + 1}`;
                }).map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-4">
          <StatCard label="Total Revenue" value={summary?.overall?.total_revenue} type="currency" isLoading={loading} />
          <StatCard label="Total Expense" value={summary?.overall?.total_expense} type="currency" isLoading={loading} />
          <StatCard label="Net Profit" value={(summary?.overall?.total_revenue || 0) - (summary?.overall?.total_expense || 0)} type="currency" isLoading={loading} />
          <StatCard label="Total Records" value={summary?.overall?.total_records} isLoading={loading} />
        </div>

        <div className="grid grid-4">
          <StatCard label="Year Revenue" value={summary?.currentYear?.total_revenue} type="currency" isLoading={loading} />
          <StatCard label="Year Expense" value={summary?.currentYear?.total_expense} type="currency" isLoading={loading} />
          <StatCard label="Year Profit" value={(summary?.currentYear?.total_revenue || 0) - (summary?.currentYear?.total_expense || 0)} type="currency" isLoading={loading} />
          <StatCard label="Month Count" value={summary?.currentYear?.total_records} isLoading={loading} />
        </div>

        <div className="charts-grid">
          <BarChartComponent data={monthlyData} title="Monthly Expense vs Revenue" dataKey1="expense" dataKey2="revenue" xAxisKey="monthName" />
          <LineChartComponent data={monthlyData} title="Monthly Trend" dataKey1="revenue" dataKey2="expense" xAxisKey="monthName" />
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Location-wise Revenue vs Expense</h3>
          <div>
            <label style={{ marginRight: '10px' }}>View Type:</label>
            <select value={locationChartType} onChange={(e) => setLocationChartType(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <BarChartComponent data={locationChartData} title="Location-wise Revenue vs Expense" dataKey1="expense" dataKey2="revenue" nameKey="name" />

        {summary?.byLocation && summary.byLocation.length > 0 && (
          <div className="card">
            <h3>Location Summary</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Total Expense</th>
                    <th>Total Revenue</th>
                    <th>Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.byLocation.map((loc) => (
                    <tr key={loc.id}>
                      <td>{loc.name}</td>
                      <td>{formatNumber(loc.total_expense)}</td>
                      <td>{formatNumber(loc.total_revenue)}</td>
                      <td style={{ color: loc.total_revenue - loc.total_expense >= 0 ? '#28a745' : '#dc3545' }}>
                        {formatNumber(loc.total_revenue - loc.total_expense)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
