import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";

const index = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <Text>index</Text>
            <Pressable onPress={() => router.push("welcome")}>
                <Text>Welcome</Text>
            </Pressable>
        </ScreenWrapper>
    );
};

export default index;
