'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppShell,
  Group,
  Burger,
  Text,
  ScrollArea,
  Drawer,
  useMantineTheme,
  Center,
} from '@mantine/core';
import {
  IconHome,
  IconUsers,
  IconSettings,
  IconBell,
  IconLogout,
  IconListCheck,
  IconMapPin,
} from '@tabler/icons-react';

export default function DashboardLayout({ children }) {
  const theme = useMantineTheme();
  const pathname = usePathname();

  const [opened, setOpened] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Dashboard', icon: IconHome, href: '/' },
    { label: 'Helpers', icon: IconUsers, href: '/helpers' },
    { label: 'Requests', icon: IconListCheck, href: '/requests' },
    { label: 'Locations', icon: IconMapPin, href: '/locations' },
    { label: 'Notifications', icon: IconBell, href: '/notifications' },
    { label: 'Settings', icon: IconSettings, href: '/settings' },
  ];

  const NavItem = ({ link }) => {
    const active = pathname === link.href;

    return (
      <Link href={link.href} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
        <Group
          p="sm"
          style={{
            cursor: 'pointer',
            borderRadius: 12,
            background: active ? theme.colors.green[6] : 'transparent',
            color: active ? '#fff' : theme.colors.gray[4],
            width: opened ? '100%' : 48,
            margin: '0 auto',
          }}
          onMouseEnter={(e) => {
            if (!active) e.currentTarget.style.background = theme.colors.dark[5];
          }}
          onMouseLeave={(e) => {
            if (!active) e.currentTarget.style.background = 'transparent';
          }}
        >
          <link.icon size={20} />
          {opened && <Text ml="sm" size="sm">{link.label}</Text>}
        </Group>
      </Link>
    );
  };

  const SidebarContent = () => (
    <ScrollArea h="100%" px={opened ? 'xs' : 0}>
      {links.map((link) => (
        <NavItem key={link.label} link={link} />
      ))}
    </ScrollArea>
  );

  return (
    <>
      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        padding="xs"
        size="xs"
        hiddenFrom="sm"
        title="Menu"
      >
        <SidebarContent />
      </Drawer>

      <AppShell
        header={{ height: 60 }}
        navbar={{ width: opened ? 220 : 72, breakpoint: 'sm' }}
        padding="md"
      >
        <AppShell.Header p="xs">
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                visibleFrom="sm"
              />
              <Burger
                opened={mobileOpen}
                onClick={() => setMobileOpen(true)}
                size="sm"
                hiddenFrom="sm"
              />
              <Text fw={700}>Road Helper</Text>
            </Group>
            <IconLogout />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar
          p="xs"
          visibleFrom="sm"
          width={{ sm: opened ? 220 : 72 }}
          bg={theme.colors.dark[7]}
        >
          <SidebarContent />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
