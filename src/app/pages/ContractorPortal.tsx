import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp, Issue, Bid } from '../context/AppContext';
import { useLang } from '../context/LanguageContext';
import { PortalHeader } from '../components/shared/PortalHeader';
import { StatusBadge, UrgencyBadge, CategoryBadge } from '../components/shared/StatusBadge';
import { BeforeAfterModal } from '../components/shared/BeforeAfterModal';
import { AssignedBadge } from '../components/shared/AssignedBadge';
import { DonationModal } from '../components/shared/DonationModal';
import { DuplicateBadge } from '../components/shared/DuplicateBadge';
import { getLocalizedIssueCopy } from '../utils/issueLocalization';

const AFTER_IMAGES = {
  road: 'https://images.unsplash.com/photo-1645698406985-20f411b4937d?w=800&q=80',
  water: 'https://images.unsplash.com/photo-1769263092692-8bdce7a125de?w=800&q=80',
  electricity: 'https://images.unsplash.com/photo-1694408614727-0a05c1019777?w=800&q=80',
  sanitation: 'https://images.unsplash.com/photo-1769263092692-8bdce7a125de?w=800&q=80',
};

export default function ContractorPortal() {
  const navigate = useNavigate();
  const { currentUser, issues, bids, addBid, updateAfterImage } = useApp();
  const { language, t } = useLang();
  const [activeTab, setActiveTab] = useState<'bids' | 'projects' | 'profile'>('bids');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [beforeAfterIssue, setBeforeAfterIssue] = useState<Issue | null>(null);
  const [bidForm, setBidForm] = useState({ amount: '', note: '' });
  const [profileOpen, setProfileOpen] = useState(false);
  const [myBidIssues, setMyBidIssues] = useState<Set<string>>(new Set(bids.filter(b => b.contractorId === currentUser?.id).map(b => b.issueId)));
  const [afterImgInput, setAfterImgInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [donationNgoId, setDonationNgoId] = useState<string | null>(null);

  useEffect(() => { if (!currentUser) navigate('/'); }, [currentUser, navigate]);
  useEffect(() => {
    setMyBidIssues(new Set(bids.filter(b => b.contractorId === currentUser?.id).map(b => b.issueId)));
  }, [bids, currentUser]);

  const openBiddingIssues = issues.filter(i => i.status === 'open_for_bidding');
  const myProjects = issues.filter(i => i.assignedContractor === currentUser?.id);
  const filteredProjects = myProjects.filter(i => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'unresolved') return i.status !== 'resolved';
    return i.status === filterStatus;
  });
  const myBids = bids.filter(b => b.contractorId === currentUser?.id);
  const selectedBids = myBids.filter(b => b.status === 'selected').length;
  const earnings = myBids.filter(b => b.status === 'selected').reduce((sum, b) => sum + b.bidAmount, 0);

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !bidForm.amount || !currentUser) return;
    const newBid: Bid = {
      id: 'bid-' + Date.now(),
      issueId: selectedIssue.id,
      contractorId: currentUser.id,
      contractorName: currentUser.company || currentUser.fullName,
      bidAmount: parseFloat(bidForm.amount),
      proposalNote: bidForm.note,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    addBid(newBid);
    setBidForm({ amount: '', note: '' });
    setSelectedIssue(null);
    alert('✅ Bid submitted successfully! Authority will review and respond shortly.');
  };

  const handleUploadAfterImage = (issue: Issue) => {
    const imgUrl = afterImgInput.trim() || AFTER_IMAGES[issue.category];
    updateAfterImage(issue.id, imgUrl);
    setAfterImgInput('');
    alert('✅ After-resolution image uploaded successfully!');
  };

  const tabs = [
    { key: 'bids', label: 'Open Bids', emoji: '🔍' },
    { key: 'projects', label: 'My Projects', emoji: '📦' },
    { key: 'profile', label: 'Profile', emoji: '👨🏻‍🔧' },
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8', fontFamily: "'Poppins', sans-serif" }}>
      <PortalHeader title={t('contractor.title')} subtitle={currentUser.company || 'Contractor'} onProfileClick={() => setProfileOpen(true)} />

      {/* Tab Bar */}
      <div className="sticky top-14 z-30 shadow-sm" style={{ background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto flex">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap transition-all"
              style={{ color: activeTab === tab.key ? '#0B1C2D' : '#6B7280', borderBottom: activeTab === tab.key ? '3px solid #E8821C' : '3px solid transparent', fontWeight: activeTab === tab.key ? 600 : 400, background: 'transparent' }}>
              <span>{tab.emoji}</span> {t(`contractor.tab.${tab.key}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* OPEN BIDS */}
        {activeTab === 'bids' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Open Opportunities', value: openBiddingIssues.length, icon: '🔍', bg: '#EFF6FF', text: '#1D4ED8' },
                { label: 'My Active Bids', value: myBids.filter(b => b.status === 'submitted').length, icon: '📝', bg: '#FFFBEB', text: '#B45309' },
                { label: 'Bids Selected', value: selectedBids, icon: '✅', bg: '#F0FDF4', text: '#15803D' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center shadow-sm" style={{ background: s.bg, border: `1px solid ${s.text}20` }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <p style={{ fontSize: '1.8rem', fontWeight: 700, color: s.text }}>{s.value}</p>
                  <p style={{ fontSize: '0.7rem', color: s.text, opacity: 0.8 }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl mb-4" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>ℹ️ You can only bid on issues with <strong>"Open for Bidding"</strong> status. Bidding is disabled once in progress or resolved.</p>
            </div>

            <div className="grid gap-4">
              {openBiddingIssues.map(issue => {
                const hasBid = myBidIssues.has(issue.id);
                const myBid = myBids.find(b => b.issueId === issue.id);
                return (
                  <div key={issue.id} className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                    <div className="flex gap-4 p-4">
                      <img src={issue.beforeImage} alt="" className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <StatusBadge status={issue.status} />
                          <UrgencyBadge urgency={issue.urgencyTag} />
                          <CategoryBadge category={issue.category} />
                        </div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3 style={{ color: '#0B1C2D', fontWeight: 600 }}>{getLocalizedIssueCopy(issue, language).title}</h3>
                          <DuplicateBadge count={issue.duplicateCount} />
                        </div>
                        <p className="text-gray-500 text-xs mb-1">📍 {getLocalizedIssueCopy(issue, language).address}, {getLocalizedIssueCopy(issue, language).city}, {getLocalizedIssueCopy(issue, language).state}</p>
                        <p className="text-gray-600 text-sm line-clamp-2">{getLocalizedIssueCopy(issue, language).description}</p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>👍 {issue.upvotes}</span>
                        <span>📅 {new Date(issue.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      {hasBid ? (
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-xs text-green-600">✅ Bid submitted: ₹{myBid?.bidAmount.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        <button onClick={() => setSelectedIssue(issue)}
                          className="ml-auto px-4 py-2 rounded-xl text-sm text-white hover:opacity-90 transition-all"
                          style={{ background: '#0B1C2D' }}>
                          💰 Submit Bid
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {openBiddingIssues.length === 0 && <div className="text-center py-16 text-gray-400">No open bidding issues available.</div>}
            </div>
          </div>
        )}

        {/* MY PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Total Earnings', value: `₹${earnings.toLocaleString('en-IN')}`, icon: '💰', bg: '#F0FDF4', text: '#15803D' },
                { label: 'Projects Won', value: selectedBids, icon: '🏆', bg: '#EFF6FF', text: '#1D4ED8' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-5 shadow-sm" style={{ background: s.bg }}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p style={{ fontSize: '1.8rem', fontWeight: 700, color: s.text }}>{s.value}</p>
                  <p style={{ fontSize: '0.75rem', color: s.text, opacity: 0.8 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-3 mb-5">
              <select className="px-3 py-2 rounded-xl text-sm border-2 outline-none" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="open_for_bidding">Open for Bidding</option>
                <option value="in_progress">In Progress</option>
                <option value="awaiting_citizen_verification">Awaiting Citizen Verification</option>
                <option value="resolved">Resolved</option>
                <option value="unresolved">Unresolved</option>
              </select>
              <div className="ml-auto text-sm text-gray-500 self-center">{filteredProjects.length} projects</div>
            </div>

            <div className="grid gap-4">
              {myProjects.length === 0 && <div className="text-center py-16 text-gray-400">No projects assigned yet. Submit bids on open issues!</div>}
              {filteredProjects.map(issue => {
                const myBid = myBids.find(b => b.issueId === issue.id && b.status === 'selected');
                return (
                  <div key={issue.id} className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                    <div className="p-5">
                      <div className="flex gap-4 mb-4">
                        <img src={issue.beforeImage} alt="" className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-1.5">
                            <StatusBadge status={issue.status} />
                            <CategoryBadge category={issue.category} />
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 style={{ color: '#0B1C2D', fontWeight: 600 }}>{getLocalizedIssueCopy(issue, language).title}</h3>
                            <DuplicateBadge count={issue.duplicateCount} />
                          </div>
                          <p className="text-gray-500 text-xs">📍 {getLocalizedIssueCopy(issue, language).city}, {getLocalizedIssueCopy(issue, language).state}</p>
                          {myBid && <p className="text-green-600 text-sm mt-1" style={{ fontWeight: 600 }}>💰 Contract Value: ₹{myBid.bidAmount.toLocaleString('en-IN')}</p>}
                        </div>
                      </div>

                      {/* Before/After Images */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">📸 Before (Reported)</p>
                          <img src={issue.beforeImage} alt="Before" className="w-full rounded-xl object-cover" style={{ height: 120 }} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">✅ After (Resolution)</p>
                          {issue.afterImage ? (
                            <img src={issue.afterImage} alt="After" className="w-full rounded-xl object-cover" style={{ height: 120 }} />
                          ) : (
                            <div className="w-full rounded-xl flex items-center justify-center" style={{ height: 120, background: '#F8FAFC', border: '2px dashed #CBD5E1' }}>
                              <p className="text-gray-400 text-xs text-center px-2">Upload after completion</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upload After Image */}
                      {issue.status === 'in_progress' && (
                        <div className="p-4 rounded-xl" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                          <p className="text-sm mb-2" style={{ color: '#0369A1', fontWeight: 500 }}>📤 Upload After-Resolution Image</p>
                          <div className="flex gap-2">
                            <input
                              className="flex-1 px-3 py-2 rounded-xl border-2 text-sm outline-none"
                              style={{ borderColor: '#BAE6FD', background: 'white' }}
                              placeholder="Image URL or leave blank to use default"
                              value={afterImgInput}
                              onChange={e => setAfterImgInput(e.target.value)}
                            />
                            <button onClick={() => handleUploadAfterImage(issue)}
                              className="px-4 py-2 rounded-xl text-sm text-white flex-shrink-0 hover:opacity-90"
                              style={{ background: '#0369A1' }}>
                              📤 Upload
                            </button>
                          </div>
                          <p className="text-xs text-blue-400 mt-1">Leave URL blank to use a default resolution image for your category.</p>
                        </div>
                      )}

                      {issue.status === 'awaiting_citizen_verification' && (
                        <div className="p-4 rounded-xl" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                          <p className="text-sm" style={{ color: '#9A3412', fontWeight: 500 }}>
                            Authority has submitted proof. This project stays open until the reporting citizen verifies the fix.
                          </p>
                        </div>
                      )}

                      {/* Rating */}
                      {issue.contractorRating && (
                        <div className="mt-3 p-3 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                          <p className="text-sm text-yellow-700">⭐ Citizen Rating: {Array(issue.contractorRating).fill('★').join('')} ({issue.contractorRating}/5)</p>
                        </div>
                      )}
                    </div>

                    {/* Assigned Badge */}
                    <AssignedBadge contractorId={issue.assignedContractor} ngoId={issue.assignedNgo} />

                    {/* Donation Button for NGO */}
                    {issue.assignedNgo && (
                      <div className="px-4 pb-4">
                        <button
                          onClick={() => setDonationNgoId(issue.assignedNgo)}
                          className="w-full py-2 rounded-xl text-sm transition-all hover:opacity-80"
                          style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', fontWeight: 500 }}>
                          💚 View NGO & Support
                        </button>
                      </div>
                    )}

                    <div className="px-4 pb-4">
                      <button onClick={() => setBeforeAfterIssue(issue)}
                        className="w-full py-2 rounded-xl text-sm transition-all hover:opacity-80"
                        style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                        🔍 View Before & After Comparison
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="grid gap-4 max-w-lg">
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: '#FFFBEB', border: '3px solid #FDE68A' }}>👨🏻‍🔧</div>
                <div>
                  <h2 style={{ color: '#0B1C2D', fontWeight: 700 }}>{currentUser.fullName}</h2>
                  <p className="text-gray-500 text-sm">{currentUser.company}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Company', value: currentUser.company || 'N/A', icon: '🏗️' },
                  { label: 'Registration ID', value: currentUser.registrationId || 'N/A', icon: '📋', mono: true },
                  { label: 'Email', value: currentUser.email, icon: '📧' },
                  { label: 'Phone', value: currentUser.phone, icon: '📱' },
                  { label: 'Location', value: `${currentUser.city}, ${currentUser.state}`, icon: '📍' },
                  { label: 'Platform Rating', value: `${currentUser.rating}/5.0 ⭐`, icon: '⭐' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p style={{ fontWeight: 500, color: '#0B1C2D', fontFamily: item.mono ? 'monospace' : 'inherit' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bid Submission Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5" style={{ background: '#0B1C2D' }}>
              <h3 className="text-white" style={{ fontWeight: 700 }}>Submit Your Bid</h3>
              <button onClick={() => setSelectedIssue(null)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-5">
              <div className="flex gap-3 mb-4 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <img src={selectedIssue.beforeImage} alt="" className="w-16 h-14 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p style={{ fontWeight: 600, color: '#0B1C2D', fontSize: '0.9rem' }}>{getLocalizedIssueCopy(selectedIssue, language).title}</p>
                    <DuplicateBadge count={selectedIssue.duplicateCount} />
                  </div>
                  <p className="text-gray-500 text-xs">📍 {getLocalizedIssueCopy(selectedIssue, language).city}, {getLocalizedIssueCopy(selectedIssue, language).state}</p>
                  <div className="flex gap-1 mt-1"><CategoryBadge category={selectedIssue.category} /></div>
                </div>
              </div>
              <form onSubmit={handleSubmitBid} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1.5" style={{ fontWeight: 500, color: '#374151' }}>Bid Amount (₹) *</label>
                  <input type="number" required min="1000"
                    className="w-full px-4 py-2.5 rounded-xl border-2 outline-none text-lg"
                    style={{ borderColor: '#E2E8F0', background: '#F8FAFC', fontWeight: 600 }}
                    placeholder="e.g. 75000"
                    value={bidForm.amount}
                    onChange={e => setBidForm(p => ({ ...p, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ fontWeight: 500, color: '#374151' }}>Proposal Note *</label>
                  <textarea rows={3} required
                    className="w-full px-4 py-2.5 rounded-xl border-2 outline-none"
                    style={{ borderColor: '#E2E8F0', background: '#F8FAFC', resize: 'none' }}
                    placeholder="Describe your approach, timeline, materials..."
                    value={bidForm.note}
                    onChange={e => setBidForm(p => ({ ...p, note: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setSelectedIssue(null)}
                    className="py-3 rounded-xl text-sm" style={{ background: '#F1F5F9', color: '#374151' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    className="py-3 rounded-xl text-sm text-white hover:opacity-90"
                    style={{ background: '#0B1C2D', fontWeight: 600 }}>
                    🚀 Submit Bid
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {beforeAfterIssue && <BeforeAfterModal issue={beforeAfterIssue} onClose={() => setBeforeAfterIssue(null)} />}

      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#0B1C2D', fontWeight: 700 }}>Contractor Profile</h3>
              <button onClick={() => setProfileOpen(false)} className="text-gray-400 text-xl">×</button>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">👨🏻‍🔧</div>
              <p style={{ fontWeight: 600, color: '#0B1C2D' }}>{currentUser.fullName}</p>
              <p className="text-sm text-gray-500">{currentUser.company}</p>
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'monospace' }}>{currentUser.registrationId}</p>
              <div className="mt-3 px-4 py-2 rounded-xl" style={{ background: '#FFFBEB' }}>
                <p className="text-sm text-yellow-700">⭐ Rating: {currentUser.rating}/5.0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {donationNgoId && <DonationModal ngoId={donationNgoId} onClose={() => setDonationNgoId(null)} />}
    </div>
  );
}
