import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
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
        if (payload.eventType == "INSERT" && payload?.new?.id) {
            let newPost = { ...payload.new };

            let res = await getUserData(newPost.user_id);

            newPost.user = res?.success ? res.data : {};
            newPost.comments = [{ count: 0 }];
            newPost.post_likes = [];

            setPost((prev) => {
                return [newPost, ...prev];
            });
        }

        if (payload.eventType == "DELETE" && payload?.old?.id) {
            setPost((prev) => {
                let updatedPost = prev.filter((p) => p.id != payload?.old?.id);
                return updatedPost;
            });
        }

        if (payload.eventType == "UPDATE" && payload?.new?.id) {
            setPost((prev) => {
                let updatedPost = prev.map((p) => {
                    if (p.id == payload?.new?.id) {
                        p.body = payload?.new?.body;
                        p.file = payload?.new?.file;
                    }
                    return p;
                });
                return updatedPost;
            });
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

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await getPosts();
        setRefreshing(false);
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item }) => {
                    return (
                        <PostCard
                            item={item}
                            currentUser={user}
                            router={router}
                        />
                    );
                }}
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
