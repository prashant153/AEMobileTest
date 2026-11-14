import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { Picker } from "@react-native-picker/picker";

const Colors = {
  background: "#0B0E14",
  surface: "#151b28",
  primary: "#6366f1",
  primaryDark: "#8b5cf6",
  accentGlass: "rgba(255, 255, 255, 0.08)",
  accentGlassHover: "rgba(255, 255, 255, 0.12)",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
  borderSubtle: "rgba(255,255,255,0.1)",
};

type TabType = "phone" | "email";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>(
    (params.tab as TabType) || "email"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India

  // Country data with flags
  const countries = [
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+39", flag: "🇮🇹", name: "Italy" },
    { code: "+34", flag: "🇪🇸", name: "Spain" },
    { code: "+7", flag: "🇷🇺", name: "Russia" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+82", flag: "🇰🇷", name: "South Korea" },
    { code: "+52", flag: "🇲🇽", name: "Mexico" },
    { code: "+31", flag: "🇳🇱", name: "Netherlands" },
    { code: "+46", flag: "🇸🇪", name: "Sweden" },
    { code: "+41", flag: "🇨🇭", name: "Switzerland" },
    { code: "+32", flag: "🇧🇪", name: "Belgium" },
    { code: "+47", flag: "🇳🇴", name: "Norway" },
    { code: "+45", flag: "🇩🇰", name: "Denmark" },
  ];

  const selectedCountry = countries.find((c) => c.code === countryCode) || countries[0];

  const backgroundImageUri =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlKY9knEoW8yLga79g-trbEf4V4msrMFTVvwVz6gTdDTgfYFBcuvvX2ZzeMBmgqxd6VCowV25StfjSE8moWrzi-C6L80a2FbetHG6mD5lLRDAf_8bfRZpbDY-jHb_NNccqxjh6DwYMC2lGOUCWy_7qFxAV43SjKNfKuXL8_YdLhZ4cisKSgH94CpdQWWVtPOgPBVfuGTIAVuqluN8vy7Vo7At3tNqAktXv_B7IfF5_FvZAhFfW3zd2BttRDYo3spe8dUjaFA6ZXEvy";

  const onContinue = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={styles.backgroundLayer}>
        <ExpoImage
          source={{ uri: backgroundImageUri }}
          style={styles.backgroundImage}
          contentFit="cover"
          blurRadius={3}
        />
        <LinearGradient
          colors={[
            "rgba(11,14,20,0.7)",
            "rgba(11,14,20,0.85)",
            "rgba(11,14,20,1)",
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(139,92,246,0.3)", "rgba(99,102,241,0.2)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Gradient Blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

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
            <Text style={styles.headerTitle}>Athlete Edge</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>
              Unlock Your {"\n"}
              <Text style={styles.titleGradient}>Potential</Text>
            </Text>
            <Text style={styles.subtitle}>
              Enter your details to track your performance and compete with the
              best.
            </Text>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <View style={styles.tabBar}>
              <View
                style={[
                  styles.tabIndicator,
                  { left: activeTab === "phone" ? 0 : "50%" },
                ]}
              />
              <Pressable
                style={styles.tab}
                onPress={() => setActiveTab("phone")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "phone" && styles.tabTextActive,
                  ]}
                >
                  Phone
                </Text>
              </Pressable>
              <Pressable
                style={styles.tab}
                onPress={() => setActiveTab("email")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "email" && styles.tabTextActive,
                  ]}
                >
                  Email
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {activeTab === "phone" ? (
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeContainer}>
                  <View style={styles.countryCodeWrapper}>
                    <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={countryCode}
                        onValueChange={setCountryCode}
                        style={styles.picker}
                        mode="dropdown"
                        dropdownIconColor="transparent"
                      >
                        {countries.map((country) => (
                          <Picker.Item
                            key={country.code}
                            label={`${country.flag} ${country.code} ${country.name}`}
                            value={country.code}
                          />
                        ))}
                      </Picker>
                    </View>
                    <View style={styles.pickerIconContainer} pointerEvents="none">
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color="#94A3B8"
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="9876543210"
                    placeholderTextColor="#64748b"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.emailInputContainer}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="you@example.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Continue Button */}
            <Pressable style={styles.continueButton} onPress={onContinue}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Send OTP</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#fff"
                  style={styles.continueButtonIcon}
                />
              </LinearGradient>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton} disabled>
              <GoogleIcon />
            </Pressable>
            <Pressable style={styles.socialButton} disabled>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text
                style={styles.footerLink}
                onPress={() => Linking.openURL("#")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.footerLink}
                onPress={() => Linking.openURL("#")}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </ScrollView>

        {/* Slider Indicator */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderDot} />
          <View style={styles.sliderDot} />
          <View style={styles.sliderDot} />
          <View style={[styles.sliderDot, styles.sliderDotActive]} />
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
    width: "100%",
    height: "100%",
    opacity: 0.4,
    transform: [{ scale: 1.25 }, { translateX: -40 }],
  },
  blob1: {
    position: "absolute",
    top: "-15%",
    right: "-15%",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(99,102,241,0.3)",
    opacity: 0.4,
    zIndex: 1,
  },
  blob2: {
    position: "absolute",
    bottom: "-10%",
    left: "-10%",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(139,92,246,0.3)",
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
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: 32,
  },
  mainContent: {
    marginBottom: 40,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 16,
  },
  titleGradient: {
    color: Colors.primaryDark,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    fontWeight: "300",
    lineHeight: 24,
    maxWidth: "90%",
  },
  tabContainer: {
    marginBottom: 32,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: 2,
    backgroundColor: Colors.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingTop: 8,
    alignItems: "center",
  },
  tabText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  formContainer: {
    marginBottom: 32,
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  countryCodeContainer: {
    width: 110,
  },
  countryCodeWrapper: {
    height: 56,
    backgroundColor: Colors.accentGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 8,
    position: "relative",
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  pickerContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  picker: {
    color: Colors.textPrimary,
    height: 56,
    width: "100%",
  },
  pickerIconContainer: {
    position: "absolute",
    right: 12,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    height: 56,
    backgroundColor: Colors.accentGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: 20,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "500",
  },
  emailInputContainer: {
    marginBottom: 8,
  },
  emailInput: {
    height: 56,
    backgroundColor: Colors.accentGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: 20,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "500",
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
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
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  continueButtonIcon: {
    marginLeft: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  dividerText: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentGlass,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 16,
  },
  footerText: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 280,
    fontWeight: "300",
  },
  footerLink: {
    color: "rgba(255,255,255,0.8)",
    textDecorationLine: "underline",
    textDecorationColor: "rgba(255,255,255,0.3)",
  },
  sliderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  sliderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    opacity: 0.25,
  },
  sliderDotActive: {
    width: 24,
    opacity: 1,
  },
});

