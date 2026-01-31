'use client';

import React from 'react';
import {
  Paper,
  Stack,
  UnstyledButton,
  Badge,
  Text,
  Group,
  Avatar,
  Menu,
  Divider,
  Box,
} from '@mantine/core';
import {
  IconDashboard,
  IconFolders,
  IconBox,
  IconArchive,
  IconReceipt,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import classes from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { label: 'Projects', icon: IconFolders, href: '/projects' },
  { label: 'Products', icon: IconBox, href: '/products' },
  { label: 'Stock', icon: IconArchive, href: '/stock' },
  { label: 'Sales', icon: IconReceipt, href: '/sales' },
  { label: 'Reports', icon: IconChartBar, href: '/reports' },
  { label: 'Settings', icon: IconSettings, href: '/settings' },
];

export function Sidebar({ active, onNavClick }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <Paper
      width={{ base: 280 }}
      p="md"
      className={classes.navbar}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Box style={{ flex: 1, overflowY: 'auto' }}>
        <div className={classes.header}>
          <Group justify="space-between" mb="xs">
            <Group gap="sm">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <Text fw={700} size="lg">
                Dukanhub
              </Text>
            </Group>
            <Badge>v1.0</Badge>
          </Group>
        </div>

        <Stack gap={0}>
          {navItems.map((item) => (
            <UnstyledButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => onNavClick?.(item.label)}
              className={classes.link}
              data-active={active === item.label || undefined}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" gap="sm">
                  <item.icon size={16} />
                  <Text size="sm">{item.label}</Text>
                </Group>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Box>

      <Box>
        <Divider />
        <Menu shadow="md" width={200} position="top-end">
          <Menu.Target>
            <UnstyledButton className={classes.user}>
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" gap="sm">
                  <Avatar src={null} alt={user?.name} color="blue" radius="xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Text size="sm" fw={500}>
                      {user?.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user?.email}
                    </Text>
                  </div>
                </Group>
                <IconChevronDown size={14} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item component={Link} href="/settings">
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={handleLogout}
              color="red"
              leftSection={<IconLogout size={14} />}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Paper>
  );
}
