'use client';

import Spline from '@splinetool/react-spline';
import { useRef } from 'react';

export default function SplineHero() {
  const splineRef = useRef<any>(null);

  function onLoad(splineApp: any) {
    splineRef.current = splineApp;
    
    // Spline 앱이 로드되면 모든 오브젝트를 순회하며 텍스트를 숨깁니다.
    const objects = splineApp.getAllObjects();
    objects.forEach((obj: any) => {
      // 텍스트 관련 오브젝트는 무조건 숨김 (디자인 미니멀리즘을 위해)
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
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508] pointer-events-none" />
    </div>
  );
}
