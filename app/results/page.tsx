'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Copy, Check, Share2, ArrowLeft } from 'lucide-react';
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
    strengths: string[];
    quirks: string[];
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
    <div className="min-h-screen bg-pitch-white flex flex-col">
      {/* Header */}
      <header className="p-8 flex justify-between items-center border-b-4 border-pitch-black">
        <div
          onClick={() => router.push('/')}
          className="flex items-center gap-2 font-black text-2xl uppercase tracking-tighter cursor-pointer hover:text-pitch-purple transition-colors"
        >
          <Github className="w-6 h-6" />
          Vibe Check
        </div>
        <button className="pitch-button h-12 px-6 flex items-center gap-2 text-xs">
          <Share2 className="w-4 h-4" /> Share Results
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar: Profile & Vibe */}
        <section className="md:w-1/3 p-8 border-b-4 md:border-b-0 md:border-r-4 border-pitch-black space-y-8 bg-white">
          {/* Profile Card */}
          <div className="flex items-center gap-4">
            <Image
              src={data.profile.avatar}
              alt={data.profile.username || data.profile.name || 'User Avatar'}
              width={80}
              height={80}
              className="rounded-full border-2 border-pitch-black"
              unoptimized
            />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {data.profile.name}
              </h2>
              <p className="text-sm text-zinc-500">@{data.profile.username || 'unknown'}</p>
            </div>
          </div>

          {data.profile.bio && (
            <p className="text-sm text-zinc-600 italic border-l-2 border-pitch-purple pl-3">
              {data.profile.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-black">{data.profile.stats.repos}</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">Repos</p>
            </div>
            <div>
              <p className="text-2xl font-black">{data.profile.stats.followers}</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">Followers</p>
            </div>
          </div>

          {/* Archetype */}
          <div className="space-y-2 pt-8 border-t-2 border-pitch-black">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Developer Archetype
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-pitch-purple">
              {data.vibe.archetype}
            </h1>
            <p className="text-lg font-medium leading-snug pt-2">{data.vibe.personality}</p>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Strengths
            </p>
            <div className="space-y-1">
              {data.vibe.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pitch-purple rounded-full" />
                  <p className="text-sm font-medium">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quirks */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quirks</p>
            <div className="space-y-1">
              {data.vibe.quirks.map((quirk, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pitch-black rounded-full" />
                  <p className="text-sm font-medium italic">{quirk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The Roast */}
          <div className="bg-pitch-green p-4 border-2 border-pitch-black">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
              The Roast
            </p>
            <p className="text-base font-bold leading-snug">
              {'"'}
              {data.vibe.roast}
              {'"'}
            </p>
          </div>
        </section>

        {/* Right Content: Code Sample & Commits */}
        <section className="flex-1 bg-pitch-green p-8 space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
              Your Code
              <br />
              DNA
            </h2>
          </div>

          {/* Code Sample */}
          <div className="pitch-card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Generated Code Sample
                </p>
                <p className="text-xs text-zinc-600 mt-1">Language: {data.codeSample.language}</p>
              </div>
              <button
                onClick={() => handleCopy(data.codeSample.code, 'code')}
                className="text-[10px] font-bold uppercase flex items-center gap-1 hover:text-pitch-purple transition-colors"
              >
                {copiedItem === 'code' ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
            <pre className="bg-[#000000] text-white p-6 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed min-h-[120px] shadow-2xl border border-white/10">
              <code>{data.codeSample.code}</code>
            </pre>
            <div className="mt-3 pt-3 border-t border-zinc-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Commit Message
              </p>
              <p className="text-sm font-medium italic">
                {'"'}
                {data.codeSample.commitMessage}
                {'"'}
              </p>
            </div>
          </div>

          {/* Commit Style */}
          <div className="pitch-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Commit Style Analysis
            </p>
            <p className="text-lg font-medium leading-snug">{data.vibe.commitStyle}</p>
          </div>

          {/* Sample Commits */}
          <div className="pitch-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
              Recent Commits
            </p>
            <div className="space-y-3">
              {data.sampleCommits.map((commit, idx) => (
                <div key={idx} className="border-l-2 border-pitch-purple pl-3">
                  <p className="text-sm font-medium">{commit.message}</p>
                  <p className="text-xs text-zinc-500 mt-1">{commit.repo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <button
              onClick={() => router.push('/')}
              className="pitch-button inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Check Another Developer
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
