'use client';

import React, { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Group,
  ActionIcon,
  Menu,
  Modal,
  Stack,
  Select,
  NumberInput,
  Textarea,
  Tabs,
  Title,
  Badge,
  Text,
} from '@mantine/core';
import {
  IconPlus,
  IconMinus,
  IconAdjustments,
  IconDots,
} from '@tabler/icons-react';
import DashboardLayout from '@/components/ui/dashboard-layout';
import {
  useGetStocksQuery,
  useAddStockMutation,
  useRemoveStockMutation,
  useAdjustStockMutation,
} from '@/services/stockService';
import { useGetProductsQuery } from '@/services/productService';
import { useForm } from 'react-hook-form';
import { addStockSchema } from '@/lib/schemas';
import { notifications } from '@mantine/notifications';

export default function StockPage() {
  const [activeTab, setActiveTab] = useState('in');
  const [opened, setOpened] = useState(false);
  const { data: stocks = [] } = useGetStocksQuery();
  const { data: products = [] } = useGetProductsQuery();
  
  const [addStock, { isLoading: isAdding }] = useAddStockMutation();
  const [removeStock, { isLoading: isRemoving }] = useRemoveStockMutation();
  const [adjustStock, { isLoading: isAdjusting }] = useAdjustStockMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      productId: '',
      quantity: 0,
      notes: '',
    },
  });

  const productOptions = products.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const onSubmit = async (data) => {
    try {
      if (activeTab === 'in') {
        await addStock(data).unwrap();
      } else if (activeTab === 'out') {
        await removeStock(data).unwrap();
      } else {
        await adjustStock(data).unwrap();
      }

      notifications.show({
        title: 'Success',
        message: `Stock ${activeTab === 'in' ? 'added' : activeTab === 'out' ? 'removed' : 'adjusted'} successfully`,
        color: 'green',
      });
      reset();
      setOpened(false);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update stock',
        color: 'red',
      });
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'in':
        return 'Add Stock (IN)';
      case 'out':
        return 'Remove Stock (OUT)';
      case 'adjust':
        return 'Adjust Stock';
      default:
        return '';
    }
  };

  return (
    <DashboardLayout
      title="Stock Management"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Stock', href: '/stock' },
      ]}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={3}>Inventory Management</Title>
          <Button
            leftSection={<IconPlus size={14} />}
            onClick={() => setOpened(true)}
          >
            Update Stock
          </Button>
        </Group>

        {stocks && stocks.length > 0 ? (
          <Card withBorder overflow="hidden">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Low Stock</Table.Th>
                  <Table.Th>Last Updated</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {stocks.map((stock) => {
                  const product = products.find((p) => p.id === stock.productId);
                  const isLow = stock.quantity <= (stock.minQuantity || 10);

                  return (
                    <Table.Tr key={stock.id}>
                      <Table.Td>{product?.name || 'Unknown'}</Table.Td>
                      <Table.Td>
                        <Text fw={500}>{stock.quantity}</Text>
                      </Table.Td>
                      <Table.Td>{stock.minQuantity || 10}</Table.Td>
                      <Table.Td>{new Date(stock.updatedAt).toLocaleDateString()}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={isLow ? 'red' : 'green'}
                          variant="light"
                        >
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Card>
        ) : (
          <Card withBorder>
            <Text c="dimmed" ta="center">
              No stock records yet. Add a product first.
            </Text>
          </Card>
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={getTabLabel()}
        size="md"
      >
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="in" leftSection={<IconPlus size={14} />}>
              Add Stock
            </Tabs.Tab>
            <Tabs.Tab value="out" leftSection={<IconMinus size={14} />}>
              Remove Stock
            </Tabs.Tab>
            <Tabs.Tab value="adjust" leftSection={<IconAdjustments size={14} />}>
              Adjust
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab} pt="md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="md">
                <Select
                  label="Select Product"
                  placeholder="Choose a product"
                  data={productOptions}
                  {...register('productId')}
                  error={errors.productId?.message}
                  searchable
                />

                <NumberInput
                  label="Quantity"
                  placeholder="Enter quantity"
                  min={1}
                  {...register('quantity', { valueAsNumber: true })}
                  error={errors.quantity?.message}
                />

                <Textarea
                  label="Notes (Optional)"
                  placeholder="Add any notes..."
                  minRows={2}
                  {...register('notes')}
                />

                <Group justify="flex-end">
                  <Button variant="default" onClick={() => setOpened(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={
                      activeTab === 'in'
                        ? isAdding
                        : activeTab === 'out'
                        ? isRemoving
                        : isAdjusting
                    }
                  >
                    Update Stock
                  </Button>
                </Group>
              </Stack>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </DashboardLayout>
  );
}
