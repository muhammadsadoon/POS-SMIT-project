"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/zustand/auth-store';
import {
  Button,
  Grid,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { gsap } from 'gsap';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain one uppercase letter')
      .regex(/[0-9]/, 'Must contain one number')
      .regex(/[!@#$%^&*]/, 'Must contain one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 780px)');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // GSAP animation - ensure element is visible
    const formElement = document.querySelector('.signup-form');
    if (formElement) {
      gsap.set(formElement, { opacity: 1, y: 0 });
      gsap.from('.signup-form', {
        opacity: 0,
        y: 20,
        duration: 0.5,
      });
    }
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.name, data.email, data.password);
      notifications.show({
        title: 'Success',
        message: 'Account created successfully 🎉',
        color: 'green',
      });
      router.push('/dashboard');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create account',
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
                  Create your Store
                </Text>
                <Text c="dimmed" m={0} p={0} fz={20}>
                  Start managing your stores today
                </Text>
                <Text c="dimmed" m={0} p={0} fz={13}>
                  Join our platform to manage multiple stores, track sales in real-time,
                  and streamline your business operations.
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

      <Grid.Col span={isMobile ? 12 : 6} mih="100vh" p="xl" m={0}>
        <Stack gap={0} h="100%" className="signup-form" justify="center">
          <Stack gap="md" mb="xl">
            <Title order={2} fw={600}>
              Sign Up
            </Title>
            <Text c="dimmed" fz={14}>
              Let's get started!
            </Text>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="Name"
                type="text"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
              />
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
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <Button type="submit" loading={isLoading} fullWidth>
                Sign Up
              </Button>
              <Text fz={14}>
                If you already have an account{' '}
                <Link style={{ color: 'skyblue' }} href="/auth/login">
                  Login now
                </Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
