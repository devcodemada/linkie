import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Avatar from "../../components/Avatar";
import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";

import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Icon from "../../assets/icons";
import Button from "../../components/Button";
import RichTextEditor from "../../components/RichTextEditor";
import { useAuth } from "../../context/AuthContext";

import { Video } from "expo-av";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "../../services/imageService";
import { createOrUpdatePost } from "../../services/postService";

const newPost = () => {
    const post = useLocalSearchParams();

    useEffect(() => {
        if (post && post?.id) {
            bodyRef.current = post?.body;
            console.log(post?.file);
            setFile(post?.file || null);
            setTimeout(() => {
                editorRef.current?.setContentHTML(post?.body);
            }, 300);
        }
    }, []);

    const { user } = useAuth();
    const bodyRef = useRef("");
    const editorRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(file);

    const onPick = async (isImage) => {
        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        };

        if (!isImage) {
            mediaConfig = {
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
            };
        }
        const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    };

    const isLocalFile = (file) => {
        if (!file) return null;
        if (typeof file == "object") return true;
        return false;
    };

    const getFileType = (file) => {
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.type;
        }

        if (file.includes("postImages")) return "image";

        return "video";
    };

    const getFileUri = (file) => {
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.uri;
        }

        return getSupabaseFileUrl(file)?.uri;
    };

    const onSubmit = async () => {
        if (!bodyRef.current && !file) {
            Alert.alert("Post", "Please choose an image or add post body");
            return;
        }

        let data = {
            file,
            body: bodyRef.current,
            user_id: user?.id,
        };

        if (post && post?.id) data.id = post?.id;

        setLoading(true);
        const result = await createOrUpdatePost(data);
        setLoading(false);

        if (result?.success) {
            setFile(null);
            bodyRef.current = "";
            editorRef.current?.setContentHTML("");
            router.replace("/home");
        } else {
            Alert.alert("Post", result?.msg);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <Header title="Create Post" />
                <ScrollView contentContainerStyle={{ gap: 20 }}>
                    {/* Avatar */}
                    <View style={styles.header}>
                        <Avatar
                            uri={user?.image}
                            size={hp(6.5)}
                            rounded={theme.radius.xl}
                        />

                        <View style={{ gap: 2 }}>
                            <Text style={styles.username}>
                                {user && user.name}
                            </Text>
                            <Text style={styles.publicText}>Public</Text>
                        </View>
                    </View>

                    <View style={styles.textEditor}>
                        <RichTextEditor
                            editorRef={editorRef}
                            onChange={(body) => (bodyRef.current = body)}
                        />
                    </View>

                    {file && (
                        <View style={styles.file}>
                            {getFileType(file) === "video" ? (
                                <Video
                                    style={{ flex: 1 }}
                                    source={{ uri: getFileUri(file) }}
                                    useNativeControls
                                    resizeMode="cover"
                                    isLooping
                                />
                            ) : (
                                <Image
                                    source={{ uri: getFileUri(file) }}
                                    contentFit="cover"
                                    style={{ flex: 1 }}
                                />
                            )}

                            <Pressable
                                style={styles.closeIcon}
                                onPress={() => setFile(null)}
                            >
                                <Icon name="delete" color={"white"} size={20} />
                            </Pressable>
                        </View>
                    )}

                    <View style={styles.media}>
                        <Text style={styles.addImageText}>
                            Add to your post
                        </Text>
                        <View style={styles.mediaIcons}>
                            <TouchableOpacity onPress={() => onPick(true)}>
                                <Icon
                                    name={"image"}
                                    color={theme.colors.dark}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onPick(false)}>
                                <Icon
                                    name={"video"}
                                    color={theme.colors.dark}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Button
                    buttonStyle={{ height: hp(6.2) }}
                    title={post && post?.id ? "Update" : "Post"}
                    onPress={onSubmit}
                    loading={loading}
                    hasShadow={false}
                />
            </View>
        </ScreenWrapper>
    );
};

export default newPost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    username: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    title: {
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.text,
        textAlign: "center",
    },
    avatar: {
        height: hp(6.5),
        width: hp(6.5),
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
    },
    publicText: {
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textLight,
    },
    textEditor: {},
    addImageText: {
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.textDark,
    },
    imageIcon: {
        borderRadius: theme.radius.md,
    },
    file: {
        height: hp(30),
        width: "100%",
        borderRadius: theme.radius.xl,
        overflow: "hidden",
        borderCurve: "continuous",
    },
    media: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        borderColor: theme.colors.gray,
    },
    mediaIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    video: {},
    closeIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 7,
        backgroundColor: "rgba(255,0,0,0.6)",
        borderRadius: 50,
    },
});
