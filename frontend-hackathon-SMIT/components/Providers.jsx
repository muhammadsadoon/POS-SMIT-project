'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import store from '@/store';
import theme from '@/lib/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/app/globals.css';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </Provider>
  );
}
