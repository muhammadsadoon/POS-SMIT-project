"use client";

import { useState } from 'react';
import { useAuthStore } from '@/store/zustand/auth-store';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Stack,
  Button,
  Select,
  Alert,
  Paper,
} from '@mantine/core';
import { IconUser, IconShield, IconSettings } from '@tabler/icons-react';

export default function SettingsPage() {
  const { user, updateUserRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRoleChange = async (newRole: string) => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      await updateUserRole(newRole);
      setMessage({ type: 'success', text: `Role updated to ${newRole} successfully!` });
    } catch (error) {
      console.error('Error updating role:', error);
      setMessage({ type: 'error', text: 'Failed to update role. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container size="xl" py="xl">
        <Title order={1} mb="xl">
          Settings
        </Title>

        <Stack gap="xl">
          {/* User Profile Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconUser size={24} />
              <Title order={3}>User Profile</Title>
            </Group>
            <Stack gap="sm">
              <Text><strong>Name:</strong> {user?.name || 'N/A'}</Text>
              <Text><strong>Email:</strong> {user?.email || 'N/A'}</Text>
              <Text><strong>Current Role:</strong> {user?.role || 'N/A'}</Text>
            </Stack>
          </Card>

          {/* Role Management Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconShield size={24} />
              <Title order={3}>Role Management</Title>
            </Group>
            <Text mb="md" c="dimmed">
              Change your user role. Note: This action may affect your access to certain features.
            </Text>

            {message && (
              <Alert color={message.type === 'success' ? 'green' : 'red'} mb="md">
                {message.text}
              </Alert>
            )}

            <Group>
              <Select
                label="Select Role"
                placeholder="Choose a role"
                data={[
                  { value: 'staff', label: 'Staff' },
                  { value: 'admin', label: 'Admin' },
                ]}
                defaultValue={user?.role}
                onChange={(value) => {
                  if (value && value !== user?.role) {
                    handleRoleChange(value);
                  }
                }}
                disabled={loading}
              />
            </Group>
          </Card>

          {/* Additional Settings Placeholder */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconSettings size={24} />
              <Title order={3}>Additional Settings</Title>
            </Group>
            <Text c="dimmed">
              More settings options will be added here in the future.
            </Text>
          </Card>
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
