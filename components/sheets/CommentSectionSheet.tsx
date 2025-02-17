import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import {
  SocialStyleCallbacks,
  useSocialComments,
  useSocialStyle,
  UseSocialStyleProps,
} from "@replyke/comments-social-react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { showMessage } from "react-native-flash-message";

import useSheetManager from "../../hooks/useSheetManager";
import BottomSheetWrapper from "./BottomSheetWrapper";

const CommentSectionSheet = () => {
  const router = useRouter();
  const {
    commentSetionSheetRef,
    commmentsEntityId,
    setCommentsEntityId,
    setHighlightedCommentsId,
    highlightedCommentId,
    closeCommentSectionSheet,
  } = useSheetManager();

  const snapPoints = useMemo(() => ["100%"], []);

  const [sheetOpen, setSheetOpen] = useState(false);
  const customStyles = useMemo<Partial<UseSocialStyleProps>>(
    () => ({
      newCommentFormProps: {
        verticalPadding: 16,
        paddingLeft: 24,
        paddingRight: 24,
      },
    }),
    []
  );
  const styleConfig = useSocialStyle(customStyles);

  const callbacks: SocialStyleCallbacks = useMemo(
    () => ({
      currentUserClickCallback: () => {
        Keyboard.dismiss();
        closeCommentSectionSheet?.();
        router.navigate("/(tabs)/profile");
      },
      otherUserClickCallback: (userId) => {
        Keyboard.dismiss();
        closeCommentSectionSheet?.();
        router.navigate(`/account/${userId}`);
      },
      loginRequiredCallback: () => {
        showMessage({
          message: "Oops! Login Required",
          description: "Please sign in or create an account to continue.",
          type: "warning",
        });
      },
    }),
    []
  );

  const { CommentSectionProvider, CommentsFeed, NewCommentForm, SortByButton } =
    useSocialComments({
      entityId: commmentsEntityId,
      styleConfig,
      highlightedCommentId,
      callbacks,
    });

  const commentFormRef = useRef<{ focus: () => void } | null>(null);

  useEffect(() => {
    if (!commmentsEntityId) return;
    const timeout = setTimeout(() => {
      if (commentFormRef.current) {
        commentFormRef.current.focus();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [commmentsEntityId]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  return (
    <BottomSheetWrapper open={sheetOpen}>
      <BottomSheet
        ref={commentSetionSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={(state) => {
          setSheetOpen(state > -1);
          if (state === -1) {
            Keyboard.dismiss();
            setCommentsEntityId?.(null);
            setHighlightedCommentsId?.(null);
          }
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <CommentSectionProvider>
            <BottomSheetView className="relative flex-1 h-full">
              <View className="flex-row gap-2 px-4 items-center mb-2">
                <View className="flex-1" />
                <SortByButton
                  priority="top"
                  activeView={
                    <Text className="bg-black py-2 px-3 rounded-md text-white text-sm">
                      Top
                    </Text>
                  }
                  nonActiveView={
                    <Text className="bg-gray-200 py-2 px-3 rounded-md text-sm">
                      Top
                    </Text>
                  }
                />
                <SortByButton
                  priority="new"
                  activeView={
                    <Text className="bg-black py-2 px-3 rounded-md text-white text-sm">
                      New
                    </Text>
                  }
                  nonActiveView={
                    <Text className="bg-gray-200 py-2 px-3 rounded-md text-sm">
                      New
                    </Text>
                  }
                />
              </View>

              <CommentsFeed />
              <NewCommentForm ref={commentFormRef} />
            </BottomSheetView>
          </CommentSectionProvider>
        </KeyboardAvoidingView>
      </BottomSheet>
    </BottomSheetWrapper>
  );
};

export default CommentSectionSheet;
