'use client';

import { ReactNode } from 'react';
import { BgmProvider, useBgm } from '@/hooks/useBgm';

function BgmIframe() {
  const { isPlaying } = useBgm();

  // 只在生产环境（HTTPS）启用网易云 BGM，本地开发时禁用避免跨域问题
  const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';

  // isPlaying 控制 iframe 是否渲染
  // 全局 Context 确保切换栏目时状态不变
  if (!isPlaying || !isProduction) return null;

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
        allow="autoplay; encrypted-media; accelerometer; gyroscope"
        referrerPolicy="no-referrer-when-downgrade"
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
