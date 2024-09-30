import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";

export default _layout = () => {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    );
};

const MainLayout = () => {
    const { setAuth, setUserData } = useAuth();
    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log(session?.user);

            if (session) {
                setAuth(session?.user);
                updateUserData(session?.user);
                router.replace("/home");
            } else {
                setAuth(null);
                router.replace("/welcome");
            }
        });
    }, []);

    const updateUserData = async (user) => {
        let res = await getUserData(user?.id);
        if (res?.success) {
            setUserData(res.data);
        }
    };
    return <Stack screenOptions={{ headerShown: false }} />;
};
