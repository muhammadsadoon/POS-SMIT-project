"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import { useAppStore } from '@/store/zustand/app-store';
import { getProjectProducts } from '@/lib/firestore/products';
import { createSale } from '@/lib/firestore/sales';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  TextInput,
  NumberInput,
  Badge,
  Paper,
  ActionIcon,
  Modal,
  Table,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShoppingCart, IconPlus, IconMinus, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { gsap } from 'gsap';
import { Product, Sale } from '@/types';
import AuthGuard from '@/components/auth/auth-guard';
import Image from 'next/image';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StaffPOSPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentProject, setDefaultProjectForStaff } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [checkoutModalOpened, { open: openCheckout, close: closeCheckout }] =
    useDisclosure(false);

  useEffect(() => {
    const initializeProject = async () => {
      if (!currentProject && user?.uid) {
        await setDefaultProjectForStaff(user.uid);
      }
      if (currentProject) {
        loadProducts();
      }
    };
    initializeProject();
  }, [currentProject, user?.uid]);

  useEffect(() => {
    // GSAP animations for product cards
    gsap.from('.product-card', {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      stagger: 0.05,
    });
  }, [products]);

  const loadProducts = async () => {
    if (!currentProject) return;

    try {
      setLoading(true);
      const liveProducts = await getProjectProducts(currentProject.id, true);
      setProducts(liveProducts.filter((p) => p.stock > 0));
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

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        notifications.show({
          title: 'Error',
          message: 'Not enough stock available',
          color: 'red',
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.stock < 1) {
        notifications.show({
          title: 'Error',
          message: 'Product out of stock',
          color: 'red',
        });
        return;
      }
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const item = cart.find((item) => item.product.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > item.product.stock) {
      notifications.show({
        title: 'Error',
        message: 'Not enough stock available',
        color: 'red',
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleBarcodeScan = () => {
    if (!barcodeInput.trim()) return;

    const product = products.find((p) => p.barcode === barcodeInput.trim());
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      notifications.show({
        title: 'Error',
        message: 'Product not found',
        color: 'red',
      });
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!currentProject || !user || cart.length === 0) return;

    try {
      setLoading(true);
      const sales: Promise<string>[] = [];

      for (const item of cart) {
        const saleData = {
          productId: item.product.id,
          productName: item.product.name,
          qty: item.quantity,
          total: item.product.price * item.quantity,
          soldBy: user.uid,
          soldByName: user.name || 'Unknown',
          projectId: currentProject.id,
        };

        sales.push(createSale(saleData));
      }

      await Promise.all(sales);
      setCart([]);
      closeCheckout();
      await loadProducts(); // Refresh stock
      notifications.show({
        title: 'Success',
        message: 'Sale completed successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to complete sale',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard requireAuth={true}>
      <Container size="xl" py="xl" fluid>
        <Group justify="space-between" mb="xl">
          <Title order={1}>Point of Sale</Title>
          <Badge size="lg" variant="light" color="blue">
            {currentProject?.name}
          </Badge>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <TextInput
                placeholder="Search products by name or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
              />
              <Group>
                <TextInput
                  placeholder="Scan barcode..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
                  style={{ flex: 1 }}
                />
                <Button onClick={handleBarcodeScan}>Scan</Button>
              </Group>

              {loading ? (
                <Text>Loading products...</Text>
              ) : filteredProducts.length === 0 ? (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text c="dimmed" ta="center">
                    No products available
                  </Text>
                </Card>
              ) : (
                <Grid>
                  {filteredProducts.map((product) => (
                    <Grid.Col key={product.id} span={{ base: 6, sm: 4, md: 3 }}>
                      <Card
                        shadow="sm"
                        padding="md"
                        radius="md"
                        withBorder
                        className="product-card"
                        style={{
                          cursor: 'pointer',
                          opacity: product.stock === 0 ? 0.5 : 1,
                        }}
                        onClick={() => product.stock > 0 && addToCart(product)}
                      >
                        <Stack gap="xs">
                          {product.imageUrl && (
                            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-2">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <Text fw={600} size="sm" lineClamp={2}>
                            {product.name}
                          </Text>
                          <Text fw={700} size="lg" c="blue">
                            ${product.price.toFixed(2)}
                          </Text>
                          <Badge
                            variant="light"
                            color={product.stock > 0 ? 'green' : 'red'}
                            size="sm"
                          >
                            Stock: {product.stock}
                          </Badge>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ position: 'sticky', top: 20 }}>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>
                    <IconShoppingCart size={24} />
                  </Title>
                  <Badge size="lg">{cart.length} items</Badge>
                </Group>

                <Divider />

                {cart.length === 0 ? (
                  <Text c="dimmed" ta="center" py="xl">
                    Cart is empty
                  </Text>
                ) : (
                  <>
                    <Stack gap="xs">
                      {cart.map((item) => (
                        <Paper key={item.product.id} p="xs" withBorder>
                          <Group justify="space-between">
                            <div style={{ flex: 1 }}>
                              <Text size="sm" fw={500}>
                                {item.product.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                ${item.product.price.toFixed(2)} each
                              </Text>
                            </div>
                            <Group gap="xs">
                              <ActionIcon
                                size="sm"
                                variant="light"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <IconMinus size={14} />
                              </ActionIcon>
                              <Text size="sm" fw={600} w={30} ta="center">
                                {item.quantity}
                              </Text>
                              <ActionIcon
                                size="sm"
                                variant="light"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={item.quantity >= item.product.stock}
                              >
                                <IconPlus size={14} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                color="red"
                                variant="light"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <IconX size={14} />
                              </ActionIcon>
                            </Group>
                          </Group>
                          <Text size="sm" fw={600} mt="xs" ta="right">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </Text>
                        </Paper>
                      ))}
                    </Stack>

                    <Divider />

                    <Group justify="space-between">
                      <Text size="lg" fw={700}>
                        Total:
                      </Text>
                      <Text size="xl" fw={700} c="blue">
                        ${calculateTotal().toFixed(2)}
                      </Text>
                    </Group>

                    <Button
                      size="lg"
                      fullWidth
                      onClick={openCheckout}
                      disabled={cart.length === 0}
                    >
                      Checkout
                    </Button>
                  </>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Modal
          opened={checkoutModalOpened}
          onClose={closeCheckout}
          title="Confirm Checkout"
          size="lg"
        >
          <Stack>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Qty</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {cart.map((item) => (
                  <Table.Tr key={item.product.id}>
                    <Table.Td>{item.product.name}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>${item.product.price.toFixed(2)}</Table.Td>
                    <Table.Td>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Divider />
            <Group justify="space-between">
              <Text size="lg" fw={700}>
                Total Amount:
              </Text>
              <Text size="xl" fw={700} c="blue">
                ${calculateTotal().toFixed(2)}
              </Text>
            </Group>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={closeCheckout}>
                Cancel
              </Button>
              <Button onClick={handleCheckout} loading={loading}>
                Confirm Sale
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </AuthGuard>
  );
}
