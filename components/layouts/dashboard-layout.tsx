"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import { useAppStore } from '@/store/zustand/app-store';
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink,
  Avatar,
  Menu,
  UnstyledButton,
  Stack,
  Badge,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconDashboard,
  IconShoppingBag,
  IconUsers,
  IconLogout,
  IconSettings,
  IconBuildingStore,
  IconCashRegister,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { gsap } from 'gsap';
import AuthGuard from '@/components/auth/auth-guard';
import { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requireRole?: UserRole;
}

export default function DashboardLayout({
  children,
  requireRole,
}: DashboardLayoutProps) {
  const [opened, setOpened] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentProject, sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  useEffect(() => {
    // GSAP animation for sidebar
    if (opened) {
      gsap.to('.sidebar', {
        x: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to('.sidebar', {
        x: -300,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [opened]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const canManageProducts = user?.role === 'admin' || user?.role === 'manager';
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      label: 'Dashboard',
      icon: IconDashboard,
      href: '/dashboard',
      roles: ['admin', 'manager', 'staff'] as UserRole[],
    },
    {
      label: 'Projects',
      icon: IconBuildingStore,
      href: '/dashboard/projects',
      roles: ['admin', 'manager', 'staff'] as UserRole[],
    },
    ...(currentProject
      ? [
          {
            label: 'Products',
            icon: IconShoppingBag,
            href: `/dashboard/projects/${currentProject.id}/products`,
            roles: ['admin', 'manager', 'staff'] as UserRole[],
          },
          {
            label: 'Sales',
            icon: IconCashRegister,
            href: `/dashboard/projects/${currentProject.id}/sales`,
            roles: ['admin', 'manager', 'staff'] as UserRole[],
          },
          {
            label: 'Members',
            icon: IconUsers,
            href: `/dashboard/projects/${currentProject.id}/members`,
            roles: ['admin', 'manager'] as UserRole[],
          },
        ]
      : []),
    {
      label: 'POS (Staff)',
      icon: IconCashRegister,
      href: '/staff',
      roles: ['admin', 'manager', 'staff'] as UserRole[],
    },
  ].filter((item) => item.roles.includes(user?.role || 'staff'));

  return (
    <AuthGuard requireAuth={true} requiredRole={requireRole}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: sidebarCollapsed ? 60 : 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={() => setOpened(!opened)}
                hiddenFrom="sm"
                size="sm"
              />
              <Group gap="xs">
                <IconShoppingBag size={24} color="var(--mantine-color-blue-6)" />
                <Text fw={700} size="lg">
                  Store Manager
                </Text>
              </Group>
            </Group>
            <Group>
              {currentProject && (
                <Badge variant="light" color="blue" size="lg">
                  {currentProject.name}
                </Badge>
              )}
              <ThemeToggle />
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="xs">
                      <Avatar
                        src={user?.photoURL}
                        alt={user?.name || 'User'}
                        radius="xl"
                        size="sm"
                      >
                        {user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {user?.name || 'User'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {user?.role || 'staff'}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconSettings size={14} />}
                    onClick={() => router.push('/dashboard/settings')}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
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
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" className="sidebar">
          <Stack gap="xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.href} label={item.label} position="right">
                    <UnstyledButton
                      onClick={() => {
                        router.push(item.href);
                        setOpened(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? 'var(--mantine-color-blue-1)' : 'transparent',
                        color: isActive ? 'var(--mantine-color-blue-6)' : 'inherit',
                      }}
                    >
                      <Icon size={16} />
                    </UnstyledButton>
                  </Tooltip>
                );
              } else {
                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    leftSection={<Icon size={16} />}
                    active={isActive}
                    onClick={() => {
                      router.push(item.href);
                      setOpened(false);
                    }}
                  />
                );
              }
            })}
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>
          <div className="dashboard-content">{children}</div>
        </AppShell.Main>
      </AppShell>
    </AuthGuard>
  );
}
