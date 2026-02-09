"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { getProject } from '@/lib/firestore/projects';
import { subscribeToProjectSales, getProjectSalesStats } from '@/lib/firestore/sales';
import { getProjectProducts } from '@/lib/firestore/products';
import { useAppStore } from '@/store/zustand/app-store';
import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Stack,
  Grid,
  Badge,
  Table,
  Paper,
  Tabs,
} from '@mantine/core';
import { IconCashRegister, IconTrendingUp, IconShoppingBag, IconChartBar } from '@tabler/icons-react';
import { gsap } from 'gsap';
import { Sale, Product } from '@/types';
import SalesCharts from '@/components/sales/sales-charts';

export default function SalesPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuthStore();
  const { setCurrentProject } = useAppStore();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalQuantity: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadProject = async () => {
    try {
      const project = await getProject(projectId);
      if (project) {
        setCurrentProject(project);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const projectProducts = await getProjectProducts(projectId);
      setProducts(projectProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    loadProject();
    loadProducts();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    // Subscribe to real-time sales
    const unsubscribe = subscribeToProjectSales(
      projectId,
      (updatedSales) => {
        setSales(updatedSales);
        const totalRevenue = updatedSales.reduce((sum, sale) => sum + sale.total, 0);
        const totalQuantity = updatedSales.reduce((sum, sale) => sum + sale.qty, 0);
        setStats({
          totalSales: updatedSales.length,
          totalRevenue,
          totalQuantity,
        });
      },
      100
    );

    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    // GSAP animation
    gsap.from('.sales-card', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
  }, [sales]);

  return (
    <DashboardLayout>
      <Container size="xl" py="xl">
        <Title order={1} mb="xl">
          Sales Dashboard
        </Title>

        <Grid mb="xl">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="sales-card">
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Total Sales
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.totalSales}
                  </Text>
                </div>
                <IconCashRegister size={40} color="blue" />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="sales-card">
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Total Revenue
                  </Text>
                  <Text fw={700} size="xl">
                    ${stats.totalRevenue.toFixed(2)}
                  </Text>
                </div>
                <IconTrendingUp size={40} color="green" />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="sales-card">
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Items Sold
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.totalQuantity}
                  </Text>
                </div>
                <IconShoppingBag size={40} color="orange" />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Tabs defaultValue="sales" mb="xl">
          <Tabs.List>
            <Tabs.Tab value="sales" leftSection={<IconCashRegister size={16} />}>
              Sales
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="sales" pt="xl">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                Recent Sales
              </Title>
              {sales.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  No sales yet
                </Text>
              ) : (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Product</Table.Th>
                      <Table.Th>Quantity</Table.Th>
                      <Table.Th>Total</Table.Th>
                      <Table.Th>Sold By</Table.Th>
                      <Table.Th>Date</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sales.map((sale) => (
                      <Table.Tr key={sale.id}>
                        <Table.Td>{products.find(p => p.id === sale.productId)?.name || sale.productName || 'Unknown'}</Table.Td>
                        <Table.Td>
                          <Badge variant="light">{sale.qty}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>${sale.total.toFixed(2)}</Text>
                        </Table.Td>
                        <Table.Td>{sale.soldByName || sale.soldBy}</Table.Td>
                        <Table.Td>
                          {sale.createdAt
                            ? new Date(sale.createdAt).toLocaleString()
                            : 'N/A'}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="xl">
            {sales.length > 0 ? (
              <SalesCharts sales={sales} products={products} />
            ) : (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text c="dimmed" ta="center">
                  No sales to analyze. Make some sales to see analytics.
                </Text>
              </Card>
            )}
          </Tabs.Panel>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
}
