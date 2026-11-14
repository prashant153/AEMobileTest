import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ExpoImage } from "expo-image";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../contexts/AuthContext";
import { navigateFromAuthState } from "@/lib/navigation/authRouter";

type RoleType = "ATHLETE" | "COACH" | "ACADEMY" | "PARENT";

type RoleOption = {
  key: RoleType;
  title: string;
  subtitle: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
};

export default function RoleIntentSelectionScreen() {
  const backgroundImageUri = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80";
  
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { resolveAuth, session } = useAuth();

  const roles: RoleOption[] = [
    {
      key: "ATHLETE",
      title: "Train as an Athlete",
      subtitle: "Track your performance, view stats, and monitor progress",
      iconName: "directions-run",
    },
    {
      key: "COACH",
      title: "Coach Athletes",
      subtitle: "Plan sessions, monitor players, and manage your team",
      iconName: "sports",
    },
    {
      key: "ACADEMY",
      title: "Manage an Academy",
      subtitle: "Manage coaches, batches, and view analytics",
      iconName: "domain",
    },
    {
      key: "PARENT",
      title: "Follow my child's journey",
      subtitle: "View attendance, performance insights, and progress",
      iconName: "family-restroom",
    },
  ];

  const handleRoleSelection = async (role: RoleType) => {
    if (!session?.access_token) {
      console.error("❌ [ROLE SELECTION] No session available");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("🎯 [ROLE SELECTION] Submitting role request:", role);

      // Second auth/resolve call with role request
      const data = await resolveAuth(role);

      if (data) {
        console.log("✅ [ROLE SELECTION] Role assigned successfully, navigating...");
        // Navigate based on backend response
        navigateFromAuthState(data);
      }
    } catch (err) {
      console.error("❌ [ROLE SELECTION] Error assigning role:", err);
      // Error handling - could show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.contentWrapper}>
          {/* Content - Scrollable */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            <Text style={styles.title}>How would you like to use AthleteEdge?</Text>
            <Text style={styles.subtitle}>
              Select your role to get started with your personalized experience.
            </Text>

            {/* Role Cards */}
            <View style={styles.list}>
              {roles.map((item, index) => {
                const selected = selectedRole === item.key;

                return (
                  <Pressable
                    key={item.key}
                    onPress={() => {
                      const newSelection = item.key;
                      setSelectedRole(newSelection);
                      
                      // Auto-scroll to selected item
                      const headerHeight = 60;
                      const titleHeight = 60;
                      const cardHeight = 88;
                      const gap = 16;
                      const scrollOffset = headerHeight + titleHeight + (index * (cardHeight + gap));
                      
                      scrollViewRef.current?.scrollTo({
                        y: Math.max(0, scrollOffset - 120),
                        animated: true,
                      });
                    }}
                    disabled={isSubmitting}
                  >
                    <View
                      style={[
                        styles.cardWrapper,
                        selected && styles.cardWrapperSelected,
                        isSubmitting && styles.cardDisabled,
                      ]}
                    >
                      <LinearGradient
                        colors={
                          selected
                            ? ["rgba(99,102,241,0.15)", "rgba(139,92,246,0.05)"]
                            : ["rgba(26,29,38,0.5)", "rgba(26,29,38,0.5)"]
                        }
                        style={styles.cardGradient}
                      />
                      <View style={styles.cardContent}>
                        <View
                          style={[
                            styles.iconBox,
                            selected && styles.iconBoxSelected,
                          ]}
                        >
                          <MaterialIcons 
                            name={item.iconName} 
                            size={28} 
                            color={selected ? "#6366f1" : "#FFFFFF"} 
                          />
                        </View>

                        <View style={styles.cardText}>
                          <Text style={styles.cardTitle}>
                            {item.title}
                          </Text>
                          <Text
                            style={[
                              styles.cardSubtitle,
                              selected && styles.cardSubtitleSelected,
                            ]}
                          >
                            {item.subtitle}
                          </Text>
                        </View>

                        <View style={[styles.check, selected && styles.checkSelected]}>
                          {selected && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FFF"
                              style={{ fontWeight: "bold" }}
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom CTA - Only show when role is selected */}
          {selectedRole !== null && (
            <SafeAreaView edges={["bottom"]} style={styles.ctaContainer}>
              <PrimaryButton
                title={isSubmitting ? "Setting up..." : "Continue"}
                onPress={() => handleRoleSelection(selectedRole)}
                disabled={isSubmitting}
                icon={isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : undefined}
              />
            </SafeAreaView>
          )}
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
  contentWrapper: {
    flex: 1,
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
  headerSpacer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 28,
    fontWeight: "300",
  },
  list: {
    gap: 16,
    marginBottom: 24,
  },
  cardWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  cardWrapperSelected: {
    borderColor: "#6366f1",
    borderWidth: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "relative",
    zIndex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconBoxSelected: {
    backgroundColor: "rgba(99,102,241,0.2)",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 20,
  },
  cardSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "400",
  },
  cardSubtitleSelected: {
    color: "rgba(99,102,241,0.9)",
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
  },
  checkSelected: {
    borderWidth: 0,
    backgroundColor: "#6366f1",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "#0f1115",
  },
});
