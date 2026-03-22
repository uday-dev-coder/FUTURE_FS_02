import React, { useEffect, useState } from 'react';
import { leadsAPI } from '../services/api';
import './Analytics.css';

const COLORS = ['#f0a500', '#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#e67e22'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsAPI.getAnalytics().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading analytics</div>;
  if (!data) return null;

  const statusMap = {};
  data.byStatus?.forEach(s => { statusMap[s._id] = s.count; });
  const converted = statusMap['Converted'] || 0;
  const conversionRate = data.total ? ((converted / data.total) * 100).toFixed(1) : 0;
  const maxByProject = Math.max(...(data.byProject?.map(p => p.count) || [1]));
  const maxBySource = Math.max(...(data.bySource?.map(s => s.count) || [1]));

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1 className="page-title">Analytics <span>Report</span></h1>
      </div>

      <div className="analytics-hero">
        <StatBox label="Total Leads" value={data.total} sub="All time" color="#f0a500" />
        <StatBox label="Converted" value={converted} sub="Successful" color="#2ecc71" />
        <StatBox label="Conversion Rate" value={`${conversionRate}%`} sub="Efficiency" color="#3498db" />
        <StatBox label="Active Pipeline" value={(data.total - (statusMap['Closed'] || 0) - converted)} sub="In progress" color="#9b59b6" />
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3 className="chart-title">By Project Type</h3>
          <div className="bar-chart">
            {data.byProject?.map((p, i) => (
              <div className="bar-row" key={p._id}>
                <div className="bar-label">{p._id}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(p.count / maxByProject) * 100}%`, background: COLORS[i % COLORS.length] }} />
                </div>
                <div className="bar-value" style={{ color: COLORS[i % COLORS.length] }}>{p.count}</div>
              </div>
            ))}
            {!data.byProject?.length && <p className="no-data">No data yet</p>}
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="chart-title">By Status</h3>
          <div className="donut-wrap">
            <DonutChart data={data.byStatus} colors={COLORS} total={data.total} />
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="chart-title">By Lead Source</h3>
          <div className="bar-chart">
            {data.bySource?.map((s, i) => (
              <div className="bar-row" key={s._id}>
                <div className="bar-label">{s._id}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(s.count / maxBySource) * 100}%`, background: COLORS[i % COLORS.length] }} />
                </div>
                <div className="bar-value" style={{ color: COLORS[i % COLORS.length] }}>{s.count}</div>
              </div>
            ))}
            {!data.bySource?.length && <p className="no-data">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, color }) {
  return (
    <div className="stat-box" style={{ '--c': color }}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function DonutChart({ data, colors, total }) {
  if (!data?.length) return <p className="no-data">No data yet</p>;
  const size = 140;
  const r = 56;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="donut-chart">
      <svg width={size} height={size}>
        {data.map((d, i) => {
          const pct = d.count / total;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const startOffset = circumference - offset * circumference;
          offset += pct;
          return (
            <circle key={d._id} cx={cx} cy={cy} r={r} fill="none"
              stroke={colors[i % colors.length]} strokeWidth="20"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={startOffset}
              transform={`rotate(-90 ${cx} ${cy})`} />
          );
        })}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)"
          fontFamily="var(--font-display)" fontSize="22" fontWeight="800">{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize="9">TOTAL</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={d._id} className="legend-item">
            <span className="legend-dot" style={{ background: colors[i % colors.length] }} />
            <span className="legend-label">{d._id}</span>
            <span className="legend-val">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
