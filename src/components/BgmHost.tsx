'use client';

import { ReactNode } from 'react';
import { BgmProvider, useBgm } from '@/hooks/useBgm';

function BgmIframe() {
  const { isPlaying } = useBgm();

  if (!isPlaying) return null;

  return (
    <div
      className="fixed z-[-1] opacity-0 pointer-events-none"
      style={{ width: 1, height: 1, left: -9999, top: -9999 }}
    >
      <iframe
        frameBorder="no"
        marginWidth={0}
        marginHeight={0}
        width={1}
        height={1}
        allow="autoplay"
        src="https://music.163.com/outchain/player?type=2&id=2075140388&auto=1&height=66"
      />
    </div>
  );
}

export function BgmHost({ children }: { children: ReactNode }) {
  return (
    <BgmProvider>
      <BgmIframe />
      {children}
    </BgmProvider>
  );
}
