"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import {
  getProject,
  addProjectMember,
  updateMemberRole,
  removeProjectMember,
} from '@/lib/firestore/projects';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Group,
  Stack,
  Modal,
  TextInput,
  Select,
  ActionIcon,
  Badge,
  Table,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { ProjectMember, UserRole } from '@/types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MembersPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuthStore();
  const [project, setProject] = useState<any>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      email: '',
      role: 'staff' as UserRole,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  useEffect(() => {
    loadProject();
    loadAvailableUsers();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const projectData = await getProject(projectId);
      if (projectData) {
        setProject(projectData);
        setMembers(projectData.members || []);
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load project',
        color: 'red',
      });
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users: any[] = [];
      usersSnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleAddMember = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const userToAdd = availableUsers.find((u) => u.email === values.email);
      if (!userToAdd) {
        throw new Error('User not found');
      }

      await addProjectMember(projectId, {
        uid: userToAdd.id,
        role: values.role,
        email: userToAdd.email,
        name: userToAdd.name,
      });

      await loadProject();
      form.reset();
      close();
      notifications.show({
        title: 'Success',
        message: 'Member added successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to add member',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (memberUid: string, newRole: UserRole) => {
    try {
      setLoading(true);
      await updateMemberRole(projectId, memberUid, newRole);
      await loadProject();
      notifications.show({
        title: 'Success',
        message: 'Member role updated successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update role',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberUid: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      setLoading(true);
      await removeProjectMember(projectId, memberUid);
      await loadProject();
      notifications.show({
        title: 'Success',
        message: 'Member removed successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to remove member',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const getMemberInfo = (member: ProjectMember) => {
    const userInfo = availableUsers.find((u) => u.id === member.uid);
    return {
      name: userInfo?.name || member.name || 'Unknown',
      email: userInfo?.email || member.email || 'No email',
    };
  };

  return (
    <DashboardLayout requireRole="manager">
      <Container size="xl" py="xl">
        <Group justify="space-between" mb="xl">
          <Title order={1}>Project Members</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={open}>
            Add Member
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {members.map((member) => {
                const info = getMemberInfo(member);
                const isOwner = project?.ownerId === member.uid;
                return (
                  <Table.Tr key={member.uid}>
                    <Table.Td>{info.name}</Table.Td>
                    <Table.Td>{info.email}</Table.Td>
                    <Table.Td>
                      {isOwner ? (
                        <Badge color="blue">Owner</Badge>
                      ) : (
                        <Select
                          value={member.role}
                          data={[
                            { value: 'manager', label: 'Manager' },
                            { value: 'staff', label: 'Staff' },
                          ]}
                          onChange={(value) =>
                            value && handleUpdateRole(member.uid, value as UserRole)
                          }
                          disabled={isOwner || loading}
                        />
                      )}
                    </Table.Td>
                    <Table.Td>
                      {!isOwner && (
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => handleRemoveMember(member.uid)}
                          disabled={loading}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Card>

        <Modal opened={opened} onClose={close} title="Add Member">
          <form onSubmit={form.onSubmit(handleAddMember)}>
            <Stack>
              <Select
                label="User Email"
                placeholder="Select user"
                data={availableUsers.map((u) => ({
                  value: u.email,
                  label: `${u.name} (${u.email})`,
                }))}
                searchable
                {...form.getInputProps('email')}
              />
              <Select
                label="Role"
                data={[
                  { value: 'manager', label: 'Manager' },
                  { value: 'staff', label: 'Staff' },
                ]}
                {...form.getInputProps('role')}
              />
              <Group justify="flex-end">
                <Button variant="subtle" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Add Member
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}
