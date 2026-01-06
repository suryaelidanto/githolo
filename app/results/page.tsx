'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check, ArrowLeft, Share2 } from 'lucide-react';
import type { WritingStyle } from '@/lib/chains';

interface GeneratedPost {
  id: number;
  topic: string;
  content: string;
}

interface ResultsData {
  writingStyle: WritingStyle;
  generatedPosts: GeneratedPost[];
  originalPosts: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [data] = useState<ResultsData | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.sessionStorage.getItem('echowrite_results');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (!data) {
      router.push('/');
    }
  }, [data, router]);

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-pitch-white flex flex-col">
      {/* Sidebar-ish Header */}
      <header className="p-8 flex justify-between items-center border-b-4 border-pitch-black">
        <div
          onClick={() => router.push('/')}
          className="flex items-center gap-2 font-black text-2xl uppercase tracking-tighter cursor-pointer"
        >
          EchoWrite
        </div>
        <button
          onClick={() => router.push('/')}
          className="font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Start Over
        </button>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel: Style Profile */}
        <section className="md:w-1/3 p-8 border-b-4 md:border-b-0 md:border-r-4 border-pitch-black space-y-8 bg-white">
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
              Your Digital
              <br />
              Identity
            </h1>
            <p className="font-bold text-pitch-purple uppercase tracking-widest text-xs">
              Writing Style Analysis
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Tone
              </label>
              <p className="text-2xl font-black uppercase leading-tight">
                {data.writingStyle.tone}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Style
              </label>
              <p className="text-lg font-medium leading-snug">{data.writingStyle.style}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Common Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {data.writingStyle.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-zinc-100 border border-pitch-black text-[10px] font-bold uppercase"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Formatting
              </label>
              <p className="text-sm border-l-2 border-pitch-purple pl-3 py-1 italic text-zinc-600">
                {data.writingStyle.formatting}
              </p>
            </div>
          </div>
        </section>

        {/* Right Panel: Generated Posts */}
        <section className="flex-1 bg-pitch-green p-8 space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
              The Next
              <br />
              Gen Posts
            </h2>
            <button className="pitch-button h-12 px-6 flex items-center gap-2 text-xs">
              <Share2 className="w-4 h-4" /> Share Results
            </button>
          </div>

          <div className="grid gap-6">
            {data.generatedPosts.map((post) => (
              <div key={post.id} className="pitch-card hover:-translate-y-1 transition-smooth">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-pitch-purple text-white px-2 py-0.5">
                      {post.topic}
                    </span>
                    <button
                      onClick={() => handleCopy(post.content, post.id)}
                      className="text-[10px] font-bold uppercase flex items-center gap-1 hover:text-pitch-purple transition-colors"
                    >
                      {copiedId === post.id ? (
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
                  <p className="text-lg font-medium whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                  <div className="pt-4 flex gap-4">
                    <button
                      onClick={() => window.open('https://www.linkedin.com/feed/', '_blank')}
                      className="flex-1 h-12 border-2 border-pitch-black font-black uppercase tracking-widest text-xs hover:bg-pitch-black hover:text-white transition-colors"
                    >
                      Post to LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof Placeholder */}
          <div className="pt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Powered by EchoWrite AI Engine
          </div>
        </section>
      </main>
    </div>
  );
}
