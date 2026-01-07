'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, Github } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let processedUsername = username.trim();
    if (!processedUsername) {
      setError('Please enter a username or profile URL.');
      return;
    }

    // Handle full GitHub URLs
    // e.g., https://github.com/suryaelidanto or github.com/suryaelidanto
    try {
      if (processedUsername.includes('github.com/')) {
        const parts = processedUsername.split('github.com/');
        processedUsername = parts[parts.length - 1].split('/')[0];
      } else {
        // Handle @username
        processedUsername = processedUsername.replace('@', '').split('/')[0];
      }
    } catch {
      setError('Invalid GitHub URL or username.');
      return;
    }

    if (!processedUsername) {
      setError('Could not extract a valid username.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: processedUsername }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong.');
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem('githolo_results', JSON.stringify(data.data));
      router.push('/results');
    } catch {
      setError('Connection failed. Please check your internet.');
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'demo', useMockData: true }),
      });
      const data = await response.json();
      sessionStorage.setItem('githolo_results', JSON.stringify(data.data));
      router.push('/results');
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F5F5F7]">
      <div className="w-full max-w-2xl space-y-12 text-center">
        {/* Header/Logo */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-[#D2D2D7]">
            <Github className="w-8 h-8 text-[#1D1D1F]" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#86868B]">GitHolo</h2>
        </div>

        {/* Hero Section */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1D1D1F] leading-[1.1]">
            Experience your <br />
            <span className="text-[#007AFF]">holographic identity</span>
          </h1>
          <p className="text-lg md:text-xl text-[#86868B] max-w-lg mx-auto leading-relaxed bento-body">
            AI analysis of your coding personality and commit habits. Get your archetype, strengths,
            and quirks in seconds.
          </p>
        </div>

        <div className="w-full max-w-lg mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <form onSubmit={handleSubmit}>
            <div className="bento-search-wrapper">
              <div className="pl-4 text-[#86868B] flex-shrink-0">
                <Github className="w-5 h-5 opacity-40" />
              </div>
              <input
                type="text"
                placeholder="username or github.com/username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bento-search-input"
                required
              />
              <button
                type="submit"
                disabled={isLoading || !username}
                className="bento-button h-12 px-6 rounded-[18px] text-sm whitespace-nowrap flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="hidden md:inline">Generate Identity</span>
                    <span className="md:hidden">Generate</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-[20px] bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest animate-in fade-in zoom-in duration-300">
              <span className="w-1 h-1 rounded-full bg-red-600" />
              {error}
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleDemo}
              disabled={isLoading}
              className="text-xs font-semibold text-[#86868B] hover:text-[#007AFF] transition-colors cursor-pointer"
            >
              Or try with demo data
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="fixed bottom-8 text-center w-full px-6">
        <p className="text-xs text-[#86868B] font-medium">Modern. Clean. Powered by GPT-4o.</p>
      </footer>
    </div>
  );
}
