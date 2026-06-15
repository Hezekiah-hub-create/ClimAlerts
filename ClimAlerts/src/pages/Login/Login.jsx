import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── SVG Icons ─────────────────────────────────────────── */
const IconCloud = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10
             c-.543 0-1.055.102-1.52.285A7.5 7.5 0 0 0 2.5 14.5
             C2.5 16.985 4.515 19 7 19h10.5z" />
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
             a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4
             c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07
             a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconTrending = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconBell = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconShieldLg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"
       strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.3 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.2-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.3 6.5 29.4 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.5-3-11.3-7.4l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 5.9l6.2 5.2C42 35.2 44 30 44 24c0-1.2-.1-2.2-.4-3.5z"/>
  </svg>
);
const IconMicrosoft = () => (
  <svg width="20" height="20" viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

const IconDots = () => (
  <svg width="450" height="450" viewBox="0 0 450 450" fill="none">
    <defs>
      <pattern id="dotPattern" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="2.5" fill="rgba(255,255,255,0.12)" />
      </pattern>
      <clipPath id="triangleClip">
        <polygon points="0,0 0,450 450,450" />
      </clipPath>
    </defs>
    <rect x="0" y="0" width="450" height="450" fill="url(#dotPattern)" clipPath="url(#triangleClip)" />
  </svg>
);

const IconLeaf = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 22l10-10"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   LOGIN COMPONENT
═══════════════════════════════════════════════════════════ */

// Authentication is handled dynamically for demo purposes

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    setTimeout(() => { 
      setIsLoading(false); 
      
      const normalizedEmail = email.toLowerCase().trim();
      let assignedRole = 'Health Official'; // Default
      if (normalizedEmail.includes('admin')) assignedRole = 'Administrator';
      else if (normalizedEmail.includes('analyst')) assignedRole = 'Analyst';
      
      let user = { role: assignedRole, name: 'Demo User' };
      
      // Skip strict password checking for demo purposes so you don't get locked out
      localStorage.setItem('climalerts_user', JSON.stringify({
        email: normalizedEmail,
        role: user.role,
        name: user.name
      }));
      navigate('/dashboard');
    }, 1200);
  };

  /* ── Shared input style object ── */
  const inputStyle = {
    width: '100%',
    height: '54px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#1a1d20',
    fontSize: '1rem',
    paddingLeft: '48px',
    paddingRight: '48px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#16A34A';
    e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.12)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: '#F4F6F8',
      overflow: 'hidden',
    }}>

      {/* ══════════ LEFT PANEL ══════════ */}
      <div style={{
        position: 'relative',
        flex: '0 0 46%',
        maxWidth: '46%',
        minHeight: '100vh',
        overflow: 'hidden',
        zIndex: 10,
        borderRadius: '2.8vw 3.68vw 3.68vw 2.8vw  / 0 50% 50% 0',
        boxShadow: '10px 0 40px rgba(0,0,0,0.1)',
        borderRight: '3px solid #16A34A',
      }}>
        {/* Nature background image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=85&w=1400&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }} />

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7,18,30,0.92) 0%, rgba(7,18,30,0.75) 18%, rgba(8,20,33,0.55) 38%, rgba(8,20,33,0.62) 55%, rgba(7,18,30,0.82) 75%, rgba(5,14,24,0.96) 100%)',
        }} />

        {/* Decorative dots */}
        <div style={{
          position: 'absolute',
          bottom: '0.2rem',
          left: '0.4rem',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <IconDots />
        </div>

        {/* Left content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: '100vh',
          color: '#fff',
          padding: '5.75rem 4rem 6.5rem 5.5rem',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '60px', height: '60px',
              backgroundColor: '#16A34A',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IconCloud />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>ClimAlerts</div>
              <div style={{ fontSize: '0.85rem', color: '#A0AEC0', marginTop: '2px' }}>Climate &amp; Health Monitoring</div>
            </div>
          </div>

          {/* Main group — vertically centered */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '3rem', marginBottom: '2.5rem' }}>

            {/* Hero headline */}
            <div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
                Predict. Prevent.<br /><span style={{ color: '#16A34A' }}>Protect Lives.</span>
              </h1>
              <div style={{ width: '50px', height: '4px', backgroundColor: '#16A34A', borderRadius: '2px', marginBottom: '1.25rem' }} />
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#A0AEC0', maxWidth: '420px' }}>
                ClimAlerts uses AI and real-time climate data
                to predict disease outbreaks early and help
                communities take action before it's too late.
              </p>
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginTop: '2.5rem' }}>
              {[
                { icon: <IconTrending />, title: 'AI-Powered Predictions', desc: <>Advanced models predict disease risks<br/>using climate and health data.</> },
                { icon: <IconBell />, title: 'Instant Alerts', desc: <>Timely SMS alerts reach the right people<br/>when it matters most.</> },
                { icon: <IconShield />, title: 'Data-Driven Decisions', desc: <>Actionable insights for a healthier,<br/>safer tomorrow.</> },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '1.5px solid rgba(22,163,74,0.5)',
                    backgroundColor: 'rgba(22,163,74,0.08)',
                    color: '#16A34A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{f.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.45, color: '#A0AEC0' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Security badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              marginTop: '2.5rem', maxWidth: '480px',
              padding: '1.25rem 1.5rem',
              backgroundColor: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            }}>
              <div style={{ color: '#16A34A', flexShrink: 0 }}><IconShieldLg /></div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.15rem' }}>Secure. Reliable. Trusted.</div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.4, color: '#A0AEC0' }}>Your data is protected with enterprise-grade security.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F6F8',
        padding: '2rem 2rem 2rem 3.5rem',
      }}>
        <div style={{ width: '100%', maxWidth: '520px'}}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2.2rem', fontWeight: 800, color: '#1A1D20',
              letterSpacing: '-0.025em', marginBottom: '0.4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              Welcome Back <span style={{ display: 'flex', color: '#16A34A' }}><IconLeaf /></span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#6C757D' }}>Sign in to your ClimAlerts account</p>
          </div>

          {/* White form card */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '3.5rem 3.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          }}>
            <form onSubmit={handleLogin} noValidate>

              {/* Email */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#1A1D20', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '16px', color: '#9ca3af', display: 'flex', pointerEvents: 'none' }}>
                    <IconMail />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    style={inputStyle}
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label htmlFor="login-password" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1A1D20' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#15803D', textDecoration: 'none' }}>
                    Forgot Password?
                  </a>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '16px', color: '#9ca3af', display: 'flex', pointerEvents: 'none' }}>
                    <IconLock />
                  </span>
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    style={inputStyle}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    tabIndex={-1}
                    style={{
                      position: 'absolute', right: '14px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9ca3af', display: 'flex', alignItems: 'center',
                      padding: '4px', borderRadius: '4px',
                    }}
                  >
                    {showPass ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
              </div>

              {/* Remember me row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.75rem 0 2rem' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
                  role="checkbox"
                  aria-checked={rememberMe}
                  tabIndex={0}
                  onClick={() => setRememberMe(v => !v)}
                  onKeyDown={e => e.key === ' ' && setRememberMe(v => !v)}
                >
                  <div style={{
                    width: '20px', height: '20px',
                    border: `1.5px solid ${rememberMe ? '#16A34A' : '#d1d5db'}`,
                    borderRadius: '4px',
                    backgroundColor: rememberMe ? '#16A34A' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>
                    {rememberMe && <IconCheck />}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#374151' }}>Remember me</span>
                </div>
                <a href="#" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#15803D', textDecoration: 'none' }}>
                  Need help?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  color: '#B91C1C',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  fontWeight: 500,
                  border: '1px solid #FCA5A5'
                }}>
                  {error}
                </div>
              )}

              {/* Sign In button */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%', height: '56px',
                  backgroundColor: '#16A34A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.65 : 1,
                  boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                  transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {isLoading ? 'Signing In…' : <><span>Sign In</span><IconArrow /></>}
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              margin: '1.4rem 0', color: '#9ca3af', fontSize: '0.8rem',
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ whiteSpace: 'nowrap', padding: '0 0.5rem' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { icon: <IconGoogle />, label: 'Google' },
                { icon: <IconMicrosoft />, label: 'Microsoft' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  style={{
                    flex: 1, height: '52px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    fontSize: '1rem', fontWeight: 600,
                    color: '#1A1D20',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F4F6F8'; e.currentTarget.style.borderColor = '#9ca3af'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: '#6C757D', fontSize: '0.95rem', marginTop: '1.75rem' }}>
            Don't have an account?{' '}
            <a href="#" style={{ color: '#15803D', fontWeight: 600, textDecoration: 'none' }}>
              Contact System Administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
