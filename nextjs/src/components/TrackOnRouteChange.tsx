// src/components/TrackOnRouteChange.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TrackOnRouteChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 尊重 DNT
    if (navigator.doNotTrack === '1') return;

    const vid = document.cookie.split('; ')
      .find(s => s.startsWith('dl_vid='))
      ?.split('=')[1];

    const payload = {
      path: pathname || '/',
      referrer: document.referrer || '',
      locale: document.documentElement.lang || 'ja',
      visitor_id: vid || null,
    };

    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon('/api/track', blob);
  }, [pathname, searchParams]); // 包含 search 变化

  return null;
}

