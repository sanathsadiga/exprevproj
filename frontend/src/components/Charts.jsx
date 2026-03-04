import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0066cc', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

const BarChartComponent = ({ data, title, dataKey1, dataKey2, xAxisKey, onBarClick }) => {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey1} fill="#0066cc" onClick={onBarClick} cursor="pointer" />
          {dataKey2 && <Bar dataKey={dataKey2} fill="#28a745" onClick={onBarClick} cursor="pointer" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const BarChartHorizontal = ({ data, title, dataKey1, dataKey2, nameKey }) => {
  const chartHeight = Math.max(450, data.length * 35);
  
  return (
    <div className="chart-container horizontal-bar" style={{ minHeight: `${chartHeight + 80}px` }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" stroke="#666" />
          <YAxis 
            dataKey={nameKey} 
            type="category" 
            width={130} 
            tick={{ fontSize: 12, fill: '#333' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '12px'
            }}
            formatter={(value) => value.toLocaleString()}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey={dataKey1} fill="#0066cc" name="Expense" radius={[0, 4, 4, 0]} />
          {dataKey2 && <Bar dataKey={dataKey2} fill="#28a745" name="Revenue" radius={[0, 4, 4, 0]} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineChartComponent = ({ data, title, dataKey1, dataKey2, xAxisKey }) => {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey1} stroke="#0066cc" />
          {dataKey2 && <Line type="monotone" dataKey={dataKey2} stroke="#28a745" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const PieChartComponent = ({ data, title, dataKey, nameKey }) => {
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name }) => {
    const RADIAN = Math.PI / 180;
    // Position label outside the pie
    const radius = outerRadius + 60;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#333" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {name}
      </text>
    );
  };

  return (
    <div className="chart-container" style={{ minHeight: '650px', paddingBottom: '20px' }}>
      <h3>{title}</h3>
      
      {/* Pie Chart with external labels */}
      <ResponsiveContainer width="100%" height={450}>
        <PieChart margin={{ top: 20, right: 150, bottom: 20, left: 150 }}>
          <Pie 
            data={data} 
            dataKey={dataKey} 
            nameKey={nameKey} 
            cx="50%" 
            cy="50%" 
            outerRadius={110}
            label={renderCustomLabel}
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `₹${value.toLocaleString()}`}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '2px solid #ddd', 
              borderRadius: '4px',
              padding: '10px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend Grid below pie chart */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: COLORS[index % COLORS.length], borderRadius: '2px', flexShrink: 0 }}></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '13px', color: '#333' }}>{item[nameKey]}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>₹{(item[dataKey]).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { BarChartComponent, BarChartHorizontal, LineChartComponent, PieChartComponent };
