import { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import SplashSlide from "./SplashSlide";
import LoginSlide from "./LoginSlide";
import LoginFormSlide from "./LoginFormSlide";
import OTPVerificationSlide from "./OTPVerificationSlide";
import AuthorizationLoaderSlide from "./AuthorizationLoaderSlide";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  { id: "splash", component: SplashSlide },
  { id: "login", component: LoginSlide },
  { id: "loginForm", component: LoginFormSlide },
  { id: "otp", component: OTPVerificationSlide },
  { id: "authorization", component: AuthorizationLoaderSlide },
];

export default function OnboardingPager() {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"phone" | "email" | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [email, setEmail] = useState<string>("");
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>(""); // Store the actual value used for OTP

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handleScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
    // Fallback to scrollToOffset if scrollToIndex fails
    flatListRef.current?.scrollToOffset({
      offset: info.index * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleComplete = () => {
    router.replace("/(tabs)");
  };

  const handleOtpComplete = (complete: boolean) => {
    setIsOtpComplete(complete);
  };

  const handleTabSelected = (tab: "phone" | "email") => {
    setSelectedTab(tab);
    goToNext();
  };

  const handlePhoneSubmit = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
    // Store the full phone number for OTP verification (without spaces)
    setPhoneOrEmail(`${code}${phone}`);
    goToNext();
  };

  const handleEmailSubmit = (emailValue: string) => {
    setEmail(emailValue);
    // Store email for OTP verification
    setPhoneOrEmail(emailValue);
    goToNext();
  };

  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
    const SlideComponent = item.component;
    const isLast = index === SLIDES.length - 1;
    const isLoginSlide = index === 1;
    const isLoginFormSlide = index === 2;
    const isOTPSlide = index === 3;
    const isAuthorizationSlide = index === 4;
    
    // Format phone number or email for display (with space for readability)
    const displayValue = phoneNumber
      ? `${countryCode} ${phoneNumber}`
      : email
      ? email
      : "+1 5550192834";
    
    // For OTP verification, use the actual phoneOrEmail value (without spaces)
    const otpVerificationValue = phoneOrEmail || displayValue;
    
    return (
      <View style={styles.slideContainer}>
        <SlideComponent
          onNext={isLast || isAuthorizationSlide ? undefined : goToNext}
          onComplete={isOTPSlide ? goToNext : isAuthorizationSlide ? goToNext : isLast ? handleComplete : undefined}
          onTabSelected={isLoginSlide ? handleTabSelected : undefined}
          initialTab={isLoginFormSlide ? selectedTab : undefined}
          onPhoneSubmit={isLoginFormSlide ? handlePhoneSubmit : undefined}
          onEmailSubmit={isLoginFormSlide ? handleEmailSubmit : undefined}
          phoneNumber={isOTPSlide ? otpVerificationValue : undefined}
          countryCode={isOTPSlide ? countryCode : undefined}
          isVisible={isAuthorizationSlide ? currentIndex === 4 : undefined}
          onOtpComplete={isOTPSlide ? handleOtpComplete : undefined}
        />
      </View>
    );
  };

  // Progress indicator dots
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [6, 24, 6],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.25, 1, 0.25],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Disable swipe on OTP slide (index 3) until OTP is complete
  // Disable swipe on AuthorizationLoaderSlide (index 4) - must wait for API call
  const scrollEnabled = !(currentIndex === 3 && !isOtpComplete) && currentIndex !== 4;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
      {renderDots()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "#6366f1",
  },
});
