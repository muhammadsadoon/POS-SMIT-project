'use client';

import React, { useState } from 'react';
import {
  Card,
  Button,
  Stack,
  TextInput,
  Textarea,
  Title,
  Stepper,
  Group,
  Text,
} from '@mantine/core';
import DashboardLayout from '@/components/ui/dashboard-layout';
import { useCreateProjectMutation } from '@/services/projectService';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createProjectSchema } from '@/lib/schemas';
import { notifications } from '@mantine/notifications';

export default function NewProjectPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await createProject(data).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Project created successfully',
        color: 'green',
      });
      // Redirect to add members
      router.push(`/projects/${result.id}/members`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.data?.message || 'Failed to create project',
        color: 'red',
      });
    }
  };

  return (
    <DashboardLayout
      title="Create New Project"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Projects', href: '/projects' },
        { label: 'New Project', href: '/projects/new' },
      ]}
    >
      <Card withBorder radius="md" p="xl" maw={600} mx="auto">
        <Stepper active={step} onStepClick={setStep} allowNextStepsSelect={false}>
          <Stepper.Step label="Project Details" description="Basic info">
            <Stack gap="lg" mt="xl">
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
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Review" description="Confirm details">
            <Stack gap="lg" mt="xl">
              <Card withBorder bg="gray.1" p="md">
                <Title order={4}>Review Your Project</Title>
                <Stack gap="sm" mt="md">
                  <div>
                    <Text fw={500}>Project Name</Text>
                    <Text c="dimmed" size="sm">
                      Will be determined after submission
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Card withBorder bg="green.0" p="md" ta="center">
              <Title order={4}>Project Created Successfully!</Title>
            </Card>
          </Stepper.Completed>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Group>
            <Button
              variant="default"
              onClick={() => router.push('/projects')}
            >
              Cancel
            </Button>
            {step === 0 ? (
              <Button onClick={() => setStep(1)}>
                Next
              </Button>
            ) : step === 1 ? (
              <Button onClick={handleSubmit(onSubmit)} loading={isLoading}>
                Create Project
              </Button>
            ) : null}
          </Group>
        </Group>
      </Card>
    </DashboardLayout>
  );
}
