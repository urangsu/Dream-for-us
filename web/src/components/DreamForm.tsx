'use client';

import { useState, useRef, useEffect } from 'react';
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

  // 결과가 생성되면 하단으로 자동 스크롤
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

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
    <div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen">
      
      {/* 1. 입력창 섹션 (화면 중하단 배치) */}
      <div className={`flex items-center justify-center transition-all duration-700 pt-32 pb-16 ${result ? 'mt-10' : 'mt-[20vh]'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-4"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
              <label className="text-purple-200/70 text-sm font-medium flex items-center gap-2 mb-2">
                <Moon size={16} /> 어젯밤의 별이 속삭인 이야기를 들려주세요...
              </label>
              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="어떤 꿈을 꾸셨나요? 운명의 실타래를 풀어드릴게요."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[150px] resize-none text-lg leading-relaxed"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !dream.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin" />
                    별의 목소리를 듣는 중...
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    운명의 해석 시작하기
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* 2. 결과 섹션 (입력창 아래 등장) */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full px-4 pb-32 space-y-12 mt-12"
          >
            {/* 꿈의 의미 */}
            <section className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                <Sun className="text-purple-400" /> 타로 마스터의 통찰
              </h3>
              <p className="text-xl text-purple-100/90 leading-relaxed font-light italic">
                "{result.meaning}"
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 운명의 경고 (Caution) */}
              <section className="bg-red-500/5 backdrop-blur-md rounded-3xl p-8 border border-red-500/20 shadow-xl relative group">
                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} /> 운명의 경고
                </h3>
                <div className="space-y-4">
                  <div className="text-red-200 font-bold border-b border-red-500/20 pb-2">
                    {result.caution.summary}
                  </div>
                  <div className="text-red-100/80 leading-loose text-lg whitespace-pre-wrap font-serif">
                    {result.caution.story}
                  </div>
                </div>
              </section>

              {/* 행운의 징조 (Good Omen) */}
              <section className="bg-emerald-500/5 backdrop-blur-md rounded-3xl p-8 border border-emerald-500/20 shadow-xl relative group">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} /> 하늘이 내린 길조
                </h3>
                <div className="space-y-4">
                  <div className="text-emerald-200 font-bold border-b border-emerald-500/20 pb-2">
                    {result.goodOmen.summary}
                  </div>
                  <div className="text-emerald-100/80 leading-loose text-lg whitespace-pre-wrap font-serif">
                    {result.goodOmen.story}
                  </div>
                </div>
              </section>
            </div>

            {/* 행운의 숫자 */}
            <section className="flex flex-col items-center py-8">
              <h3 className="text-white/50 text-sm font-medium mb-6 uppercase tracking-[0.3em]">Fortune Numbers</h3>
              <div className="flex gap-4 flex-wrap justify-center">
                {result.luckyNumbers.map((num, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-inner shadow-white/10"
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
