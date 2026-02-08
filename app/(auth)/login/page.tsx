"use client";
import { useGoogleAuthMutation, useLoginUserMutation } from "@/store/actions/auth-action/auth-action";
import { Button, Divider, Grid, Group, Image, NumberInput, Paper, PasswordInput, Stack, Text, TextInput, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";

const LoginPage = () => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
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
    // handle signIn auth
    const [handleUserSginInWithEmailAndPassword, { isLoading, error }] = useLoginUserMutation();
    const handleSignInForm = async (value: typeof form.values) => {
        try {
            const res = await handleUserSginInWithEmailAndPassword({
                email: value.email,
                password: btoa(value.password)
            })
            if (res?.error) throw new Error(`${res.error}`);
            else notifications.show({
                title: "Success",
                message: "Form submitted successfully 🎉",
                color: "green",
            });
        } catch (err) {
            if (err instanceof Error) {
                notifications.show({
                    title: "Error",
                    message: `${err.message}`,
                    color: "red",
                });
            } else {
                console.log("Err: ", err)
            }
        }
    }

    // handle the google signin instance here...
    const [userSignInWithGoogle] = useGoogleAuthMutation();
    const handleSignInWithGoogle = (value: typeof form.values) => {
        console.log(value)
        userSignInWithGoogle({})
    }

    const { colorScheme } = useMantineColorScheme();
    console.log(colorScheme)
    return (
        <Grid m={0} p={0} mih="100vh" gutter={0} style={{ overflow: "hidden" }} >
            {!isMobile && <Grid.Col span={isMobile ? 12 : 6} p={0} m={0} mih={"100vh"} bg={colorScheme == "dark" ? "light" : "dark"} >
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

            <Grid.Col span={isMobile ? 12 : 6} mih={"100vh"} p="xl" m={0} >
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
                            <Text fz={14}>If you have not an account <Link style={{ color: "skyblue" }} href={"/signup"}>Register now</Link></Text>
                            <Divider label="or" />
                            <Button onClick={() => handleSignInWithGoogle(form.values)}>
                                <Group gap={10} justify="center">
                                    <FaGoogle /><Text>Continue with google</Text>
                                </Group>
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Grid.Col>
        </Grid>
    );
};

export default LoginPage;
