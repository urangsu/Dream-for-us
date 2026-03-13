import SplineHero from '@/components/SplineHero';
import DreamForm from '@/components/DreamForm';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <SplineHero />

      {/* Content Layer: No footer, no extra elements */}
      <DreamForm />
    </main>
  );
}
