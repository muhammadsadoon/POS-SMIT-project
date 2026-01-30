'use client';

import React, { useState, useEffect } from 'react';
import {
  AppShell,
  Text,
  Burger,
  useMantineTheme,
  NavLink,
  Group,
  Avatar,
  Menu,
  Button,
  Paper,
} from '@mantine/core';
import {
  IconDashboard,
  IconBox,
  IconShoppingCart,
  IconReport,
  IconSettings,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children, title }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ added
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const navItems = [
    { icon: IconDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: IconBox, label: 'Products', href: '/products' },
    { icon: IconShoppingCart, label: 'Projects', href: '/projects' },
    { icon: IconReport, label: 'Reports', href: '/reports' },
    { icon: IconSettings, label: 'Settings', href: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? 'linear-gradient(135deg, #020617, #0f172a)'
              : 'linear-gradient(135deg, #f8fafc, #eef2ff)',
        },
      }}
    >
      <AppShell.Header>
        <Paper h={70} px="md" withBorder>
          <Group h="100%" justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                hiddenFrom="sm"
              />
              <Text fw={700}>{title}</Text>
            </Group>

            <Menu width={200} shadow="md">
              <Menu.Target>
                <Button
                  variant="light"
                  radius="xl"
                  leftSection={<Avatar size="sm" />}
                >
                  {mounted ? (user?.name || 'User') : 'Loading...'}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  href="/settings"
                  leftSection={<IconUser size={14} />}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Paper>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            component={Link}
            href={item.href}
            label={item.label}
            leftSection={<item.icon size={16} />}
            active={pathname === item.href}
            radius="md"
            mb={4}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
