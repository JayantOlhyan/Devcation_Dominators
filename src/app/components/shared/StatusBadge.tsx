import React from 'react';
import { IssueStatus, UrgencyTag, IssueCategory } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';

export function StatusBadge({ status }: { status: IssueStatus }) {
  const { t } = useLang();

  const config = {
    open_for_bidding: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: t('status.open_for_bidding'), dot: '#3B82F6' },
    in_progress: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', label: t('status.in_progress'), dot: '#F59E0B' },
    awaiting_citizen_verification: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: t('status.awaiting_citizen_verification'), dot: '#F97316' },
    resolved: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: t('status.resolved'), dot: '#22C55E' },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}`, fontWeight: 500 }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyTag }) {
  const { t } = useLang();

  const config = {
    High: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: `🔴 ${t('urgency.high')}` },
    Medium: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: `🟡 ${t('urgency.medium')}` },
    Low: { bg: '#F0FDF4', text: '#14532D', border: '#BBF7D0', label: `🟢 ${t('urgency.low')}` },
  }[urgency];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}`, fontWeight: 500 }}
    >
      {config.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: IssueCategory }) {
  const { t } = useLang();

  const config = {
    water: { emoji: '💧', label: t('category.water'), bg: '#EFF6FF', text: '#1E40AF' },
    road: { emoji: '🛣️', label: t('category.road'), bg: '#F5F5F4', text: '#44403C' },
    electricity: { emoji: '⚡', label: t('category.electricity'), bg: '#FEFCE8', text: '#713F12' },
    sanitation: { emoji: '🗑️', label: t('category.sanitation'), bg: '#F0FDF4', text: '#14532D' },
  }[category];

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
      style={{ background: config.bg, color: config.text, fontWeight: 500 }}
    >
      {config.emoji} {config.label}
    </span>
  );
}
