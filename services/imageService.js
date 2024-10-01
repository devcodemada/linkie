import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";

export const getUserImageSrc = (imagePath) => {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
    } else {
        return require("../assets/images/defaultUser.png");
    }
};

export const getSupabaseFileUrl = (filePath) => {
    return {
        uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    };
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        let imageData = decode(fileBase64);

        let { data, error } = await supabase.storage
            .from("uploads")
            .upload(fileName, imageData, {
                cacheControl: "3600",
                upsert: false,
                contentType: isImage ? "image/*" : "video/*",
            });

        if (error) {
            return {
                success: false,
                msg: `Couldn't upload media`,
            };
        }

        return {
            success: true,
            data: data.path,
        };
    } catch (error) {
        console.log("Error uploading file : ", error);
        return {
            success: false,
            msg: `Couldn't upload media`,
        };
    }
};

const getFilePath = (folderName, isImage = true) => {
    return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};

export const downloadFile = async (url) => {
    try {
        const { uri } = await FileSystem.downloadAsync(
            url,
            getLocalFilePath(url)
        );

        return uri;
    } catch (error) {
        return null;
    }
};

export const getLocalFilePath = (filePath) => {
    let fileName = filePath.split("/").pop();
    return `${FileSystem.documentDirectory}${fileName}`;
};
