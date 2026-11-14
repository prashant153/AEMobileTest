import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ExpoImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";

export default function AccountStatusScreen() {
  const backgroundImageUri = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80";
  const { backendState, signOut } = useAuth();

  const status = backendState?.status;
  const approvalMessage = backendState?.metadata?.approval_message || 
    "Your account is under review. We'll notify you once it's approved.";
  const rejectionReason = backendState?.metadata?.rejection_reason;
  const suspensionReason = backendState?.metadata?.suspension_reason;

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(onboarding)");
  };

  const getStatusContent = () => {
    if (status === "PENDING_APPROVAL" || status === "WAITING_FOR_APPROVAL") {
      return {
        icon: "time-outline" as const,
        title: "Account Under Review",
        message: approvalMessage,
        color: "#3b82f6",
      };
    }
    
    if (status === "REJECTED") {
      return {
        icon: "close-circle-outline" as const,
        title: "Account Not Approved",
        message: rejectionReason || "Your account application was not approved.",
        color: "#ef4444",
      };
    }
    
    if (status === "SUSPENDED") {
      return {
        icon: "ban-outline" as const,
        title: "Account Suspended",
        message: suspensionReason || "Your account has been suspended.",
        color: "#f59e0b",
      };
    }

    return {
      icon: "information-circle-outline" as const,
      title: "Account Status",
      message: "Please contact support for more information.",
      color: "#6366f1",
    };
  };

  const content = getStatusContent();

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
          colors={["rgba(15,23,42,0.3)", "rgba(15,23,42,0.5)", "rgba(15,23,42,0.8)"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
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
            <Text style={styles.headerTitle}>ATHLETE EDGE</Text>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.statusContainer}>
            {/* Status Icon */}
            <View style={[styles.iconContainer, { backgroundColor: `${content.color}20` }]}>
              <Ionicons name={content.icon} size={64} color={content.color} />
            </View>

            {/* Status Title */}
            <Text style={styles.statusTitle}>{content.title}</Text>

            {/* Status Message */}
            <Text style={styles.statusMessage}>{content.message}</Text>

            {/* Additional Info */}
            {status === "PENDING_APPROVAL" || status === "WAITING_FOR_APPROVAL" ? (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#3b82f6" />
                <Text style={styles.infoText}>
                  You'll receive a notification once your account is approved. This usually takes 24-48 hours.
                </Text>
              </View>
            ) : null}

            {/* Action Buttons */}
            <View style={styles.actions}>
              {status === "PENDING_APPROVAL" || status === "WAITING_FOR_APPROVAL" ? (
                <Pressable style={styles.contactButton} onPress={() => {}}>
                  <Ionicons name="mail-outline" size={20} color="#FFF" />
                  <Text style={styles.contactButtonText}>Contact Support</Text>
                </Pressable>
              ) : null}

              <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
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
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    opacity: 0.7,
    textTransform: "uppercase",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statusContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  statusTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  statusMessage: {
    color: "#94a3b8",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(59,130,246,0.1)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    width: "100%",
  },
  infoText: {
    flex: 1,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  contactButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
});
