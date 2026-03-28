import React from 'react';
import { Issue } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { getLocalizedIssueCopy } from '../../utils/issueLocalization';
import { DuplicateBadge } from './DuplicateBadge';
import { CategoryBadge, StatusBadge } from './StatusBadge';

interface BeforeAfterModalProps {
  issue: Issue;
  onClose: () => void;
}

export function BeforeAfterModal({ issue, onClose }: BeforeAfterModalProps) {
  const { language, t } = useLang();
  const localizedIssue = getLocalizedIssueCopy(issue, language);

  const afterState = issue.afterImage
    ? issue.status === 'awaiting_citizen_verification'
      ? { label: t('beforeAfter.afterAwaiting'), bg: '#FFF7ED', text: '#C2410C', icon: '🟠' }
      : { label: t('beforeAfter.afterResolved'), bg: '#F0FDF4', text: '#15803D', icon: '✅' }
    : { label: t('beforeAfter.pending'), bg: '#F9FAFB', text: '#9CA3AF', icon: '⏳' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0B1C2D' }}>
          <div>
            <h3 className="text-white" style={{ fontWeight: 700 }}>{t('beforeAfter.title')}</h3>
            <div className="flex items-center gap-2">
              <p className="text-blue-300 text-sm">{localizedIssue.title}</p>
              <DuplicateBadge count={issue.duplicateCount} />
            </div>
          </div>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-300 transition-colors">×</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid #FECACA' }}>
            <div className="py-2 px-4 text-center text-sm" style={{ background: '#FEF2F2', color: '#991B1B', fontWeight: 600 }}>
              📸 {t('beforeAfter.before')}
            </div>
            <img src={issue.beforeImage} alt={t('beforeAfter.before')} className="w-full object-cover" style={{ height: 220 }} />
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: issue.afterImage ? '2px solid #BBF7D0' : '2px dashed #D1D5DB' }}>
            <div className="py-2 px-4 text-center text-sm" style={{ background: afterState.bg, color: afterState.text, fontWeight: 600 }}>
              {afterState.icon} {afterState.label}
            </div>
            {issue.afterImage ? (
              <img src={issue.afterImage} alt={afterState.label} className="w-full object-cover" style={{ height: 220 }} />
            ) : (
              <div className="flex flex-col items-center justify-center" style={{ height: 220, background: '#F9FAFB' }}>
                <span className="text-4xl mb-3">⏳</span>
                <p className="text-gray-400 text-sm text-center px-4">{t('beforeAfter.pendingHelp')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <h4 className="text-sm mb-2" style={{ color: '#0B1C2D', fontWeight: 600 }}>{t('beforeAfter.issueDetails')}</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge status={issue.status} />
              <CategoryBadge category={issue.category} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div><span className="font-medium">{t('common.location')}:</span> {localizedIssue.city}, {localizedIssue.state}</div>
              <div><span className="font-medium">{t('common.category')}:</span> {t(`category.${issue.category}`)}</div>
              <div><span className="font-medium">{t('common.status')}:</span> {t(`status.${issue.status}`)}</div>
              <div><span className="font-medium">{t('common.reportedOn')}:</span> {new Date(issue.createdAt).toLocaleDateString('en-IN')}</div>
              <div><span className="font-medium">{t('beforeAfter.timesRaised')}:</span> {issue.duplicateCount}x</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
