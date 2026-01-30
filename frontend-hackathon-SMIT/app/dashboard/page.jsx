'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Text,
  RingProgress,
  Group,
  Stack,
  ThemeIcon,
  Progress,
  Table,
  Title,
  Container,
  SimpleGrid,
  StatisticsGroup,
  Stat,
} from '@mantine/core';
import {
  IconBox,
  IconShoppingCart,
  IconCash,
  IconTrendingUp,
} from '@tabler/icons-react';
import DashboardLayout from '@/components/ui/dashboard-layout';
import { useGetProductsQuery } from '@/services/productService';
import { useGetStocksQuery } from '@/services/stockService';
import { useGetProjectsQuery, useGetProjectMembersQuery } from '@/services/projectService';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: products = [] } = useGetProductsQuery();
  const { data: stocks = [] } = useGetStocksQuery();
  const { data: projects = [] } = useGetProjectsQuery();

  const filteredProjects = projects?.data?.data || [];

  const stats = [
    {
      title: 'Total Products',
      stats: products?.data?.length || 0,
      icon: IconBox,
      color: 'blue',
    },
    {
      title: 'Projects',
      stats: filteredProjects?.length || 0,
      icon: IconShoppingCart,
      color: 'teal',
    },
    {
      title: 'Total Stock',
      stats: stocks?.data?.reduce((sum, s) => sum + (s.quantity || 0), 0) || 0,
      icon: IconCash,
      color: 'cyan',
    },
    {
      title: 'Growth',
      stats: '+15%',
      icon: IconTrendingUp,
      color: 'green',
    },
  ];

  const statsCards = stats.map((stat, index) => (
    <Card key={index} withBorder radius="md" p="md">
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed" fw={700}>
          {stat.title}
        </Text>
        <ThemeIcon
          color={stat.color}
          variant="light"
          size="lg"
          radius="md"
        >
          <stat.icon size={18} />
        </ThemeIcon>
      </Group>
      <Text fw={700} size="lg">
        {stat.stats}
      </Text>
      <Text size="xs" c="dimmed" mt={7}>
        Across all projects
      </Text>
    </Card>
  ));
  console.log(products);
  return (
    <DashboardLayout
      title="Dashboard"
      breadcrumbs={[{ label: 'Home', href: '/dashboard' }]}
    >
      <Stack gap="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {statsCards}
        </SimpleGrid>

        <Card withBorder radius="md" p="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>Recent Products</Title>
            <Text size="sm" c="blue">
              View all
            </Text>
          </Group>
          {(products && products?.data?.length > 0) ? (
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products?.data?.map((product, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>{product?.name}</Table.Td>
                    <Table.Td>${product?.price}</Table.Td>
                    {/* <Table.Td>{product?.category}</Table.Td> */}
                    <Table.Td>
                      <Text size="sm" c="green">
                        Active
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text c="dimmed" size="sm">
              No products yet. Create one to get started.
            </Text>
          )}
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
