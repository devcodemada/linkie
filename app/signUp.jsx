import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";

import { Alert } from "react-native";
import Button from "../components/Button";

import { supabase } from "../lib/supabase";

const SignUp = () => {
    const router = useRouter();
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert("Sign up", "please fill all the fields!");
            return;
        }

        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) {
            setLoading(false);
            Alert.alert("Sign up", error.message);
            return;
        }

        console.log(data);
        setLoading(false);
    };

    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                {/* Welcome text */}
                <View>
                    <Text style={styles.welcomeText}>Let's,</Text>
                    <Text style={styles.welcomeText}>Get Started</Text>
                </View>

                {/* form */}
                <View style={styles.form}>
                    <Text
                        style={{ fontSize: hp(1.5), color: theme.colors.text }}
                    >
                        Please fill the details to create an account
                    </Text>

                    <Input
                        icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                        placeholder="Enter your name"
                        onChangeText={(value) => (nameRef.current = value)}
                    />
                    <Input
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder="Enter your email"
                        onChangeText={(value) => (emailRef.current = value)}
                    />

                    <Input
                        icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                        placeholder="Enter your password"
                        secureTextEntry
                        onChangeText={(value) => (passwordRef.current = value)}
                    />

                    <Text style={styles.forgotPassword}>Forgot password?</Text>

                    {/* Button */}
                    <Button
                        title={"Sign up"}
                        onPress={onSubmit}
                        loading={loading}
                    />
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account!
                    </Text>
                    <Pressable onPress={() => router.push("login")}>
                        <Text
                            style={[
                                styles.footerText,
                                {
                                    color: theme.colors.primaryDark,
                                    fontWeight: theme.fonts.semiBold,
                                },
                            ]}
                        >
                            Login
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        marginHorizontal: wp(5),
    },
    welcomeText: {
        fontWeight: theme.fonts.bold,
        fontSize: hp(4),
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    footerText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6),
    },
});
