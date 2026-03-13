import SplineHero from '@/components/SplineHero';
import DreamForm from '@/components/DreamForm';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050508] overflow-y-auto overflow-x-hidden flex flex-col items-center">
      {/* 1. 화면 중앙: 3D 로봇 섹션 */}
      <div className="w-full h-[60vh] flex items-center justify-center relative">
        <SplineHero />
      </div>

      {/* 2. 로봇 하단: 입력창 및 결과창 섹션 (DreamForm) */}
      <div className="w-full max-w-4xl relative z-10 -mt-10">
        <DreamForm />
      </div>
    </main>
  );
}
