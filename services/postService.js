import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
    try {
        if (post.file && typeof post.file == "object") {
            let isImage = post?.file?.type == "image";
            let folderName = isImage ? "postImages" : "postVideos";

            let fileResult = await uploadFile(
                folderName,
                post?.file?.uri,
                isImage
            );

            if (fileResult.success) {
                post.file = fileResult.data;
            } else {
                return fileResult;
            }
        }

        const { data, error } = await supabase
            .from("posts")
            .upsert(post)
            .select()
            .single();

        if (error) {
            console.log("create or update post error : ", error);
            return {
                success: false,
                msg: `Couldn't create or update post`,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.log("create or update post error : ", error);
        return {
            success: false,
            msg: `Couldn't create or update post`,
        };
    }
};

export const fetchPosts = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select(
                `
                    *, 
                    user: users (id, name, image),
                    post_likes (*),
                    comments (count)
                `
            )
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.log("fetch post error : ", error);
            return {
                success: false,
                msg: `Couldn't fetch the posts`,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.log("fetch post error : ", error);
        return {
            success: false,
            msg: `Couldn't fetch the posts`,
        };
    }
};
export const createPostLike = async (postLike) => {
    try {
        const { data, error } = await supabase
            .from("post_likes")
            .insert(postLike)
            .select()
            .single();

        if (error) {
            console.log("Post like error : ", error);
            return {
                success: false,
                msg: `Couldn't like the post`,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.log("Post like error : ", error);
        return {
            success: false,
            msg: `Couldn't like the post`,
        };
    }
};

export const removePostLike = async (postId, userId) => {
    try {
        const { error } = await supabase
            .from("post_likes")
            .delete()
            .eq("user_id", userId)
            .eq("post_id", postId);

        if (error) {
            console.log("Post like error : ", error);
            return {
                success: false,
                msg: `Couldn't remove the post like`,
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.log("Post like error : ", error);
        return {
            success: false,
            msg: `Couldn't remove the post like`,
        };
    }
};

export const fetchPostDetails = async (postId) => {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select(
                `
                *,
                user: users (id, name, image),
                post_likes (*),
                comments (*, user: users(id,name,image))
            `
            )
            .eq("id", postId)
            .order("created_at", { ascending: false, foreignTable: "comments" })
            .single();

        if (error) {
            console.log("Fetch post details error : ", error);
            return {
                success: false,
                msg: `Couldn't fetch the post details`,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.log("Fetch post details error : ", error);
        return {
            success: false,
            msg: `Couldn't fetch the post details`,
        };
    }
};
export const createComment = async (comment) => {
    try {
        const { data, error } = await supabase
            .from("comments")
            .insert(comment)
            .select()
            .single();

        if (error) {
            console.log("Comment error : ", error);
            return {
                success: false,
                msg: `Couldn't create the comment`,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.log("Comment error : ", error);
        return {
            success: false,
            msg: `Couldn't create the comment`,
        };
    }
};
export const removeComment = async (commentId) => {
    try {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);

        if (error) {
            console.log("Delete comment error : ", error);
            return {
                success: false,
                msg: `Couldn't delete the comment`,
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.log("Delete comment error : ", error);
        return {
            success: false,
            msg: `Couldn't delete the comment`,
        };
    }
};

export const removePost = async (postId) => {
    try {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (error) {
            console.log("Delete post error : ", error);
            return {
                success: false,
                msg: `Couldn't delete the post`,
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.log("Delete post error : ", error);
        return {
            success: false,
            msg: `Couldn't delete the post`,
        };
    }
};
