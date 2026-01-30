'use client';

import React, { useState, useEffect } from 'react';
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
  Center,
  Box,
} from '@mantine/core';
import { IconMail, IconLock } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/services/authService';
import { setUser } from '@/store/slices/authSlice';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/lib/schemas';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data) => {
    try {
      setError('');
      const response = await login(data).unwrap();
      console.log('response: ', response);
      
      
      dispatch(setUser({
        user: response.data.user,
        token: response.data.token,
      }));

      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      });

      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err.data?.message || 'Login failed';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  return (
    <Container style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box className=''>

      </Box>
      <Box style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
        {/* <Box style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#00C28A, #048F60)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>POS</div>
            <div style={{ textAlign: 'left' }}>
              <Title order={2} style={{ margin: 0 }}>Welcome back</Title>
              <Text color="dimmed" size="sm">Sign in to continue to your dashboard</Text>
            </div>
          </div>
        </Box> */}

        
        <Paper radius="lg" p="xl" withBorder shadow="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="lg">
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

            {error && (
              <Text color="red" size="sm">
                {error}
              </Text>
            )}

            <Button fullWidth type="submit" loading={isLoading} color="teal">
              Sign in
            </Button>
          </Stack>
        </form>

        <Group justify="center" mt="lg">
          <Text size="sm" c="dimmed">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" style={{ color: 'var(--mantine-color-teal-6)' }}>
              Sign up
            </Link>
          </Text>
        </Group>
        </Paper>
      </Box>
    </Container>
  );
}
