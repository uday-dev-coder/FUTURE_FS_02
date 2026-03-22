import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Layout.css';

const navItems = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/leads', icon: '◈', label: 'Leads' },
  { to: '/leads/add', icon: '⊕', label: 'Add Lead' },
  { to: '/analytics', icon: '◫', label: 'Analytics' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">⬡</span>
          {!collapsed && <span className="brand-name">BUILD<span>TRACK</span></span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && <div className="user-info">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div className="user-meta">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">Admin</div>
            </div>
          </div>}
          <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
        </div>

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="breadcrumb">Construction Lead CRM</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-date">{new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
