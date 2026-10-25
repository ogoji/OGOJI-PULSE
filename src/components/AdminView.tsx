import React, { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Users,
  Eye,
  CreditCard,
  Coins,
  ShieldCheck,
  Video,
  FileText,
  Sparkles,
  ChevronRight,
  Filter,
  Globe,
  Mail,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { ContentScheduleItem, ScheduleStatus, ServiceBooking } from '../types';
import { DomainSetupCenter } from './DomainSetupCenter';
import { subscribeToNewsletterSubscribers } from '../lib/firebase';

export const AdminView: React.FC = () => {
  const {
    bookings,
    adminUpdateBookingStatus,
    scheduleItems,
    addScheduleItem,
    updateScheduleStatus,
    deleteScheduleItem,
    feedItems,
    resources,
    qaQuestions,
  } = usePulseStore();

  const [activeSection, setActiveSection] = useState<'scheduler' | 'bookings' | 'analytics' | 'subscribers' | 'domain'>(
    'scheduler'
  );

  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  useEffect(() => {
    const unsub = subscribeToNewsletterSubscribers((subs) => {
      setSubscribers(subs);
    });
    return () => unsub();
  }, []);

  // New Content Item Form State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState<ContentScheduleItem['format']>('Talking-Head');
  const [newPlatform, setNewPlatform] = useState<ContentScheduleItem['targetPlatform']>('YouTube');
  const [newDate, setNewDate] = useState('');
  const [newHook, setNewHook] = useState('');
  const [newScriptOutline, setNewScriptOutline] = useState('');
  const [newCta, setNewCta] = useState('');

  // Selected Booking Details Modal
  const [inspectedBooking, setInspectedBooking] = useState<ServiceBooking | null>(null);

  const pipelineColumns: { status: ScheduleStatus; label: string; color: string }[] = [
    { status: 'draft', label: 'Idea Backlog', color: 'border-slate-700 bg-slate-900/50' },
    { status: 'scripting', label: 'Scripting & Hook', color: 'border-cyan-500/30 bg-cyan-950/20' },
    { status: 'in_review', label: 'Filming / Review', color: 'border-amber-500/30 bg-amber-950/20' },
    { status: 'scheduled', label: 'Scheduled Drop', color: 'border-purple-500/30 bg-purple-950/20' },
    { status: 'published', label: 'Live on Pulse', color: 'border-emerald-500/30 bg-emerald-950/20' },
  ];

  const handleCreateScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addScheduleItem({
      title: newTitle.trim(),
      format: newFormat,
      targetPlatform: newPlatform,
      scheduledDate: newDate || '2026-09-30',
      status: 'draft',
      hook: newHook.trim() || 'Stop scrolling: here is the hidden bug in your code.',
      scriptOutline: newScriptOutline.trim() || '1. Hook\n2. The QA Trap\n3. Solution',
      callToAction: newCta.trim() || 'Check out OgojiPulse for templates.',
      tags: ['Talking-Head', 'Creator'],
    });

    setNewTitle('');
    setNewHook('');
    setNewScriptOutline('');
    setShowAddModal(false);
  };

  // High-level analytics
  const totalViews = feedItems.reduce((acc, i) => acc + i.views, 0);
  const totalCopies = resources.reduce((acc, r) => acc + r.copyCount, 0);
  const totalBookingsCount = bookings.length;
  const verifiedBookingsCount = bookings.filter((b) => b.status === 'verified').length;

  return (
    <div id="admin-view" className="space-y-8 pb-12">
      {/* Creator Command Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Victor Olufemi's Creator Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
            Pipeline, Monetization & Content Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage media releases, verify PalmPay/USDT transactions, track client onboarding questionnaires, and schedule talking-head drops.
          </p>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => setActiveSection('scheduler')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeSection === 'scheduler'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Content Pipeline
          </button>
          <button
            onClick={() => setActiveSection('bookings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeSection === 'bookings'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Client Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeSection === 'analytics'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Metrics & Reach
          </button>
          <button
            onClick={() => setActiveSection('subscribers')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeSection === 'subscribers'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Leads ({subscribers.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('domain')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeSection === 'domain'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Custom Domain & DNS</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CONTENT PIPELINE & SCRIPT SCHEDULER */}
      {activeSection === 'scheduler' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Content Scheduler & Script Studio
              </h3>
              <p className="text-xs text-slate-400">
                Track talking-head ideas from raw hook to script outline and scheduled drop date.
              </p>
            </div>

            <button
              id="admin-add-content-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 text-xs font-bold cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Queue New Drop</span>
            </button>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
            {pipelineColumns.map((col) => {
              const itemsInCol = scheduleItems.filter((i) => i.status === col.status);

              return (
                <div
                  key={col.status}
                  className={`rounded-2xl border p-3.5 flex flex-col justify-between min-h-[360px] ${col.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {col.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {itemsInCol.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {itemsInCol.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-slate-800/80 text-center text-[11px] text-slate-500">
                          No drops in {col.label.toLowerCase()}
                        </div>
                      ) : (
                        itemsInCol.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-sm hover:border-slate-700 transition-all text-left"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="px-2 py-0.2 rounded font-bold bg-slate-800 text-cyan-400">
                                {item.format}
                              </span>
                              <span className="text-slate-500">{item.targetPlatform}</span>
                            </div>

                            <h4 className="text-xs font-bold text-white line-clamp-2">
                              {item.title}
                            </h4>

                            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 italic line-clamp-2">
                              "{item.hook}"
                            </div>

                            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                {item.scheduledDate}
                              </span>
                              <button
                                onClick={() => deleteScheduleItem(item.id)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Quick Advance Status Dropdown */}
                            <div className="pt-2 border-t border-slate-800/80">
                              <select
                                value={item.status}
                                onChange={(e) =>
                                  updateScheduleStatus(item.id, e.target.value as ScheduleStatus)
                                }
                                className="w-full bg-slate-950 text-[10px] text-slate-300 border border-slate-800 rounded px-1.5 py-1 focus:outline-none focus:border-cyan-500"
                              >
                                <option value="draft">Move: Idea Backlog</option>
                                <option value="scripting">Move: Scripting</option>
                                <option value="in_review">Move: Review</option>
                                <option value="scheduled">Move: Scheduled</option>
                                <option value="published">Move: Published</option>
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: BOOKINGS & PAYMENT VERIFICATION MANAGER */}
      {activeSection === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Client Optimization Bookings Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Verify PalmPay & USDT receipts, review client career goals, and advance client onboarding.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Reference & Date</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Service Tier</th>
                  <th className="p-4">Channel & Total</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                      No client bookings recorded yet. New client bookings submitted through PalmPay or USDT will appear here in real time.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono">
                      <div className="font-bold text-cyan-400">{b.referenceCode}</div>
                      <div className="text-[10px] text-slate-500">{b.createdAt}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{b.clientName}</div>
                      <div className="text-[11px] text-slate-400">{b.clientEmail}</div>
                      <a
                        href={b.clientLinkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        LinkedIn Profile <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="p-4 font-medium text-slate-200">{b.tierName}</td>
                    <td className="p-4 font-mono">
                      <div className="font-bold text-white">{b.amountFormatted}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {b.paymentMethod === 'PalmPay' ? 'PalmPay (NGN)' : 'USDT (BEP20)'}
                      </span>
                    </td>
                    <td className="p-4">
                      {b.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : b.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          ✓ Delivery Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Needs Verification
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setInspectedBooking(b)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                      >
                        Inspect Intake
                      </button>

                      {b.status === 'pending_verification' && (
                        <button
                          onClick={() =>
                            adminUpdateBookingStatus(
                              b.id,
                              'verified',
                              'Payment verified by Victor Olufemi.'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] text-white font-bold transition-colors cursor-pointer"
                        >
                          Verify Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: ANALYTICS & REACH */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Talking-Head Views
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {totalViews.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400">Verified video releases</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Prompt Copies & Downloads
              </span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {totalCopies.toLocaleString()}
              </div>
              <span className="text-[11px] text-cyan-300">From {resources.length} active developer stacks</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Optimization Bookings
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {totalBookingsCount}
              </div>
              <span className="text-[11px] text-slate-400">
                {verifiedBookingsCount} verified & active
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Community Q&A Backlog
              </span>
              <div className="text-2xl font-black text-purple-400 font-mono">
                {qaQuestions.length}
              </div>
              <span className="text-[11px] text-purple-300">
                {qaQuestions.filter((q) => q.status === 'queued_for_vlog').length} in filming queue
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: NEWSLETTER EMAIL LEADS */}
      {activeSection === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OgojiPulse Lead Generation Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                Newsletter Subscribers & Email Leads
              </h3>
              <p className="text-xs text-slate-400">
                Live leads captured from the OgojiPulse footer newsletter form, synced to Cloud Firestore.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy all emails button */}
              <button
                type="button"
                onClick={() => {
                  const allEmails = subscribers.map((s) => s.email).filter(Boolean).join(', ');
                  navigator.clipboard.writeText(allEmails);
                  setCopiedEmail('ALL_EMAILS');
                  setTimeout(() => setCopiedEmail(null), 2500);
                }}
                disabled={subscribers.length === 0}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {copiedEmail === 'ALL_EMAILS' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All ({subscribers.length})</span>
                  </>
                )}
              </button>

              {/* Export to CSV */}
              <button
                type="button"
                onClick={() => {
                  if (subscribers.length === 0) return;
                  const csvHeaders = 'Email,Source,Interests,Status,Date\n';
                  const csvRows = subscribers
                    .map((s) => {
                      const interests = Array.isArray(s.interests) ? s.interests.join(';') : '';
                      const date = s.createdAt?.toDate
                        ? s.createdAt.toDate().toISOString()
                        : s.createdAt || '';
                      return `"${s.email || ''}","${s.source || 'footer'}","${interests}","${s.status || 'subscribed'}","${date}"`;
                    })
                    .join('\n');
                  const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `ogojipulse_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                disabled={subscribers.length === 0}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Captured Leads
              </span>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {subscribers.length}
              </div>
              <span className="text-[11px] text-slate-400">Synced to Firestore collection</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Subscriber Health
              </span>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                100%
              </div>
              <span className="text-[11px] text-emerald-300">Active subscriber rate</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Capture Point
              </span>
              <div className="text-lg font-bold text-white font-mono truncate mt-1">
                Footer Dispatch
              </div>
              <span className="text-[11px] text-cyan-300">Free AI & SQA updates</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <Mail className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={subscriberSearch}
              onChange={(e) => setSubscriberSearch(e.target.value)}
              placeholder="Search subscribers by email address or interest..."
              className="w-full bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Subscribers Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            {subscribers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="text-base font-bold text-white">No Newsletter Subscribers Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Subscribers who enter their email address in the footer will automatically appear here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Subscriber Email</th>
                      <th className="py-3 px-4">Interests / Focus</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {subscribers
                      .filter((s) => {
                        if (!subscriberSearch.trim()) return true;
                        const query = subscriberSearch.toLowerCase();
                        return (
                          s.email?.toLowerCase().includes(query) ||
                          s.interests?.some((i: string) => i.toLowerCase().includes(query))
                        );
                      })
                      .map((sub, idx) => (
                        <tr key={sub.id || idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-cyan-300">
                            {sub.email}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(sub.interests) && sub.interests.length > 0 ? (
                                sub.interests.map((tag: string, tIdx: number) => (
                                  <span
                                    key={tIdx}
                                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-500 text-[10px]">General Updates</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {sub.source || 'footer'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{sub.status || 'subscribed'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(sub.email);
                                setCopiedEmail(sub.email);
                                setTimeout(() => setCopiedEmail(null), 2000);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="Copy email"
                            >
                              {copiedEmail === sub.email ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 5: CUSTOM DOMAIN & DNS SETUP */}
      {activeSection === 'domain' && <DomainSetupCenter />}

      {/* Modal: Queue New Drop */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">Queue New Media Drop</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateScheduleItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Video / Post Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 3 SQA Secrets Every Junior Developer Should Know"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) =>
                      setNewFormat(e.target.value as ContentScheduleItem['format'])
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Talking-Head">Talking-Head Video</option>
                    <option value="Screen Tutorial">Screen Tutorial</option>
                    <option value="Quick Reel">Quick Reel</option>
                    <option value="Carousel Post">Carousel Post</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) =>
                      setNewPlatform(e.target.value as ContentScheduleItem['targetPlatform'])
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X/Twitter">X / Twitter</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Hook (First 3 Seconds)
                </label>
                <input
                  type="text"
                  value={newHook}
                  onChange={(e) => setNewHook(e.target.value)}
                  placeholder="e.g. You are writing unit tests backwards. Here is why."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Script Outline / Notes
                </label>
                <textarea
                  rows={3}
                  value={newScriptOutline}
                  onChange={(e) => setNewScriptOutline(e.target.value)}
                  placeholder="Outline key talking points..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Client Intake Details Inspector */}
      {inspectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {inspectedBooking.referenceCode}
                </span>
                <h4 className="text-lg font-bold">{inspectedBooking.clientName}</h4>
              </div>
              <button onClick={() => setInspectedBooking(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Service Package:</span>
                <div className="text-sm font-bold text-white">
                  {inspectedBooking.tierName} ({inspectedBooking.amountFormatted})
                </div>
                <div className="text-slate-400">Channel: {inspectedBooking.paymentMethod}</div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-300">Client Career Goals:</span>
                <p className="p-3 rounded-lg bg-slate-800/60 text-slate-200">
                  {inspectedBooking.intakeAnswers?.careerGoals || 'Not specified'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-300">Target Audience:</span>
                <p className="p-3 rounded-lg bg-slate-800/60 text-slate-200">
                  {inspectedBooking.intakeAnswers?.targetAudience || 'Not specified'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-300">Profile Links & References:</span>
                <p className="p-3 rounded-lg bg-slate-800/60 font-mono text-cyan-400 break-all">
                  {inspectedBooking.intakeAnswers?.profileLinks || inspectedBooking.clientLinkedIn}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-300">Payment Note / TX Hash:</span>
                <p className="p-2.5 rounded-lg bg-slate-950 text-slate-300 font-mono">
                  {inspectedBooking.proofNote || 'None provided'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              {inspectedBooking.status === 'pending_verification' && (
                <button
                  onClick={() => {
                    adminUpdateBookingStatus(
                      inspectedBooking.id,
                      'verified',
                      'Verified via Admin Inspector'
                    );
                    setInspectedBooking(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Verify Payment Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
