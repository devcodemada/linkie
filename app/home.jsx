import React from "react";
import { Alert, Button, Text } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const Home = () => {
    const { setAuth } = useAuth();
    const onLogout = async () => {
        setAuth(null);
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Sign out", error.message);
        }
    };
    return (
        <ScreenWrapper bg={"white"}>
            <Text>Home</Text>
            <Button title="Logout" onPress={onLogout} />
        </ScreenWrapper>
    );
};

export default Home;
