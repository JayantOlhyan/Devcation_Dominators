import React from 'react';
import { useLang } from '../../context/LanguageContext';

export function DuplicateBadge({ count }: { count: number }) {
  const { t } = useLang();

  if (count <= 1) return null;

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
      style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA', fontWeight: 700 }}
    >
      {t('duplicate.raisedCount', { count })}
    </span>
  );
}
