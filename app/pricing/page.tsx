"use client";

import { Container, Title, Text, Stack, Grid, Card, Button, Badge, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { gsap } from 'gsap';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    gsap.from('.pricing-card', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
    });
  }, []);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/forever',
      description: 'Perfect for getting started',
      projects: 2,
      features: [
        '2 projects',
        'Basic analytics',
        'Email support',
        '5 team members per project',
        'Product management',
        'Sales tracking',
        'Mobile POS access',
      ],
      popular: false,
      cta: 'Get started',
    },
    {
      name: 'Standard',
      price: '$29',
      period: '/month',
      description: 'For growing businesses',
      projects: 8,
      features: [
        '8 projects',
        'Advanced analytics',
        'Priority email support',
        'Unlimited team members',
        'Product image uploads',
        'Real-time sales dashboard',
        'Inventory management',
        'Export reports',
        'API access',
      ],
      popular: true,
      cta: 'Start free trial',
    },
    {
      name: 'Extreme',
      price: '$79',
      period: '/month',
      description: 'For large organizations',
      projects: 15,
      features: [
        '15 projects',
        'Everything in Standard',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security',
        'Multi-location support',
        'White-label options',
        'On-premise option',
      ],
      popular: false,
      cta: 'Contact sales',
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px' }}>
      <Container size="xl" py={80}>
        <Stack gap="xl" align="center">
          <div style={{ textAlign: 'center', maxWidth: '700px' }}>
            <Text tt="uppercase" fw={700} size="sm" c="dimmed" mb="md">
              Pricing
            </Text>
            <Title order={1} size={48} fw={700} mb="md">
              Simple, transparent pricing
            </Title>
            <Text size="lg" c="dimmed">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </Text>
          </div>

          <Grid gutter="xl">
            {plans.map((plan, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                <Card
                  shadow="sm"
                  padding="xl"
                  radius="md"
                  withBorder
                  className="pricing-card"
                  style={{
                    border: plan.popular ? '2px solid var(--mantine-color-blue-6)' : undefined,
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {plan.popular && (
                    <Badge
                      color="blue"
                      variant="filled"
                      style={{ position: 'absolute', top: 16, right: 16 }}
                      size="lg"
                    >
                      Most Popular
                    </Badge>
                  )}
                  <Stack gap="md" style={{ flex: 1 }}>
                    <div>
                      <Title order={3} fw={700} mb="xs">
                        {plan.name}
                      </Title>
                      <Text c="dimmed" size="sm">
                        {plan.description}
                      </Text>
                    </div>
                    <Group gap={4} align="flex-end">
                      <Text fz={36} fw={700}>
                        {plan.price}
                      </Text>
                      <Text c="dimmed" mb={4} size="sm">
                        {plan.period}
                      </Text>
                    </Group>
                    <Badge
                      variant="light"
                      color="blue"
                      size="lg"
                      style={{ width: 'fit-content' }}
                    >
                      {plan.projects} Projects
                    </Badge>
                    <Stack gap="xs" mt="md" style={{ flex: 1 }}>
                      {plan.features.map((feature, i) => (
                        <Group key={i} gap="xs" align="flex-start">
                          <IconCheck size={18} color="var(--mantine-color-green-6)" style={{ marginTop: 2 }} />
                          <Text size="sm" style={{ flex: 1 }}>
                            {feature}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                    <Button
                      fullWidth
                      mt="auto"
                      size="lg"
                      variant={plan.popular ? 'filled' : 'outline'}
                      component={Link}
                      href="/auth/signup"
                      radius="md"
                    >
                      {plan.cta}
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          <Card
            shadow="sm"
            padding="xl"
            radius="md"
            withBorder
            mt="xl"
            style={{ maxWidth: '800px', width: '100%' }}
          >
            <Stack gap="md" align="center" ta="center">
              <Title order={3}>Need more projects?</Title>
              <Text c="dimmed" size="sm">
                Contact us for custom enterprise plans with unlimited projects and dedicated
                support.
              </Text>
              <Button variant="outline" component={Link} href="/auth/signup" radius="md">
                Contact Sales
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  );
}
