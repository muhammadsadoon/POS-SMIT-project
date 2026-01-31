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
  MantineProvider,
  Image,
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
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1a1b1e' }}>
        <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2e2f32' }}>
          <Box style={{ textAlign: 'center', padding: '2rem' }}>
            <Title order={1} style={{ color: 'white', marginBottom: '1rem' }}>Welcome Back!</Title>
            <Text size="lg" style={{ color: '#b0b3b8' }}>We're excited to have you here. Sign in to continue managing your inventory.</Text>
          </Box>
        </Box>
        <Container style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#1a1b1e' }}>
          <Box style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
            <Center mb="xl">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Image src={"/logo.png"} h={100} w={100}/>
                <Title order={1} style={{ margin: 0, textAlign: 'center', color: 'white' }}>Sign in to DukanHub</Title>
                <Text color="dimmed" size="sm" style={{ textAlign: 'center', color: '#b0b3b8' }}>Enter your details below to sign in</Text>
              </div>
            </Center>

            <Paper radius="lg" p="xl" withBorder shadow="sm" style={{ backgroundColor: '#2e2f32' }}>
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
                <Text size="sm" c="dimmed" style={{ color: '#b0b3b8' }}>
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" style={{ color: 'var(--mantine-color-teal-6)' }}>
                    Sign up
                  </Link>
                </Text>
              </Group>
            </Paper>
          </Box>
        </Container>
      </div>
    </MantineProvider>
  );
}
