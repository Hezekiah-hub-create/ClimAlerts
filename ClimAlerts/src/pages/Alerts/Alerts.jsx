import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Send, MessageSquare, CheckCircle, AlertTriangle, 
  Users, Sparkles, Plus, Copy, Edit, Clock, 
  MoreVertical, Filter, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Eye, FileText, Bookmark, 
  Calendar, Check
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import './Alerts.css';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { lastNDayLabels, fmtDateTime, hoursAgo, daysAgo, dateRange } from '../../utils/dateUtils';

// ---------- Mock Data ----------

const _dayLabels = lastNDayLabels(8);
const alertsSentOverTime = [];

const alertDistribution = [];

const alertTemplates = [
  { id: 1, title: 'Malaria Outbreak Alert', desc: 'High risk of malaria outbreak detected...' },
  { id: 2, title: 'Cholera Outbreak Alert', desc: 'High risk of cholera outbreak detected...' },
  { id: 3, title: 'Dengue Fever Alert', desc: 'Increased dengue fever risk in your area...' },
  { id: 4, title: 'Heatwave Warning', desc: 'Extreme heat conditions expected...' },
  { id: 5, title: 'Heavy Rainfall Warning', desc: 'Heavy rainfall expected in region...' },
];

const scheduledAlerts = [];

const alertHistory = [];

