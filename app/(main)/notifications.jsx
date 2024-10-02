import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";
import NotificationItem from "../../components/NotificationItem";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { hp, wp } from "../../helpers/common";
import { fetchNotifications } from "../../services/postService";

const Notifications = () => {
    const [notification, setNotification] = useState([]);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        let res = await fetchNotifications(user?.id);
        if (res?.success) {
            console.log("res: ", res);
            setNotification(res.data);
        }
    };

    return (
        <ScreenWrapper bg={"white"}>
            <View style={styles.container}>
                <Header title={"Notifications"} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                >
                    {notification.map((item) => {
                        return (
                            <NotificationItem
                                item={item}
                                key={item?.id}
                                router={router}
                            />
                        );
                    })}

                    {notification.length == 0 && (
                        <View>
                            <Text style={styles.noData}>
                                No Notifications yet
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    listStyle: {
        paddingVertical: 20,
        gap: 10,
    },
    noData: {
        fontSize: hp(1.8),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
        textAlign: "center",
    },
});
