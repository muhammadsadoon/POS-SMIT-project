'use client';

import React from 'react';
import { Card, Stack, Title, Text, Tabs, Switch, Group, Button } from '@mantine/core';
import DashboardLayout from '@/components/ui/dashboard-layout';
import { IconLock, IconBell, IconPalette } from '@tabler/icons-react';

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Settings', href: '/settings' },
      ]}
    >
      <Card withBorder radius="md" p="xl" maw={600} mx="auto">
        <Tabs defaultValue="general">
          <Tabs.List>
            <Tabs.Tab value="general" leftSection={<IconPalette size={14} />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={14} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconLock size={14} />}>
              Security
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general" pt="md">
            <Stack gap="md">
              <Title order={4}>General Settings</Title>
              <Text c="dimmed" size="sm">
                Configure your application preferences
              </Text>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="notifications" pt="md">
            <Stack gap="md">
              <Title order={4}>Notification Settings</Title>
              <Group>
                <Switch label="Email notifications" />
                <Switch label="Push notifications" />
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security" pt="md">
            <Stack gap="md">
              <Title order={4}>Security Settings</Title>
              <Button variant="outline">Change Password</Button>
              <Button variant="outline" color="red">
                Logout from all devices
              </Button>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </DashboardLayout>
  );
}
