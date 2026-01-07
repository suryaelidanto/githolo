'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Copy, Check, ArrowLeft, Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface IdentityData {
  profile: {
    username: string;
    name: string;
    bio: string;
    avatar: string;
    stats: {
      repos: number;
      followers: number;
      following: number;
    };
  };
  identity: {
    archetype: string;
    personality: string;
    audit: {
      testing: string;
      tooling: string;
      architecture: string;
    };
    stats: {
      power: number;
      coding: number;
      shipSpeed: number;
      reliability: number;
    };
    marketRole: string;
    growthAdvice: string[];
    roast: string;
    commitStyle: string;
  };
  codeSample: {
    code: string;
    language: string;
    commitMessage: string;
  };
  sampleCommits: Array<{
    message: string;
    repo: string;
  }>;
}

const ARCHETYPE_IMAGES: Record<string, string> = {
  'The Architect': '/cards/architect.png',
  'The SRE': '/cards/sre.png',
  'The Sentinel': '/cards/sentinel.png',
  'The Weaver': '/cards/weaver.png',
  'The Researcher': '/cards/researcher.png',
  'The Modernizer': '/cards/modernizer.png',
  'The Principal': '/cards/principal.png',
  'The Purist': '/cards/purist.png',
  'The Automator': '/cards/automator.png',
  'The Velocity Lead': '/cards/velocity_lead.png',
  'The Stabilizer': '/cards/stabilizer.png',
  'The Artisan': '/cards/artisan.png',
  'The Scribe': '/cards/scribe.png',
  'The Maintainer': '/cards/maintainer.png',
  'The Pilot': '/cards/pilot.png',
  'The Vanguard': '/cards/vanguard.png',
  'The Oracle': '/cards/oracle.png',
  'The Optimizer': '/cards/optimizer.png',
  'The Navigator': '/cards/navigator.png',
  'The Generalist': '/cards/generalist.png',
};

