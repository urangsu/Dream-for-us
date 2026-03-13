'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Sun, AlertCircle, TrendingUp, RefreshCcw } from 'lucide-react';

interface AnalysisResult {
  meaning: string;
  caution: {
    summary: string;
    story: string;
  };
  goodOmen: {
    summary: string;
    story: string;
  };
  luckyNumbers: number[];
}

export default function DreamForm() {
  const [dream, setDream] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [dream]);

  // 결과 생성 시 자동 스크롤
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!dream.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center justify-center">
      
      {/* 1. 입력창 섹션 (화면 정중앙 정렬) */}
      <div 
        className="w-full max-w-xs px-6 transition-all duration-1000 flex justify-center"
        style={{ marginTop: result ? '42px' : '72px' }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center"
        >
          <form onSubmit={handleSubmit} className="relative group w-full">
            {/* 후광 효과 (박스 크기에 맞춰 축소) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl blur-xl opacity-20 group-hover:opacity-60 transition duration-1000"></div>
            
            <div className="relative bg-[#0d0d12]/40 backdrop-blur-2xl border border-white/5 p-2 rounded-xl flex flex-col gap-2 shadow-2xl ring-1 ring-white/5">
              <label className="text-purple-300/30 text-[8px] font-bold tracking-[0.4em] uppercase flex items-center gap-2 ml-1">
                <Moon size={8} className="text-purple-400/50" /> 
                Dream Whisper
              </label>
              
              <textarea
                ref={textareaRef}
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="꿈의 조각..."
                className="w-full bg-transparent border-none p-1 text-white placeholder:text-white/10 focus:outline-none min-h-[32px] max-h-[200px] resize-none text-sm leading-relaxed font-serif overflow-hidden text-center"
                disabled={loading}
                rows={1}
              />
              
              <div className="flex justify-center pt-3 border-t border-white/5">
                <button
                  type="submit"
                  disabled={loading || !dream.trim()}
                  className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-8 py-2.5 rounded-xl border border-white/10 transition-all active:scale-[0.98] disabled:opacity-20 flex items-center gap-3 text-xs font-semibold group/btn"
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="animate-spin" size={14} />
                      수집 중...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="group-hover/btn:rotate-12 transition-transform" />
                      해석 요청
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* 2. 결과 섹션 (화면 중앙 정렬) */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl px-6 mt-20 pb-40 flex flex-col items-center"
          >
            <div className="w-full bg-[#050508]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-1 shadow-2xl overflow-hidden max-h-[75vh] flex flex-col">
              
              <div className="overflow-y-auto p-12 space-y-16 custom-scrollbar">
                
                {/* 30년 경력 마스터의 통찰 (중앙 정렬) */}
                <section className="relative text-center">
                  <div className="text-[10px] text-purple-400/40 tracking-[0.5em] mb-8 uppercase flex items-center justify-center gap-2 font-bold">
                    <Sun size={14} /> Master's Insight
                  </div>
                  <p className="text-2xl text-white font-serif leading-[1.8] italic tracking-tight opacity-90 px-4">
                    "{result.meaning}"
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-white/5 pt-16">
                  {/* 운명의 경고 */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-bold text-red-400/40 tracking-[0.3em] uppercase flex items-center gap-2">
                      <AlertCircle size={14} /> The Caution
                    </h4>
                    <div className="space-y-8">
                      <p className="text-red-100 font-bold text-lg leading-snug">{result.caution.summary}</p>
                      <p className="text-white/40 leading-[2.2] text-md whitespace-pre-wrap font-serif italic">
                        {result.caution.story}
                      </p>
                    </div>
                  </section>

                  {/* 행운의 징조 */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-bold text-emerald-400/40 tracking-[0.3em] uppercase flex items-center gap-2">
                      <TrendingUp size={14} /> The Good Omen
                    </h4>
                    <div className="space-y-8">
                      <p className="text-emerald-100 font-bold text-lg leading-snug">{result.goodOmen.summary}</p>
                      <p className="text-white/40 leading-[2.2] text-md whitespace-pre-wrap font-serif italic">
                        {result.goodOmen.story}
                      </p>
                    </div>
                  </section>
                </div>

                {/* 행운의 숫자 */}
                <section className="flex flex-col items-center pt-12 border-t border-white/5">
                  <span className="text-white/10 text-[10px] font-bold tracking-[0.8em] mb-12 uppercase italic">Destiny Numbers</span>
                  <div className="flex gap-6 flex-wrap justify-center">
                    {result.luckyNumbers.map((num, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                        className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-xl font-serif text-white/80 bg-white/5 backdrop-blur-sm shadow-xl"
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
