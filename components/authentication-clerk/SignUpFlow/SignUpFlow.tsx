import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, View, Dimensions, TextInput } from "react-native";
import { handleError } from "replyke-rn";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/clerk-expo";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import VerificationInput, {
  VERIFICATION_CODE_LENGTH,
} from "./VerificationInput";
import { OAuthProviders } from "../OAuthProviders";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SignUpFlow = forwardRef(
  (
    {
      signUpStage,
      setSignUpStage,
    }: {
      signUpStage: "email" | "password" | "verification";
      setSignUpStage: (stage: "email" | "password" | "verification") => void;
    },
    ref
  ) => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const {
      control,
      handleSubmit,
      formState: { errors },
      setError,
      reset: resetForm,
      watch,
    } = useForm({
      defaultValues: {
        email: "",
        password: "",
      },
    });

    // Watch the "username" field
    const email = watch("email");
    const password = watch("password");
    const [verificationCode, setVerificationCode] = useState<string[]>(
      Array(VERIFICATION_CODE_LENGTH).fill("")
    );
    const [verificationError, setVerificationError] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    const passwordRef = useRef<TextInput | null>(null);
    const verificationRef = useRef<TextInput | null>(null);

    // Animation state
    const translateX = useRef(new Animated.Value(0)).current;

    const animateToStage = (stage: "email" | "password" | "verification") => {
      let toValue = 0;
      if (stage === "password") toValue = -SCREEN_WIDTH;
      if (stage === "verification") toValue = -SCREEN_WIDTH * 2;

      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSignUpStage(stage));
    };

    // Handle submission of sign-up form
    const onSubmit = async (data: { email: string; password: string }) => {
      if (!isLoaded || isCreating) return;
      const { email, password } = data;
      try {
        setIsCreating(true);

        await signUp.create({
          emailAddress: email,
          password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        resetForm();
        animateToStage("verification");
      } catch (err) {
        handleError(err, "Error during sign-up:");
      } finally {
        setIsCreating(false);
      }
    };

    const resetSignup = () => {
      animateToStage("email");
      resetForm();
      setVerificationCode(Array(VERIFICATION_CODE_LENGTH).fill(""));
      setVerificationError("");
    };

    // Expose resetSignup function to parent
    useImperativeHandle(ref, () => ({
      resetSignup,
    }));

    useEffect(() => {
      animateToStage(signUpStage);
      if (signUpStage === "password" && passwordRef.current) {
        passwordRef.current.focus();
      }

      if (signUpStage === "verification" && verificationRef.current) {
        verificationRef.current.focus();
      }
    }, [signUpStage]);

    return (
      <View>
        <Animated.View
          className="flex-row"
          style={{ width: SCREEN_WIDTH * 3, transform: [{ translateX }] }}
        >
          {/* Email Input Stage */}
          <View className="flex-1">
            <EmailInput
              email={email}
              control={control}
              errors={errors}
              setError={setError}
              setSignUpStage={setSignUpStage}
            />
            <View className="p-6 pt-0">
              <OAuthProviders />
            </View>
          </View>

          {/* Password Input Stage */}
          <View className="w-full flex-1">
            <PasswordInput
              ref={passwordRef}
              password={password}
              control={control}
              errors={errors}
              setError={setError}
              isCreating={isCreating}
              submitForm={handleSubmit(onSubmit)}
            />
          </View>

          {/* Verification Input Stage */}
          <View className="w-full flex-1">
            <VerificationInput
              ref={verificationRef}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              isLoaded={isLoaded}
              signUp={signUp}
              setActive={setActive}
              signUpStage={signUpStage}
              verificationError={verificationError}
              setVerificationError={setVerificationError}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
);

export default SignUpFlow;
