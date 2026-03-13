'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2, Wind, ArrowRight, Loader2 } from 'lucide-react';

interface Result {
  meaning: string;
  caution: string;
  goodOmen: string;
}

export default function DreamForm() {
  const [dream, setDream] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [dream]);

  const triggerSubmit = async () => {
    if (!dream.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dream }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 서버에서 보낸 에러 메시지를 구체적으로 알림
        alert(`분석 실패: ${data.error || '알 수 없는 오류가 발생했습니다.'}`);
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert('연결에 실패했습니다. 인터넷 연결이나 서버 상태를 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSubmit();
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-sm mt-[55vh]" 
      >
        {!result ? (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-sm md:text-base font-normal text-white/90 tracking-[0.4em] font-['Malgun_Gothic']">
                당신의 꿈을 풀어드립니다
              </h1>
            </div>

            <div className="relative glass-minimal flex flex-col bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-2xl px-5 py-4 group hover:border-white/10 transition-all duration-1000 shadow-2xl overflow-hidden">
              {loading && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
                />
              )}

              <textarea
                ref={textareaRef}
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="어떤 꿈이었나요?"
                rows={1}
                className="w-full bg-transparent border-none text-white/90 placeholder-white/20 focus:outline-none focus:ring-0 text-sm py-1 font-light resize-none leading-relaxed overflow-hidden font-['Malgun_Gothic']"
                style={{ minHeight: '1.5rem', maxHeight: '10rem' }}
                disabled={loading}
              />
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-[10px] text-purple-300/40 tracking-widest font-['Malgun_Gothic']"
                      >
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>무의식을 해석하는 중...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={triggerSubmit}
                  disabled={loading || !dream.trim()}
                  className="p-1.5 text-white/40 hover:text-white/90 transition-all duration-700 disabled:opacity-0"
                >
                  <div className="p-1">
                    <ArrowRight className="w-5 h-5 opacity-40 hover:opacity-100" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="space-y-6"
            >
              <div className="glass-minimal p-8 rounded-[3rem] border border-white/5 bg-black/60 backdrop-blur-[40px] space-y-8 shadow-2xl">
                <section className="space-y-5">
                  <div className="flex items-center gap-2 text-purple-300/30 uppercase tracking-[0.5em] text-[8px] font-bold">
                    <Wind className="w-3 h-3" />
                    <span>Dream Insight</span>
                  </div>
                  <p className="text-white/90 leading-relaxed font-light text-sm md:text-base font-['Malgun_Gothic']">
                    {result.meaning}
                  </p>
                </section>

                <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/5">
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-300/20 uppercase tracking-[0.4em] text-[8px]">
                      <AlertCircle className="w-2.5 h-2.5" />
                      <span>Caution</span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed font-light font-['Malgun_Gothic']">
                      {result.caution}
                    </p>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-300/20 uppercase tracking-[0.4em] text-[8px]">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Omen</span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed font-light font-['Malgun_Gothic']">
                      {result.goodOmen}
                    </p>
                  </section>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="w-full pt-4 text-[7px] tracking-[1em] text-white/5 hover:text-white/30 uppercase transition-all duration-1000 font-['Malgun_Gothic']"
                >
                  Return
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
