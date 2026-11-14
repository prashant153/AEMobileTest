import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ExpoImage } from "expo-image";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../contexts/AuthContext";
import { IntentMapper, type UIIntent } from "../../lib/storage";

type Intent = UIIntent;

type Props = {
  onNext?: () => void;
  onIntentSelected?: (selected: boolean) => void;
};

export default function IntentSlide({ onNext, onIntentSelected }: Props) {
  const backgroundImageUri = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"; // Different athlete image
  
  const [selectedIntent, setSelectedIntent] =
    useState<Intent | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { setOnboardingIntent } = useAuth();

  const intents = [
    {
      key: "player",
      title: "Track my performance",
      subtitle: "View stats, sessions, progress",
      iconName: "directions-run" as const,
    },
    {
      key: "coach",
      title: "Coach & manage athletes",
      subtitle: "Plan sessions and monitor players",
      iconName: "sports" as const,
    },
    {
      key: "parent",
      title: "Follow my child's journey",
      subtitle: "Attendance and performance insights",
      iconName: "family-restroom" as const,
    },
    {
      key: "admin",
      title: "Manage an academy",
      subtitle: "Coaches, batches, analytics",
      iconName: "domain" as const,
    },
  ];

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
          <Text style={styles.title}>What would you like to do?</Text>
          <Text style={styles.subtitle}>
            Select your role to customize your Athlete Edge experience.
          </Text>

          {/* Intent Cards */}
          <View style={styles.list}>
            {intents.map((item, index) => {
              const selected = selectedIntent === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={async () => {
                    const newSelection = item.key as Intent;
                    setSelectedIntent(newSelection);
                    onIntentSelected?.(true);
                    
                    // Save intent to storage
                    try {
                      const backendIntent = IntentMapper.toBackendIntent(newSelection);
                      await setOnboardingIntent(backendIntent);
                    } catch (error) {
                      console.error("Error saving intent:", error);
                      // Continue even if save fails - user can still proceed
                    }
                    
                    // Auto-scroll to selected item to ensure it's visible
                    // Calculate position: header + title + subtitle + previous cards
                    const headerHeight = 60; // paddingTop
                    const titleHeight = 60; // title + subtitle + margins
                    const cardHeight = 88; // card height (16px padding * 2 + 48px icon + gap)
                    const gap = 16;
                    const scrollOffset = headerHeight + titleHeight + (index * (cardHeight + gap));
                    
                    // Scroll with offset to show card above button area (button is ~80px tall)
                    scrollViewRef.current?.scrollTo({
                      y: Math.max(0, scrollOffset - 120),
                      animated: true,
                    });
                  }}
                >
                  <View
                    style={[
                      styles.cardWrapper,
                      selected && styles.cardWrapperSelected,
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

          {/* Bottom CTA - Only show when intent is selected */}
          {selectedIntent !== null && (
            <SafeAreaView edges={["bottom"]} style={styles.ctaContainer}>
              <PrimaryButton
                title="Continue"
                onPress={() => onNext?.()}
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
  /* Scrollable Content */
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

  /* Card Wrapper - handles border, shadow, and overflow */
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

  /* Gradient - fills wrapper completely using absolute positioning */
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },

  /* Card Content - contains all content with padding, determines wrapper size */
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

