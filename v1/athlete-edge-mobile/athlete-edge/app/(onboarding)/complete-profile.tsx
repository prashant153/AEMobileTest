import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ExpoImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../contexts/AuthContext";
import { navigateFromAuthState } from "@/lib/navigation/authRouter";
import { apiClient } from "@/lib/api/client";

export default function CompleteProfileScreen() {
  const backgroundImageUri = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80";
  
  const { resolveAuth, session, backendState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
  });

  // Get missing fields from backend state metadata
  const missingFields = backendState?.metadata?.missing_fields || [];
  const role = backendState?.role;

  useEffect(() => {
    // Pre-fill with existing user data if available
    if (backendState?.user) {
      setFormData({
        name: backendState.user.name || "",
        dob: backendState.user.dob || "",
        gender: backendState.user.gender || "",
      });
    }
  }, [backendState]);

  const handleSubmit = async () => {
    if (!session?.access_token) {
      Alert.alert("Error", "No active session. Please log in again.");
      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Please enter your name");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("📝 [PROFILE] Submitting profile data:", formData);

      // TODO: Replace with actual profile update API endpoint
      // For now, we'll call auth/resolve after a delay to simulate API call
      // In production, you would call: await apiClient.post("/profile/update", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Third auth/resolve call - check if profile is now complete
      const data = await resolveAuth(null);

      if (data) {
        console.log("✅ [PROFILE] Profile updated, navigating...");
        navigateFromAuthState(data);
      }
    } catch (err) {
      console.error("❌ [PROFILE] Error updating profile:", err);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: string, label: string, placeholder: string, keyboardType: "default" | "numeric" = "default") => {
    if (!missingFields.includes(field)) return null;

    return (
      <View style={styles.fieldContainer} key={field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={formData[field as keyof typeof formData]}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          keyboardType={keyboardType}
          editable={!isSubmitting}
        />
      </View>
    );
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
        </View>

        <View style={styles.contentWrapper}>
          <ScrollView 
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Please provide the following information to get started.
            </Text>

            {/* Form Fields */}
            <View style={styles.form}>
              {renderField("name", "Full Name", "Enter your full name")}
              {renderField("dob", "Date of Birth", "YYYY-MM-DD")}
              {renderField("gender", "Gender", "Male / Female / Other")}
              
              {/* Add more fields based on role */}
              {role === "ATHLETE" && (
                <>
                  {renderField("academy_id", "Academy", "Select your academy")}
                  {renderField("team", "Team", "Enter your team name")}
                </>
              )}
              
              {role === "COACH" && (
                <>
                  {renderField("certification", "Certification", "Enter your certification")}
                  {renderField("experience", "Years of Experience", "0", "numeric")}
                </>
              )}
            </View>
          </ScrollView>

          {/* Bottom CTA */}
          <SafeAreaView edges={["bottom"]} style={styles.ctaContainer}>
            <PrimaryButton
              title={isSubmitting ? "Saving..." : "Continue"}
              onPress={handleSubmit}
              disabled={isSubmitting}
              icon={isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : undefined}
            />
          </SafeAreaView>
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
  form: {
    gap: 20,
  },
  fieldContainer: {
    marginBottom: 4,
  },
  label: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFF",
    fontSize: 16,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "#0f1115",
  },
});
