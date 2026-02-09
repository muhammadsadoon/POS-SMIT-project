"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { pageTransitionIn } from '@/lib/animations/page-transitions';

export default function PageTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (contentRef.current) {
        pageTransitionIn(contentRef.current);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  // For auth pages, don't apply opacity animation to avoid conflicts
  const isAuthPage = pathname?.startsWith('/auth');

  // Prevent hydration mismatch by only rendering transitions after mount
  if (!mounted) {
    return <>{children}</>;
  }

  // For auth pages, render without wrapper to avoid conflicts
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div ref={contentRef} style={{ opacity: 1 }}>
      {children}
    </div>
  );
}
