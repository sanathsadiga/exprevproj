import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import { dataAPI, locationAPI } from '../api/client';
import { formatNumber } from '../utils/constants';

// Calendar months for the form (user-facing)
const CALENDAR_MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// Function to convert calendar month/year to fiscal month/year
const getFormData = (calendarMonth, calendarYear) => {
  let fiscalMonth;
  let fiscalYear;

  if (calendarMonth >= 4) {
    // April-December: fiscal year starts in current calendar year
    fiscalMonth = calendarMonth - 3; // April (4) -> 1, June (6) -> 3, Dec (12) -> 9
    fiscalYear = calendarYear;
  } else {
    // January-March: fiscal year starts in previous calendar year
    fiscalMonth = calendarMonth + 9; // Jan (1) -> 10, Feb (2) -> 11, Mar (3) -> 12
    fiscalYear = calendarYear - 1;
  }

  return { fiscalMonth, fiscalYear };
};

const DataEntry = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // For filtering and display
  const [filterCalendarMonth, setFilterCalendarMonth] = useState(new Date().getMonth() + 1);
  const [filterCalendarYear, setFilterCalendarYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    location_id: '',
    calendar_month: new Date().getMonth() + 1,
    calendar_year: new Date().getFullYear(),
    expense: '',
    revenue: '',
    revenue_source: '',
  });

  useEffect(() => {
    fetchLocations();
    fetchEntries();
  }, [filterCalendarMonth, filterCalendarYear]);

  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getLocations();
      setLocations(response.data.locations);
    } catch (error) {
      setError('Error loading locations');
    }
  };

  const fetchEntries = async () => {
    try {
      // Convert calendar to fiscal for API call
      const { fiscalMonth, fiscalYear } = getFormData(filterCalendarMonth, filterCalendarYear);
      
      const response = await dataAPI.getMonthlyData({
        month: fiscalMonth,
        year: fiscalYear,
      });
      setEntries(response.data.data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'expense' || name === 'revenue' ? parseFloat(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.location_id || formData.expense === '' || formData.revenue === '') {
      setError('Location, expense, and revenue are required');
      return;
    }

    setLoading(true);

    try {
      // Convert calendar month/year to fiscal month/year
      const { fiscalMonth, fiscalYear } = getFormData(formData.calendar_month, formData.calendar_year);
      
      const submitData = {
        location_id: formData.location_id,
        month: fiscalMonth,
        year: fiscalYear,
        expense: formData.expense,
        revenue: formData.revenue,
        revenue_source: formData.revenue_source
          ? formData.revenue_source.split(',').map(s => s.trim()).filter(s => s).join(', ')
          : null
      };

      if (editingId) {
        await dataAPI.updateExpenseRevenue(editingId, {
          expense: submitData.expense,
          revenue: submitData.revenue,
          revenue_source: submitData.revenue_source,
        });
        setSuccess('Data updated successfully');
        setEditingId(null);
      } else {
        await dataAPI.addExpenseRevenue(submitData);
        setSuccess('Data saved successfully');
      }
      setFormData({
        location_id: '',
        calendar_month: filterCalendarMonth,
        calendar_year: filterCalendarYear,
        expense: '',
        revenue: '',
        revenue_source: '',
      });
      fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    // entry.month and entry.year are fiscal values from DB
    // Convert back to calendar for display
    const fiscalMonth = entry.month;
    const fiscalYear = entry.year;
    
    let calendarMonth, calendarYear;
    if (fiscalMonth <= 9) {
      // Fiscal months 1-9 (April-December) are in the same calendar year
      calendarMonth = fiscalMonth + 3;
      calendarYear = fiscalYear;
    } else {
      // Fiscal months 10-12 (January-March) are in the next calendar year
      calendarMonth = fiscalMonth - 9;
      calendarYear = fiscalYear + 1;
    }

    setEditingId(entry.id);
    setFormData({
      location_id: entry.location_id,
      calendar_month: calendarMonth,
      calendar_year: calendarYear,
      expense: entry.expense,
      revenue: entry.revenue,
      revenue_source: entry.revenue_source || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await dataAPI.deleteExpenseRevenue(id);
        setSuccess('Entry deleted successfully');
        fetchEntries();
      } catch (err) {
        setError('Error deleting entry');
      }
    }
  };

  const handleCSVImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        setError('CSV file must have at least a header and one data row');
        setLoading(false);
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const locationIdx = headers.findIndex((h) => h === 'location');
      const expenseIdx = headers.findIndex((h) => h === 'expense');
      const revenueIdx = headers.findIndex((h) => h === 'revenue');

      if (locationIdx === -1 || expenseIdx === -1 || revenueIdx === -1) {
        setError('CSV must have columns: location, expense, revenue');
        setLoading(false);
        return;
      }

      const data = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        return {
          location: values[locationIdx],
          expense: values[expenseIdx],
          revenue: values[revenueIdx],
        };
      });

      // Convert calendar to fiscal for API call
      const { fiscalMonth, fiscalYear } = getFormData(filterCalendarMonth, filterCalendarYear);
      
      const response = await dataAPI.bulkImportCSV({
        month: fiscalMonth,
        year: fiscalYear,
        data,
      });

      setSuccess(
        `Bulk import completed! Inserted: ${response.data.inserted}, Skipped: ${response.data.skipped}`
      );
      fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Error importing CSV');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const getLocationName = (locationId) => {
    const location = locations.find((l) => l.id === locationId);
    return location?.name || 'Unknown';
  };

  return (
    <div className="layout">
      <Sidebar role={user?.role} />
      <div className="main-content">
        <div className="header">
          <h1>Expense & Revenue Data Entry</h1>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowTable(!showTable)}
          >
            {showTable ? 'Hide Entries' : 'View Entries'}
          </button>
          <label className="btn btn-success" style={{ cursor: 'pointer', margin: 0 }}>
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h3>{editingId ? 'Edit Entry' : 'Add New Entry'}</h3>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="required">Location</label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  required
                  disabled={loading || editingId}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Month</label>
                  <select
                    name="calendar_month"
                    value={formData.calendar_month}
                    onChange={handleChange}
                    required
                    disabled={loading || editingId}
                  >
                    {CALENDAR_MONTHS.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="required">Year</label>
                  <select
                    name="calendar_year"
                    value={formData.calendar_year}
                    onChange={handleChange}
                    required
                    disabled={loading || editingId}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Expense (INR)</label>
                  <input
                    type="number"
                    name="expense"
                    value={formData.expense}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="required">Revenue (INR)</label>
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Office Events</label>
                <input
                  type="text"
                  name="revenue_source"
                  value={formData.revenue_source}
                  onChange={handleChange}
                  placeholder="e.g., Sales, Service A, Service B (comma-separated)"
                  disabled={loading}
                />
                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                  Enter multiple sources separated by commas
                </small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Entry' : 'Add Entry'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        location_id: '',
                        month: filterMonth,
                        year: filterYear,
                        expense: '',
                        revenue: '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h3>Filter Entries</h3>
            <div className="form-group">
              <label>Month</label>
              <select value={filterCalendarMonth} onChange={(e) => setFilterCalendarMonth(parseInt(e.target.value))}>
                {CALENDAR_MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <select value={filterCalendarYear} onChange={(e) => setFilterCalendarYear(parseInt(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '20px' }}>
              Total Entries: <strong>{entries.length}</strong>
            </p>
          </div>
        </div>

        {showTable && entries.length > 0 && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h3>Your Entries ({CALENDAR_MONTHS.find(m => m.value === filterCalendarMonth)?.label} {filterCalendarYear})</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Expense</th>
                    <th>Revenue</th>
                    <th>Office Events</th>
                    <th>Profit/Loss</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{getLocationName(entry.location_id)}</td>
                      <td>{formatNumber(entry.expense)}</td>
                      <td>{formatNumber(entry.revenue)}</td>
                      <td style={{ fontSize: '13px' }}>{entry.revenue_source || '-'}</td>
                      <td style={{ color: entry.revenue - entry.expense >= 0 ? '#28a745' : '#dc3545' }}>
                        {formatNumber(entry.revenue - entry.expense)}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => handleEdit(entry)}
                          style={{ marginRight: '5px' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </button>
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

export default DataEntry;
