"use client";

import { useEffect, useRef } from 'react';
import { Product, Sale } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Card, Title, Text, Stack, Grid, Group } from '@mantine/core';
import { gsap } from 'gsap';

interface SalesChartsProps {
  sales: Sale[];
  products: Product[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function SalesCharts({ sales, products }: SalesChartsProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      gsap.from(chartRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
      });
    }
  }, [sales]);

  // Prepare data for charts
  const salesByProduct = sales.reduce((acc, sale) => {
    const product = products.find(p => p.id === sale.productId)?.name || sale.productName || 'Unknown';
    if (!acc[product]) {
      acc[product] = { name: product, quantity: 0, revenue: 0 };
    }
    acc[product].quantity += sale.qty;
    acc[product].revenue += sale.total;
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const productSalesData = Object.values(salesByProduct)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Sales over time (daily)
  const salesOverTime = sales.reduce((acc, sale) => {
    const date = sale.createdAt ? new Date(sale.createdAt).toDateString() : 'Unknown';
    if (!acc[date]) {
      acc[date] = { date, sales: 0, revenue: 0 };
    }
    acc[date].sales += sale.qty;
    acc[date].revenue += sale.total;
    return acc;
  }, {} as Record<string, { date: string; sales: number; revenue: number }>);

  const timeData = Object.values(salesOverTime)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Last 14 days

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.qty, 0);

  return (
    <div ref={chartRef}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Stack>
              <Title order={4}>Sales by Product</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#0088FE" name="Quantity Sold" />
                </BarChart>
              </ResponsiveContainer>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Stack>
              <Title order={4}>Revenue by Product</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#00C49F" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Title order={4}>Sales Trend (Last 14 Days)</Title>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Items Sold" />
                </LineChart>
              </ResponsiveContainer>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Title order={4}>Sales Summary</Title>
              <Text size="xl" fw={700} c="blue" mt="xl">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text size="sm" c="dimmed">
                Total Revenue
              </Text>
              <Stack gap="xs" mt="md">
                <Group justify="space-between">
                  <Text size="sm">Total Items Sold:</Text>
                  <Text fw={600}>{totalQuantity}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Total Transactions:</Text>
                  <Text fw={600}>{sales.length}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Average Sale:</Text>
                  <Text fw={600}>
                    ${sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00'}
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
