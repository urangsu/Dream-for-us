'use client';

import Spline from '@splinetool/react-spline';
import { useRef } from 'react';

export default function SplineHero() {
  const splineRef = useRef<any>(null);

  function onLoad(splineApp: any) {
    splineRef.current = splineApp;
    
    // 텍스트 숨김 처리
    const objects = splineApp.getAllObjects();
    objects.forEach((obj: any) => {
      if (
        obj.type === 'Text' || 
        obj.name.toLowerCase().includes('text') || 
        obj.name.toLowerCase().includes('touch') ||
        obj.name.toLowerCase().includes('get') ||
        obj.name.toLowerCase().includes('social')
      ) {
        obj.visible = false;
      }
    });
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Spline
        scene="https://prod.spline.design/jbvk5NDyYjzNdcvs/scene.splinecode" 
        onLoad={onLoad}
        className="w-full h-full"
      />
      {/* 하단 페이드 효과를 주어 입력창이 더 잘 보이게 함 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]/80 pointer-events-none" />
    </div>
  );
}
