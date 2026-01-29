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
  TextInput,
  Title,
  Badge,
  Text,
} from '@mantine/core';
import { IconPlus, IconTrash, IconDots } from '@tabler/icons-react';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import {
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
} from '@/services/projectService';
import { useForm } from 'react-hook-form';
import { memberSchema } from '@/lib/schemas';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
import { ROLE_LABELS } from '@/lib/constants';

export default function ProjectMembersPage() {
  const params = useParams();
  const projectId = params.id;
  const [opened, setOpened] = useState(false);
  
  const { data: members = [] } = useGetProjectMembersQuery(projectId);
  const [addMember, { isLoading }] = useAddProjectMemberMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      email: '',
      role: 'staff',
    },
  });

  const onSubmit = async (data) => {
    try {
      await addMember({ projectId, ...data }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Member added successfully',
        color: 'green',
      });
      reset();
      setOpened(false);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.data?.message || 'Failed to add member',
        color: 'red',
      });
    }
  };

  return (
    <DashboardLayout
      title="Project Members"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Projects', href: '/projects' },
        { label: 'Members', href: `/projects/${projectId}/members` },
      ]}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={3}>Team Members</Title>
          <Button
            leftSection={<IconPlus size={14} />}
            onClick={() => setOpened(true)}
          >
            Add Member
          </Button>
        </Group>

        {members && members.length > 0 ? (
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
                {members.map((member) => (
                  <Table.Tr key={member.id}>
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

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add Project Member"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="member@example.com"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: 'admin', label: 'Administrator' },
                { value: 'manager', label: 'Manager' },
                { value: 'staff', label: 'Staff' },
              ]}
              {...register('role')}
              error={errors.role?.message}
            />

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setOpened(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                Add Member
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
