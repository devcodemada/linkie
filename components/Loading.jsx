import React from "react";
import { ActivityIndicator, View } from "react-native";
import { theme } from "../constants/theme";

const Loading = ({ size = "large", color = theme.colors.primary }) => {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

export default Loading;
