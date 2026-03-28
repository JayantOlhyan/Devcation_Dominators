import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface DonationModalProps {
  ngoId: string;
  onClose: () => void;
}

export function DonationModal({ ngoId, onClose }: DonationModalProps) {
  const { users, donations, addDonation, currentUser } = useApp();
  const ngo = users.find(u => u.id === ngoId);
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [donationComplete, setDonationComplete] = useState(false);

  if (!ngo) return null;

  const ngoDonations = donations.filter(d => d.ngoId === ngoId);
  const totalDonations = ngoDonations.reduce((sum, d) => sum + d.amount, 0);

  const handleDonate = () => {
    const donationAmount = amount || parseInt(customAmount) || 0;
    if (donationAmount < 100) {
      alert('Minimum donation amount is ₹100');
      return;
    }

    const newDonation = {
      id: 'd' + Date.now(),
      ngoId,
      donorName: currentUser?.fullName || 'Anonymous',
      amount: donationAmount,
      message: message || 'Thank you for your great work!',
      createdAt: new Date().toISOString(),
    };

    addDonation(newDonation);
    setDonationComplete(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)' }}>
                👥
              </div>
              <div>
                <p className="text-white" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{ngo.ngoName}</p>
                <p className="text-green-100 text-xs">Verified NGO</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white text-2xl opacity-80 hover:opacity-100">×</button>
          </div>
        </div>

        {!donationComplete ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl text-center" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p className="text-xs text-gray-500 mb-1">Total Donations Received</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#15803D' }}>₹{totalDonations.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">{ngoDonations.length} donors</p>
            </div>

            <div>
              <p className="mb-3" style={{ fontWeight: 600, color: '#0B1C2D' }}>Select Donation Amount</p>
              <div className="grid grid-cols-3 gap-3">
                {[100, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => { setAmount(amt); setCustomAmount(''); }}
                    className="py-3 rounded-xl text-center transition-all"
                    style={{
                      background: amount === amt ? '#10B981' : '#F3F4F6',
                      color: amount === amt ? 'white' : '#374151',
                      border: amount === amt ? '2px solid #10B981' : '2px solid #E5E7EB',
                      fontWeight: amount === amt ? 600 : 400,
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#374151', fontWeight: 500 }}>Custom Amount (₹)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border-2 outline-none"
                style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setAmount(null); }}
                min="100"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#374151', fontWeight: 500 }}>Message (Optional)</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border-2 outline-none"
                style={{ borderColor: '#E2E8F0', background: '#F8FAFC', resize: 'none' }}
                rows={2}
                placeholder="Add a message of support..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            <div className="p-3 rounded-xl text-xs" style={{ background: '#FFF7ED', border: '1px solid #FED7AA', color: '#92400E' }}>
              💡 This is a demo donation system. No real payment will be processed.
            </div>

            <button
              onClick={handleDonate}
              className="w-full py-3.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#10B981', fontWeight: 600, fontSize: '1rem' }}
            >
              💚 Donate Now
            </button>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto" style={{ background: '#F0FDF4' }}>
              ✓
            </div>
            <div>
              <h3 className="mb-2" style={{ color: '#0B1C2D', fontWeight: 700, fontSize: '1.2rem' }}>Thank You!</h3>
              <p className="text-gray-600">Your donation of <strong>₹{(amount || parseInt(customAmount)).toLocaleString('en-IN')}</strong> has been recorded.</p>
              <p className="text-sm text-gray-500 mt-2">Together, we're building a better India! 🇮🇳</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl transition-all"
              style={{ background: '#F3F4F6', color: '#374151', fontWeight: 500 }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
