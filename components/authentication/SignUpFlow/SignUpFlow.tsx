import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, View, Dimensions, TextInput } from "react-native";
import { handleError, useAuth } from "replyke-rn";
import { useForm } from "react-hook-form";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";

const SCREEN_WIDTH = Dimensions.get("window").width;

const EmailPasswordSignUp = forwardRef(
  (
    {
      signUpStage,
      setSignUpStage,
    }: {
      signUpStage: "email" | "password";
      setSignUpStage: (stage: "email" | "password") => void;
    },
    ref
  ) => {
    const { signUpWithEmailAndPassword } = useAuth();
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

    const [isCreating, setIsCreating] = useState(false);

    const passwordRef = useRef<TextInput | null>(null);

    // Animation state
    const translateX = useRef(new Animated.Value(0)).current;

    const animateToStage = (stage: "email" | "password") => {
      let toValue = 0;
      if (stage === "password") toValue = -SCREEN_WIDTH;

      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSignUpStage(stage));
    };

    // Handle submission of sign-up form
    const onSubmit = async (data: { email: string; password: string }) => {
      if (isCreating) return;
      const { email, password } = data;
      try {
        setIsCreating(true);
        await signUpWithEmailAndPassword?.({ email, password });

        resetForm();
      } catch (err) {
        handleError(err, "Error during sign-up:");
      } finally {
        setIsCreating(false);
      }
    };

    const resetSignup = () => {
      animateToStage("email");
      resetForm();
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
    }, [signUpStage]);

    return (
      <View>
        <Animated.View
          className="flex-row"
          style={{ width: SCREEN_WIDTH * 2, transform: [{ translateX }] }}
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
          </View>

          {/* Password Input Stage */}
          <View className="flex-1">
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
        </Animated.View>
      </View>
    );
  }
);

export default EmailPasswordSignUp;
