'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl,
          useMockData: false, // Set to true for testing without hitting LinkedIn
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store results in sessionStorage and navigate
      sessionStorage.setItem('echowrite_results', JSON.stringify(data.data));
      router.push('/results');
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to connect to the server. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            EchoWrite
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          GitHub
        </a>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl w-full space-y-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              What would your AI twin write?
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Enter your LinkedIn profile URL and discover your unique writing style. Then, let your
            AI Echo write the next viral post for you.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="profile-url" className="text-sm font-medium text-zinc-300">
                LinkedIn Profile URL
              </label>
              <Input
                id="profile-url"
                type="url"
                placeholder="https://linkedin.com/in/yourname"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                disabled={isLoading}
                className="h-14 text-lg bg-white/5 border-white/10 focus:border-purple-400 focus:ring-purple-400/20"
                required
              />
              <p className="text-xs text-zinc-500">
                We&apos;ll analyze your last 5 posts to understand your writing style
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !profileUrl}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 glow-on-hover"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing your style...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Discover My AI Voice
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Social Proof */}
        <div className="text-center space-y-4">
          <p className="text-sm text-zinc-500">
            Join 1,000+ professionals who found their AI voice
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-zinc-500">Posts Generated</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">95%</p>
              <p className="text-zinc-500">Accuracy Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">3 min</p>
              <p className="text-zinc-500">Average Time</p>
            </div>
          </div>
        </div>

        {/* Demo Button */}
        <div className="text-center">
          <button
            onClick={async () => {
              setProfileUrl('https://linkedin.com/in/demo');
              setError('');
              setIsLoading(true);

              try {
                const response = await fetch('/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    profileUrl: 'https://linkedin.com/in/demo',
                    useMockData: true, // Use mock data for demo
                  }),
                });

                const data = await response.json();

                if (!data.success) {
                  setError(data.error || 'Something went wrong. Please try again.');
                  setIsLoading(false);
                  return;
                }

                sessionStorage.setItem('echowrite_results', JSON.stringify(data.data));
                router.push('/results');
              } catch (err) {
                console.error('Generation error:', err);
                setError('Failed to connect to the server. Please try again.');
                setIsLoading(false);
              }
            }}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline"
            disabled={isLoading}
          >
            Try with demo data
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-sm text-zinc-600">
        <p>
          Built with Next.js, LangChain, and OpenRouter •{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
            How it works
          </a>
        </p>
      </footer>
    </div>
  );
}
