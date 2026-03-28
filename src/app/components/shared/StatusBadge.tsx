import React from 'react';
import { IssueStatus, UrgencyTag, IssueCategory } from '../../context/AppContext';

export function StatusBadge({ status }: { status: IssueStatus }) {
  const config = {
    open_for_bidding: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'Open for Bidding', dot: '#3B82F6' },
    in_progress: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', label: 'In Progress', dot: '#F59E0B' },
    awaiting_citizen_verification: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'Awaiting Citizen Verification', dot: '#F97316' },
    resolved: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Resolved', dot: '#22C55E' },
  }[status];

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}`, fontWeight: 500 }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyTag }) {
  const config = {
    High: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: '🔴 High' },
    Medium: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: '🟡 Medium' },
    Low: { bg: '#F0FDF4', text: '#14532D', border: '#BBF7D0', label: '🟢 Low' },
  }[urgency];

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}`, fontWeight: 500 }}>
      {config.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: IssueCategory }) {
  const config = {
    water: { emoji: '💧', label: 'Water', bg: '#EFF6FF', text: '#1E40AF' },
    road: { emoji: '🛣️', label: 'Road', bg: '#F5F5F4', text: '#44403C' },
    electricity: { emoji: '⚡', label: 'Electricity', bg: '#FEFCE8', text: '#713F12' },
    sanitation: { emoji: '🗑️', label: 'Sanitation', bg: '#F0FDF4', text: '#14532D' },
  }[category];

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
      style={{ background: config.bg, color: config.text, fontWeight: 500 }}>
      {config.emoji} {config.label}
    </span>
  );
}
