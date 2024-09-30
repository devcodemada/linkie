import { useRouter } from "expo-router";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "../../assets/icons";
import Avatar from "../../components/Avatar";
import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
const Profile = () => {
    const { user, setAuth } = useAuth();
    const onLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Sign out", error.message);
        }
    };

    const handleLogout = async () => {
        Alert.alert("Confirm", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                onPress: () => console.log("modal cancel"),
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: () => onLogout(),
                style: "destructive",
            },
        ]);
    };
    const router = useRouter();
    return (
        <ScreenWrapper bg={"white"}>
            <UserHeader
                user={user}
                router={router}
                handleLogout={handleLogout}
            />
        </ScreenWrapper>
    );
};

const UserHeader = ({ user, router, handleLogout }) => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                paddingHorizontal: wp(4),
            }}
        >
            <View>
                <Header title="Profile" mb={30} />
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Icon name="logout" color={theme.colors.rose} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={{ gap: 15 }}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={user?.image}
                            size={hp(12)}
                            rounded={theme.radius.xxl * 1.4}
                        />
                        <Pressable
                            style={styles.editIcon}
                            onPress={() => router.push("/edit_profile")}
                        >
                            <Icon name="edit" strokeWidth={2.5} size={20} />
                        </Pressable>
                    </View>

                    {/* Username & Address */}
                    <View
                        style={{
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <Text style={styles.username}>{user && user.name}</Text>
                        <Text style={styles.infoText}>
                            {user && user.address}
                        </Text>
                    </View>

                    <View
                        style={{
                            gap: 10,
                        }}
                    >
                        <View style={styles.info}>
                            <Icon
                                name={"mail"}
                                color={theme.colors.textLight}
                                size={20}
                            />
                            <Text style={styles.infoText}>
                                {user && user.email}
                            </Text>
                        </View>
                        {user && user.phoneNumber && (
                            <View style={styles.info}>
                                <Icon
                                    name={"call"}
                                    color={theme.colors.textLight}
                                    size={20}
                                />
                                <Text style={styles.infoText}>
                                    {user && user.phoneNumber}
                                </Text>
                            </View>
                        )}
                        {user && user.bio && (
                            <Text style={styles.infoText}>{user.bio}</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20,
    },
    headerShape: {
        width: wp(100),
        height: hp(20),
    },
    logoutButton: {
        position: "absolute",
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: "#FEE2E2",
    },
    avatarContainer: {
        width: hp(12),
        height: hp(12),
        alignSelf: "center",
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: "white",
        shadowColor: theme.colors.textLight,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    username: {
        fontSize: hp(3),
        fontWeight: theme.fonts.bold,
        color: theme.colors.textDark,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.bold,
        color: theme.colors.textLight,
    },
});
