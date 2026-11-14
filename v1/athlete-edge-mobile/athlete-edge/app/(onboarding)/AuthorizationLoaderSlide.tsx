import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { useAuth } from "../../contexts/AuthContext";
import { navigateFromAuthState } from "@/lib/navigation/authRouter";

const Colors = {
  background: "#0f172a",
  primary: "#6366f1",
  secondary: "#a855f7",
  accent: "#3b82f6",
  textPrimary: "#FFFFFF",
  textMuted: "rgba(191, 219, 254, 0.6)",
};

type Props = {
  onComplete?: () => void;
  isVisible?: boolean;
};

export default function AuthorizationLoaderSlide({ onComplete, isVisible = true }: Props) {
  const { resolveAuth, session, loading, error, backendState } = useAuth();
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const backgroundImageUri =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKKplpf3tgA_1oteORfTaSqEkXvUJXlF0lMo2nRSo3JP_9E-g_FlNTl6Vceu-n3qKgAxNxGNCrQ_Xw5KWricLW3-kx7e-_FKsQK0Md81HTD1SDjNmSq1YX7qk0ckB7nG-BfnPSt8EOFdIaNHebpS3x3Jttet7Rh30wKL5l5L2mZTFUYfHmPgkIA1jZnUe9FwUJca2bY0F4CxFmR3kCg7tqAYG-3u5l9B91NI1x75wTAZMP4H2BUJR8jx5QRVVr5VQu54vOrCisdifG";

  // Start continuous animations (spinner and pulse)
  useEffect(() => {
    if (!isVisible) return;

    let spinAnimation: Animated.CompositeAnimation;
    let pulseAnimation: Animated.CompositeAnimation;

    // Spin animation for outer ring
    spinAnimation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Pulse animation for inner circle
    pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, [isVisible]);

  // Call auth/resolve API when component becomes visible
  useEffect(() => {
    if (!isVisible) return;
    if (!session?.access_token) {
      console.warn("No session available for auth resolve");
      setResolveError("No active session. Please log in again.");
      // Still navigate after showing error
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          router.replace("/(tabs)");
        }
      }, 2000);
      return;
    }

    let isMounted = true;

    const callResolveAuth = async () => {
      try {
        setIsResolving(true);
        setResolveError(null);
        
        // Start progress animation (will animate over 1-2 seconds)
        Animated.timing(progressAnim, {
          toValue: 0.8, // Animate to 80% while API call is in progress
          duration: 1500,
          useNativeDriver: false,
        }).start();

        // First auth/resolve call - no role request
        console.log("🔄 [AUTH LOADER] Making first auth/resolve call (no role request)");
        const data = await resolveAuth(null);

        if (!isMounted || !data) return;

        // Complete progress animation
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();

        // Navigate based on backend response
        setTimeout(() => {
          if (!isMounted) return;
          console.log("🧭 [AUTH LOADER] Navigating based on backend response:", data.next);
          navigateFromAuthState(data);
        }, 500);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : "Failed to resolve authentication";
        setResolveError(errorMessage);
        console.error("❌ [AUTH LOADER] Error resolving auth:", err);
        
        // Complete progress even on error
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
        
        // On error, still try to navigate (fallback to dashboard)
        setTimeout(() => {
          if (!isMounted) return;
          console.warn("⚠️ [AUTH LOADER] Auth resolve failed, falling back to dashboard");
          router.replace("/(tabs)");
        }, 1500);
      } finally {
        if (isMounted) {
          setIsResolving(false);
        }
      }
    };

    // Small delay to ensure component is mounted and animations start
    const timer = setTimeout(() => {
      callResolveAuth();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isVisible, session?.access_token, resolveAuth, onComplete]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={styles.backgroundLayer}>
        <ExpoImage
          source={{ uri: backgroundImageUri }}
          style={styles.backgroundImage}
          contentFit="cover"
          blurRadius={2}
          cachePolicy="memory-disk"
        />
        <View style={styles.backgroundOverlay} />
        <LinearGradient
          colors={[
            "rgba(15,23,42,0.5)",
            "rgba(15,23,42,0.8)",
            "rgba(15,23,42,1)",
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Gradient Blob */}
      <View style={styles.gradientBlob} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.content}>
          {/* Header with Logo */}
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

          {/* Loading Spinner */}
          <View style={styles.spinnerContainer}>
            {/* Outer ring */}
            <View style={styles.outerRing}>
              <Animated.View
                style={[
                  styles.spinningRing,
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}
              >
                <View style={styles.ringBorder} />
              </Animated.View>
            </View>

            {/* Inner circle with check icon */}
            <Animated.View
              style={[
                styles.innerCircle,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={[
                  "rgba(99,102,241,0.2)",
                  "rgba(168,85,247,0.1)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.innerCircleGradient}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={48}
                  color="#FFFFFF"
                  style={styles.checkIcon}
                />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {isResolving || loading
                ? "Setting up your account..."
                : backendState
                ? "Account ready!"
                : resolveError
                ? "Setting up account..."
                : "Setting up your account..."}
            </Text>
            <Text style={styles.subtitle}>
              {isResolving || loading
                ? "Connecting to backend..."
                : backendState
                ? "Redirecting you now..."
                : resolveError
                ? "Please wait..."
                : "Finalizing personalization..."}
            </Text>
            {resolveError && (
              <Text style={styles.errorText}>{resolveError}</Text>
            )}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressWidth,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.3)" />
            <Text style={styles.footerText}>SECURE CONNECTION</Text>
          </View>
        </View>
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
    opacity: 0.3,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.8)",
  },
  gradientBlob: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 600,
    height: 600,
    marginTop: -300,
    marginLeft: -300,
    borderRadius: 300,
    backgroundColor: "rgba(168,85,247,0.2)",
    opacity: 0.3,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 16,
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
  spinnerContainer: {
    width: 144,
    height: 144,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  outerRing: {
    position: "absolute",
    width: 144,
    height: 144,
    borderRadius: 72,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.01)",
  },
  spinningRing: {
    position: "absolute",
    width: 136,
    height: 136,
    borderRadius: 68,
  },
  ringBorder: {
    width: "100%",
    height: "100%",
    borderRadius: 68,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: Colors.accent,
    borderRightColor: Colors.secondary,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  innerCircleGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    textShadowColor: "rgba(168,85,247,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  textContainer: {
    alignItems: "center",
    gap: 12,
    maxWidth: "80%",
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 32,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
  },
  progressBarContainer: {
    width: 128,
    marginTop: 32,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    fontWeight: "300",
    letterSpacing: 1.5,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
});

