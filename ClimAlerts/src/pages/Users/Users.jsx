import React, { useState } from 'react';
import { 
  Users as UsersIcon, UserCheck, ShieldAlert, Key, 
  Search, Filter, ChevronLeft, ChevronRight, MoreVertical,
  Check, Lock, Edit3, UserPlus, LogIn, Sparkles, Shield,
  Plus, TrendingUp, TrendingDown
} from 'lucide-react';
import './Users.css';

// ---------- Mock Data ----------

const usersList = [
  { id: 1, name: 'Admin User', email: 'admin@climalerts.gov.gh', role: 'System Administrator', dept: 'Head Office', status: 'Active', active: 'May 23, 2025 08:30 AM', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Health Officer', email: 'health.officer@ghana.gov.gh', role: 'Health Officer', dept: 'Health Department', status: 'Active', active: 'May 23, 2025 07:45 AM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Data Analyst', email: 'analyst@climalerts.gov.gh', role: 'Data Analyst', dept: 'Analytics Unit', status: 'Active', active: 'May 22, 2025 10:15 PM', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Field Officer', email: 'field.officer@ghana.gov.gh', role: 'Field Officer', dept: 'Volta Region', status: 'Active', active: 'May 22, 2025 06:20 PM', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
  { id: 5, name: 'Regional Manager', email: 'region.manager@ghana.gov.gh', role: 'Regional Manager', dept: 'Ashanti Region', status: 'Active', active: 'May 22, 2025 04:10 PM', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
  { id: 6, name: 'Viewer', email: 'viewer@climalerts.gov.gh', role: 'Viewer', dept: 'Western Region', status: 'Inactive', active: 'May 20, 2025 11:30 AM', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' },
  { id: 7, name: 'Outbreak Coordinator', email: 'outbreak.coordinator@ghana.gov.gh', role: 'Health Officer', dept: 'Central Region', status: 'Active', active: 'May 20, 2025 09:05 AM', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100' },
  { id: 8, name: 'Data Manager', email: 'data.manager@climalerts.gov.gh', role: 'Data Analyst', dept: 'Data Management', status: 'Pending', active: 'May 19, 2025 08:50 AM', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100' },
];

const permissionsData = [
  { resource: 'Dashboard Access', view: true, create: true, edit: true, delete: true },
  { resource: 'Predictions Access', view: true, create: true, edit: true, delete: true },
  { resource: 'SMS Access', view: true, create: true, edit: true, delete: true },
  { resource: 'Reports Access', view: true, create: true, edit: true, delete: true },
  { resource: 'User Management', view: true, create: true, edit: true, delete: true },
  { resource: 'Settings Management', view: true, create: true, edit: true, delete: true },
];

const activityLogs = [
  { action: 'User Login', desc: 'Admin User logged in', time: 'May 23, 2025 08:30 AM', type: 'login' },
  { action: 'Password Reset', desc: 'Password reset for Health Officer', time: 'May 23, 2025 07:45 AM', type: 'reset' },
  { action: 'Permission Updated', desc: 'Updated permissions for Data Analyst', time: 'May 22, 2025 10:15 PM', type: 'update' },
  { action: 'New User Created', desc: 'New user Field Officer was added', time: 'May 22, 2025 06:20 PM', type: 'create' },
  { action: 'User Login', desc: 'Regional Manager logged in', time: 'May 22, 2025 04:10 PM', type: 'login' },
];

export const Users = () => {
  const [searchVal, setSearchVal] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchVal.toLowerCase());
    const matchRole = selectedRole === 'All Roles' || u.role === selectedRole;
    const matchStatus = selectedStatus === 'All Status' || u.status === selectedStatus;
    const matchRegion = selectedRegion === 'All Regions' || u.dept === selectedRegion;
    return matchSearch && matchRole && matchStatus && matchRegion;
  });

  return (
    <div className="users-page-container">
      {/* ===== ACTIONS HEADER ===== */}
      <div className="users-header-actions">
        <button className="btn-add-user">
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* ===== TOP METRICS ROW ===== */}
      <div className="users-metrics-grid">
        <div className="us-metric-card">
          <div className="us-metric-icon blue">
            <UsersIcon size={22} />
          </div>
          <div className="us-metric-body">
            <span className="us-metric-label">Total Users</span>
            <span className="us-metric-val">28</span>
            <span className="us-metric-sub positive">
              <TrendingUp size={12} /> 18% vs last 30 days
            </span>
          </div>
        </div>

        <div className="us-metric-card">
          <div className="us-metric-icon green">
            <UserCheck size={22} />
          </div>
          <div className="us-metric-body">
            <span className="us-metric-label">Active Users</span>
            <span className="us-metric-val">24</span>
            <span className="us-metric-sub positive">
              <TrendingUp size={12} /> 16% vs last 30 days
            </span>
          </div>
        </div>

        <div className="us-metric-card">
          <div className="us-metric-icon orange">
            <ShieldAlert size={22} />
          </div>
          <div className="us-metric-body">
            <span className="us-metric-label">Pending Invites</span>
            <span className="us-metric-val">3</span>
            <span className="us-metric-sub positive">
              <TrendingUp size={12} /> 50% vs last 30 days
            </span>
          </div>
        </div>

        <div className="us-metric-card">
          <div className="us-metric-icon purple">
            <Key size={22} />
          </div>
          <div className="us-metric-body">
            <span className="us-metric-label">Admin Accounts</span>
            <span className="us-metric-val">5</span>
            <span className="us-metric-sub neutral">No change</span>
          </div>
        </div>
      </div>

      {/* ===== SEARCH AND FILTERS BAR ===== */}
      <div className="users-filters-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-selectors">
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            className="filter-select-users"
          >
            <option value="All Roles">All Roles</option>
            <option value="System Administrator">System Administrator</option>
            <option value="Health Officer">Health Officer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Field Officer">Field Officer</option>
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select-users"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>

          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="filter-select-users"
          >
            <option value="All Regions">All Regions</option>
            <option value="Head Office">Head Office</option>
            <option value="Volta Region">Volta Region</option>
            <option value="Ashanti Region">Ashanti Region</option>
          </select>

          <button className="btn-users-filter-details">
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      {/* ===== TWO-COLUMN MAIN CONTENT ===== */}
      <div className="users-main-grid">
        {/* Left Column: Users Table */}
        <div className="users-table-card card">
          <div className="users-table-wrap">
            <table className="users-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Region / Department</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td className="user-profile-cell">
                      <img src={user.avatar} alt={user.name} className="user-avatar-img" />
                      <span className="user-name-text">{user.name}</span>
                    </td>
                    <td className="user-email-cell">{user.email}</td>
                    <td>
                      <span className={`user-role-badge ${user.role.toLowerCase().replace(/ /g, '-')}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="user-dept-cell">{user.dept}</td>
                    <td>
                      <span className={`user-status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="user-active-cell">{user.active}</td>
                    <td className="user-actions-cell">
                      <button className="btn-table-actions"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No users match the given filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="users-table-footer-pag">
            <span className="pag-count-info">Showing {filteredUsers.length > 0 ? 1 : 0} to {filteredUsers.length} of {usersList.length} users</span>
            <div className="pag-nav-group">
              <button className="nav-pag-btn" disabled><ChevronLeft size={16} /></button>
              <button className="nav-pag-btn active">1</button>
              <button className="nav-pag-btn">2</button>
              <button className="nav-pag-btn">3</button>
              <button className="nav-pag-btn">4</button>
              <button className="nav-pag-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Permissions & Activity Log) */}
        <div className="users-sidebar-column">
          {/* Role Permissions Preview */}
          <div className="permissions-card card">
            <div className="permissions-card-header">
              <div className="perm-hdr-titles">
                <h3>Role Permissions</h3>
                <span className="perm-selected-sub">Permissions for <strong style={{ color: '#2563EB' }}>System Administrator</strong></span>
              </div>
            </div>
            <div className="permissions-table-wrap">
              <table className="permissions-grid-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>View</th>
                    <th>Create</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionsData.map((perm, idx) => (
                    <tr key={idx}>
                      <td className="perm-resource-name">{perm.resource}</td>
                      <td>
                        {perm.view && <Check size={14} className="check-success-perm" />}
                      </td>
                      <td>
                        {perm.create && <Check size={14} className="check-success-perm" />}
                      </td>
                      <td>
                        {perm.edit && <Check size={14} className="check-success-perm" />}
                      </td>
                      <td>
                        {perm.delete && <Check size={14} className="check-success-perm" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="permissions-card-footer">
              <a href="#" className="perm-footer-action">View all roles & permissions →</a>
            </div>
          </div>

          {/* Activity Log */}
          <div className="activity-card card">
            <div className="activity-card-header">
              <h3>Activity Log</h3>
              <a href="#" className="act-view-all-link">View all logs →</a>
            </div>
            <div className="activity-list">
              {activityLogs.map((log, idx) => (
                <div className="activity-item-row" key={idx}>
                  <div className="activity-icon-container">
                    {log.type === 'login' && (
                      <div className="act-icon-wrap login"><LogIn size={14} /></div>
                    )}
                    {log.type === 'reset' && (
                      <div className="act-icon-wrap reset"><Lock size={14} /></div>
                    )}
                    {log.type === 'update' && (
                      <div className="act-icon-wrap update"><Edit3 size={14} /></div>
                    )}
                    {log.type === 'create' && (
                      <div className="act-icon-wrap create"><UserPlus size={14} /></div>
                    )}
                  </div>
                  <div className="activity-info-box">
                    <span className="activity-desc-lbl"><strong>{log.action}</strong></span>
                    <span className="activity-sub-text">{log.desc}</span>
                  </div>
                  <span className="activity-time-lbl">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