function getArchetypeImage(archetype: string) {
  // Try exact match or fallback to a common one
  return ARCHETYPE_IMAGES[archetype] || '/cards/polyglot_sage.png';
}

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState<IdentityData | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('githolo_results');
    if (!stored) {
      router.push('/');
      return;
    }
    Promise.resolve().then(() => {
      setData(JSON.parse(stored));
    });
  }, [router, setData]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-4 md:p-8 animate-in fade-in duration-700">
      {/* Top Nav */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div
          onClick={() => router.push('/')}
          className="flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
        >
          <div className="w-8 h-8 bg-[#1D1D1F] rounded-xl flex items-center justify-center shadow-sm">
            <Github className="w-4 h-4 text-white" />
          </div>
          <span className="tracking-tight">GitHolo</span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="bento-button bento-button-secondary h-10 px-4 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Check New
        </button>
      </nav>

      {/* Main Bento Grid */}
      <main className="max-w-7xl mx-auto bento-grid">
        {/* Profile Card */}
        <section className="md:col-span-4 md:row-span-2 bento-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={data.profile.avatar}
                alt={data.profile.username || 'Avatar'}
                width={64}
                height={64}
                className="rounded-2xl border border-[#D2D2D7]"
                unoptimized
              />
              <div>
                <h3 className="bento-heading text-lg">{data.profile.name}</h3>
                <p className="text-sm text-[#86868B]">@{data.profile.username}</p>
              </div>
            </div>
            <p className="text-sm bento-body line-clamp-3">
              {data.profile.bio || 'No bio provided.'}
            </p>
          </div>
          <div className="flex gap-6 pt-4 border-t border-[#F5F5F7]">
            <div>
              <p className="text-xl font-bold">{data.profile.stats.repos}</p>
              <p className="text-[10px] uppercase font-bold text-[#86868B]">Repos</p>
            </div>
            <div>
              <p className="text-xl font-bold">{data.profile.stats.followers}</p>
              <p className="text-[10px] uppercase font-bold text-[#86868B]">Followers</p>
            </div>
          </div>
        </section>

        {/* Developer Trading Card Section */}
        <section className="md:col-span-8 md:row-span-4 bento-card p-0 overflow-hidden bg-white border-2 border-[#D2D2D7] relative group">
          <div className="flex flex-col md:flex-row h-full">
            {/* Visual Part */}
            <div className="w-full md:w-1/2 h-64 md:h-full relative bg-[#1D1D1F] overflow-hidden flex items-center justify-center">
              {/* Fallback Placeholder (shown when image fails) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1D1D1F] to-[#2C2C2E] flex flex-col items-center justify-center p-8">
                <div className="relative w-full h-full border border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center overflow-hidden">
                  {/* Holographic effect glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#007AFF] opacity-10 blur-[100px]" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 mb-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl">
                      <Github className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                      Holographic Slot
                    </p>
                    <h4 className="text-white/60 text-sm font-medium max-w-[200px] leading-relaxed mb-6">
                      Awaiting holographic asset for{' '}
                      <span className="text-white">{data.identity.archetype}</span>
                    </h4>
                    <a
                      href="https://github.com/suryaelidanto/githolo/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
                    >
                      Apply as Contributor
                    </a>
                  </div>
                </div>
              </div>

              {/* Final Image */}
              <Image
                src={getArchetypeImage(data.identity.archetype)}
                alt={data.identity.archetype}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 z-10"
                unoptimized
                onError={(e) => {
                  // Hide the image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#D2D2D7]">
                  {data.identity.marketRole}
                </span>
              </div>

              <a
                href="https://github.com/suryaelidanto/githolo/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 z-20 px-2 py-1 bg-[#007AFF] text-white rounded text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Seeking Artist: Contribute Art
              </a>
            </div>

            {/* Stats Part */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#86868B] mb-1">
                  Identity Card
                </p>
                <h1 className="text-3xl md:text-5xl bento-heading text-[#1D1D1F] leading-tight mb-4">
                  {data.identity.archetype}
                </h1>
                <p className="text-sm md:text-base bento-body mb-8 italic">
                  {data.identity.personality}
                </p>

                {/* Power Stats */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Power', value: data.identity.stats.power, color: '#FF3B30' },
                    { label: 'Coding', value: data.identity.stats.coding, color: '#007AFF' },
                    { label: 'Ship Speed', value: data.identity.stats.shipSpeed, color: '#34C759' },
                    {
                      label: 'Reliability',
                      value: data.identity.stats.reliability,
                      color: '#FF9500',
                    },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#86868B]">
                          {stat.label}
                        </span>
                        <span className="text-xs font-bold">{stat.value}</span>
                      </div>
                      <div className="h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${stat.value}%`,
                            backgroundColor: stat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="flex-1 bento-button h-12 text-sm font-bold bg-[#1D1D1F] text-white border-none transition-transform active:scale-95">
                  <Copy className="w-4 h-4 mr-2" /> Share Card
                </button>
                <button className="bento-button bento-button-secondary w-12 h-12 p-0 flex items-center justify-center transition-transform active:scale-95 group/btn">
                  <Star className="w-4 h-4 text-[#86868B] group-hover/btn:text-[#007AFF] transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* The Roast Card */}
        <section className="md:col-span-4 md:row-span-2 bento-card !bg-[#1D1D1F] !text-white border-none shadow-xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -top-4 -left-2 text-[120px] font-serif text-white/10 leading-none select-none group-hover:text-white/20 transition-colors">
            &ldquo;
          </div>
          <p className="relative z-10 text-lg md:text-xl font-medium italic leading-relaxed pt-4">
            {'"'}
            {data.identity.roast}
            {'"'}
          </p>
          <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-[#86868B]">
            The Verdict
          </p>
        </section>

        {/* Engineering Audit Card */}
        <section className="md:col-span-6 md:row-span-2 bento-card">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-4">
            Engineering Audit
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-[#5856D6] uppercase mb-1.5 tracking-widest">
                Testing Culture
              </p>
              <p className="text-sm font-semibold leading-tight text-[#1D1D1F]">
                {data.identity.audit.testing}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#5856D6] uppercase mb-1.5 tracking-widest">
                Ops & Tooling
              </p>
              <p className="text-sm font-semibold leading-tight text-[#1D1D1F]">
                {data.identity.audit.tooling}
              </p>
            </div>
          </div>
        </section>

        {/* Growth Advice Card */}
        <section className="md:col-span-6 md:row-span-2 bento-card">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-4">
            Growth Advice
          </h4>
          <div className="space-y-3">
            {data.identity.growthAdvice.map((advice, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] mt-1.5 shrink-0" />
                <p className="text-sm font-medium leading-snug">{advice}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code DNA Card */}
        <section className="md:col-span-8 md:row-span-4 bento-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B]">
                Code DNA
              </h4>
              <p className="text-xs text-[#86868B] mt-0.5">{data.codeSample.language}</p>
            </div>
            <button
              onClick={() => handleCopy(data.codeSample.code, 'code')}
              className="text-[10px] font-bold uppercase flex items-center gap-1.5 text-[#007AFF] hover:opacity-70 transition-opacity"
            >
              {copiedItem === 'code' ? (
                <>
                  <Check className="w-3 h-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Snippet
                </>
              )}
            </button>
          </div>
          <pre className="bento-code-block min-h-[200px] text-xs">
            <code>{data.codeSample.code}</code>
          </pre>
          <div className="mt-4 pt-4 border-t border-[#F5F5F7]">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-2">
              Commit Style
            </p>
            <p className="text-sm font-medium italic text-[#1D1D1F]">
              {'"'}
              {data.codeSample.commitMessage}
              {'"'}
            </p>
          </div>
        </section>

        {/* Commit Style Analysis */}
        <section className="md:col-span-4 md:row-span-2 bento-card bg-[#F5F5F7] border-none">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-3">
            Communication
          </h4>
          <p className="text-sm md:text-base font-medium leading-relaxed">
            {data.identity.commitStyle}
          </p>
        </section>

        {/* Recent Activity Card */}
        <section className="md:col-span-4 md:row-span-2 bento-card overflow-hidden">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-4">
            Recent Activity
          </h4>
          <div className="space-y-4">
            {data.sampleCommits.slice(0, 3).map((c, i) => (
              <div key={i} className="space-y-1">
                <p className="text-xs font-semibold line-clamp-1">{c.message}</p>
                <div className="text-[10px] text-[#86868B] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D2D2D7]" /> {c.repo.split('/')[1]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section - Full Width at Bottom */}
        <section className="md:col-span-12 mt-4 flex flex-col md:flex-row gap-4 items-center justify-center p-8 bg-white rounded-[32px] border border-[#D2D2D7] shadow-sm">
          <div className="text-center md:text-left md:mr-auto">
            <h3 className="bento-heading text-lg">Like the identity?</h3>
            <p className="text-sm bento-body">Support the developer or this project on GitHub.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://github.com/${data.profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-button h-12"
            >
              Follow @{data.profile.username} <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <a
              href="https://github.com/suryaelidanto/githolo"
              target="_blank"
              rel="noopener noreferrer"
              className="bento-button bento-button-secondary h-12"
            >
              Star this Project <Star className="w-4 h-4 ml-2 fill-[#007AFF] text-[#007AFF]" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 mb-8 text-center text-[#86868B] text-xs font-medium">
        <p>© 2026 GitHolo. Crafted with precision for the developer community.</p>
      </footer>
    </div>
  );
}
