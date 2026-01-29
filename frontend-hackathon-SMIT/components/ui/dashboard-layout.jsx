'use client';

import React, { useState, useEffect } from 'react';
import { AppShell, Container, Box, Title, Breadcrumbs, Anchor, Group } from '@mantine/core';
import { Sidebar } from '@/components/layouts/Sidebar';
import { useProtectedRoute } from '@/hooks/useAuth';

export function DashboardLayout({ children, breadcrumbs = [], title = '' }) {
  const isAuthenticated = useProtectedRoute();
  const [active, setActive] = useState('Dashboard');
  const [mobileOpened, setMobileOpened] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const items = breadcrumbs.map((item, index) => (
    <Anchor key={index} href={item.href} underline="hover">
      {item.label}
    </Anchor>
  ));

  return (
    <AppShell
      navbar={<Sidebar active={active} onNavClick={setActive} />}
      header={
        <Box component="header" style={{ height: 70 }} px="md">
          <Group h="100%" px="md" justify="space-between">
            <div>
              {title && <Title order={2}>{title}</Title>}
              {breadcrumbs.length > 0 && (
                <Breadcrumbs separator="/" mt="xs">
                  {items}
                </Breadcrumbs>
              )}
            </div>
          </Group>
        </Box>
      }
      padding="md"
    >
      <Container size="xl" py="md">
        {children}
      </Container>
    </AppShell>
  );
}
