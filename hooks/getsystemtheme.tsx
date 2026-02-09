import { useEffect, useState } from 'react';

export default function useSystemTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setTheme(media.matches ? 'dark' : 'light');

    update(); // set initial value
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  return theme;
}
