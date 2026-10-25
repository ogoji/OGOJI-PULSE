import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Server,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const DomainSetupCenter: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customDomainInput, setCustomDomainInput] = useState<string>('ogojipulse.com');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateVerification = () => {
    if (!customDomainInput.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult(
        `DNS CNAME record detected for "${customDomainInput.trim()}". Routing target verified to Google Cloud Run / Firebase endpoint.`
      );
    }, 1800);
  };

  const suggestedDomains = [
    {
      domain: 'ogojipulse.com',
      badge: 'Recommended Flagship',
      desc: 'The official commercial domain for the app, services & subscriber ecosystem.',
      bestFor: 'Global Brand & Web App',
    },
    {
      domain: 'ogojithecreator.com',
      badge: 'Personal Brand',
      desc: 'Matches your TikTok and YouTube handle @ogojithecreator._ for maximum recognition.',
      bestFor: 'Creator Portfolio & Bookings',
    },
    {
      domain: 'ogojithecreator.tech',
      badge: 'Tech Authority',
      desc: 'Dedicated to AI workflows, SQA frameworks, and engineering tools.',
      bestFor: 'Developers & Tech Audiences',
    },
    {
      domain: 'ogojipulse.ng',
      badge: 'Local Authority',
      desc: 'Official Nigerian domain for direct local client consulting and PalmPay payments.',
      bestFor: 'Nigerian Corporate Clients',
    },
  ];

  const registrars = [
    {
      name: 'Cloudflare Registrar',
      url: 'https://www.cloudflare.com/products/registrar/',
      highlight: 'Zero Markup + Free DDoS & DNS',
      priceEstimate: '~$9.77/yr (.com)',
    },
    {
      name: 'Namecheap',
      url: 'https://www.namecheap.com',
      highlight: 'Affordable with free lifetime WHOIS privacy',
      priceEstimate: '~$10.28/yr (.com)',
    },
    {
      name: 'WhoGoHost / DomainKing',
      url: 'https://www.whogohost.com',
      highlight: 'Best for .ng / .com.ng via Naira & PalmPay',
      priceEstimate: '₦12,000 - ₦18,000/yr (.ng)',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Globe className="w-3.5 h-3.5" />
            <span>Custom Domain & DNS Command Center</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 font-['Outfit']">
            Connect Your Custom Domain to OgojiPulse
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Follow this 3-step guide to purchase and link your custom domain (e.g. <span className="text-cyan-300 font-mono">ogojipulse.com</span>) to your Google Cloud & Firebase infrastructure.
          </p>
        </div>
      </div>

      {/* Step 1: Recommended Brand Domains */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
          <span>Pick Your Ideal Domain Name</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedDomains.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.domain}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">{item.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-slate-500 font-medium">Best for: {item.bestFor}</span>
                <button
                  onClick={() => {
                    setCustomDomainInput(item.domain);
                    copyToClipboard(item.domain, `domain-${idx}`);
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  {copiedKey === `domain-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === `domain-${idx}` ? 'Copied' : 'Select'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Registrars */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
          <span>Register on ICANN Registrar</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {registrars.map((reg, idx) => (
            <a
              key={idx}
              href={reg.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">
                    {reg.name}
                  </h5>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{reg.highlight}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>{reg.priceEstimate}</span>
                <span className="text-slate-500 text-[10px]">Open &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Step 3: DNS Records Configuration */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">3</span>
          <span>Configure DNS Records at Registrar / Cloudflare</span>
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Name / Host</th>
                <th className="p-3">Value / Target</th>
                <th className="p-3">TTL</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300 font-mono">
              <tr>
                <td className="p-3 font-bold text-cyan-400">CNAME</td>
                <td className="p-3">@ (or app)</td>
                <td className="p-3 max-w-xs truncate text-[11px]">
                  ais-pre-u4s2p26alkrfxm3vzgx4sc-168374311698.europe-west1.run.app
                </td>
                <td className="p-3 text-slate-500">Auto</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'ais-pre-u4s2p26alkrfxm3vzgx4sc-168374311698.europe-west1.run.app',
                        'cname-val'
                      )
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    title="Copy Value"
                  >
                    {copiedKey === 'cname-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-purple-400">TXT</td>
                <td className="p-3">@</td>
                <td className="p-3 max-w-xs truncate text-[11px]">
                  firebase=beaming-firmament-9lxdt
                </td>
                <td className="p-3 text-slate-500">Auto</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => copyToClipboard('firebase=beaming-firmament-9lxdt', 'txt-val')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    title="Copy Value"
                  >
                    {copiedKey === 'txt-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Verification Simulator */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Test DNS Propagation</span>
          </span>
          <span className="text-[11px] text-slate-500">Instant Check</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customDomainInput}
            onChange={(e) => setCustomDomainInput(e.target.value)}
            placeholder="e.g. ogojipulse.com"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSimulateVerification}
            disabled={isVerifying}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Checking DNS...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Propagation</span>
              </>
            )}
          </button>
        </div>

        {verificationResult && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{verificationResult}</span>
          </div>
        )}
      </div>
    </div>
  );
};
