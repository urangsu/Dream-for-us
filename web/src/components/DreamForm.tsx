'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2, Wind, ArrowRight, Loader2, Copy, X, Moon, Stars, RotateCcw } from 'lucide-react';

interface Result {
  meaning: string;
  caution: string;
  goodOmen: string;
  luckyNumbers: number[];
}

export default function DreamForm() {
  const [dream, setDream] = useState('');
  const [submittedDream, setSubmittedDream] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [dream]);

  const copyToClipboard = (text: string, msg: string = '복사되었습니다.') => {
    navigator.clipboard.writeText(text);
    if (msg) alert(msg);
  };

  const triggerSubmit = async () => {
    if (!dream.trim() || loading) return;

    setSubmittedDream(dream);
    setLoading(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || '알 수 없는 오류가 발생했습니다.');
        setLoading(false);
        return;
      }

      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1000);

    } catch (error: any) {
      setErrorMessage(`연결에 실패했습니다.\n[사유]\n${error.message}`);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setDream('');
    setSubmittedDream('');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSubmit();
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center min-h-screen px-6 py-20 overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-sm flex flex-col gap-16 mt-[12vh]">
        
        {/* 입력 섹션 */}
        <motion.div
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="text-lg md:text-xl font-medium text-white tracking-[0.4em] font-['Malgun_Gothic']">
              당신의 꿈을 풀어드립니다
            </h1>
            <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-light">Ethereal Dream Oracle</p>
          </div>

          <div className="relative glass-minimal flex flex-col bg-white/[0.04] backdrop-blur-[40px] border border-white/10 rounded-2xl px-6 py-5 group hover:border-white/20 transition-all duration-1000">
            {loading && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-[1px] bg-white/20"
              />
            )}

            <textarea
              ref={textareaRef}
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="기억 너머의 이야기를 들려주세요..."
              rows={1}
              className="w-full bg-transparent border-none text-white/90 placeholder-white/20 focus:outline-none focus:ring-0 text-sm md:text-base py-3 font-normal resize-none leading-relaxed overflow-hidden font-['Malgun_Gothic']"
              style={{ minHeight: '2rem', maxHeight: '15rem' }}
              disabled={loading || !!result}
            />
            
            {!result && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-[10px] text-purple-300 tracking-widest font-['Malgun_Gothic']"
                      >
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="animate-pulse">해석 중...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={triggerSubmit}
                  disabled={loading || !dream.trim()}
                  className="p-2 text-white/40 hover:text-white/100 transition-all duration-700 disabled:opacity-0"
                >
                  <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* 결과 섹션 */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 40, filter: 'blur(15px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 pb-32"
            >
              <div className="text-center px-8 relative opacity-60">
                <p className="text-[11px] text-white/60 leading-relaxed font-['Malgun_Gothic'] italic font-light">
                  "{submittedDream}"
                </p>
              </div>

              <div className="glass-minimal p-10 rounded-[4rem] border border-white/10 bg-black/60 backdrop-blur-[60px] space-y-12 shadow-2xl relative">
                
                <section className="space-y-5">
                  <div className="flex items-center gap-2 text-purple-300 uppercase tracking-[0.4em] text-[10px] font-bold">
                    <Stars className="w-4 h-4" />
                    <span>해몽 (Insight)</span>
                  </div>
                  <p className="text-white text-base md:text-lg leading-[1.8] font-normal font-['Malgun_Gothic']">
                    {result.meaning}
                  </p>
                </section>

                <div className="grid grid-cols-1 gap-10 pt-10 border-t border-white/10">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-300/80 uppercase tracking-[0.3em] text-[9px] font-bold">
                      <Moon className="w-3.5 h-3.5" />
                      <span>주의 (Caution)</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed font-normal font-['Malgun_Gothic']">
                      {result.caution}
                    </p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-300/80 uppercase tracking-[0.3em] text-[9px] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>길조 (Omen)</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed font-normal font-['Malgun_Gothic']">
                      {result.goodOmen}
                    </p>
                  </section>
                </div>

                {/* 행운의 숫자 섹션 */}
                <div className="pt-10 border-t border-white/10 text-center">
                  <div className="flex items-center justify-center gap-2 text-[9px] tracking-[0.5em] text-white/30 uppercase mb-6 font-bold">
                    🍀 Lucky Numbers
                  </div>
                  <div className="flex justify-between gap-2 px-2">
                    {result.luckyNumbers.map((num, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-medium text-white/90"
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 하단 버튼: 극도로 미니멀하게 변경 (그라데이션 제거) */}
                <div className="flex flex-col gap-6 pt-4 items-center">
                  <button
                    onClick={handleReset}
                    className="text-[10px] tracking-[0.5em] text-white/20 hover:text-white/80 uppercase transition-all duration-1000 font-['Malgun_Gothic'] flex items-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    새로운 꿈 해석하기
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 에러 모달 */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 glass-minimal bg-red-500/5 border-red-500/10 rounded-3xl space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold font-['Malgun_Gothic'] uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" />
                  <span>별의 연결이 끊어졌습니다</span>
                </div>
                <button onClick={() => setErrorMessage(null)} className="text-white/20 hover:text-white/100 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/60 text-[11px] leading-relaxed font-mono select-all p-4">
                {errorMessage}
              </p>
              <button
                onClick={() => copyToClipboard(errorMessage, '에러 내용이 복사되었습니다.')}
                className="w-full py-2 text-white/20 hover:text-white/60 text-[10px] uppercase tracking-widest font-['Malgun_Gothic'] border border-white/5 rounded-xl transition-all"
              >
                Error Copy
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
