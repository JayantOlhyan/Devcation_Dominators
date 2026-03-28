import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';

interface AssignedBadgeProps {
  contractorId: string | null;
  ngoId: string | null;
}

export function AssignedBadge({ contractorId, ngoId }: AssignedBadgeProps) {
  const { users } = useApp();
  const { t } = useLang();

  if (!contractorId && !ngoId) return null;

  const contractor = contractorId ? users.find(u => u.id === contractorId) : null;
  const ngo = ngoId ? users.find(u => u.id === ngoId) : null;

  return (
    <div className="px-4 pb-3 space-y-2">
      {contractor && (
        <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <span className="text-lg">👨🏻‍🔧</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">{t('assigned.contractor')}</p>
            <p className="truncate" style={{ fontWeight: 600, color: '#1D4ED8', fontSize: '0.85rem' }}>
              {contractor.company || contractor.fullName}
            </p>
          </div>
        </div>
      )}
      {ngo && (
        <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <span className="text-lg">👥</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">{t('assigned.ngo')}</p>
            <p className="truncate" style={{ fontWeight: 600, color: '#15803D', fontSize: '0.85rem' }}>
              {ngo.ngoName || ngo.fullName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
