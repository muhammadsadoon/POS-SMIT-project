"use client";

import { gsap } from 'gsap';

export const pageTransitionIn = (element: HTMLElement | null) => {
  if (!element) return;

  // Ensure element is visible before animating
  gsap.set(element, { opacity: 1, y: 0 });
  
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }
  );
};

export const pageTransitionOut = (element: HTMLElement | null, callback?: () => void) => {
  if (!element) {
    callback?.();
    return;
  }

  gsap.to(element, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: callback,
  });
};

export const cardHoverAnimation = (element: HTMLElement | null) => {
  if (!element) return;

  const handleMouseEnter = () => {
    gsap.to(element, {
      scale: 1.05,
      y: -5,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

export const staggerChildren = (
  parentSelector: string,
  childSelector: string,
  delay: number = 0.1
) => {
  gsap.from(`${parentSelector} ${childSelector}`, {
    opacity: 0,
    y: 30,
    duration: 0.5,
    stagger: delay,
    ease: 'power2.out',
  });
};
