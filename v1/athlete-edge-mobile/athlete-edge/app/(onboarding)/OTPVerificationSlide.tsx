import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { useAuth } from "../../contexts/AuthContext";

const Colors = {
  background: "#0B0E14",
  surface: "#151b28",
  primary: "#6366f1",
  primaryDim: "#4f46e5",
  primaryDark: "#8b5cf6",
  accentGlass: "rgba(255, 255, 255, 0.08)",
  accentGlassHover: "rgba(255, 255, 255, 0.12)",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
  borderSubtle: "rgba(255,255,255,0.1)",
};

type Props = {
  phoneNumber?: string;
  countryCode?: string;
  onComplete?: () => void;
  onOtpComplete?: (complete: boolean) => void;
};

export default function OTPVerificationSlide({
  phoneNumber = "+1 5550192834",
  countryCode = "+1",
  onComplete,
  onOtpComplete,
}: Props) {
  const { verifyOTP, signInWithOTP, loading, error, clearError } = useAuth();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeRemaining, setTimeRemaining] = useState(45); // 45 seconds
  const [focusedIndex, setFocusedIndex] = useState(0); // Start with 1st input
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  // Determine if it's phone or email
  // phoneNumber prop might already include country code or be just the number
  const isEmail = phoneNumber.includes("@");
  const phoneOrEmail = isEmail 
    ? phoneNumber 
    : phoneNumber.startsWith("+") 
      ? phoneNumber 
      : `${countryCode}${phoneNumber}`;

  const backgroundImageUri =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAHlPccSBdkSTTn2V2sgU_g988G9erQ48SwHkgUndA5UDmAutcV0pxsAqManPVFzTC7SYZPJtNYRs29r-uMrAakGMdS3rTrrTse9BDU_EopYmqP7ZvU536ADvJFwkLmjAnMKR2yAU-aNuw0ZilyluTbhhfYop26AR1mrkIC8-f9BhnODV6slJcFEPdx_ZrV-aMpsDxgB6yIt9170RP94zPT5EuDKCY3P99DzPLIXzSyxvXxRp_07W01HE-UWD6iPRmsQwL9pRYKLsEC";

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  // Auto-focus on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[focusedIndex]?.focus();
    }, 100);
  }, []);

  // Clear error when OTP changes
  useEffect(() => {
    if (localError || error) {
      setLocalError(null);
      clearError();
    }
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
    
    // Auto-verify when all 6 digits are entered
    const otpString = newOtp.join("");
    if (otpString.length === 6) {
      handleVerify(otpString);
    }
  };


  const handleVerify = async (otpString?: string) => {
    const code = otpString || otp.join("");
    if (code.length !== 6 || isVerifying) {
      return;
    }

    try {
      setIsVerifying(true);
      setLocalError(null);
      clearError();

      // Verify OTP with Supabase
      await verifyOTP(phoneOrEmail, code, isEmail ? "email" : "phone");

      // OTP verified successfully
      if (onOtpComplete) {
        onOtpComplete(true);
      }
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setLocalError(errorMessage);
      
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      setFocusedIndex(0);
      inputRefs.current[0]?.focus();
      
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isResending || timeRemaining > 0) {
      return;
    }

    try {
      setIsResending(true);
      setLocalError(null);
      clearError();

      // Resend OTP
      await signInWithOTP(phoneOrEmail, isEmail ? "email" : "phone");

      // Reset timer
      setTimeRemaining(45);
      
      // Clear OTP
      setOtp(["", "", "", "", "", ""]);
      setFocusedIndex(0);
      inputRefs.current[0]?.focus();

      Alert.alert("OTP Resent", "A new verification code has been sent to your " + (isEmail ? "email" : "phone"));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend OTP. Please try again.";
      setLocalError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const displayError = localError || error;

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
        <LinearGradient
          colors={[
            "rgba(15,23,42,0.9)",
            "rgba(15,23,42,0.95)",
            "rgba(15,23,42,1)",
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(99,102,241,0.2)", "rgba(168,85,247,0.2)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Verify your {isEmail ? "email" : "number"}</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to {"\n"}
              <Text style={styles.phoneNumber}>
                {isEmail 
                  ? phoneNumber 
                  : phoneNumber.startsWith("+") 
                    ? phoneNumber.replace(/(\d{1,3})(\d{3})(\d{3})(\d+)/, "$1 $2 $3 $4")
                    : `${countryCode} ${phoneNumber}`}
              </Text>
            </Text>
          </View>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => {
              const isFocused = focusedIndex === index;
              const hasValue = digit !== "";

              return (
                <View key={index} style={styles.otpInputWrapper}>
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      isFocused && styles.otpInputFocused,
                      hasValue && !isFocused && styles.otpInputFilled,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onFocus={() => setFocusedIndex(index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    showSoftInputOnFocus={true}
                  />
                  {isFocused && <View style={styles.caret} />}
                </View>
              );
            })}
          </View>

          {/* Error Message */}
          {displayError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}

          {/* Timer */}
          <View style={styles.timerContainer}>
            {timeRemaining > 0 ? (
              <View style={styles.timerBox}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#6366f1"
                  style={styles.timerIcon}
                />
                <Text style={styles.timerText}>
                  Resend code in{" "}
                  <Text style={styles.timerValue}>{formatTime(timeRemaining)}</Text>
                </Text>
              </View>
            ) : (
              <Pressable 
                style={[styles.resendButton, isResending && styles.resendButtonDisabled]}
                onPress={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <ActivityIndicator color={Colors.primary} size="small" />
                ) : (
                  <Text style={styles.resendButtonText}>Resend Code</Text>
                )}
              </Pressable>
            )}
          </View>

          {/* Verify Button - Only show when OTP is complete and not auto-verifying */}
          {isOtpComplete && !isVerifying && (
            <Pressable 
              style={styles.verifyButton} 
              onPress={() => handleVerify()}
              disabled={isVerifying}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDim, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.verifyButtonGradient}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color="#fff"
                  style={styles.verifyButtonIcon}
                />
              </LinearGradient>
            </Pressable>
          )}

          {/* Loading indicator when verifying */}
          {isVerifying && (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.verifyingText}>Verifying...</Text>
            </View>
          )}
        </ScrollView>
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
    opacity: 0.4,
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
  logoCircle: {
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
    color: Colors.textPrimary,
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  mainContent: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
  },
  phoneNumber: {
    color: Colors.primary,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpInputWrapper: {
    position: "relative",
  },
  otpInput: {
    width: 44,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderWidth: 1,
    borderColor: "transparent",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  otpInputFocused: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  otpInputFilled: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  caret: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: [{ translateX: -3 }],
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 24,
    minHeight: 48,
  },
  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  timerIcon: {
    opacity: 0.8,
  },
  timerText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "400",
  },
  timerValue: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resendButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  verifyButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  verifyButtonText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  verifyButtonIcon: {
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  verifyingContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  verifyingText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
});

