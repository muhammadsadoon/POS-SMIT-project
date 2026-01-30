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
  TextInput,
  NumberInput,
  Select,
  Title,
  Badge,
  Grid,
  Text,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconBarcode,
} from '@tabler/icons-react';
import DashboardLayout from '@/components/ui/dashboard-layout';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '@/services/productService';
import { useForm } from 'react-hook-form';
import { productSchema } from '@/lib/schemas';
import { notifications } from '@mantine/notifications';
import { generateBarcode } from '@/lib/constants';

export default function ProductsPage() {
  const [opened, setOpened] = useState(false);
  const { data: products = [] } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      name: '',
      price: 0,
      category: '',
      barcode: '',
      sku: '',
      description: '',
    },
  });

  const barcode = watch('barcode');

  const onSubmit = async (data) => {
    try {
      // Auto-generate barcode if empty
      const submitData = {
        ...data,
        barcode: data.barcode || generateBarcode(),
      };
      
      await createProduct(submitData).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Product created successfully',
        color: 'green',
      });
      reset();
      setOpened(false);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.data?.message || 'Failed to create product',
        color: 'red',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete product',
        color: 'red',
      });
    }
  };

  return (
    <DashboardLayout
      title="Products"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Products', href: '/products' },
      ]}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={3}>Product Inventory</Title>
          <Button
            leftSection={<IconPlus size={14} />}
            onClick={() => setOpened(true)}
          >
            Add Product
          </Button>
        </Group>

        {products && products?.data?.data?.length > 0 ? (
          <Card withBorder overflow="hidden">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Barcode</Table.Th>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th ta="right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>{product.name}</Table.Td>
                    <Table.Td>${product.price}</Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="light">
                        {product.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" ff="monospace">
                        {product.barcode}
                      </Text>
                    </Table.Td>
                    <Table.Td>{product.sku}</Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={14} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconBarcode size={14} />}
                          >
                            View Barcode
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        ) : (
          <Card withBorder>
            <Text c="dimmed" ta="center">
              No products yet. Create one to get started.
            </Text>
          </Card>
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add New Product"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Product Name"
              placeholder="e.g., T-Shirt"
              {...register('name')}
              error={errors.name?.message}
            />

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Price"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  {...register('price', { valueAsNumber: true })}
                  error={errors.price?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Category"
                  placeholder="Select category"
                  data={[
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'clothing', label: 'Clothing' },
                    { value: 'food', label: 'Food' },
                    { value: 'other', label: 'Other' },
                  ]}
                  {...register('category')}
                  error={errors.category?.message}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Barcode (Leave empty to auto-generate)"
                  placeholder="Leave empty for auto-generation"
                  {...register('barcode')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="SKU"
                  placeholder="Optional SKU"
                  {...register('sku')}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Description"
              placeholder="Optional description"
              {...register('description')}
            />

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setOpened(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isCreating}>
                Add Product
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
