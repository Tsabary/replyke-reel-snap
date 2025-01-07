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
  useSocialComments,
  useSocialStyle,
  UseSocialStyleProps,
  useUser,
} from "replyke-rn";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { showMessage } from "react-native-flash-message";

import useSheetManager from "../../hooks/useSheetManager";
import BottomSheetWrapper from "./BottomSheetWrapper";

const CommentsComponents = memo(
  ({
    entityId,
    navigateToAccount,
    navigateToProfile,
  }: {
    entityId: string | null | undefined;
    navigateToAccount: (accountId: string) => void;
    navigateToProfile: () => void;
  }) => {
    const { highlightedCommentId, closeCommentSectionDrawer } =
      useSheetManager();
    const customStyles = useMemo<Partial<UseSocialStyleProps>>(
      () => ({
        commentProps: {},
        newCommentFormProps: {
          verticalPadding: 24,
          paddingLeft: 24,
          paddingRight: 24,
        },
      }),
      []
    );
    const styleConfig = useSocialStyle(customStyles);

    const {
      CommentSectionProvider,
      CommentsFeed,
      NewCommentForm,
      SortByButton,
    } = useSocialComments({
      entityId,
      styleConfig,
      highlightedCommentId,
      callbacks: {
        currentUserClickCallback: () => {
          Keyboard.dismiss();
          closeCommentSectionDrawer?.();
          navigateToProfile();
        },
        otherUserClickCallback: (userId) => {
          Keyboard.dismiss();
          closeCommentSectionDrawer?.();
          navigateToAccount(userId);
        },
        loginRequiredCallback: () => {
          showMessage({
            message: "Oops! Login Required",
            description: "Please sign in or create an account to continue.",
            type: "warning",
          });
        },
      },
    });

    const commentFormRef = useRef<{ focus: () => void } | null>(null);

    useEffect(() => {
      if (!entityId) return;
      const timeout = setTimeout(() => {
        if (commentFormRef.current) {
          commentFormRef.current.focus();
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }, [entityId]);

    return (
      <CommentSectionProvider>
        <BottomSheetView className="flex-1 h-full">
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
    );
  },
  (prevProps, nextProps) => {
    return prevProps.entityId === nextProps.entityId;
  }
);

const CommentSectionSheet = () => {
  const { user } = useUser();
  const {
    commentSetionSheetRef,
    commmentsEntityId,
    setCommentsEntityId,
    setHighlightedCommentsId,
  } = useSheetManager();

  const snapPoints = useMemo(() => ["100%"], []);

  const [sheetOpen, setSheetOpen] = useState(false);

  const router = useRouter();

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
          <CommentsComponents
            entityId={commmentsEntityId}
            navigateToAccount={(accountId: string) =>
              router.navigate(`/account/${accountId}`)
            }
            navigateToProfile={() => router.navigate("/(tabs)/profile")}
          />
        </KeyboardAvoidingView>
      </BottomSheet>
    </BottomSheetWrapper>
  );
};

export default CommentSectionSheet;
