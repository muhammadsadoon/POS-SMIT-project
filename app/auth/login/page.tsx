"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/zustand/auth-store';
import {
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa6';
import { gsap } from 'gsap';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 780px)');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // GSAP animation - ensure element is visible
    const formElement = document.querySelector('.login-form');
    if (formElement) {
      gsap.set(formElement, { opacity: 1, y: 0 });
      gsap.from('.login-form', {
        opacity: 0,
        y: 20,
        duration: 0.5,
      });
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully 🎉',
        color: 'green',
      });
      router.push('/dashboard');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to login',
        color: 'red',
      });
    }
  };

  return (
    <Grid m={0} p={0} mih="100vh" gutter={0} style={{ overflow: 'hidden' }}>
      {!isMobile && (
        <Grid.Col span={6} p={0} m={0} mih="100vh">
          <Paper h="100%" p="xl" radius={0}>
            <Stack gap={10} justify="center" h="100%">
              <div style={{ padding: '30px' }}>
                <Text m={0} p={0} fz={30} fw={700}>
                  Welcome Back
                </Text>
                <Text c="dimmed" m={0} p={0} fz={20}>
                  Manage your stores efficiently
                </Text>
                <Text c="dimmed" m={0} p={0} fz={13}>
                  Access your dashboard to manage products, track sales, and oversee your
                  multi-store operations.
                </Text>
              </div>
              <Paper
                p="md"
                radius="md"
                withBorder
                w="90%"
              >
                <Image
                  src="/dashboard.png"
                  alt="Dashboard preview"
                  radius="md"
                  h={400}
                  w="100%"
                />
              </Paper>
            </Stack>
          </Paper>
        </Grid.Col>
      )}
      <Divider orientation="vertical" />
      <Grid.Col span={isMobile ? 12 : 6} mih="100vh" p="xl" m={0}>
        <Stack gap={0} h="100%" className="login-form" justify="center">
          <Stack gap="md" mb="xl">
            <Title order={2} fw={600}>
              Sign In
            </Title>
            <Text c="dimmed" fz={14}>
              Let&apos;s connect with us!
            </Text>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="Email"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" loading={isLoading} fullWidth>
                Sign In
              </Button>
              <Text fz={14}>
                If you don't have an account{' '}
                <Link style={{ color: 'skyblue' }} href="/auth/signup">
                  Register now
                </Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
