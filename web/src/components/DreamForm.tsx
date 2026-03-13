'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Result {
  meaning: string;
  caution: string;
  goodOmen: string;
}

export default function DreamForm() {
  const [dream, setDream] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

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

      if (!response.ok) {
        throw new Error('Failed to analyze dream');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('꿈 분석 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 mb-4"
          >
            어젯밤의 무의식을 <br className="md:hidden" /> 읽어드립니다
          </motion.h1>
          <p className="text-gray-400 text-lg">당신이 머물렀던 그 꿈의 조각들을 적어주세요.</p>
        </div>

        {!result && (
          <form onSubmit={handleSubmit} className="glass p-8 space-y-6">
            <div className="relative">
              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="꿈의 내용을 자세히 기억나는 대로 입력해 주세요. (예: 숲속에서 흰 사슴을 만난 꿈)"
                className="w-full h-44 bg-transparent border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none leading-relaxed"
                disabled={loading}
              />
              <div className="absolute bottom-4 right-4 text-gray-600 text-sm">
                현재 {dream.length}자 입력됨
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !dream.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin w-5 h-5 text-yellow-300" />
                  무의식의 세계를 분석하고 있습니다...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  꿈의 의미 확인하기
                </>
              )}
            </button>
          </form>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="glass p-8 space-y-8">
                <section>
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="text-xl font-bold">꿈의 의미</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{result.meaning}</p>
                </section>

                <section>
                  <div className="flex items-center gap-2 text-amber-400 mb-3">
                    <AlertCircle className="w-5 h-5" />
                    <h2 className="text-xl font-bold">주의사항</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{result.caution}</p>
                </section>

                <section>
                  <div className="flex items-center gap-2 text-emerald-400 mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <h2 className="text-xl font-bold">좋은 일</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{result.goodOmen}</p>
                </section>

                <button
                  onClick={() => setResult(null)}
                  className="w-full py-3 border border-white/10 hover:bg-white/5 text-gray-400 rounded-xl transition-all"
                >
                  다른 꿈 해석하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
