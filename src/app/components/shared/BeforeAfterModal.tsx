import React from 'react';
import { Issue } from '../../context/AppContext';

interface BeforeAfterModalProps {
  issue: Issue;
  onClose: () => void;
}

export function BeforeAfterModal({ issue, onClose }: BeforeAfterModalProps) {
  const afterState = issue.afterImage
    ? issue.status === 'awaiting_citizen_verification'
      ? { label: 'Proof Uploaded - Awaiting Citizen Verification', bg: '#FFF7ED', text: '#C2410C', icon: '🟠' }
      : { label: 'AFTER - Issue Resolved', bg: '#F0FDF4', text: '#15803D', icon: '✅' }
    : { label: 'Resolution Pending', bg: '#F9FAFB', text: '#9CA3AF', icon: '⏳' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0B1C2D' }}>
          <div>
            <h3 className="text-white" style={{ fontWeight: 700 }}>Before & After Comparison</h3>
            <p className="text-blue-300 text-sm">{issue.title}</p>
          </div>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-300 transition-colors">×</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid #FECACA' }}>
            <div className="py-2 px-4 text-center text-sm" style={{ background: '#FEF2F2', color: '#991B1B', fontWeight: 600 }}>
              📸 BEFORE - Citizen Reported
            </div>
            <img src={issue.beforeImage} alt="Before" className="w-full object-cover" style={{ height: 220 }} />
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: issue.afterImage ? '2px solid #BBF7D0' : '2px dashed #D1D5DB' }}>
            <div className="py-2 px-4 text-center text-sm" style={{ background: afterState.bg, color: afterState.text, fontWeight: 600 }}>
              {afterState.icon} {afterState.label}
            </div>
            {issue.afterImage ? (
              <img src={issue.afterImage} alt="After" className="w-full object-cover" style={{ height: 220 }} />
            ) : (
              <div className="flex flex-col items-center justify-center" style={{ height: 220, background: '#F9FAFB' }}>
                <span className="text-4xl mb-3">⏳</span>
                <p className="text-gray-400 text-sm text-center px-4">Resolution proof will appear here after the authority uploads it.</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <h4 className="text-sm mb-2" style={{ color: '#0B1C2D', fontWeight: 600 }}>Issue Details</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div><span className="font-medium">Location:</span> {issue.city}, {issue.state}</div>
              <div><span className="font-medium">Category:</span> {issue.category}</div>
              <div><span className="font-medium">Status:</span> {issue.status.replaceAll('_', ' ')}</div>
              <div><span className="font-medium">Reported:</span> {new Date(issue.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
