"use client";

import { useEffect, useRef } from 'react';
import { Product } from '@/types';
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
} from 'recharts';
import { Card, Title, Text, Stack, Grid, Group } from '@mantine/core';
import { gsap } from 'gsap';

interface ProductChartsProps {
  products: Product[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ProductCharts({ products }: ProductChartsProps) {
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
  }, [products]);

  // Prepare data for charts
  const stockData = products
    .map((p) => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: p.stock,
      price: p.price,
    }))
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10);

  const liveVsDraft = [
    {
      name: 'Live',
      value: products.filter((p) => p.isLive).length,
    },
    {
      name: 'Draft',
      value: products.filter((p) => !p.isLive).length,
    },
  ];

  const lowStockProducts = products.filter((p) => p.stock < 10 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const stockStatusData = [
    { name: 'In Stock', value: products.filter((p) => p.stock >= 10).length },
    { name: 'Low Stock', value: lowStockProducts.length },
    { name: 'Out of Stock', value: outOfStockProducts.length },
  ];

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div ref={chartRef}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Stack>
              <Title order={4}>Stock Levels</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="#0088FE" name="Stock Quantity" />
                </BarChart>
              </ResponsiveContainer>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Stack>
              <Title order={4}>Live vs Draft</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={liveVsDraft}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {liveVsDraft.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Title order={4}>Stock Status</Title>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Title order={4}>Inventory Value</Title>
              <Text size="xl" fw={700} c="blue" mt="xl">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text size="sm" c="dimmed">
                Total value of all products in stock
              </Text>
              <Stack gap="xs" mt="md">
                <Group justify="space-between">
                  <Text size="sm">Total Products:</Text>
                  <Text fw={600}>{products.length}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Low Stock Items:</Text>
                  <Text fw={600} c="orange">{lowStockProducts.length}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Out of Stock:</Text>
                  <Text fw={600} c="red">{outOfStockProducts.length}</Text>
                </Group>
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
