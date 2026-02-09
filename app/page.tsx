"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Card,
  Badge,
  Paper,
  Accordion,
  ThemeIcon,
} from '@mantine/core';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  IconShoppingBag,
  IconUsers,
  IconTrendingUp,
  IconCheck,
  IconBuildingStore,
  IconCashRegister,
  IconChartBar,
  IconShield,
  IconArrowRight,
  IconChevronRight,
} from '@tabler/icons-react';
import { gsap } from 'gsap';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Hero animations
    gsap.from('.hero-title', {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power3.out',
    });
    gsap.from('.hero-text', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
    });
    gsap.from('.hero-buttons', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out',
    });

    // Feature cards animation
    gsap.from('.feature-card', {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.6,
      ease: 'power2.out',
    });

    // How it works animation - using intersection observer approach
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.from('.step-card', {
            opacity: 0,
            x: -30,
            duration: 0.6,
            stagger: 0.15,
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const stepsSection = document.querySelector('.steps-section');
    if (stepsSection) {
      observer.observe(stepsSection);
    }
  }, []);

  const features = [
    {
      icon: IconBuildingStore,
      title: 'Multi-Store Management',
      description: 'Create and manage unlimited stores from a single dashboard. Switch between stores effortlessly.',
    },
    {
      icon: IconUsers,
      title: 'Role-Based Access Control',
      description: 'Admin, Manager, and Staff roles with granular permissions. Secure and scalable.',
    },
    {
      icon: IconTrendingUp,
      title: 'Real-Time Sales Tracking',
      description: 'Monitor sales live as they happen. Get instant insights and analytics.',
    },
    {
      icon: IconCashRegister,
      title: 'Modern POS System',
      description: 'Mobile-first POS interface for staff. Fast checkout with barcode scanning.',
    },
    {
      icon: IconChartBar,
      title: 'Advanced Analytics',
      description: 'Product charts, inventory value, stock status, and comprehensive reports.',
    },
    {
      icon: IconShield,
      title: 'Secure & Reliable',
      description: 'Password-protected products, encrypted data, and enterprise-grade security.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds with your email. Start with a free account and upgrade anytime.',
    },
    {
      number: '02',
      title: 'Set Up Your Stores',
      description: 'Create your first store, add products with images, and invite team members.',
    },
    {
      number: '03',
      title: 'Start Managing',
      description: 'Track sales in real-time, manage inventory, and grow your business efficiently.',
    },
  ];

  const faqs = [
    {
      question: 'How many stores can I manage?',
      answer: 'You can create unlimited stores on any plan. Each store can have unlimited products and team members.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use Firebase Authentication and Firestore with enterprise-grade security. All product passwords are encrypted with bcrypt.',
    },
    {
      question: 'Can I try before purchasing?',
      answer: 'Absolutely! Start with our free plan and upgrade when you need advanced features. No credit card required.',
    },
    {
      question: 'Do you support multiple users?',
      answer: 'Yes! Add unlimited team members to your stores. Assign roles (Admin, Manager, Staff) with appropriate permissions.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export all your sales data, product information, and reports at any time from the dashboard.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and PayPal. All payments are processed securely through Stripe.',
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <Paper
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
        }}
        py="md"
        withBorder
        radius={0}
      >
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <IconShoppingBag size={28} color="var(--mantine-color-blue-6)" />
              <Title order={3} fw={700}>
                StoreManager
              </Title>
            </Group>
            <Group gap="md">
              <Button variant="subtle" component={Link} href="/about">
                Features
              </Button>
              <Button variant="subtle" component={Link} href="/pricing">
                Pricing
              </Button>
              <ThemeToggle />
              <Button variant="outline" component={Link} href="/auth/login">
                Sign In
              </Button>
              <Button component={Link} href="/auth/signup">
                Get Started
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Container size="xl" py={120}>
        <Stack align="center" gap="xl" ta="center">
          <Badge size="lg" variant="light" color="blue" mb="md">
            Trusted by 1000+ Businesses
          </Badge>
          <Title
            order={1}
            size={64}
            fw={800}
            className="hero-title"
            style={{ lineHeight: 1.2 }}
          >
            Turn your stores into
            <br />
            <Text
              span
              inherit
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            >
              profit machines
            </Text>
          </Title>
          <Text size="xl" c="dimmed" maw={700} className="hero-text" style={{ lineHeight: 1.7 }}>
            Manage multiple stores effortlessly. Track sales in real-time. Automate inventory.
            Build relationships at scale without lifting a finger.
          </Text>
          <Group className="hero-buttons" mt="xl">
            <Button size="xl" component={Link} href="/auth/signup" radius="md">
              Start free
            </Button>
            <Button
              size="xl"
              variant="outline"
              component={Link}
              href="/pricing"
              radius="md"
              rightSection={<IconChevronRight size={20} />}
            >
              Watch demo
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* Dashboard Preview Image Placeholder */}
      <Container size="xl" mb={100}>
        <Paper
          p="md"
          radius="lg"
          withBorder
          style={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack align="center" gap="md">
            <IconChartBar size={64} />
            <Text c="dimmed" size="lg">
              Dashboard Preview
            </Text>
          </Stack>
        </Paper>
      </Container>

      {/* Capabilities Section */}
      <Container size="xl" py={100}>
        <Stack gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Text tt="uppercase" fw={700} size="sm" c="dimmed" mb="md">
              Capabilities
            </Text>
            <Title order={2} size={48} fw={700} mb="md">
              What you can do
            </Title>
            <Text size="lg" c="dimmed" maw={600} style={{ margin: '0 auto' }}>
              Automate your store management with intelligent features and real-time insights.
            </Text>
          </div>

          <Grid>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card
                    shadow="sm"
                    padding="xl"
                    radius="md"
                    withBorder
                    className="feature-card"
                    h="100%"
                    style={{ transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { y: -5, duration: 0.3 });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { y: 0, duration: 0.3 });
                    }}
                  >
                    <Stack gap="md">
                      <ThemeIcon size={56} radius="md" variant="light" color="blue">
                        <Icon size={28} />
                      </ThemeIcon>
                      <Title order={4} fw={600}>
                        {feature.title}
                      </Title>
                      <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Text>
                      <Group gap={4} mt="auto">
                        <Text size="sm" c="blue" fw={500}>
                          Learn more
                        </Text>
                        <IconArrowRight size={16} color="var(--mantine-color-blue-6)" />
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>
      </Container>

      {/* How It Works Section */}
      <Paper className="steps-section" py={100} radius={0} style={{ backgroundColor: 'transparent' }}>
        <Container size="xl">
          <Stack gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Text tt="uppercase" fw={700} size="sm" c="dimmed" mb="md">
                How it works
              </Text>
              <Title order={2} size={48} fw={700} mb="md">
                Three simple steps
              </Title>
              <Text size="lg" c="dimmed" maw={600} style={{ margin: '0 auto' }}>
                Get started in minutes and let automation handle the rest.
              </Text>
            </div>

            <Grid>
              {steps.map((step, index) => (
                <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                  <Card
                    shadow="sm"
                    padding="xl"
                    radius="md"
                    withBorder
                    className="step-card"
                    h="100%"
                  >
                    <Stack gap="md">
                      <Text size="xl" fw={800} c="blue" opacity={0.2} style={{ fontSize: 48 }}>
                        {step.number}
                      </Text>
                      <Title order={4} fw={600}>
                        {step.title}
                      </Title>
                      <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                        {step.description}
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Paper>

      {/* Pricing Section */}
      <Container size="xl" py={100}>
        <Stack gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Text tt="uppercase" fw={700} size="sm" c="dimmed" mb="md">
              Pricing
            </Text>
            <Title order={2} size={48} fw={700} mb="md">
              Simple, transparent pricing
            </Title>
            <Text size="lg" c="dimmed" maw={600} style={{ margin: '0 auto' }}>
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </Text>
          </div>

          <Group justify="center" mt="xl">
            <Button size="lg" component={Link} href="/pricing" radius="md">
              View Pricing Plans
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* FAQ Section */}
      <Paper py={100} radius={0} style={{ backgroundColor: 'transparent' }}>
        <Container size="xl">
          <Stack gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Text tt="uppercase" fw={700} size="sm" c="dimmed" mb="md">
                FAQ
              </Text>
              <Title order={2} size={48} fw={700} mb="md">
                Common questions
              </Title>
              <Text size="lg" c="dimmed" maw={600} style={{ margin: '0 auto' }}>
                Everything you need to know about StoreManager.
              </Text>
            </div>

            <Accordion
              variant="separated"
              radius="md"
              style={{ maxWidth: 800, margin: '0 auto' }}
            >
              {faqs.map((faq, index) => (
                <Accordion.Item key={index} value={`faq-${index}`}>
                  <Accordion.Control>
                    <Text fw={600}>{faq.question}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                      {faq.answer}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Stack>
        </Container>
      </Paper>

      {/* CTA Section */}
      <Container size="xl" py={100}>
        <Card
          shadow="lg"
          padding="xl"
          radius="lg"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Stack align="center" gap="md" ta="center">
            <Title order={2} c="white">
              Ready to transform your stores?
            </Title>
            <Text size="lg" c="white" opacity={0.9} maw={600}>
              Join thousands of businesses managing their stores efficiently. Start your free
              trial today.
            </Text>
            <Group mt="md">
              <Button
                size="lg"
                variant="white"
                component={Link}
                href="/auth/signup"
                radius="md"
              >
                Start free trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                style={{ borderColor: 'white', color: 'white' }}
                component={Link}
                href="/pricing"
                radius="md"
              >
                View pricing
              </Button>
            </Group>
          </Stack>
        </Card>
      </Container>

      {/* Footer */}
      <Paper py={60} withBorder radius={0}>
        <Container size="xl">
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Group gap="xs">
                <IconShoppingBag size={24} color="var(--mantine-color-blue-6)" />
                <Title order={4} fw={700}>
                  StoreManager
                </Title>
              </Group>
              <Text size="sm" c="dimmed">
                © 2026 StoreManager. All rights reserved.
              </Text>
            </Stack>
            <Group gap="xl">
              <Stack gap="xs">
                <Text fw={600} size="sm">
                  Product
                </Text>
                <Text size="sm" c="dimmed" component={Link} href="/about" style={{ textDecoration: 'none' }}>
                  Features
                </Text>
                <Text size="sm" c="dimmed" component={Link} href="/pricing" style={{ textDecoration: 'none' }}>
                  Pricing
                </Text>
              </Stack>
              <Stack gap="xs">
                <Text fw={600} size="sm">
                  Company
                </Text>
                <Text size="sm" c="dimmed" component={Link} href="/about" style={{ textDecoration: 'none' }}>
                  About
                </Text>
                <Text size="sm" c="dimmed">
                  Privacy
                </Text>
                <Text size="sm" c="dimmed">
                  Terms
                </Text>
              </Stack>
            </Group>
          </Group>
        </Container>
      </Paper>
    </div>
  );
}
