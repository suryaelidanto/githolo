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
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.replace('@', '').trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong.');
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem('vibecheck_results', JSON.stringify(data.data));
      router.push('/results');
    } catch {
      setError('Connection failed. Please check your internet.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-pitch-white">
      {/* Top Section: Hero & Headline */}
      <section className="flex-[1.2] flex flex-col items-center justify-center px-6 relative">
        <header className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center">
          <div className="font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-2">
            <Github className="w-6 h-6" />
            Vibe Check
          </div>
        </header>

        <div className="pitch-container text-center space-y-2 md:space-y-4">
          <h1 className="pitch-headline">
            DISCOVER
            <br />
            YOUR <span className="text-pitch-purple">DEVELOPER</span> VIBE
          </h1>
          <p className="text-base md:text-xl font-medium text-zinc-600 max-w-xl mx-auto leading-tight">
            AI analyzes your GitHub commits and reveals your coding personality.
          </p>
        </div>
      </section>

      {/* Bottom Section: Action & Form */}
      <section className="flex-1 bg-pitch-green flex flex-col justify-center px-6 border-t-4 border-pitch-black relative">
        <div className="max-w-3xl w-full mx-auto space-y-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex flex-col md:flex-row items-stretch">
              <input
                type="text"
                placeholder="GITHUB USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="pitch-input flex-1 md:border-r-0"
                required
              />
              <button
                type="submit"
                disabled={isLoading || !username}
                className="pitch-button min-w-full md:min-w-[280px]"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    CHECK VIBE <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-600 font-bold uppercase tracking-tight text-center text-xs bg-white/50 py-2 border border-red-200">
                {error}
              </p>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const response = await fetch('/api/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username: 'demo', useMockData: true }),
                    });
                    const data = await response.json();
                    sessionStorage.setItem('vibecheck_results', JSON.stringify(data.data));
                    router.push('/results');
                  } catch {
                    setIsLoading(false);
                  }
                }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-pitch-black transition-colors underline underline-offset-4"
                disabled={isLoading}
              >
                Or try with demo data
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Abstract Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] -left-12 w-48 h-48 border-[0.5px] border-pitch-black opacity-10 rounded-full" />
        <div className="absolute bottom-[10%] -right-12 w-64 h-64 border-[0.5px] border-pitch-black opacity-10 rotate-12" />
      </div>
    </div>
  );
}
