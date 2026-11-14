import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ExpoImage } from "expo-image";
import PrimaryButton from "../../components/PrimaryButton";

type Props = {
  onNext?: () => void;
};

export default function SplashSlide({ onNext }: Props) {
  const backgroundImageUri = "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80"; // Basketball player image
  
  /* Logo animation */
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          colors={["rgba(10,15,30,0.4)", "rgba(26,35,66,0.6)", "rgba(10,15,30,0.85)"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentWrapper}>
          {/* Main Content */}
          <View style={styles.content}>
          {/* Animated Logo Card */}
          <Animated.View
            style={[
              styles.logoCard,
              {
                opacity: opacityAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: translateYAnim },
                ],
              },
            ]}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>ATHLETE EDGE</Text>

          {/* Motto */}
          <Text style={styles.motto}>TRACK. TRAIN. TRANSFORM.</Text>

          {/* Description */}
          <Text style={styles.description}>
            Train with purpose.{"\n"}
            <Text style={styles.descriptionEmphasis}>
              Perform with clarity.
            </Text>
          </Text>
        </View>

          {/* CTA Button */}
          <SafeAreaView edges={["bottom"]} style={styles.ctaContainer}>
            <PrimaryButton
              title="UNLOCK YOUR EDGE"
              onPress={() => onNext?.()}
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
    backgroundColor: "#0A0F1E",
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  /* Logo */
  logoCard: {
    width: 140,
    height: 140,
    backgroundColor: "#000",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    elevation: 8,
  },

  logo: {
    width: 80,
    height: 80,
  },

  /* Text */
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },

  motto: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 20,
  },

  description: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "400",
  },

  descriptionEmphasis: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  ctaContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
});

