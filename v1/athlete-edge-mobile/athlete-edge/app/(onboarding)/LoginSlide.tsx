import { View, Text, StyleSheet, Pressable, Image, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";

const Colors = {
  background: "#0f172a",
  surface: "rgba(30,41,59,0.4)",
  primary: "#818cf8",
  primaryHover: "#6366f1",
  accentBlue: "#3b82f6",
  accentPurple: "#a855f7",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
  borderSubtle: "rgba(255,255,255,0.1)",
  surfaceDark: "#1e293b",
};

type Props = {
  onComplete?: () => void;
  onTabSelected?: (tab: "phone" | "email") => void;
};

export default function LoginSlide({ onComplete, onTabSelected }: Props) {
  const backgroundImageUri = "https://lh3.googleusercontent.com/aida-public/AB6AXuBlKY9knEoW8yLga79g-trbEf4V4msrMFTVvwVz6gTdDTgfYFBcuvvX2ZzeMBmgqxd6VCowV25StfjSE8moWrzi-C6L80a2FbetHG6mD5lLRDAf_8bfRZpbDY-jHb_NNccqxjh6DwYMC2lGOUCWy_7qFxAV43SjKNfKuXL8_YdLhZ4cisKSgH94CpdQWWVtPOgPBVfuGTIAVuqluN8vy7Vo7At3tNqAktXv_B7IfF5_FvZAhFfW3zd2BttRDYo3spe8dUjaFA6ZXEvy";

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={styles.backgroundLayer}>
        <ExpoImage
          source={{ uri: backgroundImageUri }}
          style={styles.backgroundImage}
          contentFit="cover"
          blurRadius={2}
        />
        <LinearGradient
          colors={["rgba(59,130,246,0.1)", "rgba(15,23,42,0.5)", "rgba(15,23,42,0.8)"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Gradient Blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* Content */}
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandText}>Athlete Edge</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.title}>Unlock Your Edge</Text>
              <Text style={styles.subtitle}>
                Track, analyze, and improve your performance.
              </Text>
            </View>

            {/* Glass Panel */}
            <BlurView intensity={12} tint="dark" style={styles.glassPanel}>
              <Text style={styles.sectionTitle}>Choose login method</Text>

              {/* Phone CTA */}
              <Pressable onPress={() => onTabSelected?.("phone")}>
                <LinearGradient
                  colors={[Colors.accentBlue, Colors.accentPurple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.phoneButton}
                >
                  <MaterialIcons name="smartphone" size={24} color="#fff" />
                  <Text style={styles.phoneButtonText}>Continue with Phone</Text>
                </LinearGradient>
              </Pressable>

              {/* Email CTA */}
              <Pressable onPress={() => onTabSelected?.("email")}>
                <LinearGradient
                  colors={[Colors.accentBlue, Colors.accentPurple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.phoneButton}
                >
                  <Ionicons name="mail" size={24} color="#fff" />
                  <Text style={styles.phoneButtonText}>Continue with Email</Text>
                </LinearGradient>
              </Pressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialGrid}>
                <Pressable 
                  style={styles.socialButton}
                  disabled
                >
                  <GoogleIcon />
                  <Text style={styles.socialButtonText}>Google</Text>
                </Pressable>
                <Pressable 
                  style={styles.socialButton}
                  disabled
                >
                  <FacebookIcon />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </Pressable>
              </View>
            </BlurView>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text 
                style={styles.footerLink}
                onPress={() => Linking.openURL("https://example.com/terms")}
              >
                Terms of Service
              </Text>
              {" "}& {" "}
              <Text 
                style={styles.footerLink}
                onPress={() => Linking.openURL("https://example.com/privacy")}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Google Icon Component - Using Google logo image
function GoogleIcon() {
  return (
    <Image
      source={{ uri: "https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" }}
      style={styles.googleIcon}
      resizeMode="contain"
    />
  );
}

// Facebook Icon Component
function FacebookIcon() {
  return (
    <Ionicons name="logo-facebook" size={20} color="#1877F2" />
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
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  blob1: {
    position: "absolute",
    top: "-15%",
    left: "-10%",
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "rgba(59,130,246,0.2)",
    opacity: 0.4,
    zIndex: 1,
  },
  blob2: {
    position: "absolute",
    bottom: "-10%",
    right: "-10%",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(168,85,247,0.2)",
    opacity: 0.3,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerContent: {
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
  brandText: {
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
    paddingVertical: 32,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "rgba(168,85,247,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
  glassPanel: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  phoneButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: Colors.accentPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  phoneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#64748b",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  socialGrid: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: "rgba(30,41,59,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    paddingVertical: 24,
    paddingBottom: 60, // Extra space for progress dots
    alignItems: "center",
  },
  footerText: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 300,
  },
  footerLink: {
    color: Colors.accentBlue,
    textDecorationLine: "underline",
  },
});
