"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import { useAppStore } from '@/store/zustand/app-store';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { getProject } from '@/lib/firestore/projects';
import {
  getProjectProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/firestore/products';
import ImageUpload from '@/components/products/image-upload';
import ProductCharts from '@/components/products/product-charts';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Modal,
  TextInput,
  NumberInput,
  Switch,
  PasswordInput,
  ActionIcon,
  Badge,
  Tabs,
  Image as MantineImage,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconEdit, IconShoppingBag, IconChartBar } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { gsap } from 'gsap';
import { Product } from '@/types';
import Image from 'next/image';

export default function ProductsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuthStore();
  const { setCurrentProject } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePublicId, setImagePublicId] = useState<string>('');

  const form = useForm({
    initialValues: {
      name: '',
      price: 0,
      stock: 0,
      barcode: '',
      isLive: true,
      password: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      stock: (value) => (value < 0 ? 'Stock cannot be negative' : null),
      password: (value) => (value.length < 4 ? 'Password must be at least 4 characters' : null),
    },
  });

  useEffect(() => {
    loadProject();
    loadProducts();
  }, [projectId]);

  useEffect(() => {
    gsap.from('.product-card', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
  }, [products]);

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
      setLoading(true);
      const projectProducts = await getProjectProducts(projectId);
      setProducts(projectProducts);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load products',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const productData: Parameters<typeof createProduct>[0] = {
        name: values.name,
        price: values.price,
        stock: values.stock,
        isLive: values.isLive,
        password: values.password,
        projectId,
      };
      if (values.barcode) {
        productData.barcode = values.barcode;
      }
      if (imageUrl) {
        productData.imageUrl = imageUrl;
      }
      if (imagePublicId) {
        productData.imagePublicId = imagePublicId;
      }
      await createProduct(productData);
      await loadProducts();
      form.reset();
      setImageUrl('');
      setImagePublicId('');
      close();
      notifications.show({
        title: 'Success',
        message: 'Product created successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create product',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setImageUrl(product.imageUrl || '');
    setImagePublicId(product.imagePublicId || '');
    form.setValues({
      name: product.name,
      price: product.price,
      stock: product.stock,
      barcode: product.barcode,
      isLive: product.isLive,
      password: '',
    });
    open();
  };

  const handleUpdateProduct = async (values: typeof form.values) => {
    if (!editProduct) return;

    try {
      setLoading(true);
      await updateProduct(editProduct.id, {
        name: values.name,
        price: values.price,
        stock: values.stock,
        barcode: values.barcode,
        isLive: values.isLive,
        currentPassword: values.password,
        password: values.password || undefined,
        imageUrl: imageUrl || undefined,
        imagePublicId: imagePublicId || undefined,
      });
      await loadProducts();
      form.reset();
      setEditProduct(null);
      setImageUrl('');
      setImagePublicId('');
      close();
      notifications.show({
        title: 'Success',
        message: 'Product updated successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update product',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      await deleteProduct(productToDelete.id, deletePassword);
      await loadProducts();
      setProductToDelete(null);
      setDeletePassword('');
      closeDelete();
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete product',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    openDelete();
  };

  const handleImageUploaded = (url: string, publicId: string) => {
    setImageUrl(url);
    setImagePublicId(publicId);
  };

  const handleImageDeleted = () => {
    setImageUrl('');
    setImagePublicId('');
  };

  return (
    <DashboardLayout>
      <Container size="xl" py="xl">
        <Group justify="space-between" mb="xl">
          <Title order={1}>Products</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={open}>
            New Product
          </Button>
        </Group>

        <Tabs defaultValue="products" mb="xl">
          <Tabs.List>
            <Tabs.Tab value="products" leftSection={<IconShoppingBag size={16} />}>
              Products
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="products" pt="xl">
            {loading && products.length === 0 ? (
              <Text>Loading products...</Text>
            ) : products.length === 0 ? (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack align="center" gap="md">
                  <IconShoppingBag size={48} color="gray" />
                  <Text size="lg" c="dimmed">
                    No products yet
                  </Text>
                  <Button onClick={open}>Create Product</Button>
                </Stack>
              </Card>
            ) : (
              <Grid>
                {products.map((product) => (
                  <Grid.Col key={product.id} span={{ base: 12, md: 6, lg: 4 }}>
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      className="product-card"
                    >
                      <Stack gap="md">
                        {product.imageUrl && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <Group justify="space-between">
                          <Title order={4}>{product.name}</Title>
                          <Group gap="xs">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => handleEditProduct(product)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => openDeleteModal(product)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                        <Group>
                          <Text size="sm" fw={500}>
                            ${product.price.toFixed(2)}
                          </Text>
                          <Badge variant="light" color={product.stock > 0 ? 'green' : 'red'}>
                            Stock: {product.stock}
                          </Badge>
                          <Badge variant="light" color={product.isLive ? 'blue' : 'gray'}>
                            {product.isLive ? 'Live' : 'Draft'}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">
                          Barcode: {product.barcode}
                        </Text>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="xl">
            {products.length > 0 ? (
              <ProductCharts products={products} />
            ) : (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text c="dimmed" ta="center">
                  No products to analyze. Create products to see analytics.
                </Text>
              </Card>
            )}
          </Tabs.Panel>
        </Tabs>

        <Modal
          opened={opened}
          onClose={() => {
            close();
            setEditProduct(null);
            form.reset();
            setImageUrl('');
            setImagePublicId('');
          }}
          title={editProduct ? 'Edit Product' : 'Create New Product'}
          size="lg"
        >
          <form
            onSubmit={form.onSubmit(
              editProduct ? handleUpdateProduct : handleCreateProduct
            )}
          >
            <Stack>
              <ImageUpload
                currentImageUrl={imageUrl}
                currentImagePublicId={imagePublicId}
                onImageUploaded={handleImageUploaded}
                onImageDeleted={handleImageDeleted}
              />
              <TextInput
                label="Product Name"
                placeholder="Product name"
                required
                {...form.getInputProps('name')}
              />
              <NumberInput
                label="Price"
                placeholder="0.00"
                required
                min={0}
                step={0.01}
                {...form.getInputProps('price')}
              />
              <NumberInput
                label="Stock"
                placeholder="0"
                required
                min={0}
                {...form.getInputProps('stock')}
              />
              <TextInput
                label="Barcode (optional)"
                placeholder="Leave empty to auto-generate"
                {...form.getInputProps('barcode')}
              />
              <Switch
                label="Live (available for sale)"
                {...form.getInputProps('isLive', { type: 'checkbox' })}
              />
              <PasswordInput
                label={editProduct ? 'Password (required for update)' : 'Product Password'}
                placeholder="Enter password"
                required
                {...form.getInputProps('password')}
              />
              <Group justify="flex-end">
                <Button
                  variant="subtle"
                  onClick={() => {
                    close();
                    setEditProduct(null);
                    form.reset();
                    setImageUrl('');
                    setImagePublicId('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  {editProduct ? 'Update' : 'Create'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        <Modal opened={deleteModalOpened} onClose={closeDelete} title="Delete Product">
          <Stack>
            <Text>
              Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
            </Text>
            <Text size="sm" c="dimmed">
              This action requires the product password.
            </Text>
            <PasswordInput
              label="Product Password"
              placeholder="Enter password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <Group justify="flex-end">
              <Button variant="subtle" onClick={closeDelete}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteProduct} loading={loading}>
                Delete
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}
