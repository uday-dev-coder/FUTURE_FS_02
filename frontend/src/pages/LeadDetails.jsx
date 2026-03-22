import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import './LeadDetails.css';

const STATUSES = ['New', 'Contacted', 'Site Visit Scheduled', 'Quotation Sent', 'Converted', 'Closed'];
const PROJECT_TYPES = ['House Construction', 'Apartment Construction', 'Commercial Building', 'Renovation', 'Interior Design'];
const SOURCES = ['Website', 'Referral', 'Social Media', 'Walk-in', 'Phone Call', 'Other'];

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    leadsAPI.getOne(id).then(r => { setLead(r.data); setEditForm(r.data); setLoading(false); }).catch(() => navigate('/leads'));
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setAddingNote(true);
    const res = await leadsAPI.addNote(id, noteText);
    setLead(res.data);
    setNoteText('');
    setAddingNote(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await leadsAPI.update(id, editForm);
    setLead(res.data);
    setEditing(false);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    await leadsAPI.delete(id);
    navigate('/leads');
  };

  if (loading) return <div className="loading">Loading lead details</div>;
  if (!lead) return null;

  return (
    <div className="lead-details">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lead.name}</h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
            <span className={`badge badge-${lead.status}`}>{lead.status}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{lead.projectType}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : '✎ Edit'}
          </button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
          <Link to="/leads" className="btn-secondary">← Back</Link>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-left">
          {/* Info Card */}
          {!editing ? (
            <div className="card info-card">
              <h3 className="section-label">Lead Information</h3>
              <div className="info-grid">
                <InfoRow icon="📞" label="Phone" value={lead.phone} />
                <InfoRow icon="✉" label="Email" value={lead.email || '—'} />
                <InfoRow icon="📍" label="Location" value={lead.location || '—'} />
                <InfoRow icon="🏗" label="Project Type" value={lead.projectType} />
                <InfoRow icon="₹" label="Budget" value={lead.budget ? `₹${lead.budget}` : '—'} />
                <InfoRow icon="◉" label="Source" value={lead.source} />
                <InfoRow icon="📅" label="Created" value={new Date(lead.createdAt).toLocaleString('en-IN')} />
              </div>
            </div>
          ) : (
            <form className="card info-card" onSubmit={handleSaveEdit}>
              <h3 className="section-label">Edit Lead</h3>
              <div className="edit-grid">
                {[
                  { name: 'name', label: 'Name', type: 'text' },
                  { name: 'phone', label: 'Phone', type: 'text' },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'location', label: 'Location', type: 'text' },
                  { name: 'budget', label: 'Budget', type: 'text' },
                ].map(f => (
                  <div className="form-group" key={f.name}>
                    <label>{f.label}</label>
                    <input type={f.type} value={editForm[f.name] || ''} onChange={e => setEditForm({ ...editForm, [f.name]: e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Project Type</label>
                  <select value={editForm.projectType} onChange={e => setEditForm({ ...editForm, projectType: e.target.value })}>
                    {PROJECT_TYPES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select value={editForm.source} onChange={e => setEditForm({ ...editForm, source: e.target.value })}>
                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* Status change */}
          {!editing && (
            <div className="card status-card">
              <h3 className="section-label">Update Status</h3>
              <div className="status-buttons">
                {STATUSES.map(s => (
                  <button key={s} className={`status-btn ${lead.status === s ? 'active' : ''}`}
                    onClick={async () => { const res = await leadsAPI.update(id, { status: s }); setLead(res.data); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="details-right">
          {/* Notes */}
          <div className="card notes-card">
            <h3 className="section-label">Follow-Up Notes <span className="note-count">{lead.notes?.length || 0}</span></h3>
            <form onSubmit={handleAddNote} className="note-form">
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add a follow-up note... e.g. Called client about house construction" rows={3} />
              <button type="submit" className="btn-primary btn-sm" disabled={addingNote || !noteText.trim()}>
                {addingNote ? 'Adding...' : '+ Add Note'}
              </button>
            </form>
            <div className="notes-list">
              {[...(lead.notes || [])].reverse().map((note, i) => (
                <div className="note-item" key={i}>
                  <div className="note-text">{note.text}</div>
                  <div className="note-time">{new Date(note.createdAt).toLocaleString('en-IN')}</div>
                </div>
              ))}
              {!lead.notes?.length && <p className="no-notes">No notes yet. Add your first follow-up note above.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <div className="info-icon">{icon}</div>
      <div>
        <div className="info-label">{label}</div>
        <div className="info-value">{value}</div>
      </div>
    </div>
  );
}
