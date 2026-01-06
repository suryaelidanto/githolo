'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Copy, Check, ArrowLeft, Star, ExternalLink, Quote } from 'lucide-react';
import Image from 'next/image';

interface VibeData {
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
  vibe: {
    archetype: string;
    personality: string;
    audit: {
      testing: string;
      tooling: string;
      architecture: string;
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

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState<VibeData | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('vibecheck_results');
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
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#D2D2D7] shadow-sm">
            <Github className="w-4 h-4" />
          </div>
          <span>Vibe Check</span>
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

        {/* Archetype Card */}
        <section className="md:col-span-8 md:row-span-2 bento-card bg-white flex flex-col justify-center">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#86868B] mb-2 text-center md:text-left">
            Developer Archetype
          </p>
          <h1 className="text-4xl md:text-7xl bento-heading text-center md:text-left text-[#007AFF] leading-none mb-4">
            {data.vibe.archetype}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <p className="text-lg md:text-xl font-medium text-[#1D1D1F] text-center md:text-left">
              {data.vibe.personality}
            </p>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#D2D2D7]" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#007AFF] text-center md:text-left">
              {data.vibe.marketRole}
            </p>
          </div>
        </section>

        {/* The Roast Card */}
        <section className="md:col-span-4 md:row-span-2 bento-card !bg-[#1D1D1F] !text-white border-none shadow-xl flex flex-col justify-center">
          <Quote className="w-8 h-8 text-[#86868B] opacity-30 mb-4" />
          <p className="text-lg md:text-xl font-medium italic leading-relaxed">
            {'"'}
            {data.vibe.roast}
            {'"'}
          </p>
          <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-[#86868B]">
            The Verdict
          </p>
        </section>

        {/* Engineering Audit Card */}
        <section className="md:col-span-4 md:row-span-2 bento-card">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-4">
            Engineering Audit
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-[#007AFF] uppercase mb-1">Testing Culture</p>
              <p className="text-sm font-medium leading-tight">{data.vibe.audit.testing}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#007AFF] uppercase mb-1">Ops & Tooling</p>
              <p className="text-sm font-medium leading-tight">{data.vibe.audit.tooling}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#007AFF] uppercase mb-1">Architecture</p>
              <p className="text-sm font-medium leading-tight">{data.vibe.audit.architecture}</p>
            </div>
          </div>
        </section>

        {/* Growth Advice Card */}
        <section className="md:col-span-4 md:row-span-2 bento-card">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-4">
            Growth Advice
          </h4>
          <div className="space-y-3">
            {data.vibe.growthAdvice.map((advice, i) => (
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
            {data.vibe.commitStyle}
          </p>
        </section>

        {/* Recent Activity Card */}
        <section className="md:col-span-4 md:row-span-2 bento-card overflow-hidden">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#86868B] mb-4">
            Recent Actvity
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
            <h3 className="bento-heading text-lg">Like the vibe?</h3>
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
              href="https://github.com/suryaelidanto/github-vibecheck"
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
        <p>© 2026 GitHub Vibe Check. Made with ❤️ for the dev community.</p>
      </footer>
    </div>
  );
}
