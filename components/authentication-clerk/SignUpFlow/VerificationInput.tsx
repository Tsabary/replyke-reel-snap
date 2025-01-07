import { View, TextInput, Text } from "react-native";
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { handleError } from "replyke-rn";
import { SetActive, SignUpResource } from "@clerk/types";

import CustomButton from "../../ui/CustomButton";

interface VerificationInputProps {
  verificationCode: string[];
  setVerificationCode: React.Dispatch<React.SetStateAction<string[]>>;
  isLoaded: boolean;
  signUp: SignUpResource | undefined;
  setActive: SetActive | undefined;
  signUpStage: "email" | "password" | "verification";
  verificationError: string;
  setVerificationError: React.Dispatch<React.SetStateAction<string>>;
}

interface VerificationInputRef {
  focus: () => void;
}

export const VERIFICATION_CODE_LENGTH = 6; // Adjust based on the number of digits needed
const RESEND_WAIT_TIME = 20;
const VerificationInput = forwardRef<
  VerificationInputRef,
  VerificationInputProps
>(
  (
    {
      verificationCode,
      setVerificationCode,
      isLoaded,
      signUp,
      setActive,
      signUpStage,
      verificationError,
      setVerificationError,
    },
    ref
  ) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(RESEND_WAIT_TIME);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const inputsRef = useRef<(TextInput | null)[]>([]);

    // Expose the first TextInput ref to the parent
    useImperativeHandle(ref, () => ({
      focus: () => inputsRef.current[0]?.focus(),
    }));

    const onVerifyPress = async (code: string[]) => {
      if (!isLoaded || !signUp || !setActive) return;

      try {
        setIsVerifying(true);
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code: code.join(""),
        });

        if (signUpAttempt.status === "complete") {
          await setActive({ session: signUpAttempt.createdSessionId });
          setVerificationError("");
        } else {
          console.error(JSON.stringify(signUpAttempt, null, 2));
        }
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        if (err instanceof Error) {
          setVerificationError(err.message);
        }
      } finally {
        setIsVerifying(false);
      }
    };

    const resendCode = async () => {
      try {
        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setResendTimer(RESEND_WAIT_TIME);
        setIsResendDisabled(true);
      } catch (err) {
        handleError(err, "Failed to resend code");
      }
    };

    const handleChange = (text: string, index: number) => {
      const updatedCode = [...verificationCode];
      updatedCode[index] = text;

      setVerificationCode(updatedCode);

      if (text && index < VERIFICATION_CODE_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (
        index === VERIFICATION_CODE_LENGTH - 1 &&
        updatedCode.every((char) => char !== "")
      ) {
        onVerifyPress(updatedCode);
      }
    };

    const handleKeyPress = (e: any, index: number) => {
      if (
        e.nativeEvent.key === "Backspace" &&
        !verificationCode[index] &&
        index > 0
      ) {
        const updatedCode = [...verificationCode];
        updatedCode[index - 1] = "";
        setVerificationCode(updatedCode);
        inputsRef.current[index - 1]?.focus();
      }
    };
    const handleFocus = (index: number) => {
      const firstEmptyIndex = verificationCode.findIndex((char) => char === "");
      if (index > firstEmptyIndex && firstEmptyIndex !== -1) {
        inputsRef.current[firstEmptyIndex]?.focus();
      } else {
        setFocusedIndex(index);
        inputsRef.current[index]?.setNativeProps({
          selection: { start: 0, end: 1 },
        });
      }
    };

    const handleBlur = () => {
      setFocusedIndex(null);
    };

    useEffect(() => {
      if (resendTimer > 0) {
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIsResendDisabled(false);
      }
    }, [resendTimer]);

    useEffect(() => {
      setResendTimer(RESEND_WAIT_TIME);
      setIsResendDisabled(true);
    }, [signUpStage]);

    return (
      <View className="gap-5 p-6">
        <View className="flex-row items-center justify-between gap-2">
          {Array.from({ length: VERIFICATION_CODE_LENGTH }).map((_, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={verificationCode[index]}
              onChangeText={(text) => {
                // Remove any non-digit characters
                const sanitizedText = text.replace(/[^0-9]/g, "");
                handleChange(sanitizedText, index);
              }}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              keyboardType="numeric"
              inputMode="numeric"
              maxLength={1}
              className={`flex-1 aspect-square bg-gray-100 text-center text-gray-700 rounded-xl text-3xl font-medium border-2 ${
                focusedIndex === index
                  ? "border-gray-900"
                  : "border-transparent"
              }`}
              selectionColor="transparent"
            />
          ))}
        </View>

        <Text
          onPress={() => {
            if (!isResendDisabled) {
              resendCode();
            }
          }}
          className={`font-medium ${
            isResendDisabled ? "text-gray-400" : "text-blue-500"
          }`}
        >
          Resend code{" "}
          {isResendDisabled && resendTimer !== 0 ? `${resendTimer}s` : ""}
        </Text>

        <CustomButton
          text="Verify"
          activeText="Verifying.."
          onPress={() => onVerifyPress(verificationCode)}
          disabled={isVerifying || verificationCode.some((char) => char === "")}
          submitting={isVerifying}
          error={verificationError}
        />
      </View>
    );
  }
);

export default VerificationInput;
