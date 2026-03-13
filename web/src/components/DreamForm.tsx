'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
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

  // 결과 생성 시 해당 영역으로 부드럽게 스크롤
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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      
      {/* 1. 입력창 섹션 (로봇 하단 상자 위치에 맞게 조정) */}
      <div className={`w-full px-4 transition-all duration-1000 ${result ? 'mt-[15vh]' : 'mt-[58vh]'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="relative group">
            {/* 후광 효과 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="relative bg-[#0d0d12]/60 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl flex flex-col gap-6 shadow-2xl ring-1 ring-white/5">
              <label className="text-purple-300/40 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center gap-3">
                <Moon size={14} className="text-purple-400" /> 
                Tell me your dream
              </label>
              
              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="어젯밤의 꿈을 들려주세요 (Enter로 전송)"
                className="w-full bg-transparent border-none p-0 text-white placeholder:text-white/10 focus:outline-none min-h-[120px] max-h-[150px] resize-none text-2xl leading-relaxed font-serif"
                disabled={loading}
              />
              
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <div className="text-[10px] text-white/20 italic font-serif">Shift + Enter for new line</div>
                <button
                  type="submit"
                  disabled={loading || !dream.trim()}
                  className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-10 py-4 rounded-full border border-white/10 transition-all active:scale-[0.98] disabled:opacity-30 flex items-center gap-4 text-sm font-semibold group/btn"
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="animate-spin" size={18} />
                      별의 조각을 모으는 중...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="group-hover/btn:rotate-12 transition-transform" />
                      해석 시작
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* 2. 결과 섹션 (입력창 하단에 자연스럽게 배치) */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl px-4 mt-20 pb-40"
          >
            <div className="bg-[#050508]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-1 shadow-2xl overflow-hidden max-h-[75vh] flex flex-col">
              
              <div className="overflow-y-auto p-12 space-y-16 custom-scrollbar">
                
                {/* 30년 경력 마스터의 통찰 */}
                <section className="relative">
                  <div className="text-[10px] text-purple-400/40 tracking-[0.5em] mb-6 uppercase flex items-center gap-2">
                    <Sun size={14} /> Master's Insight
                  </div>
                  <p className="text-3xl text-white font-serif leading-[1.6] italic tracking-tight">
                    "{result.meaning}"
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-white/5 pt-16">
                  {/* 운명의 경고 */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-bold text-red-400/50 tracking-[0.3em] uppercase flex items-center gap-2">
                      <AlertCircle size={14} /> The Caution
                    </h4>
                    <div className="space-y-8">
                      <p className="text-red-100 font-bold text-xl leading-snug">{result.caution.summary}</p>
                      <p className="text-white/50 leading-[2.0] text-lg whitespace-pre-wrap font-serif italic">
                        {result.caution.story}
                      </p>
                    </div>
                  </section>

                  {/* 하늘의 길조 */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-bold text-emerald-400/50 tracking-[0.3em] uppercase flex items-center gap-2">
                      <TrendingUp size={14} /> The Good Omen
                    </h4>
                    <div className="space-y-8">
                      <p className="text-emerald-100 font-bold text-xl leading-snug">{result.goodOmen.summary}</p>
                      <p className="text-white/50 leading-[2.0] text-lg whitespace-pre-wrap font-serif italic">
                        {result.goodOmen.story}
                      </p>
                    </div>
                  </section>
                </div>

                {/* 행운의 숫자 (신비로운 배치) */}
                <section className="flex flex-col items-center pt-12 border-t border-white/5">
                  <span className="text-white/10 text-[10px] font-bold tracking-[0.8em] mb-12 uppercase">Destiny Numbers</span>
                  <div className="flex gap-6 flex-wrap justify-center">
                    {result.luckyNumbers.map((num, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                        className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-2xl font-serif text-white/90 bg-white/5 backdrop-blur-sm shadow-xl"
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
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.03);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
