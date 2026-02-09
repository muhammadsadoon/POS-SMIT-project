"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import { useAppStore } from '@/store/zustand/app-store';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { getUserProjects } from '@/lib/firestore/projects';
import { subscribeToProjectSales, getProjectSalesStats } from '@/lib/firestore/sales';
import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Stack,
  Grid,
  Badge,
  RingProgress,
  Paper,
  Button,
  Button as MantineButton,
} from '@mantine/core';
import { IconShoppingBag, IconCashRegister, IconTrendingUp } from '@tabler/icons-react';
import { gsap } from 'gsap';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { projects, setProjects, currentProject } = useAppStore();
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalQuantity: 0,
  });

  useEffect(() => {
    // GSAP animation for cards
    gsap.from('.dashboard-card', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      if (user?.uid) {
        try {
          const userProjects = await getUserProjects(user.uid);
          setProjects(userProjects);
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      }
    };

    loadProjects();
  }, [user, setProjects]);

  useEffect(() => {
    if (!currentProject) return;

    const loadSalesStats = async () => {
      try {
        const stats = await getProjectSalesStats(currentProject.id);
        setSalesStats(stats);
      } catch (error) {
        console.error('Error loading sales stats:', error);
      }
    };

    loadSalesStats();

    // Subscribe to real-time sales
    const unsubscribe = subscribeToProjectSales(
      currentProject.id,
      (sales) => {
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalQuantity = sales.reduce((sum, sale) => sum + sale.qty, 0);
        setSalesStats({
          totalSales: sales.length,
          totalRevenue,
          totalQuantity,
        });
      },
      100
    );

    return () => unsubscribe();
  }, [currentProject]);

  return (
    <DashboardLayout>
      <Container size="xl" py="xl">
        <Title order={1} mb="xl">
          Dashboard
        </Title>

        {!currentProject ? (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center" gap="md">
              <Text size="lg" c="dimmed">
                No project selected
              </Text>
              <Text size="sm" c="dimmed">
                Create a new project or select an existing one to get started
              </Text>
              <MantineButton
                onClick={() => router.push('/dashboard/projects')}
                color="blue"
              >
                Go to Projects
              </MantineButton>
            </Stack>
          </Card>
        ) : (
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="dashboard-card"
              >
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                      Total Sales
                    </Text>
                    <Text fw={700} size="xl">
                      {salesStats.totalSales}
                    </Text>
                  </div>
                  <IconCashRegister size={40} color="blue" />
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="dashboard-card"
              >
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                      Total Revenue
                    </Text>
                    <Text fw={700} size="xl">
                      ${salesStats.totalRevenue.toFixed(2)}
                    </Text>
                  </div>
                  <IconTrendingUp size={40} color="green" />
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="dashboard-card"
              >
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                      Items Sold
                    </Text>
                    <Text fw={700} size="xl">
                      {salesStats.totalQuantity}
                    </Text>
                  </div>
                  <IconShoppingBag size={40} color="orange" />
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        )}

        <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
          <Title order={3} mb="md">
            Quick Actions
          </Title>
          <Group>
            <MantineButton
              onClick={() => router.push('/dashboard/projects')}
              color="blue"
            >
              Manage Projects
            </MantineButton>
            {currentProject && (
              <>
                <MantineButton
                  onClick={() =>
                    router.push(`/dashboard/projects/${currentProject.id}/products`)
                  }
                  color="green"
                >
                  Manage Products
                </MantineButton>
                <MantineButton
                  onClick={() => router.push('/staff')}
                  color="violet"
                >
                  Open POS
                </MantineButton>
              </>
            )}
          </Group>
        </Card>
      </Container>
    </DashboardLayout>
  );
}
