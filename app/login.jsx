import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";

import Button from "../components/Button";

const Login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                {/* Welcome text */}
                <View>
                    <Text style={styles.welcomeText}>Hey,</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>

                {/* form */}
                <View style={styles.form}>
                    <Text
                        style={{ fontSize: hp(1.5), color: theme.colors.text }}
                    >
                        Please login to continue
                    </Text>

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
                        title={"Login"}
                        onPress={onSubmit}
                        loading={loading}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Login;

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
