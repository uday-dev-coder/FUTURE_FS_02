import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import './AddLead.css';

const PROJECT_TYPES = ['House Construction', 'Apartment Construction', 'Commercial Building', 'Renovation', 'Interior Design'];
const SOURCES = ['Website', 'Referral', 'Social Media', 'Walk-in', 'Phone Call', 'Other'];

const initialForm = { name: '', email: '', phone: '', projectType: '', budget: '', location: '', source: 'Website', status: 'New' };

export default function AddLead() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.projectType) {
      setError('Name, phone and project type are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await leadsAPI.create(form);
      navigate(`/leads/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-lead-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add <span>New Lead</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Capture a new client inquiry</p>
        </div>
        <Link to="/leads" className="btn-secondary">← Back to Leads</Link>
      </div>

      <form onSubmit={handleSubmit} className="lead-form">
        {error && <div className="error-msg">{error}</div>}

        <div className="form-section">
          <h3 className="section-title">Client Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rajesh Kumar" required />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="client@email.com" />
            </div>
            <div className="form-group">
              <label>Location / City</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Pune, Maharashtra" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Project Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Project Type *</label>
              <select name="projectType" value={form.projectType} onChange={handleChange} required>
                <option value="">Select project type</option>
                {PROJECT_TYPES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Budget (₹)</label>
              <input name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. 50,00,000" />
            </div>
            <div className="form-group">
              <label>Lead Source</label>
              <select name="source" value={form.source} onChange={handleChange}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Initial Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>New</option>
                <option>Contacted</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/leads" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Lead →'}
          </button>
        </div>
      </form>
    </div>
  );
}
