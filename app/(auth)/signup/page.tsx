"use client"

import { Box, Button, Checkbox, Grid, Group, Stack, Text, TextInput } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useForm } from '@mantine/form';

export default function SignUpScreen() {
  const isMobile = useMediaQuery("(max-width:780px)");

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Box h="100vh" w="100vw" m={0} p={0} style={{ overflow: "hidden" }}>
      <Grid h="100%" w="100%" m={0} gutter={0}>

        {/* Left */}
        <Grid.Col bg={"white"} span={isMobile ? 12 : 6} h="100%">
          <Stack h="100%" justify="center" align="center">
            <Text size="xl" fw={600}>Create your own page</Text>
          </Stack>
        </Grid.Col>

        {/* Right */}
        <Grid.Col span={isMobile ? 12 : 6} h="100%">
          <Stack h="100%" justify="center" px="lg">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />

              <Checkbox
                mt="md"
                label="I agree to sell my privacy"
                key={form.key('termsOfService')}
                {...form.getInputProps('termsOfService', { type: 'checkbox' })}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </Stack>
        </Grid.Col>

      </Grid>
    </Box>
  );
}
