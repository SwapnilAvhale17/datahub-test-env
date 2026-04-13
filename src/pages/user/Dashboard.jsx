import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Bell, Building2, Clock, Plus, RefreshCw, Send, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { requests, reminders as mockReminders, documents } from '../../data/mockData';
import StatusBadge from '../../components/common/StatusBadge';

const isCompletedStatus = (status) => ['approved', 'completed'].includes(status);

function mapProgressCategory(req) {
  const text = `${req.name} ${req.type}`.toLowerCase();
  if (text.includes('kyc') || text.includes('director') || text.includes('hr') || text.includes('employee')) return 'HR';
  if (text.includes('financial') || text.includes('bank') || text.includes('tax') || text.includes('revenue') || text.includes('trial balance') || text.includes('budget')) return 'Financial';
  return 'IT';
}

function progressPct(list) {
  if (!list.length) return 0;
  const completed = list.filter(r => isCompletedStatus(r.status)).length;
  return Math.round((completed / list.length) * 100);
}

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // User sees only their own company data
  const companyId = user?.company_id || user?.companyId;
  const company = {
    id: companyId,
    name: user?.company || user?.name || 'My Company',
  };

  // Filter requests for this user's company
  const myRequests = requests.filter(r => r.companyId === (companyId || 'co1'));
  const myRequestIds = new Set(myRequests.map(r => r.id));
  const myDocs = documents.filter(d => myRequestIds.has(d.requestId));
  const myReminders = mockReminders.filter(r => r.companyId === (companyId || 'co1') && r.status === 'active');

  const pendingCount = myRequests.filter(r => r.status === 'pending').length;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const stats = [
    { label: 'Pending Requests', value: pendingCount, icon: Building2, color: '#b45e08', bg: '#FAC086', cta: '/user/requests' },
    { label: 'Documents Uploaded', value: myDocs.length, icon: TrendingUp, color: '#00648F', bg: '#A7DCF7', cta: '/user/upload' },
    { label: 'Active Reminders', value: myReminders.length, icon: Bell, color: '#742982', bg: '#DAAAE4', cta: '/user/reminders' },
  ];

  const categorized = {
    HR: myRequests.filter(r => mapProgressCategory(r) === 'HR'),
    Financial: myRequests.filter(r => mapProgressCategory(r) === 'Financial'),
    IT: myRequests.filter(r => mapProgressCategory(r) === 'IT'),
  };

  const progressCards = [
    { key: 'HR', color: '#742982', bg: '#DAAAE4' },
    { key: 'Financial', color: '#F68C1F', bg: '#FAC086' },
    { key: 'IT', color: '#00B0F0', bg: '#A7DCF7' },
  ].map(c => ({
    ...c,
    total: categorized[c.key].length,
    pct: progressPct(categorized[c.key]),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="theme-card flex items-center gap-4 border-l-4 border-primary p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
          <Building2 size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{company.name}</h1>
          <p className="text-sm text-secondary mt-1">{today}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => navigate(stat.cta)}
              style={{ background: stat.bg }}
              className="theme-card group flex items-center gap-4 p-6 transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: `${stat.color}20` }}>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-medium text-text-muted">{stat.label}</p>
                <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>

      {/* Progress by Category */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-text-primary">Request Progress by Category</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {progressCards.map((card) => (
            <div key={card.key} className="theme-card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text-primary">{card.key}</h3>
                <span style={{ color: card.color }} className="text-sm font-bold">{card.pct}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    style={{ 
                      width: `${card.pct}%`,
                      background: card.color,
                    }}
                    className="transition-all"
                  />
                </div>
                <p className="text-xs text-text-muted">{card.total} total requests</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      {myDocs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">Recent Documents</h2>
            <button onClick={() => navigate('/user/upload')} className="text-sm font-semibold text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {myDocs.slice(0, 4).map((doc) => (
              <div key={doc.id} className="theme-card flex items-center justify-between gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                  <p className="text-xs text-text-muted">{doc.size}</p>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Reminders */}
      {myReminders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">Active Reminders</h2>
            <button onClick={() => navigate('/user/reminders')} className="text-sm font-semibold text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {myReminders.slice(0, 3).map((reminder) => (
              <div key={reminder.id} className="theme-card flex items-center gap-3 p-3">
                <div className="flex h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">{reminder.title}</p>
                  <p className="text-xs text-text-muted">{reminder.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
