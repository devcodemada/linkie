import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import Avatar from "./Avatar";

const NotificationItem = ({ item, router }) => {
    const createdAt = moment(item?.created_at).format("MMM d, YYYY");
    const handleClick = () => {
        let { post_id, comment_id } = JSON.parse(item?.data);
        router.push({
            pathname: "/post_details",
            params: {
                postId: post_id,
                commentId: comment_id,
            },
        });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handleClick}>
            <Avatar uri={item?.sender?.image} size={hp(5)} />
            <View style={styles.nameTitle}>
                <Text style={styles.text}>{item?.sender?.name}</Text>
                <Text style={[styles.text, { color: theme.colors.textDark }]}>
                    {item?.title}
                </Text>
            </View>

            <Text style={[styles.text, { color: theme.colors.textLight }]}>
                {createdAt}
            </Text>
        </TouchableOpacity>
    );
};

export default NotificationItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: theme.colors.darkLight,
        padding: 15,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
    },
    nameTitle: {
        flex: 1,
        gap: 2,
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
    },
});
