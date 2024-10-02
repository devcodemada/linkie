import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "../../assets/icons";
import CommentItem from "../../components/CommentItem";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import {
    createComment,
    createNotification,
    fetchPostDetails,
    removeComment,
    removePost,
} from "../../services/postService";
import { getUserData } from "../../services/userService";

const PostDetails = () => {
    const { postId, commentId } = useLocalSearchParams();
    const { user } = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const [post, setPost] = useState(null);

    const inputRef = useRef(null);
    const commentRef = useRef("");

    const handleNewComment = async (payload) => {
        if (payload.new) {
            let newComment = { ...payload.new };
            let res = await getUserData(newComment.user_id);

            newComment.user = res.success ? res.data : {};
            setPost((prev) => {
                return { ...prev, comments: [newComment, ...prev.comments] };
            });
        }
    };

    useEffect(() => {
        let commentChannel = supabase
            .channel("comments")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "comments",
                    filter: `post_id=eq.${postId}`,
                },
                handleNewComment
            )
            .subscribe();

        getPostDetails();

        return () => {
            supabase.removeChannel(commentChannel);
        };
    }, []);

    const getPostDetails = async () => {
        let res = await fetchPostDetails(postId);

        if (res?.success) {
            setPost(res.data);
        }

        setStartLoading(false);
    };

    const [loading, setLoading] = useState(false);

    const onNewComment = async () => {
        if (!commentRef.current) return null;

        let data = {
            user_id: user?.id,
            post_id: post?.id,
            text: commentRef.current,
        };

        setLoading(true);

        // create comment
        let res = await createComment(data);
        setLoading(false);

        if (res?.success) {
            if (user.id != post.user_id) {
                let notify = {
                    sender_id: user.id,
                    receiver_id: post.user_id,
                    title: "Commented on your post",
                    data: JSON.stringify({
                        post_id: post.id,
                        comment_id: res?.data?.id,
                    }),
                };

                createNotification(notify);
            }
            inputRef.current?.clear();
            commentRef.current = "";
        } else {
            Alert.alert("Comment", res.msg);
        }
    };

    if (startLoading) {
        return (
            <View style={styles.center}>
                <Loading />
            </View>
        );
    }

    if (!post) {
        return (
            <View
                style={[
                    styles.center,
                    {
                        justifyContent: "flex-start",
                        marginTop: 100,
                    },
                ]}
            >
                <Text style={styles.notFound}>Post not found !</Text>
            </View>
        );
    }

    const onDeleteComment = async (comment) => {
        let res = await removeComment(comment?.id);
        if (res?.success) {
            setPost((prev) => {
                let updatedPost = { ...prev };
                updatedPost.comments = updatedPost.comments.filter(
                    (c) => c.id !== comment?.id
                );
                return updatedPost;
            });
        } else {
            Alert.alert("Comment", res?.msg);
        }
    };

    const onEditPost = async (item) => {
        router.push({
            pathname: "/new_post",
            params: {
                ...item,
            },
        });
    };
    const onDeletePost = async () => {
        let res = await removePost(post.id);
        if (res?.success) {
            router.back();
        } else {
            Alert.alert("Post", res?.msg);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                <PostCard
                    item={{
                        ...post,
                        comments: [{ count: post?.comments?.length }],
                    }}
                    currentUser={user}
                    router={router}
                    hasShadow={false}
                    showMoreIcon={false}
                    showDelete={true}
                    onDelete={onDeletePost}
                    onEdit={onEditPost}
                />

                {/* Comment input */}
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Type comment..."
                        placeholderTextColor={theme.colors.textLight}
                        containerStyle={{
                            flex: 1,
                            height: hp(6.2),
                            borderRadius: theme.radius.xl,
                        }}
                        inputRef={inputRef}
                        onChangeText={(text) => (commentRef.current = text)}
                    />
                    {loading ? (
                        <View style={styles.loading}>
                            <Loading size="small" />
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.sendIcon}
                            onPress={onNewComment}
                        >
                            <Icon
                                name="send"
                                color={theme.colors.primaryDark}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{ marginVertical: 15, gap: 17 }}>
                    {post?.comments?.map((comment) => (
                        <CommentItem
                            key={comment?.id?.toString()}
                            item={comment}
                            canDelete={
                                user.id == comment?.user_id ||
                                user.id == post.user_id
                            }
                            onDeleteComment={() => onDeleteComment(comment)}
                            highlight={comment.id == commentId}
                        />
                    ))}

                    {post?.comments?.length == 0 && (
                        <Text
                            style={{ color: theme.colors.text, marginLeft: 5 }}
                        >
                            Be first to comment!
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default PostDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: wp(7),
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    list: {
        paddingHorizontal: wp(4),
    },
    sendIcon: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: "continuous",
        height: hp(5.8),
        width: hp(5.8),
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: "center",
        alignItems: "center",
        transform: [
            {
                scale: 1.3,
            },
        ],
    },
});
