"use client";

import { Container, Title, Text, Stack } from '@mantine/core';
import { gsap } from 'gsap';
import { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    gsap.from('.about-content', {
      opacity: 0,
      y: 20,
      duration: 0.6,
    });
  }, []);

  return (
    <Container size="xl" py={80}>
      <Stack gap="xl" className="about-content">
        <Title order={1}>About Us</Title>
        <Text size="lg">
          Our Store Management System is designed to help businesses of all sizes
          manage their operations efficiently. Whether you run a single store or
          multiple locations, our platform provides the tools you need.
        </Text>
        <Title order={2}>Our Mission</Title>
        <Text>
          To empower businesses with modern, intuitive tools that simplify store
          management, improve efficiency, and drive growth.
        </Text>
        <Title order={2}>Key Benefits</Title>
        <Stack gap="md">
          <Text>• Multi-store management from a single dashboard</Text>
          <Text>• Real-time sales tracking and analytics</Text>
          <Text>• Role-based access control for team collaboration</Text>
          <Text>• Mobile-friendly POS system for staff</Text>
          <Text>• Secure product management with password protection</Text>
        </Stack>
      </Stack>
    </Container>
  );
}