// Google Icon Component - Proper Google G logo with better visibility
function GoogleIcon() {
  return (
    <View style={googleIconStyles.container}>
      <View style={googleIconStyles.outerCircle}>
        {/* Blue top-left quarter circle */}
        <View style={[googleIconStyles.arc, {
          backgroundColor: "#4285F4",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderTopLeftRadius: 12,
        }]} />
        {/* Blue top bar */}
        <View style={[googleIconStyles.bar, {
          backgroundColor: "#4285F4",
          top: 0,
          left: 12,
          width: 10,
          height: 5,
        }]} />
        {/* Green right bar */}
        <View style={[googleIconStyles.bar, {
          backgroundColor: "#34A853",
          top: 5,
          left: 20,
          width: 4,
          height: 10,
        }]} />
        {/* Green bottom bar */}
        <View style={[googleIconStyles.bar, {
          backgroundColor: "#34A853",
          top: 15,
          left: 10,
          width: 12,
          height: 5,
        }]} />
        {/* Yellow left bottom */}
        <View style={[googleIconStyles.bar, {
          backgroundColor: "#FBBC05",
          top: 15,
          left: 0,
          width: 4,
          height: 9,
        }]} />
        {/* Red left middle */}
        <View style={[googleIconStyles.bar, {
          backgroundColor: "#EA4335",
          top: 5,
          left: 0,
          width: 4,
          height: 10,
        }]} />
      </View>
    </View>
  );
}

const googleIconStyles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    position: "relative",
    overflow: "hidden",
  },
  arc: {
    position: "absolute",
  },
  bar: {
    position: "absolute",
  },
});
