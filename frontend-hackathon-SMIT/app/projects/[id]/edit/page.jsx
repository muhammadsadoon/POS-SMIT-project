'use client';

import React, { useState } from 'react';
import {
  Card,
  Button,
  Stack,
  TextInput,
  Textarea,
  Title,
  Group,
  Text,
  Tabs,
  Table,
  ActionIcon,
  Menu,
  Modal,
  Select,
  Badge,
  NumberInput,
  Grid,
} from '@mantine/core';
import { IconPlus, IconTrash, IconDots, IconEdit } from '@tabler/icons-react';
import DashboardLayout from '@/components/ui/dashboard-layout';
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useDeleteProjectMutation,
} from '@/services/projectService';
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/services/productService';
import {
  useGetStocksQuery,
  useAddStockMutation,
  useRemoveStockMutation,
  useAdjustStockMutation,
} from '@/services/stockService';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createProjectSchema } from '@/lib/schemas';
import { notifications } from '@mantine/notifications';
import { ROLE_LABELS } from '@/lib/constants';

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id;
  const router = useRouter();
  const { data: project, isLoading } = useGetProjectByIdQuery(projectId);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // Members
  const { data: members = [] } = useGetProjectMembersQuery(projectId);
  const [addMember, { isLoading: isAddingMember }] = useAddProjectMemberMutation();
  const [openedMember, setOpenedMember] = useState(false);

  // Products
  const { data: products = [] } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Stock
  const { data: stocks = [] } = useGetStocksQuery({ projectId });
  const [addStock] = useAddStockMutation();
  const [removeStock] = useRemoveStockMutation();
  const [adjustStock] = useAdjustStockMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset: resetForm,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const memberForm = useForm({
    defaultValues: {
      email: '',
      role: 'STAFF',
    },
  });

  React.useEffect(() => {
    if (project?.data) {
      setValue('name', project.data.name);
      setValue('description', project.data.description);
    }
  }, [project, setValue]);

  const onSubmitProject = async (data) => {
    try {
      await updateProject({ id: projectId, ...data }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Project updated successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.data?.message || 'Failed to update project',
        color: 'red',
      });
    }
  };

  const onSubmitMember = async (data) => {
    try {
      const submitData = { ...data, role: data.role.toLowerCase() };
      await addMember({ projectId, ...submitData }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Member added successfully',
        color: 'green',
      });
      memberForm.reset();
      setOpenedMember(false);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.data?.message || 'Failed to add member',
        color: 'red',
      });
    }
  };

  const handleDeleteMember = async (memberId) => {
    // Implement delete member if API available
    notifications.show({
      title: 'Info',
      message: 'Delete member functionality not implemented yet',
      color: 'blue',
    });
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      await updateProduct({ id, ...data }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Product updated successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update product',
        color: 'red',
      });
    }
  };

  const handleDeleteProduct = async (id) => {
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

  // if (isLoading) {
  //   return (
  //     <DashboardLayout title="Edit Project">
  //       <Text>Loading...</Text>
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout
      title="Edit Project"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Projects', href: '/projects' },
        { label: 'Edit Project', href: `/projects/${projectId}/edit` },
      ]}
    >
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
          <Tabs.Tab value="products">Products</Tabs.Tab>
          <Tabs.Tab value="stock">Stock</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="xl">
          <Card withBorder radius="md" p="xl" maw={600} mx="auto">
            <Title order={3} mb="lg">
              Edit Project Details
            </Title>
            <form onSubmit={handleSubmit(onSubmitProject)}>
              <Stack gap="lg">
                <TextInput
                  label="Project Name"
                  placeholder="e.g., My First Store"
                  {...register('name')}
                  error={errors.name?.message}
                />

                <Textarea
                  label="Description"
                  placeholder="Describe your project..."
                  minRows={3}
                  {...register('description')}
                  error={errors.description?.message}
                />

                <Group justify="flex-end">
                  <Button variant="default" onClick={() => router.push('/projects')}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={isUpdating}>
                    Update Project
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="members" pt="xl">
          <Stack gap="lg">
            <Group justify="space-between">
              <Title order={3}>Team Members</Title>
              <Button leftSection={<IconPlus size={14} />} onClick={() => setOpenedMember(true)}>
                Add Member
              </Button>
            </Group>

            {members?.data?.length > 0 ? (
              <Card withBorder overflow="hidden">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Role</Table.Th>
                      <Table.Th>Joined</Table.Th>
                      <Table.Th ta="right">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {members?.data?.map((member) => (
                      <Table.Tr key={member._id}>
                        <Table.Td>{member.user?.name || 'N/A'}</Table.Td>
                        <Table.Td>{member.user?.email}</Table.Td>
                        <Table.Td>
                          <Badge variant="light">
                            {ROLE_LABELS[member.role] || member.role}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {new Date(member.createdAt).toLocaleDateString()}
                        </Table.Td>
                        <Table.Td>
                          <Menu position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDots size={14} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => handleDeleteMember(member.id)}
                              >
                                Remove
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
                  No members yet. Add your first team member.
                </Text>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="products" pt="xl">
          <Stack gap="lg">
            <Title order={3}>Products</Title>
            {products?.data?.length > 0 ? (
              <Card withBorder overflow="hidden">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Barcode</Table.Th>
                      <Table.Th ta="right">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {products?.data?.map((product) => (
                      <Table.Tr key={product._id}>
                        <Table.Td>{product.name}</Table.Td>
                        <Table.Td>{product.category.name}</Table.Td>
                        <Table.Td>${product.price}</Table.Td>
                        <Table.Td>{product.barcode}</Table.Td>
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
                                onClick={() => {
                                  // Implement edit modal
                                  notifications.show({
                                    title: 'Info',
                                    message: 'Edit product functionality not implemented yet',
                                    color: 'blue',
                                  });
                                }}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => handleDeleteProduct(product.id)}
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
                  No products yet.
                </Text>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="stock" pt="xl">
          <Stack gap="lg">
            <Title order={3}>Stock Management</Title>
            {stocks?.data?.length > 0 ? (
              <Card withBorder overflow="hidden">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Product</Table.Th>
                      <Table.Th>Current Stock</Table.Th>
                      <Table.Th>Last Updated</Table.Th>
                      <Table.Th ta="right">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {stocks?.data?.map((stock) => (
                      <Table.Tr key={stock._id}>
                        <Table.Td>{stock.product?.name || 'N/A'}</Table.Td>
                        <Table.Td>{stock.quantity}</Table.Td>
                        <Table.Td>
                          {new Date(stock.updatedAt).toLocaleDateString()}
                        </Table.Td>
                        <Table.Td>
                          <Menu position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDots size={14} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconPlus size={14} />}
                                onClick={() => {
                                  // Implement add stock
                                  notifications.show({
                                    title: 'Info',
                                    message: 'Add stock functionality not implemented yet',
                                    color: 'blue',
                                  });
                                }}
                              >
                                Add Stock
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                  // Implement remove stock
                                  notifications.show({
                                    title: 'Info',
                                    message: 'Remove stock functionality not implemented yet',
                                    color: 'blue',
                                  });
                                }}
                              >
                                Remove Stock
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
                  No stock data yet.
                </Text>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={openedMember}
        onClose={() => setOpenedMember(false)}
        title="Add Project Member"
        size="md"
      >
        <form onSubmit={memberForm.handleSubmit(onSubmitMember)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="member@example.com"
              type="email"
              {...memberForm.register('email')}
            />

            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: 'ADMIN', label: 'Administrator' },
                { value: 'MANAGER', label: 'Manager' },
                { value: 'CASHIER', label: 'Cashier' },
                { value: 'STAFF', label: 'Staff' },
              ]}
              {...memberForm.register('role')}
            />

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setOpenedMember(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isAddingMember}>
                Add Member
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
