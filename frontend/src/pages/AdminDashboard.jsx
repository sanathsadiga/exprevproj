import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { BarChartComponent, BarChartHorizontal, LineChartComponent, PieChartComponent } from '../components/Charts';
import { dataAPI, locationAPI } from '../api/client';
import { formatNumber, getCurrentFiscalYear } from '../utils/constants';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [locations, setLocations] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(getCurrentFiscalYear());
  const [allMonthlyData, setAllMonthlyData] = useState([]);
  const [locationChartType, setLocationChartType] = useState('monthly');
  const [locationChartMonth, setLocationChartMonth] = useState(1);
  const [locationChartYear, setLocationChartYear] = useState(2025);
  const [topPerformersSort, setTopPerformersSort] = useState('revenue');
  const [selectedMonthModal, setSelectedMonthModal] = useState(null);
  const monthNames = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

  useEffect(() => {
    fetchData();
    fetchLocations();
  }, [selectedLocation, selectedFiscalYear]);

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
      const summaryResponse = await dataAPI.getDashboardSummary();
      setSummary(summaryResponse.data);

      const params = { fiscal_year: selectedFiscalYear };
      if (selectedLocation !== 'all') {
        params.location_id = selectedLocation;
      }

      const allMonthlyResponse = await dataAPI.getAllMonthlyData(params);
      setAllMonthlyData(allMonthlyResponse.data.data);

      const yearlyResponse = await dataAPI.getAllYearlyData(params);
      setYearlyData(yearlyResponse.data.data);

      const processed = processMonthlyData(allMonthlyResponse.data.data);
      setMonthlyData(processed);
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
        months[monthIndex].expense = (months[monthIndex].expense || 0) + (parseFloat(item.expense) || 0);
        months[monthIndex].revenue = (months[monthIndex].revenue || 0) + (parseFloat(item.revenue) || 0);
      }
    });

    return months;
  };

  const getLocationChartData = () => {
    if (locationChartType === 'monthly') {
      // Filter data for selected month
      const filteredData = allMonthlyData.filter(
        (item) => item.month === locationChartMonth
      );
      
      const locationData = {};
      filteredData.forEach((item) => {
        if (!locationData[item.location_id]) {
          locationData[item.location_id] = {
            id: item.location_id,
            name: item.location_name,
            expense: 0,
            revenue: 0,
          };
        }
        locationData[item.location_id].expense += parseFloat(item.expense) || 0;
        locationData[item.location_id].revenue += parseFloat(item.revenue) || 0;
      });
      
      return Object.values(locationData).sort((a, b) => b.revenue - a.revenue);
    } else {
      // Use the summary byLocation data (yearly)
      return (
        summary?.byLocation?.map((loc) => ({
          name: loc.name,
          revenue: parseFloat(loc.total_revenue) || 0,
          expense: parseFloat(loc.total_expense) || 0,
        })) || []
      );
    }
  };

  const locationChartData = getLocationChartData();

  // Filter out zero revenue data for pie chart
  const pieChartData = locationChartData.filter((item) => parseFloat(item.revenue) > 0);

  const getTopPerformers = () => {
    if (!summary?.byLocation) return [];
    
    const performers = summary.byLocation.map((loc) => ({
      name: loc.name,
      revenue: parseFloat(loc.total_revenue) || 0,
      expense: parseFloat(loc.total_expense) || 0,
      profit: (parseFloat(loc.total_revenue) || 0) - (parseFloat(loc.total_expense) || 0),
    }));

    // Sort based on selected criteria
    if (topPerformersSort === 'revenue') {
      return performers.sort((a, b) => b.revenue - a.revenue);
    } else if (topPerformersSort === 'profit') {
      return performers.sort((a, b) => b.profit - a.profit);
    } else if (topPerformersSort === 'expense') {
      return performers.sort((a, b) => b.expense - a.expense);
    }
    
    return performers;
  };

  const handleMonthClick = (data) => {
    setSelectedMonthModal(data);
  };

  const getMonthDataForModal = () => {
    if (!selectedMonthModal) return [];
    
    return allMonthlyData.filter(item => item.month === selectedMonthModal.month);
  };

  return (
    <div className="layout">
      <Sidebar role={user?.role} />
      <div className="main-content">
        <div className="header">
          <h1>Admin Dashboard</h1>
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
                <option value={getCurrentFiscalYear()}>{getCurrentFiscalYear()}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-4">
          <StatCard label="Total Revenue" value={summary?.overall?.total_revenue} type="currency" isLoading={loading} />
          <StatCard label="Total Expense" value={summary?.overall?.total_expense} type="currency" isLoading={loading} />
          <StatCard label="Net Profit" value={(summary?.overall?.total_revenue || 0) - (summary?.overall?.total_expense || 0)} type="currency" isLoading={loading} />

        </div>

        

        <div className="charts-grid">
          <BarChartComponent data={monthlyData} title="Monthly Expense vs Revenue" dataKey1="expense" dataKey2="revenue" xAxisKey="monthName" onBarClick={handleMonthClick} />
          <LineChartComponent data={monthlyData} title="Monthly Trend" dataKey1="revenue" dataKey2="expense" xAxisKey="monthName" />
        </div>

        {locationChartData.length > 0 && (
          <>
            <div className="chart-filter-controls" style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px' }}>
              <label style={{ fontWeight: '600' }}>Location-wise View:</label>
              <select value={locationChartType} onChange={(e) => setLocationChartType(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              
              {locationChartType === 'monthly' && (
                <select value={locationChartMonth} onChange={(e) => setLocationChartMonth(parseInt(e.target.value))} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  {monthNames.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month} (Month {index + 1})
                    </option>
                  ))}
                </select>
              )}
              
              {locationChartType === 'yearly' && (
                <select value={selectedFiscalYear} onChange={(e) => setSelectedFiscalYear(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value={selectedFiscalYear}>{selectedFiscalYear}</option>
                </select>
              )}
            </div>
            <BarChartHorizontal data={locationChartData} title="Location-wise Revenue vs Expense" dataKey1="expense" dataKey2="revenue" nameKey="name" />
          </>
        )}

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

        {getTopPerformers().length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Top Performers by Location</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value="revenue"
                    checked={topPerformersSort === 'revenue'}
                    onChange={(e) => setTopPerformersSort(e.target.value)}
                  />
                  By Revenue
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value="profit"
                    checked={topPerformersSort === 'profit'}
                    onChange={(e) => setTopPerformersSort(e.target.value)}
                  />
                  By Profit
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value="expense"
                    checked={topPerformersSort === 'expense'}
                    onChange={(e) => setTopPerformersSort(e.target.value)}
                  />
                  By Expense
                </label>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Location</th>
                    <th>Revenue</th>
                    <th>Expense</th>
                    <th>Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {getTopPerformers().map((loc, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: '600' }}>{index + 1}</td>
                      <td>{loc.name}</td>
                      <td style={{ color: '#28a745', fontWeight: '600' }}>{formatNumber(loc.revenue)}</td>
                      <td>{formatNumber(loc.expense)}</td>
                      <td style={{ color: loc.profit >= 0 ? '#28a745' : '#dc3545', fontWeight: '600' }}>
                        {formatNumber(loc.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {allMonthlyData.length > 0 && (
          <div className="card">
            <h3>All Entries</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Location</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Expense</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {allMonthlyData.slice(0, 50).map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.user_name}</td>
                      <td>{entry.location_name}</td>
                      <td>{entry.month}</td>
                      <td>{entry.year}</td>
                      <td>{formatNumber(entry.expense)}</td>
                      <td>{formatNumber(entry.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allMonthlyData.length > 50 && <p style={{ marginTop: '10px', color: '#999' }}>Showing 50 of {allMonthlyData.length} entries</p>}
          </div>
        )}

        {/* Month Details Modal */}
        {selectedMonthModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>
                  {selectedMonthModal.monthName} - Detailed Data
                </h2>
                <button 
                  onClick={() => setSelectedMonthModal(null)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
              </div>

              {getMonthDataForModal().length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Location</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Expense</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Revenue</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getMonthDataForModal().map((entry) => (
                        <tr key={entry.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', textAlign: 'center'}}>{entry.location_name}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>{formatNumber(entry.expense)}</td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#28a745', fontWeight: '600' }}>{formatNumber(entry.revenue)}</td>
                          <td style={{ 
                            padding: '12px', 
                            textAlign: 'center',
                            color: (parseFloat(entry.revenue) - parseFloat(entry.expense)) >= 0 ? '#28a745' : '#dc3545',
                            fontWeight: '600'
                          }}>
                            {formatNumber(parseFloat(entry.revenue) - parseFloat(entry.expense))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  No data available for {selectedMonthModal.monthName}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
