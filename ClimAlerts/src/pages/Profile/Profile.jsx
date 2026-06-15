import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  User, Mail, MapPin, Phone, Shield, Calendar, Clock,
  Camera, Save, Key, Bell, Activity, LogOut,
  CheckCircle, Globe, Building2, Fingerprint, Edit3
} from 'lucide-react';
import { fmtDateTime, hoursAgo, daysAgo, nowDateTime } from '../../utils/dateUtils';
import './Profile.css';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    organization: '',
    department: '',
    bio: '',
  });

  const handleSave = () => {
    setIsSaving(true);
    const loadingId = toast.loading('Saving profile...');
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Profile updated successfully!', { id: loadingId });
    }, 1200);
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'security', label: 'Security' },
    { key: 'activity', label: 'Activity' },
    { key: 'notifications', label: 'Notifications' },
  ];

  const sessions = [];
  const activityLog = [];

  return (
    <div className="profile-page">

      {/* ── Profile Header Card ── */}
      <div className="profile-hero-card">
        <div className="profile-hero-bg" />
        <div className="profile-hero-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Admin User"
                className="profile-avatar-lg"
              />
              <button className="avatar-edit-btn">
                <Camera size={14} />
              </button>
            </div>
            <div className="profile-identity">
              <h1>{formData.fullName}</h1>
              <div className="profile-role-badge">
                <Shield size={12} />
                System Administrator
              </div>
              <div className="profile-meta-row">
                <span><Mail size={13} /> {formData.email}</span>
                <span><MapPin size={13} /> {formData.location}</span>
                <span><Building2 size={13} /> {formData.organization}</span>
              </div>
            </div>
          </div>
          <div className="profile-hero-actions">
            {!isEditing ? (
              <button className="btn-profile-edit" onClick={() => setIsEditing(true)}>
                <Edit3 size={14} /> Edit Profile
              </button>
            ) : (
              <button className="btn-profile-save" onClick={handleSave} disabled={isSaving}>
                <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="profile-stats-strip">
        <div className="profile-stat">
          <span className="profile-stat-value">142</span>
          <span className="profile-stat-label">Alerts Sent</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">38</span>
          <span className="profile-stat-label">Reports Generated</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">24</span>
          <span className="profile-stat-label">Users Managed</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">16</span>
          <span className="profile-stat-label">Districts Monitored</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="profile-tab-content">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="profile-overview-grid">
            <div className="profile-card">
              <h3>Personal Information</h3>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  ) : (
                    <p>{formData.fullName}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  ) : (
                    <p>{formData.email}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  ) : (
                    <p>{formData.phone}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Location</label>
                  {isEditing ? (
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  ) : (
                    <p>{formData.location}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Organization</label>
                  {isEditing ? (
                    <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
                  ) : (
                    <p>{formData.organization}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Department</label>
                  {isEditing ? (
                    <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                  ) : (
                    <p>{formData.department}</p>
                  )}
                </div>
                <div className="profile-field full-width">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                  ) : (
                    <p>{formData.bio}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-sidebar-col">
              <div className="profile-card">
                <h3>Account Details</h3>
                <div className="profile-detail-list">
                  <div className="profile-detail-item">
                    <Fingerprint size={15} />
                    <div>
                      <span className="detail-label">User ID</span>
                      <span className="detail-value">USR-2025-0001</span>
                    </div>
                  </div>
                  <div className="profile-detail-item">
                    <Shield size={15} />
                    <div>
                      <span className="detail-label">Role</span>
                      <span className="detail-value">System Administrator</span>
                    </div>
                  </div>
                  <div className="profile-detail-item">
                    <Calendar size={15} />
                    <div>
                      <span className="detail-label">Member Since</span>
                      <span className="detail-value">January 15, 2024</span>
                    </div>
                  </div>
                  <div className="profile-detail-item">
                    <Clock size={15} />
                    <div>
                      <span className="detail-label">Last Login</span>
                      <span className="detail-value">{fmtDateTime(hoursAgo(0.1))}</span>
                    </div>
                  </div>
                  <div className="profile-detail-item">
                    <Globe size={15} />
                    <div>
                      <span className="detail-label">Time Zone</span>
                      <span className="detail-value">GMT+0 (Accra)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h3>Status</h3>
                <div className="profile-status-indicator">
                  <span className="status-dot online" />
                  <span>Online</span>
                </div>
                <div className="profile-status-meta">
                  <p>Active session since {fmtDateTime(hoursAgo(0.1))}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <div className="profile-security-grid">
            <div className="profile-card">
              <h3>Change Password</h3>
              <div className="profile-form-grid single-col">
                <div className="profile-field">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="profile-field">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
                <div className="profile-field">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
                <button className="btn-profile-save" onClick={() => toast.success('Password updated!')}>
                  <Key size={14} /> Update Password
                </button>
              </div>
            </div>

            <div className="profile-card">
              <h3>Two-Factor Authentication</h3>
              <div className="tfa-status-row">
                <CheckCircle size={18} color="#16A34A" />
                <div>
                  <span className="tfa-status-text">2FA is enabled</span>
                  <span className="tfa-sub">Using authenticator app</span>
                </div>
              </div>
              <button className="btn-profile-outline">Manage 2FA Settings</button>
            </div>

            <div className="profile-card full-width">
              <h3>Active Sessions</h3>
              <div className="sessions-list">
                {sessions.length > 0 ? sessions.map((s, i) => (
                  <div className="session-item" key={i}>
                    <div className="session-info">
                      <span className="session-device">{s.device}</span>
                      <span className="session-meta">IP: {s.ip} · {s.time}</span>
                    </div>
                    {s.current ? (
                      <span className="session-badge current">Current Session</span>
                    ) : (
                      <button className="btn-session-revoke">Revoke</button>
                    )}
                  </div>
                )) : (
                  <p className="empty-state-text">No active sessions.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="profile-activity-section">
            <div className="profile-card full-width">
              <h3>Recent Activity</h3>
              <div className="activity-timeline">
                {activityLog.length > 0 ? activityLog.map((item, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon-wrap">{item.icon}</div>
                    <div className="activity-content">
                      <span className="activity-action">{item.action}</span>
                      <span className="activity-detail">{item.detail}</span>
                    </div>
                    <span className="activity-time">{item.time}</span>
                  </div>
                )) : (
                  <p className="empty-state-text">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="profile-notifications-section">
            <div className="profile-card full-width">
              <h3>Notification Preferences</h3>
              <div className="notif-pref-list">
                {[
                  { label: 'Email Alerts', desc: 'Receive outbreak alerts via email', enabled: true },
                  { label: 'SMS Alerts', desc: 'Receive critical alerts via SMS', enabled: true },
                  { label: 'Push Notifications', desc: 'In-app push notifications', enabled: true },
                  { label: 'Weekly Digest', desc: 'Weekly summary of all activity', enabled: false },
                  { label: 'System Updates', desc: 'Notifications about system maintenance', enabled: true },
                  { label: 'New User Signups', desc: 'Alert when new users register', enabled: false },
                ].map((pref, i) => (
                  <div className="notif-pref-item" key={i}>
                    <div className="notif-pref-info">
                      <span className="notif-pref-label">{pref.label}</span>
                      <span className="notif-pref-desc">{pref.desc}</span>
                    </div>
                    <label className="profile-toggle">
                      <input type="checkbox" defaultChecked={pref.enabled} />
                      <span className="profile-toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
