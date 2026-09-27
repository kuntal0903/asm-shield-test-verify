import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../context/ToastContext';
import {
  User, Shield, Key, Plug, Calendar, Bell, Palette,
  Users, AlertTriangle, Check, Copy, Plus,
  Trash2, Mail, MessageSquare, Link2, Save, Lock, X
} from 'lucide-react';

import '../styles/settings.css';

const NAV_SECTIONS = [
  {
    group: 'ACCOUNT', items: [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'api-keys', label: 'API Keys', icon: Key },
    ]
  },
  {
    group: 'PLATFORM', items: [
      { id: 'integrations', label: 'Integrations', icon: Plug },
      { id: 'scan', label: 'Scan Schedule', icon: Calendar },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ]
  },
  {
    group: 'SYSTEM', items: [
      { id: 'appearance', label: 'Appearance', icon: Palette },
      { id: 'team', label: 'Team Access', icon: Users },
      { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
    ]
  },
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Alex Dawson',
    email: 'alex.dawson@enterprise.sec',
    role: 'SecOps Lead & Administrator',
    bio: 'Overseeing enterprise threat surface discovery and automated vulnerability triage.',
    department: 'Cybersecurity Operations',
    timezone: 'UTC-07:00 (Pacific Time)',
  });

  // Security State
  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30',
    ipRestricted: false,
    allowedIps: '192.168.1.0/24, 10.0.0.0/8',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'CI/CD Pipeline Key', key: 'asm_live_98a7f6e5d4c3b2a10987654321', created: '2026-08-15', lastUsed: '2 mins ago', scope: 'Read/Write' },
    { id: '2', name: 'SIEM Integration Tool', key: 'asm_live_1a2b3c4d5e6f7a8b9c0d1e2f3a', created: '2026-07-20', lastUsed: '1 hour ago', scope: 'Read Only' },
  ]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Integrations State
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack Alerts', desc: 'Real-time notifications for critical asset changes and high vulnerabilities', connected: true, status: 'connected', color: '#4A154B' },
    { id: 'jira', name: 'Jira Software', desc: 'Auto-create tickets for discovered CVEs and unpatched open ports', connected: true, status: 'connected', color: '#0052CC' },
    { id: 'splunk', name: 'Splunk Enterprise SIEM', desc: 'Stream raw scan telemetry and asset findings directly to your SIEM index', connected: false, status: 'disconnected', color: '#ED5723' },
    { id: 'pagerduty', name: 'PagerDuty', desc: 'Trigger on-call escalation policies for newly exposed SSH/RDP endpoints', connected: true, status: 'connected', color: '#06AC38' },
    { id: 'aws', name: 'AWS Security Hub', desc: 'Sync multi-cloud discovery results with native Security Hub dashboards', connected: false, status: 'disconnected', color: '#FF9900' },
    { id: 'webhook', name: 'Custom Webhook', desc: 'POST JSON payloads on scan completion or asset risk updates', connected: false, status: 'disconnected', color: '#3B82F6' },
  ]);

  // Scan Schedule State
  const [scanSchedule, setScanSchedule] = useState({
    frequency: 'daily',
    concurrency: 5,
    timeout: 10,
    excludedDomains: 'staging.internal, test-dev.corp',
    autoRescan: true,
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    slackAlerts: true,
    digestFrequency: 'daily',
    minSeverity: 'high',
    channels: {
      email: true,
      slack: true,
      webhook: false,
    }
  });

  // Appearance State
  const [compactView, setCompactView] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Team Access State
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Alex Dawson', email: 'alex.dawson@enterprise.sec', role: 'Admin', status: 'live', avatar: 'AD', color: 'var(--accent-purple)' },
    { id: '2', name: 'Elena Rostova', email: 'elena.r@enterprise.sec', role: 'Analyst', status: 'live', avatar: 'ER', color: 'var(--accent-blue)' },
    { id: '3', name: 'Marcus Vance', email: 'm.vance@enterprise.sec', role: 'Analyst', status: 'live', avatar: 'MV', color: 'var(--accent-cyan)' },
    { id: '4', name: 'DevOps Automated Bot', email: 'devops-bot@enterprise.sec', role: 'ReadOnly', status: 'live', avatar: 'DB', color: 'var(--accent-emerald)' },
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Analyst');

  // Copy helper
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    addToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Generate API Key
  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `asm_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      scope: 'Read/Write',
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setShowNewKeyModal(false);
    addToast('Generated new API key successfully', 'success');
  };

  const handleRevokeKey = (id) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    addToast('API key revoked', 'warning');
  };

  const toggleIntegration = (id) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        const nextState = !item.connected;
        return {
          ...item,
          connected: nextState,
          status: nextState ? 'connected' : 'disconnected'
        };
      }
      return item;
    }));
    addToast('Integration status updated', 'info');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Platform <span>Settings</span>
          </h1>
          <p className="page-header__subtitle">
            Configure system preferences, API credentials, third-party integrations, and team access.
          </p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Navigation Sidebar */}
        <nav className="settings-nav">
          {NAV_SECTIONS.map((sec) => (
            <div key={sec.group}>
              <div className="settings-nav__group-label">{sec.group}</div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`settings-nav__item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Dynamic Content Pane */}
        <div className="settings-content">

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="settings-section__header">
                <div className="settings-section__icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
                  <User size={20} />
                </div>
                <div className="settings-section__titles">
                  <h3>User Profile & Account Information</h3>
                  <p>Manage your identity, role permissions, and contact preferences.</p>
                </div>
              </div>
              <div className="settings-section__body">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">AD</div>
                  <div className="profile-avatar-info">
                    <h4>{profile.name}</h4>
                    <p>{profile.role} • {profile.department}</p>
                    <button className="btn btn--outline btn--sm" onClick={() => addToast('Avatar update function ready', 'info')}>
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="field-row">
                    <label className="field-label">Full Name</label>
                    <input
                      type="text"
                      className="s-input"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="field-row">
                    <label className="field-label">Email Address <span>(Primary Login)</span></label>
                    <input
                      type="email"
                      className="s-input"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="field-row">
                    <label className="field-label">Department / Team</label>
                    <input
                      type="text"
                      className="s-input"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    />
                  </div>
                  <div className="field-row">
                    <label className="field-label">Timezone</label>
                    <select
                      className="s-select"
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    >
                      <option>UTC-07:00 (Pacific Time)</option>
                      <option>UTC-05:00 (Eastern Time)</option>
                      <option>UTC+00:00 (London, GMT)</option>
                      <option>UTC+01:00 (Berlin, CET)</option>
                      <option>UTC+05:30 (India, IST)</option>
                      <option>UTC+08:00 (Singapore, SGT)</option>
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <label className="field-label">Professional Bio / Responsibility Notes</label>
                  <textarea
                    className="s-textarea"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>

                <div className="settings-footer">
                  <button className="btn btn--primary" onClick={() => addToast('Profile changes saved successfully', 'success')}>
                    <Save size={14} style={{ marginRight: 6 }} /> Save Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="settings-section__header">
                <div className="settings-section__icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-purple)' }}>
                  <Shield size={20} />
                </div>
                <div className="settings-section__titles">
                  <h3>Security & Authentication</h3>
                  <p>Multi-factor authentication, session lifecycle, and IP access rules.</p>
                </div>
              </div>
              <div className="settings-section__body">
                <div className="toggle-row" onClick={() => {
                  setSecurity({ ...security, twoFactor: !security.twoFactor });
                  addToast(`Two-Factor Authentication ${!security.twoFactor ? 'enabled' : 'disabled'}`, 'info');
                }}>
                  <div>
                    <div className="toggle-row__label">Two-Factor Authentication (2FA / TOTP)</div>
                    <div className="toggle-row__desc">Require hardware security key or authenticator app code on login</div>
                  </div>
                  <label className="toggle" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={security.twoFactor}
                      onChange={() => {
                        setSecurity({ ...security, twoFactor: !security.twoFactor });
                        addToast(`Two-Factor Authentication ${!security.twoFactor ? 'enabled' : 'disabled'}`, 'info');
                      }}
                    />
                    <span className="toggle__track"></span>
                    <span className="toggle__thumb"></span>
                  </label>
                </div>

                <div className="settings-footer">
                  <button className="btn btn--primary" onClick={() => addToast('Security policies updated', 'success')}>
                    <Save size={14} style={{ marginRight: 6 }} /> Save Security Rules
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API KEYS */}
          {activeTab === 'api-keys' && (
            <div className="settings-section">
              <div className="settings-section__header">
                <div className="settings-section__icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
                  <Key size={20} />
                </div>
                <div className="settings-section__titles">
                  <h3>API Credentials & Tokens</h3>
                  <p>Generate REST API keys for headless automation, CI/CD, and SIEM ingestion.</p>
                </div>
              </div>
              <div className="settings-section__body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700 }}>Active API Keys ({apiKeys.length})</h4>
                  <button className="btn btn--primary btn--sm" onClick={() => setShowNewKeyModal(true)}>
                    <Plus size={14} style={{ marginRight: 6 }} /> Generate New Key
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {apiKeys.map((item) => (
                    <div key={item.id} className="api-key-row">
                      <div>
                        <div className="api-key-row__name">{item.name}</div>
                        <div className="api-key-row__value">{item.key}</div>
                      </div>
                      <div className="api-key-row__meta">
                        <button className="btn btn--icon btn--ghost" onClick={() => handleCopy(item.key, item.id)}>
                          {copiedKeyId === item.id ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}