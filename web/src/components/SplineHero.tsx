'use client';

import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function SplineHero() {
  return (
    <div className="fixed inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/jbvk5NDyYjzNdcvs/scene.splinecode" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
    </div>
  );
}
