import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../../assets/icons";
import Avatar from "../../components/Avatar";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import { fetchPosts } from "../../services/postService";
import { getUserData } from "../../services/userService";

var limit = 0;
const Home = () => {
    const { user } = useAuth();
    const router = useRouter();

    const [post, setPost] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const handlePostEvent = async (payload) => {
        if (payload.eventType === "INSERT" && payload?.new?.id) {
            let newPost = { ...payload.new };
            let res = await getUserData(newPost.user_id);

            newPost.user = res.success ? res.data : {};
            setPost((prev) => [newPost, ...prev]);
        }
    };

    useEffect(() => {
        let postChannel = supabase
            .channel("posts")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "posts",
                },
                handlePostEvent
            )
            .subscribe();

        // getPosts();

        return () => {
            supabase.removeChannel(postChannel);
        };
    }, []);

    const getPosts = async () => {
        if (hasMore == false) return null;
        limit = limit + 10;

        let response = await fetchPosts(limit);

        if (response.success) {
            if (post.length == response.data.length) setHasMore(false);
            setPost(response.data);
        }
    };

    return (
        <ScreenWrapper bg={"white"}>
            <View style={StyleSheet.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Linkie</Text>
                    <View style={styles.icons}>
                        <Pressable
                            onPress={() => router.push("/notifications")}
                        >
                            <Icon
                                name="heart"
                                size={hp(3.2)}
                                strokeWidth={2}
                                color={theme.colors.text}
                            />
                        </Pressable>
                        <Pressable onPress={() => router.push("/new_post")}>
                            <Icon
                                name="plus"
                                size={hp(3.2)}
                                strokeWidth={2}
                                color={theme.colors.text}
                            />
                        </Pressable>
                        <Pressable onPress={() => router.push("/profile")}>
                            <Avatar
                                uri={user?.image}
                                size={hp(4.3)}
                                rounded={theme.radius.sm}
                                style={{ borderWidth: 2 }}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>

            <FlatList
                data={post}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listStyle}
                key={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostCard item={item} currentUser={user} router={router} />
                )}
                ListFooterComponent={
                    hasMore ? (
                        <View
                            style={{
                                marginVertical: post.length == 0 ? 200 : 30,
                            }}
                        >
                            <Loading />
                        </View>
                    ) : (
                        <View style={{ marginVertical: 30 }}>
                            <Text style={styles.noPost}>No more posts</Text>
                        </View>
                    )
                }
                onEndReached={() => {
                    getPosts();
                    console.log(`end reached : ${limit}`);
                }}
                onEndReachedThreshold={0}
            />
        </ScreenWrapper>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        marginHorizontal: wp(4),
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: "continuous",
        borderColor: theme.colors.gray,
        borderWidth: 3,
    },
    icons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4),
    },
    noPost: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.text,
    },
});
