'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Text,
  Button,
  Group,
  Table,
  Title,
  Container,
  Stack,
  Grid,
  Badge,
  ActionIcon,
  Menu,
} from '@mantine/core';
import { IconEdit, IconTrash, IconDots, IconPlus } from '@tabler/icons-react';
import DashboardLayout from '@/components/ui/dashboard-layout';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
} from '@/services/projectService';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';

export default function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  const filteredProjects = projects?.data || [];

  const handleDelete = async (id) => {
    try {
      await deleteProject(id).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Project deleted successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete project',
        color: 'red',
      });
    }
  };

  return (
    <DashboardLayout
      title="Projects"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Projects', href: '/projects' },
      ]}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Your Projects
          </Text>
          <Button
            component={Link}
            href="/projects/new"
            leftSection={<IconPlus size={14} />}
          >
            New Project
          </Button>
        </Group>

        {filteredProjects.length > 0 ? (
          <Grid>
            {filteredProjects.map((project) => (
              <Grid.Col key={project._id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card withBorder radius="md" p="md">
                  <Group justify="space-between" mb="md">
                    <Title order={4}>{project.name}</Title>
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={14} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          component={Link}
                          href={`/projects/${project._id}/members`}
                        >
                          Members
                        </Menu.Item>
                        <Menu.Item
                          component={Link}
                          href={`/projects/${project._id}/edit`}
                          leftSection={<IconEdit size={14} />}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => handleDelete(project.id)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {project.description}
                  </Text>
                  <Group justify="space-between">
                    <Badge>{project.status || 'Active'}</Badge>
                    <Text size="xs" c="dimmed">
                      {dayjs(project.createdAt).format('MMM DD, YYYY')}
                    </Text>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Card withBorder>
            <Text c="dimmed" ta="center">
              No projects yet.{' '}
              <Button
                component={Link}
                href="/projects/new"
                variant="subtle"
                compact
              >
                Create your first project
              </Button>
            </Text>
          </Card>
        )}
      </Stack>
    </DashboardLayout>
  );
}
