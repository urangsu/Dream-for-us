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

  // 결과가 생성되면 하단으로 자동 스크롤하되, 결과창 자체에 내부 스크롤 부여
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  // 엔터 키 처리: Enter는 제출, Shift + Enter는 줄바꿈
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
      
      {/* 1. 입력창 섹션: 로봇(Spline) 하단에 맞춤 배치 */}
      <div className={`w-full px-4 transition-all duration-1000 ${result ? 'mt-[10vh]' : 'mt-[50vh]'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
              <label className="text-purple-200/80 text-sm font-medium flex items-center gap-2">
                <Moon size={16} className="text-purple-400" /> 
                꿈의 조각을 입력하고 Enter를 눌러주세요...
              </label>
              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="어젯밤 어떤 꿈을 꾸셨나요? (Shift + Enter로 줄바꿈)"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[120px] max-h-[200px] resize-none text-lg leading-relaxed transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !dream.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg overflow-hidden"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin" size={20} />
                    해몽 중...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    운명의 해석 시작
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* 2. 결과 섹션: 입력창 바로 아래 자연스럽게 등장 및 내부 스크롤 */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full px-4 mt-8 pb-20"
          >
            <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-1 shadow-2xl overflow-hidden max-h-[70vh] flex flex-col">
              
              {/* 결과창 내부 스크롤 영역 */}
              <div className="overflow-y-auto p-8 space-y-10 custom-scrollbar">
                
                {/* 핵심 의미 */}
                <section className="relative">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 flex items-center gap-3">
                    <Sun size={24} className="text-purple-400" /> 해몽가의 통찰
                  </h3>
                  <p className="text-xl text-purple-100/90 leading-relaxed font-light italic border-l-4 border-purple-500/30 pl-6">
                    "{result.meaning}"
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 운명의 경고 */}
                  <section className="space-y-4">
                    <h4 className="text-lg font-bold text-red-400/90 flex items-center gap-2">
                      <AlertCircle size={18} /> 운명의 경고
                    </h4>
                    <div className="bg-red-500/5 rounded-2xl p-5 border border-red-500/10">
                      <p className="text-red-200 font-bold mb-3">{result.caution.summary}</p>
                      <p className="text-red-100/70 leading-relaxed text-md whitespace-pre-wrap font-serif">
                        {result.caution.story}
                      </p>
                    </div>
                  </section>

                  {/* 행운의 징조 */}
                  <section className="space-y-4">
                    <h4 className="text-lg font-bold text-emerald-400/90 flex items-center gap-2">
                      <TrendingUp size={18} /> 하늘의 길조
                    </h4>
                    <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10">
                      <p className="text-emerald-200 font-bold mb-3">{result.goodOmen.summary}</p>
                      <p className="text-emerald-100/70 leading-relaxed text-md whitespace-pre-wrap font-serif">
                        {result.goodOmen.story}
                      </p>
                    </div>
                  </section>
                </div>

                {/* 행운의 숫자 */}
                <section className="flex flex-col items-center pt-6 border-t border-white/5">
                  <span className="text-white/30 text-xs font-medium tracking-[0.4em] mb-6">FORTUNE NUMBERS</span>
                  <div className="flex gap-3 flex-wrap justify-center">
                    {result.luckyNumbers.map((num, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-lg"
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
