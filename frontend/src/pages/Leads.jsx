import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import './Leads.css';

const PROJECT_TYPES = ['House Construction', 'Apartment Construction', 'Commercial Building', 'Renovation', 'Interior Design'];
const STATUSES = ['New', 'Contacted', 'Site Visit Scheduled', 'Quotation Sent', 'Converted', 'Closed'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadsAPI.getAll({ search, status: statusFilter, projectType: projectFilter });
      setLeads(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [search, statusFilter, projectFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    setDeleting(id);
    await leadsAPI.delete(id);
    setLeads(leads.filter(l => l._id !== id));
    setDeleting(null);
  };

  const handleStatusChange = async (id, status) => {
    await leadsAPI.update(id, { status });
    setLeads(leads.map(l => l._id === id ? { ...l, status } : l));
  };

  return (
    <div className="leads-page">
      <div className="page-header">
        <h1 className="page-title">All <span>Leads</span></h1>
        <Link to="/leads/add" className="btn-primary">+ New Lead</Link>
      </div>

      <div className="card filters-bar">
        <input className="search-input" placeholder="🔍  Search by name or phone..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
          <option value="">All Projects</option>
          {PROJECT_TYPES.map(p => <option key={p}>{p}</option>)}
        </select>
        {(search || statusFilter || projectFilter) && (
          <button className="btn-secondary btn-sm" onClick={() => { setSearch(''); setStatusFilter(''); setProjectFilter(''); }}>
            Clear ✕
          </button>
        )}
      </div>

      {loading ? <div className="loading">Loading leads</div> : (
        <div className="card table-card">
          <div className="table-meta">{leads.length} lead{leads.length !== 1 ? 's' : ''} found</div>
          <div className="table-wrap">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Project Type</th>
                  <th>Budget</th>
                  <th>Location</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id}>
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar">{lead.name[0].toUpperCase()}</div>
                        <div>
                          <div className="client-name">{lead.name}</div>
                          <div className="client-contact">{lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="type-tag">{lead.projectType}</span></td>
                    <td>{lead.budget ? `₹${lead.budget}` : '—'}</td>
                    <td>{lead.location || '—'}</td>
                    <td><span className="source-tag">{lead.source}</span></td>
                    <td>
                      <select className="status-select" value={lead.status}
                        onChange={e => handleStatusChange(lead._id, e.target.value)}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/leads/${lead._id}`} className="btn-secondary btn-sm">View</Link>
                        <button className="btn-danger btn-sm" onClick={() => handleDelete(lead._id)} disabled={deleting === lead._id}>
                          {deleting === lead._id ? '...' : 'Del'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!leads.length && (
                  <tr><td colSpan="8" className="empty-row">
                    No leads found. <Link to="/leads/add">Add your first lead →</Link>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
