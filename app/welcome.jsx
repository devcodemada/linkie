import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";

const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                {/* welcome image */}
                <Image
                    source={require("../assets/images/welcome.png")}
                    style={styles.welcomeImage}
                    resizeMode="contain"
                />

                {/* title */}
                <View style={{ gap: 20 }}>
                    <Text style={styles.title}>Linkie</Text>
                    <Text style={styles.punchLine}>
                        Where every thought finds a home and every image tells a
                        story!
                    </Text>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Button
                        title="Getting Started"
                        buttonStyle={{
                            marginHorizontal: wp(3),
                        }}
                        onPress={() => router.push("signup")}
                    />
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.loginText}>
                            Already have an account!
                        </Text>
                        <Pressable onPress={() => router.push("login")}>
                            <Text
                                style={[
                                    styles.loginText,
                                    {
                                        color: theme.colors.primary,
                                        fontWeight: theme.fonts.semiBold,
                                    },
                                ]}
                            >
                                Login
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
        marginHorizontal: wp(4),
    },
    welcomeImage: {
        width: wp(100),
        height: hp(30),
        alignSelf: "center",
    },
    title: {
        fontWeight: theme.fonts.extraBold,
        fontSize: hp(4),
        color: theme.colors.text,
        textAlign: "center",
    },
    punchLine: {
        textAlign: "center",
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text,
    },
    footer: {
        width: "100%",
        gap: 20,
    },
    bottomTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },
    loginText: {
        color: theme.colors.text,
        textAlign: "center",
        fontSize: hp(1.6),
    },
});
