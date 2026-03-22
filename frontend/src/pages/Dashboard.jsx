import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { useAuth } from '../App';
import './Dashboard.css';

const STATUS_CONFIG = {
  New: { color: '#3498db', icon: '●' },
  Contacted: { color: '#9b59b6', icon: '◎' },
  'Site Visit Scheduled': { color: '#f0a500', icon: '◉' },
  'Quotation Sent': { color: '#e67e22', icon: '◈' },
  Converted: { color: '#2ecc71', icon: '✓' },
  Closed: { color: '#7f8c8d', icon: '✕' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsAPI.getAnalytics().then(r => { setAnalytics(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard</div>;

  const statusMap = {};
  analytics?.byStatus?.forEach(s => { statusMap[s._id] = s.count; });

  const converted = statusMap['Converted'] || 0;
  const conversionRate = analytics?.total ? Math.round((converted / analytics.total) * 100) : 0;

  const summaryCards = [
    { label: 'Total Leads', value: analytics?.total || 0, color: '#f0a500', icon: '◈' },
    { label: 'New Leads', value: statusMap['New'] || 0, color: '#3498db', icon: '●' },
    { label: 'Contacted', value: statusMap['Contacted'] || 0, color: '#9b59b6', icon: '◎' },
    { label: 'Converted', value: converted, color: '#2ecc71', icon: '✓' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard <span>Overview</span></h1>
          <p className="page-sub">Welcome back, {user?.name}</p>
        </div>
        <Link to="/leads/add" className="btn-primary">+ Add Lead</Link>
      </div>

      <div className="summary-cards">
        {summaryCards.map(card => (
          <div className="summary-card" key={card.label} style={{ '--card-color': card.color }}>
            <div className="card-icon">{card.icon}</div>
            <div className="card-value">{card.value}</div>
            <div className="card-label">{card.label}</div>
            <div className="card-bar" style={{ width: `${Math.min(100, (card.value / (analytics?.total || 1)) * 100)}%` }} />
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card status-breakdown">
          <h3 className="card-heading">Lead Pipeline</h3>
          <div className="pipeline">
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
              <div className="pipeline-item" key={status}>
                <div className="pipeline-label">
                  <span style={{ color: cfg.color }}>{cfg.icon}</span>
                  {status}
                </div>
                <div className="pipeline-bar-wrap">
                  <div className="pipeline-bar" style={{ width: `${Math.min(100, ((statusMap[status] || 0) / (analytics?.total || 1)) * 100)}%`, background: cfg.color }} />
                </div>
                <span className="pipeline-count">{statusMap[status] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card conversion-card">
          <h3 className="card-heading">Conversion Rate</h3>
          <div className="conversion-ring">
            <svg viewBox="0 0 120 120" className="ring-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#2ecc71" strokeWidth="8"
                strokeDasharray={`${conversionRate * 3.14} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)" />
            </svg>
            <div className="ring-text">
              <div className="ring-value">{conversionRate}%</div>
              <div className="ring-label">Converted</div>
            </div>
          </div>
          <div className="conversion-stats">
            <div><span>{converted}</span> Converted</div>
            <div><span>{analytics?.total || 0}</span> Total</div>
          </div>
        </div>

        <div className="card project-types">
          <h3 className="card-heading">By Project Type</h3>
          <div className="type-list">
            {analytics?.byProject?.map(p => (
              <div className="type-item" key={p._id}>
                <span className="type-name">{p._id}</span>
                <span className="type-count">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card recent-leads">
        <div className="card-header-row">
          <h3 className="card-heading">Recent Leads</h3>
          <Link to="/leads" className="btn-secondary btn-sm">View All →</Link>
        </div>
        <table className="mini-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Project</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.recentLeads?.map(lead => (
              <tr key={lead._id}>
                <td><Link to={`/leads/${lead._id}`} className="lead-link">{lead.name}</Link></td>
                <td><span className="type-tag">{lead.projectType}</span></td>
                <td>{lead.location || '—'}</td>
                <td><span className={`badge badge-${lead.status}`}>{lead.status}</span></td>
                <td>{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
            {!analytics?.recentLeads?.length && (
              <tr><td colSpan="5" className="empty-row">No leads yet. <Link to="/leads/add">Add your first lead →</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
