"use client";
import { SignUpFromType } from "@/utils/types";
import { Button, Grid, Image, NumberInput, Paper, PasswordInput, Stack, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import 'react-phone-number-input/style.css';

const LoginPage = () => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            confirmPassword: "",
        },

        validate: {
            
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => {
                if (value.length < 8) return "Password must be at least 8 characters";
                if (!/[A-Z]/.test(value)) return "Must contain one uppercase letter";
                if (!/[0-9]/.test(value)) return "Must contain one number";
                if (!/[!@#$%^&*]/.test(value))
                    return "Must contain one special character";
                return null;
            },
        },
    });
    const isMobile = useMediaQuery("(max-width: 780px)");
    const tp = useMantineTheme();

    const handleError = () => {
        notifications.show({
            title: "Form Error",
            message: "Please fix all errors before submitting ❌",
            color: "red",
        });
    };
    const handleSignInForm = (value: typeof form.values) => {
        notifications.show({
            title: "Success",
            message: "Form submitted successfully 🎉",
            color: "green",
        });
        console.log(value);
    }
    return (
        <Grid m={0} p={0} mih="100vh" gutter={0} style={{ overflow: "hidden" }} >
            {!isMobile && <Grid.Col span={isMobile ? 12 : 6} p={0} m={0} mih={"100vh"} bg="white" >
                <Stack gap={10} justify="center">
                    <div style={{ padding: "30px" }}>
                        <Text c={tp.colors.dark[6]} m={0} p={0} fz={30} fw={700}>Welcome Back Starter</Text>
                        <Text c={tp.colors.dark[3]} m={0} p={0} fz={20}>See and make more Startup</Text>
                        <Text c={tp.colors.dark[3]} m={0} p={0} fz={13}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, ex quibusdam ipsam necessitatibus eveniet pariatur quia quod voluptas dolores, dolor dolore saepe perspiciatis facilis incidunt totam animi molestias harum error!</Text>
                    </div>
                    <Paper p={"5px 5px 5px 0px"} bg={"transparent"} bd={"2px solid black"} bdrs={"0% 3% 3% 0%"} w={"90%"}>
                        <Image src={"/dashboard.png"} alt="Test image" bdrs={"0% 3% 3% 0%"} h={400} w={"100%"} />
                    </Paper>
                </Stack>
            </Grid.Col>}

            <Grid.Col span={isMobile ? 12 : 6} mih={"100vh"} p="xl" m={0} bg="dark">
                <Stack gap={0} h={"100%"}>
                    <Paper bg={"transparent"} my={20}>
                        <Text fw={600} fz={25}>Sign In</Text>
                        <Text fz={14}>Let's connect with us!</Text>
                    </Paper>
                    <form onSubmit={form.onSubmit((values) => handleSignInForm(values), handleError)}>
                        <Stack>
                            
                            <TextInput label="Email" type="email" name="email" placeholder="john@example.com" {...form.getInputProps("email")} />
                            <PasswordInput
                                label="Password"
                                name="password"
                                placeholder="Input placeholder"
                                {...form.getInputProps("password")}
                                max={11}
                            />

                            <Button type="submit">
                                Sign In
                            </Button>
                            <Text>If you have not an account <Link style={{color:"skyblue"}} href={"/signup"}>Register now</Link></Text>
                        </Stack>
                    </form>
                </Stack>
            </Grid.Col>
        </Grid>
    );
};

export default LoginPage;
