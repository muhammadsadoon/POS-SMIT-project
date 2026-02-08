"use client";
import { useSignupUserMutation } from "@/store/actions/auth-action/auth-action";
import { Button, Grid, Image, NumberInput, Paper, PasswordInput, Stack, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";

const SignUpPage = () => {
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
            name: (value) => (value.length > 5 ? null : 'At les enter the 4 character your name'),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phone: (value) => {
                console.log(String(value).length)
                return String(value).length === 10 ? null : 'Number must be exactly 11 characters'},
            password: (value) => {
                if (value.length < 8) return "Password must be at least 8 characters";
                if (!/[A-Z]/.test(value)) return "Must contain one uppercase letter";
                if (!/[0-9]/.test(value)) return "Must contain one number";
                if (!/[!@#$%^&*]/.test(value))
                    return "Must contain one special character";
                return null;
            },
            confirmPassword: (v, values) => v !== values.password ? "Passwords do not match" : null,
        },
    });
    const isMobile = useMediaQuery("(max-width: 780px)");
    const tp = useMantineTheme();
    console.log(form.values.phone.length)
    const handleError = () => {
        notifications.show({
            title: "Form Error",
            message: "Please fix all errors before submitting ❌",
            color: "red",
        });
    };

    // handle signUp auth with simple email and password...

    const [handleSignUp] = useSignupUserMutation();
    const handleSignInForm = async (value: typeof form.values) => {
        try {
            const res = await handleSignUp({
                name: value.name,
                email: value.email,
                password: btoa(value.password),
                phone: value.phone
            })

            if (res.error) throw new Error(`${res.error}`);
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
            }else{
                console.log("Err: ",err)
            }
        }
    }
    return (
        <Grid m={0} p={0} mih="100vh" gutter={0} style={{ overflow: "hidden" }} >
            {!isMobile && <Grid.Col span={isMobile ? 12 : 6} p={0} m={0} mih={"100vh"} bg="white" >
                <Stack gap={10} justify="center">
                    <div style={{ padding: "30px" }}>
                        <Text c={tp.colors.dark[6]} m={0} p={0} fz={30} fw={700}>Create your Starter</Text>
                        <Text c={tp.colors.dark[3]} m={0} p={0} fz={20}>See and make more Startup</Text>
                        <Text c={tp.colors.dark[3]} m={0} p={0} fz={13}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, ex quibusdam ipsam necessitatibus eveniet pariatur quia quod voluptas dolores, dolor dolore saepe perspiciatis facilis incidunt totam animi molestias harum error!</Text>
                    </div>
                    <Paper p={"5px 5px 5px 0px"} bg={"transparent"} bd={"2px solid black"} bdrs={"0% 3% 3% 0%"} w={"90%"}>
                        <Image src={"/dashboard.png"} alt="Test image" bdrs={"0% 3% 3% 0%"} h={400} w={"100%"} />
                    </Paper>
                </Stack>
            </Grid.Col>}

            <Grid.Col span={isMobile ? 12 : 6} mih={"100vh"} p="xl" m={0}>
                <Stack gap={0} h={"100%"}>
                    <Paper bg={"transparent"} my={20}>
                        <Text fw={600} fz={25}>Sign Up</Text>
                        <Text fz={14}>Let's connect with us!</Text>
                    </Paper>
                    <form onSubmit={form.onSubmit((values) => handleSignInForm(values), handleError)}>
                        <Stack>
                            <TextInput label="Name" type="text" name="name" placeholder="e.o John Doe" {...form.getInputProps("name")} />
                            <TextInput label="Email" type="email" name="email" placeholder="john@example.com" {...form.getInputProps("email")} />
                            <NumberInput
                                label="Phone Number"
                                placeholder="345 0012345"
                                {...form.getInputProps("phone")}
                            />
                            <PasswordInput
                                label="Password"
                                name="password"
                                placeholder="Input placeholder"
                                {...form.getInputProps("password")}
                                max={11}
                            />

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="confirm password"
                                {...form.getInputProps("confirmPassword")}
                            />
                            <Button type="submit">
                                Sign In
                            </Button>
                            <Text fz={14}>If you have already account <Link style={{ color: "skyblue" }} href={"/login"}>login now</Link></Text>
                        </Stack>
                    </form>
                </Stack>
            </Grid.Col>
        </Grid>
    );
};

export default SignUpPage;
