import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image as ExpoImage } from "expo-image";

const Colors = {
  background: "#020617",
  surface: "#0f172a",
  primary: "#8b5cf6",
  secondary: "#3b82f6",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
  borderSubtle: "rgba(255,255,255,0.1)",
};

type Props = {
  onComplete?: () => void;
};

export default function RoleConfirmationSlide({ onComplete }: Props) {
  const backgroundImageUri =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDLzhZTnTymafOHX_oy8s4zZP5P9ZAhxn5tdlfQoCdLWGZdP2UAHGMftBsgE7VZZd4EkmjSwrrNrN1TzCZAn666cTTjrUOSphT6eg0Pg_9pGXINm4nU_HpF8uXWNwADLvCSY6maRr-vwW45Kpbede-cScbNxfvppXEmBPEP43kb0cEu1S68m7ZpsLcyt7GcviAB9VA9TtEzHb5xoiNVmrqsMsSuEOhseAk0mdB7wJRizGh0R7-8tKUAvYdnPRdcrKW01-UKzVVWyZR0";

  const profileImageUri =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCs-ghZ5KDzSxsKSa0J_qUJ5irAw__-LToYXBn17SCFVLKpyqDbtNyX-_J41_OQc20Uwx0OBPvzI-NvvDiaDaaGpn5O3XrqzxVL8QqEAVISO-RkZaWRp9oMAur0yYYsn10NyMFHwClqCnrHNPC8zixIKSt7ycLIsP2U7ciWX_x4h5VloG4U-hFQeofiI5B_qCBMeFrBI5q5z0HhVwVaQuNQIl1JkFYCacn_hCT270pm6wvBe3tcHPzOZYFt3Uu8nY4aBaLjHP5w2yWx";

  const handleContinue = () => {
    onComplete?.() || router.replace("/(tabs)");
  };

  const handleLogout = () => {
    // Navigate back to login or onboarding start
    router.replace("/(onboarding)");
  };

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={styles.backgroundLayer}>
        <ExpoImage
          source={{ uri: backgroundImageUri }}
          style={styles.backgroundImage}
          contentFit="cover"
          blurRadius={4}
          cachePolicy="memory-disk"
        />
        <LinearGradient
          colors={[
            "rgba(2,6,23,0.9)",
            "rgba(2,6,23,0.95)",
            "rgba(2,6,23,0.95)",
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(59,130,246,0.3)", "rgba(139,92,246,0.3)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Gradient Blob */}
      <View style={styles.gradientBlob} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.headerText}>ATHLETE EDGE</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Continue as <Text style={styles.titleGradient}>Coach</Text>?
            </Text>
            <Text style={styles.subtitle}>
              Please confirm your role to access the team dashboard.
            </Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={["rgba(59,130,246,0.1)", "rgba(139,92,246,0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCardGradient}
            />
            <View style={styles.profileCardTopLine} />

            <View style={styles.profileContent}>
              {/* Profile Image */}
              <View style={styles.profileImageContainer}>
                <LinearGradient
                  colors={[Colors.secondary, Colors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profileImageBorder}
                >
                  <View style={styles.profileImageWrapper}>
                    <ExpoImage
                      source={{ uri: profileImageUri }}
                      style={styles.profileImage}
                      contentFit="cover"
                    />
                  </View>
                </LinearGradient>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                </View>
              </View>

              {/* Profile Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Marcus Johnson</Text>
                <Text style={styles.profileRole}>Head Coach - Varsity Track</Text>
                <View style={styles.verifiedTag}>
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={styles.verifiedTagText}>Verified Account</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <SafeAreaView edges={["bottom"]} style={styles.footerContainer}>
          <View style={styles.footer}>
            <Pressable style={styles.continueButton} onPress={handleContinue}>
              <LinearGradient
                colors={[Colors.secondary, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#fff"
                  style={styles.continueButtonIcon}
                />
              </LinearGradient>
            </Pressable>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>
                Not Marcus?{" "}
                <Text style={styles.logoutButtonLink}>Logout</Text>
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  gradientBlob: {
    position: "absolute",
    top: "-10%",
    left: "50%",
    width: 600,
    height: 600,
    marginLeft: -300,
    borderRadius: 300,
    backgroundColor: "rgba(139,92,246,0.2)",
    opacity: 0.3,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logo: {
    width: 24,
    height: 24,
  },
  headerSpacer: {
    flex: 1,
  },
  headerText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    opacity: 0.7,
    textTransform: "uppercase",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 32,
  },
  titleGradient: {
    color: Colors.primary,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  profileCard: {
    width: "100%",
    backgroundColor: "rgba(15,23,42,0.4)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    position: "relative",
    overflow: "hidden",
  },
  profileCardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  profileCardTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  profileContent: {
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImageBorder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
    overflow: "hidden",
    backgroundColor: "#1e293b",
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  profileInfo: {
    alignItems: "center",
    gap: 4,
  },
  profileName: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  profileRole: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  verifiedTagText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footerContainer: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  continueButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  continueButtonIcon: {
    marginLeft: 4,
  },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButtonLink: {
    color: Colors.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

