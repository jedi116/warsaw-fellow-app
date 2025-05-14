'use client';

import React from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('./loading'), { ssr: false });

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}