'use client';

import React from 'react';
import { Card, Stack, Title, Text, SimpleGrid, LineChart } from '@mantine/core';
import { DashboardLayout } from '@/components/ui/dashboard-layout';

export default function ReportsPage() {
  return (
    <DashboardLayout
      title="Reports"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Reports', href: '/reports' },
      ]}
    >
      <Stack gap="lg">
        <Card withBorder radius="md" p="md">
          <Title order={3} mb="md">
            Sales Overview
          </Title>
          <Text c="dimmed">
            Sales reports and analytics coming soon...
          </Text>
        </Card>

        <Card withBorder radius="md" p="md">
          <Title order={3} mb="md">
            Inventory Reports
          </Title>
          <Text c="dimmed">
            Detailed inventory reports coming soon...
          </Text>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