export const Alerts = () => {
  const [alertType, setAlertType] = useState('Emergency');
  const [recipientGroup, setRecipientGroup] = useState('Health Officials (Volta Region)');
  const [selectedRegion, setSelectedRegion] = useState('Volta Region');
  const [message, setMessage] = useState(
    'High malaria outbreak risk detected in Volta Region. Recommended immediate distribution of mosquito nets and community awareness.'
  );
  const [historyTab, setHistoryTab] = useState('All');
  const [isSending, setIsSending] = useState(false);

  const alertTypes = ['General', 'Emergency', 'Weather Advisory', 'Disease Alert'];

  const handleSendAlert = () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    setIsSending(true);
    const loadingId = toast.loading('Sending alert to ' + recipientGroup + '...');
    setTimeout(() => {
      setIsSending(false);
      toast.success('Alert sent successfully!', { id: loadingId });
      setMessage('');
    }, 1500);
  };

  const handleScheduleAlert = () => {
    if (!message.trim()) return toast.error('Message cannot be empty');
    toast.success('Alert scheduled successfully!');
    setMessage('');
  };

  const handleSaveTemplate = () => {
    if (!message.trim()) return toast.error('Message cannot be empty');
    toast.success('Saved as template!');
  };

  const handleLoadTemplate = (desc) => {
    setMessage(desc);
    toast.success('Template loaded!');
  };

  const filteredHistory = historyTab === 'All' 
    ? alertHistory 
    : alertHistory.filter(h => h.status === historyTab);

  const handleUseRecommendation = () => {
    setMessage(
      'High Malaria Outbreak Risk Detected in Volta Region. Recommended actions: 1. Immediate distribution of mosquito nets. 2. Community sensitization on prevention. 3. Indoor residual spraying in high-risk districts.'
    );
    setAlertType('Emergency');
    setSelectedRegion('Volta Region');
    setRecipientGroup('Health Officials (Volta Region)');
  };

  return (
    <div className="alerts-page-container">
      {/* ===== HEADER ROW ===== */}
      <div className="alerts-header-actions">
        <button className="btn-new-alert-top">
          <Plus size={16} /> New Alert
        </button>
      </div>

      {/* ===== TOP METRICS ===== */}
      <div className="alerts-metrics-grid">
        <div className="alert-m-card">
          <div className="alert-m-icon-box purple">
            <MessageSquare size={22} />
          </div>
          <div className="alert-m-body">
            <span className="alert-m-label">Total Alerts Sent</span>
            <span className="alert-m-value">0</span>
            <span className="alert-m-trend neutral">
              —
            </span>
          </div>
        </div>

        <div className="alert-m-card">
          <div className="alert-m-icon-box green">
            <Send size={22} />
          </div>
          <div className="alert-m-body">
            <span className="alert-m-label">Successful Deliveries</span>
            <span className="alert-m-value">0</span>
            <span className="alert-m-trend neutral">—</span>
          </div>
        </div>

        <div className="alert-m-card">
          <div className="alert-m-icon-box red">
            <Clock size={22} />
          </div>
          <div className="alert-m-body">
            <span className="alert-m-label">Failed Messages</span>
            <span className="alert-m-value">0</span>
            <span className="alert-m-trend neutral">—</span>
          </div>
        </div>

        <div className="alert-m-card">
          <div className="alert-m-icon-box blue">
            <Users size={22} />
          </div>
          <div className="alert-m-body">
            <span className="alert-m-label">Total Recipients</span>
            <span className="alert-m-value">0</span>
            <span className="alert-m-trend neutral">—</span>
          </div>
        </div>
      </div>

      {/* ===== MIDDLE ROW (Compose / Recommendation / Templates) ===== */}
      <div className="alerts-middle-grid">
        {/* 1. Compose New Alert */}
        <div className="alerts-card compose-card card">
          <div className="alerts-card-header">
            <h3>Compose New Alert</h3>
          </div>
          <div className="alerts-card-body">
            {/* Alert Type */}
            <div className="compose-form-group">
              <label className="compose-lbl">Alert Type</label>
              <div className="alert-type-pills">
                {alertTypes.map(t => (
                  <button 
                    key={t}
                    className={`type-pill ${alertType === t ? 'active' : ''} ${t.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setAlertType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients Section */}
            <div className="compose-row-split">
              <div className="compose-form-group">
                <label className="compose-lbl">Recipient Group</label>
                <CustomDropdown 
                  className="compose-select custom-dropdown" 
                  value={recipientGroup} 
                  onChange={setRecipientGroup}
                  options={[
                    { value: 'Health Officials (Volta Region)', label: 'Health Officials (Volta Region)' },
                    { value: 'Farmers Group', label: 'Farmers Group' },
                    { value: 'General Public', label: 'General Public' }
                  ]}
                />
              </div>

              <div className="compose-form-group">
                <label className="compose-lbl">Or Select Region</label>
                <CustomDropdown 
                  className="compose-select custom-dropdown" 
                  value={selectedRegion} 
                  onChange={setSelectedRegion}
                  options={[
                    { value: 'Volta Region', label: 'Volta Region' },
                    { value: 'Ashanti Region', label: 'Ashanti Region' },
                    { value: 'Greater Accra', label: 'Greater Accra' },
                    { value: 'Northern Region', label: 'Northern Region' }
                  ]}
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="compose-form-group">
              <label className="compose-lbl">Message</label>
              <textarea 
                className="compose-textarea" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={160}
              />
              <div className="compose-textarea-footer">
                <span className="recipients-count-est">Estimated Recipients: 2,450</span>
                <span className="char-count">{message.length}/160</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="compose-actions-footer">
              <button className="btn-outline-action" onClick={handleSaveTemplate}>
                <Bookmark size={14} /> Save as Template
              </button>
              <button className="btn-outline-action" onClick={handleScheduleAlert}>
                <Calendar size={14} /> Schedule
              </button>
              <button className="btn-solid-blue" onClick={handleSendAlert} disabled={isSending}>
                <Send size={14} /> {isSending ? 'Sending...' : 'Send Now'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. AI-Generated Alert Recommendation */}
        <div className="alerts-card ai-rec-card card">
          <div className="alerts-card-header">
            <h3><Sparkles size={16} className="spark-icon" /> AI-Generated Alert Recommendation</h3>
          </div>
          <div className="alerts-card-body rec-body">
            <div className="rec-alert-banner">
              <div className="banner-left">
                <AlertTriangle size={18} className="warn-icon" />
                <div className="banner-info">
                  <h4>High Malaria Outbreak Risk Detected</h4>
                  <p>Volta Region • Prediction Window: {dateRange(14)}</p>
                </div>
              </div>
              <span className="confidence-badge-red">87% Confidence</span>
            </div>

            <p className="rec-context-text">
              Based on current weather conditions, historical data, and environmental factors, our AI model recommends the following actions:
            </p>

            <ul className="rec-bullets-list">
              <li>
                <span className="bullet-ico rain"><Sparkles size={12} /></span>
                <span>Immediate distribution of mosquito nets</span>
              </li>
              <li>
                <span className="bullet-ico users"><Users size={12} /></span>
                <span>Community sensitization on malaria prevention</span>
              </li>
              <li>
                <span className="bullet-ico spray"><Bookmark size={12} /></span>
                <span>Indoor residual spraying in high-risk districts</span>
              </li>
              <li>
                <span className="bullet-ico test"><Check size={12} /></span>
                <span>Increase availability of rapid diagnostic tests</span>
              </li>
            </ul>

            <button className="btn-use-rec" onClick={handleUseRecommendation}>
              Use This Recommendation
            </button>
          </div>
        </div>

        {/* 3. Emergency Alert Templates */}
        <div className="alerts-card templates-card card">
          <div className="alerts-card-header">
            <h3>Emergency Alert Templates</h3>
            <a href="#" className="header-view-all">View all →</a>
          </div>
          <div className="alerts-card-body templates-body">
            <div className="templates-list-wrap">
              {alertTemplates.map(tpl => (
                <div className="template-item-row" key={tpl.id}>
                  <div className="template-content">
                    <span className="tpl-title">
                      {tpl.id === 1 || tpl.id === 2 ? (
                        <span className="dot-red"></span>
                      ) : tpl.id === 3 ? (
                        <span className="dot-blue"></span>
                      ) : (
                        <span className="dot-orange"></span>
                      )}
                      {tpl.title}
                    </span>
                    <span className="tpl-desc">{tpl.desc}</span>
                  </div>
                  <div className="template-action-icons">
                    <button className="tpl-act-btn" title="Use template" onClick={() => handleLoadTemplate(tpl.desc)}>
                      <Send size={12} />
                    </button>
                    <button className="tpl-act-btn" title="Duplicate"><Copy size={12} /></button>
                    <button className="tpl-act-btn" title="Edit"><Edit size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-create-template-dashed">
              Create New Template
            </button>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM ROW (Scheduled Alerts & Alert History) ===== */}
      <div className="alerts-bottom-grid">
        {/* 1. Scheduled Alerts */}
        <div className="alerts-card scheduled-card card">
          <div className="alerts-card-header">
            <h3>Scheduled Alerts</h3>
            <a href="#" className="header-view-all">View all →</a>
          </div>
          <div className="scheduled-table-wrap">
            <table className="scheduled-data-table">
              <thead>
                <tr>
                  <th>Alert Name</th>
                  <th>Scheduled Date</th>
                  <th>Recipient Group</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledAlerts.length > 0 ? scheduledAlerts.map((row, idx) => (
                  <tr key={idx}>
                    <td className="sched-name-cell">{row.name}</td>
                    <td className="sched-date-cell">{row.date}</td>
                    <td className="sched-group-cell">{row.group}</td>
                    <td>
                      <span className="sched-status-badge">Scheduled</span>
                    </td>
                    <td className="sched-act-cell">
                      <button className="tbl-actions-dot"><MoreVertical size={14} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                      No scheduled alerts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="scheduled-card-footer">
            <a href="#" className="footer-link-action">View all scheduled alerts →</a>
          </div>
        </div>

        {/* 2. Alert History */}
        <div className="alerts-card history-card card">
          <div className="alerts-card-header history-header-row">
            <div className="history-header-left">
              <h3>Alert History</h3>
              <div className="history-tab-pills">
                {['All', 'Sent', 'Pending', 'Failed', 'Scheduled'].map(tab => (
                  <button 
                    key={tab}
                    className={`hist-pill ${historyTab === tab ? 'active' : ''}`}
                    onClick={() => setHistoryTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <button className="hist-filter-btn"><Filter size={14} /></button>
          </div>
          <div className="history-table-wrap">
            <table className="history-data-table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Message Preview</th>
                  <th>Recipients</th>
                  <th>Region</th>
                  <th>Delivery Rate</th>
                  <th>Status</th>
                  <th>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? filteredHistory.map((row, idx) => (
                  <tr key={idx}>
                    <td className="hist-id-cell">{row.id}</td>
                    <td className="hist-msg-cell">{row.msg}</td>
                    <td>{row.recipients}</td>
                    <td>{row.region}</td>
                    <td className="hist-rate-cell">
                      {row.rate !== '—' ? (
                        <div className="hist-rate-bar-row">
                          <span className="rate-lbl">{row.rate}</span>
                          <div className="rate-progress-track">
                            <div 
                              className="rate-progress-fill" 
                              style={{ width: row.rate, backgroundColor: row.color }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`hist-status-badge ${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="hist-date-cell">{row.date}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                      No alerts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="history-card-footer">
            <span className="pagination-info">Showing 0 to 0 of 0 alerts</span>
            <div className="pagination-controls">
              <button className="pag-btn" disabled><ChevronLeft size={16} /></button>
              <button className="pag-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== VERY BOTTOM ROW (SMS Analytics) ===== */}
      <div className="sms-analytics-card card">
        <div className="sms-card-header">
          <h3>SMS Analytics (This Month)</h3>
        </div>
        <div className="sms-card-body">
          {/* 1. Left Stats Grid */}
          <div className="sms-stats-subgrid">
            <div className="sms-stat-box">
              <span className="sms-stat-lbl">Delivery Rate</span>
              <span className="sms-stat-val">0%</span>
              <span className="sms-stat-subneutral">—</span>
            </div>

            <div className="sms-stat-box">
              <span className="sms-stat-lbl">Avg. Response Time</span>
              <span className="sms-stat-val">0s</span>
              <span className="sms-stat-subneutral">—</span>
            </div>

            <div className="sms-stat-box">
              <span className="sms-stat-lbl">Total SMS Sent</span>
              <span className="sms-stat-val">0</span>
              <span className="sms-stat-subneutral">—</span>
            </div>

            <div className="sms-stat-box">
              <span className="sms-stat-lbl">Total SMS Cost</span>
              <span className="sms-stat-val" style={{ fontSize: '1rem' }}>GHS 0.00</span>
              <span className="sms-stat-subneutral">—</span>
            </div>
          </div>

          {/* 2. Middle LineChart */}
          <div className="sms-chart-box">
            <h4 className="chart-box-title">Alerts Sent Over Time</h4>
            <div className="sms-chart-wrap" style={{ height: '140px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertsSentOverTime} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB', strokeWidth: 1, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Right PieChart */}
          <div className="sms-pie-box">
            <h4 className="chart-box-title">Alert Distribution by Type</h4>
            <div className="sms-pie-content">
              <div className="pie-graphic-wrap" style={{ width: '80px', height: '80px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={38}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {alertDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pie-legend-column">
                {alertDistribution.map((item, idx) => (
                  <div className="pie-leg-row" key={idx}>
                    <span className="pie-leg-dot" style={{ backgroundColor: item.color }}></span>
                    <span className="pie-leg-name">{item.name}</span>
                    <span className="pie-leg-val"><strong>{item.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
