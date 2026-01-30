'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import store from '@/store';
import theme from '@/lib/theme';
import { hydrate } from '@/store/slices/authSlice';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/app/globals.css';

export function Providers({ children }) {
  useEffect(() => {
    store.dispatch(hydrate());
  }, []);

  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </Provider>
  );
}
