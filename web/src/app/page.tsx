import SplineHero from '@/components/SplineHero';
import DreamForm from '@/components/DreamForm';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* 3D Background */}
      <SplineHero />

      {/* Content Layer */}
      <DreamForm />
      
      {/* Decorative footer */}
      <footer className="relative z-10 py-10 text-center text-gray-500 text-sm">
        <p>© 2024 Dream Oracle. All your dreams analyzed by AI.</p>
      </footer>
    </main>
  );
}
