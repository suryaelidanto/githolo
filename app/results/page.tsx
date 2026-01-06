'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
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

  if (!data) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="shimmer w-full max-w-4xl h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-4 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start Over
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Your Digital DNA</h1>
          </div>
          <Button
            variant="outline"
            className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Writing Style Analysis */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Your Writing Style</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Tone Card */}
            <Card className="glass-card p-6 space-y-3 transition-smooth hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-400">Tone</h3>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  Primary
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white">{data.writingStyle.tone}</p>
            </Card>

            {/* Style Card */}
            <Card className="glass-card p-6 space-y-3 transition-smooth hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-400">Style</h3>
              </div>
              <p className="text-lg text-white">{data.writingStyle.style}</p>
            </Card>

            {/* Keywords Card */}
            <Card className="glass-card p-6 space-y-3 transition-smooth hover:scale-[1.02]">
              <h3 className="text-sm font-medium text-zinc-400">Common Topics</h3>
              <div className="flex flex-wrap gap-2">
                {data.writingStyle.keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="border-blue-400/30 text-blue-300">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Formatting Card */}
            <Card className="glass-card p-6 space-y-3 transition-smooth hover:scale-[1.02]">
              <h3 className="text-sm font-medium text-zinc-400">Formatting Quirks</h3>
              <p className="text-white">{data.writingStyle.formatting}</p>
            </Card>
          </div>

          {/* Signature Phrases */}
          {data.writingStyle.signature_phrases.length > 0 && (
            <Card className="glass-card p-6 mt-4 transition-smooth hover:scale-[1.01]">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Signature Phrases</h3>
              <div className="flex flex-wrap gap-2">
                {data.writingStyle.signature_phrases.map((phrase, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-sm text-white border border-purple-400/30"
                  >
                    &quot;{phrase}&quot;
                  </span>
                ))}
              </div>
            </Card>
          )}
        </section>

        {/* Generated Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">
              Your Next Posts, Written by Your Echo
            </h2>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              {data.generatedPosts.length} Posts Generated
            </Badge>
          </div>

          <div className="space-y-4">
            {data.generatedPosts.map((post) => (
              <Card
                key={post.id}
                className="glass-card p-6 space-y-4 transition-smooth hover:scale-[1.01] glow-on-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                      Topic: {post.topic}
                    </Badge>
                    <p className="text-white whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleCopy(post.content, post.id)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
                    onClick={() => {
                      // In a real app, this would open LinkedIn with pre-filled text
                      window.open('https://www.linkedin.com/feed/', '_blank');
                    }}
                  >
                    Post to LinkedIn
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <Card className="glass-card p-8 space-y-4">
            <h3 className="text-2xl font-bold text-white">Love your AI voice?</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              EchoWrite is open source and free to use. Star us on GitHub to support the project!
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate More Posts
              </Button>
              <Button
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:bg-white/5"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                ⭐ Star on GitHub
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
