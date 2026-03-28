import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, MOCK_USERS } from '../context/AppContext';
import { useLang, Language } from '../context/LanguageContext';
import { DonationModal } from '../components/shared/DonationModal';

const INDIA_GATE_BG = 'https://images.unsplash.com/photo-1766405532163-e38c3033f862?w=1920&q=80';

const loginCards = [
  { role: 'citizen' as const, emoji: '👤', path: '/citizen', descEn: 'Report civic issues, track progress & engage with your community', descHi: 'नागरिक समस्याएं दर्ज करें, प्रगति ट्रैक करें' },
  { role: 'authority' as const, emoji: '👨🏻‍💼', path: '/authority', descEn: 'Manage issues, approve contractors & oversee civic resolution', descHi: 'समस्याएं प्रबंधित करें, ठेकेदार अनुमोदित करें' },
  { role: 'contractor' as const, emoji: '👨🏻‍🔧', path: '/contractor', descEn: 'Bid on civic projects, submit resolutions & track earnings', descHi: 'परियोजनाओं पर बोली लगाएं, समाधान अपलोड करें' },
  { role: 'ngo' as const, emoji: '👥', path: '/ngo', descEn: 'View unresolved issues, raise requests & manage donations', descHi: 'अनसुलझी समस्याएं देखें, अनुरोध उठाएं' },
];

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'ta', label: 'த' },
  { code: 'mr', label: 'म' },
  { code: 'kn', label: 'ಕ' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const { language, setLanguage, t } = useLang();
  const [loginModal, setLoginModal] = useState<{ role: string; path: string } | null>(null);
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [donationNgoId, setDonationNgoId] = useState<string | null>(null);

  const roleNames: Record<string, string> = {
    citizen: t('landing.login.citizen'),
    authority: t('landing.login.authority'),
    contractor: t('landing.login.contractor'),
    ngo: t('landing.login.ngo'),
  };

  const handleCardClick = (card: typeof loginCards[0]) => {
    const user = MOCK_USERS.find(u => u.role === card.role)!;
    setLoginName(user.fullName);
    setLoginEmail(user.email);
    setLoginModal({ role: card.role, path: card.path });
  };

  const handleLogin = () => {
    if (!loginModal) return;
    const user = MOCK_USERS.find(u => u.role === loginModal.role)!;
    setCurrentUser(user);
    navigate(loginModal.path);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Poppins', 'Mukta', sans-serif" }}>
      {/* Hero Section */}
      <div
        className="relative flex-1 flex flex-col"
        style={{
          backgroundImage: `url(${INDIA_GATE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(11,28,45,0.88) 0%, rgba(11,28,45,0.75) 40%, rgba(11,28,45,0.92) 100%)' }} />

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#E8821C' }}>
              <span className="text-white text-lg">🏛</span>
            </div>
            <span className="text-white tracking-widest uppercase" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.2em' }}>CIVICSETU</span>
          

          </div>
          {/* Language Selector */}
          <div className="flex items-center gap-1">

  <div className='flex items-center mr-4'>
    <button
      onClick={() => setDonationNgoId('u4')}
      className="px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
      style={{ 
        background: '#E8821C', 
        color: 'white', 
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(232, 130, 28, 0.3)'
      }}
    >
      💰 Donate to NGO
    </button>
  </div>
  
  {LANGUAGES.map(lang => (
    <button
      key={lang.code}
      onClick={() => setLanguage(lang.code)}
      className="px-3 py-1 rounded-full text-sm transition-all"
      style={{
        background: language === lang.code ? '#E8821C' : 'rgba(255,255,255,0.15)',
        color: 'white',
        border: language === lang.code ? '2px solid #E8821C' : '2px solid rgba(255,255,255,0.3)',
        fontWeight: language === lang.code ? 600 : 400,
      }}
    >
      {lang.label}
    </button>
  ))}
</div>
        </header>

        {/* Hero Content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-4">
            <div
              className="inline-block px-5 py-2 rounded-full mb-6"
              style={{ background: 'rgba(232,130,28,0.25)', border: '1px solid rgba(232,130,28,0.6)', color: '#FFB366' }}
            >
              <span className="text-sm">🇮🇳 {t('landing.hero.badge')}</span>
            </div>
            <h1
              className="text-white mb-2 tracking-widest uppercase"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '0.15em', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            >
              {t('app.name')}
            </h1>
            <p className="text-blue-100 max-w-xl mx-auto" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              {t('app.tagline')}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex gap-6 mb-10 mt-4 flex-wrap justify-center">
            {[
              { label: 'Issues Resolved', value: '1,200+' },
              { label: 'States Covered', value: '25+' },
              { label: 'Active NGOs', value: '230+' },
              { label: 'Contractors', value: '350+' },
            ].map(s => (
              <div key={s.label} className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFB366' }}>{s.value}</div>
                <div className="text-blue-200 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          

          {/* Login Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl px-4">
            {loginCards.map(card => (
              <button
                key={card.role}
                onClick={() => handleCardClick(card)}
                className="group relative flex flex-col items-center p-6 rounded-2xl text-center transition-all duration-300 cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(12px)',
                  minHeight: 180,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(232,130,28,0.2)';
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(232,130,28,0.6)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(232,130,28,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <span className="text-4xl mb-3 block">{card.emoji}</span>
                <h3 className="text-white mb-2" style={{ fontWeight: 600, fontSize: '1rem' }}>
                  {roleNames[card.role]}
                </h3>
                <p className="text-blue-200 mb-4" style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.5 }}>
                  {language === 'hi' ? card.descHi : card.descEn}
                </p>
                <span
                  className="px-4 py-1.5 rounded-full text-sm transition-all"
                  style={{ background: '#E8821C', color: 'white', fontWeight: 500 }}
                >
                  {t('landing.login.enter')} →
                </span>
              </button>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-blue-200 text-sm tracking-widest uppercase" style={{ opacity: 0.7 }}>
            © 2026 CIVICSETU | Crafted with ❤️ for Better Civic Engagement | All rights reserved.
          </p>
        </footer>
      </div>

      {/* Login Modal */}
      {loginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">
                {loginCards.find(c => c.role === loginModal.role)?.emoji}
              </div>
              <h2 className="text-2xl" style={{ color: '#0B1C2D', fontWeight: 700 }}>
                {roleNames[loginModal.role]}
              </h2>
              <p className="text-gray-500 text-sm mt-1">CIVICSETU Platform — Demo Login</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: '#0B1C2D', fontWeight: 500 }}>Full Name</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                  style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}
                  value={loginName}
                  onChange={e => setLoginName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#0B1C2D', fontWeight: 500 }}>Email</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                  style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#0B1C2D', fontWeight: 500 }}>Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none"
                  style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}
                  defaultValue="demo1234"
                  placeholder="Password"
                />
              </div>

              <div className="p-3 rounded-xl text-sm" style={{ background: '#FFF7ED', border: '1px solid #FED7AA', color: '#92400E' }}>
                🔐 Demo credentials pre-filled. Click Login to continue.
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#0B1C2D', fontWeight: 600, fontSize: '1rem' }}
              >
                Login & Enter Portal →
              </button>
              <button
                onClick={() => setLoginModal(null)}
                className="w-full py-2 rounded-xl text-gray-500 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {donationNgoId && (
        <DonationModal
          ngoId={donationNgoId}
          onClose={() => setDonationNgoId(null)}
        />
      )}
    </div>
  );
}