"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import { useAppStore } from '@/store/zustand/app-store';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { getUserProjects, createProject, deleteProject } from '@/lib/firestore/projects';
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
  ActionIcon,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconEdit, IconBuildingStore } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { gsap } from 'gsap';
import { Project } from '@/types';

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { projects, setProjects, setCurrentProject } = useAppStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Project name must be at least 2 characters' : null),
    },
  });

  useEffect(() => {
    loadProjects();
  }, [user]);

  useEffect(() => {
    // GSAP animation
    gsap.from('.project-card', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
  }, [projects]);

  const loadProjects = async () => {
    if (user?.uid) {
      try {
        setLoading(true);
        const userProjects = await getUserProjects(user.uid);
        setProjects(userProjects);
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to load projects',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateProject = async (values: typeof form.values) => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const projectId = await createProject(values.name, user.uid);
      await loadProjects();
      form.reset();
      close();
      notifications.show({
        title: 'Success',
        message: 'Project created successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create project',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    router.push(`/dashboard/projects/${project.id}/products`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setLoading(true);
      await deleteProject(projectId);
      await loadProjects();
      notifications.show({
        title: 'Success',
        message: 'Project deleted successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete project',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container size="xl" py="xl">
        <Group justify="space-between" mb="xl">
          <Title order={1}>Projects</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={open}>
            New Project
          </Button>
        </Group>

        {loading && projects.length === 0 ? (
          <Text>Loading projects...</Text>
        ) : projects.length === 0 ? (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center" gap="md">
              <IconBuildingStore size={48} color="gray" />
              <Text size="lg" c="dimmed">
                No projects yet
              </Text>
              <Text size="sm" c="dimmed">
                Create your first project to get started
              </Text>
              <Button onClick={open}>Create Project</Button>
            </Stack>
          </Card>
        ) : (
          <Grid>
            {projects.map((project) => (
              <Grid.Col key={project.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  className="project-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectProject(project)}
                >
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Title order={4}>{project.name}</Title>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProject(project);
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    <Group>
                      <Badge variant="light">
                        {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="light" color="blue">
                        Owner
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        <Modal opened={opened} onClose={close} title="Create New Project">
          <form onSubmit={form.onSubmit(handleCreateProject)}>
            <Stack>
              <TextInput
                label="Project Name"
                placeholder="My Store"
                required
                {...form.getInputProps('name')}
              />
              <Group justify="flex-end">
                <Button variant="subtle" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Create
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}
