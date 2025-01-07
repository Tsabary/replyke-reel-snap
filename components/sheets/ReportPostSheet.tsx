import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import {
  handleError,
  ReportReasonKey,
  reportReasons,
  useUser,
  useSubmitReport,
} from "replyke-rn";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { showMessage } from "react-native-flash-message";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import useSheetManager from "../../hooks/useSheetManager";
import CustomButton from "../ui/CustomButton";
import BottomSheetWrapper from "./BottomSheetWrapper";
import { cn } from "../../utils/cn";

const ReportPostSheet = () => {
  const { user } = useUser();
  const {
    reportPostSheetRef,
    reportedPost,
    setReportedPost,
    closeReportPostSheet,
  } = useSheetManager();
  const { submitEntityReport } = useSubmitReport();

  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState<ReportReasonKey | null>(null);
  const snapPoints = useMemo(() => ["100%"], []);

  const [sheetOpen, setSheetOpen] = useState(false);

  const buttonActive = useMemo(
    () => !!reason && !!reportedPost,
    [reason, reportedPost]
  );

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

  const handleSubmitReport = async () => {
    try {
      if (!reportedPost) throw new Error("No entity to report selected");
      if (!reason) throw new Error("No reason to report selected");
      if (!user) {
        showMessage({
          message: "Oops! Login Required",
          description: "Please sign in or create an account to continue.",
          type: "warning",
        });
        return;
      }

      setSubmitting(true);
      await submitEntityReport({ targetId: reportedPost.id, reason });
      closeReportPostSheet?.();
      setReportedPost?.(null);
      setReason(null);
    } catch (err) {
      handleError(err, "Submtting report failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheetWrapper open={sheetOpen}>
      <BottomSheet
        ref={reportPostSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={(state) => {
          setSheetOpen(state > -1);
          if (state === -1) {
            setReportedPost?.(null);
            setReason(null);
          }
        }}
        backgroundStyle={{ backgroundColor: "#18181B" }}
        handleIndicatorStyle={{ backgroundColor: "#fff" }}
      >
        <BottomSheetView className="p-7 flex-1 h-full justify-between">
          <View>
            <View className="flex-row items-center gap-4">
              <MaterialIcons name="flag" size={24} color="#e5e7eb" />
              <Text className="text-2xl text-gray-200">Submit a report</Text>
            </View>
            <Text className="text-gray-200 mt-6">
              Thank you fo looking out for our community. Let us know what is
              happenning, and we'll look into it.
            </Text>

            <View className="flex-row flex-wrap gap-3 mt-6">
              {Object.entries(reportReasons).map(([key, value], index) => (
                <Pressable
                  onPress={() => setReason(key as ReportReasonKey)}
                  className={cn(
                    "border border-gray-200 px-4 py-2.5 rounded-xl",
                    key === reason ? "bg-gray-100" : ""
                  )}
                  key={index}
                >
                  <Text
                    className={
                      key === reason ? "text-gray-950" : "text-gray-200"
                    }
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <CustomButton
            text="Submit Report"
            activeText="Submitting.."
            onPress={handleSubmitReport}
            disabled={!buttonActive}
            submitting={submitting}
          />
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetWrapper>
  );
};

export default ReportPostSheet;
