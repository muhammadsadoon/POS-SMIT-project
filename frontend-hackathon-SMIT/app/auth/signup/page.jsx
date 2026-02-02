// Sign up screen
'use client';

import React, { useState } from 'react';
import {
  Container,
  Paper,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Stack,
  TextInput,
  Alert,
  Box,
  MantineProvider,
  Center,
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '@/services/authService';
import { setUser } from '@/store/slices/authSlice';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { signupSchema } from '@/lib/schemas';

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register_, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      const { confirmPassword, ...submitData } = data;
      const response = await register_(submitData).unwrap();
      
      dispatch(setUser({
        user: response.user,
        token: response.token,
      }));

      notifications.show({
        title: 'Success',
        message: 'Account created successfully',
        color: 'green',
      });

      router.push('/projects/new');
    } catch (err) {
      const errorMessage = err.data?.message || 'Registration failed';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  return (
    <Container size={520} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
        <Box style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#00C28A, #048F60)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>POS</div>
            <div style={{ textAlign: 'left' }}>
              <Title order={2} style={{ margin: 0 }}>Create account</Title>
              <Text color="dimmed" size="sm">Start managing inventory for your business</Text>
            </div>
          </div>
        </Box>

        <Paper radius="lg" p="xl" withBorder shadow="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="lg">
            <TextInput
              label="Full Name"
              placeholder="John Doe"
              {...register('name')}
              error={errors.name?.message}
              disabled={isLoading}
            />

            <TextInput
              label="Email"
              placeholder="your@email.com"
              icon={<IconMail size={14} />}
              {...register('email')}
              error={errors.email?.message}
              disabled={isLoading}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              icon={<IconLock size={14} />}
              {...register('password')}
              error={errors.password?.message}
              disabled={isLoading}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm password"
              icon={<IconLock size={14} />}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error}
              </Alert>
            )}

            <Button fullWidth type="submit" loading={isLoading} color="teal">
              Create account
            </Button>
          </Stack>
        </form>

        <Group justify="center" mt="lg">
          <Text size="sm" c="dimmed">
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--mantine-color-teal-6)' }}>
              Sign in
            </Link>
          </Text>
        </Group>
        </Paper>
      </Box>
    </Container>
  );
}
