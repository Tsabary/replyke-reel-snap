import React, { createContext, useState, useRef } from "react";
import { Entity } from "@replyke/expo";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type SheetManagerContext = {
  accountSheetRef: React.RefObject<BottomSheetMethods>;
  commentSetionSheetRef: React.RefObject<BottomSheetMethods>;
  saveToListSheetRef: React.RefObject<BottomSheetMethods>;
  postOptionsSheetRef: React.RefObject<BottomSheetMethods>;
  ownerPostOptionsSheetRef: React.RefObject<BottomSheetMethods>;
  reportPostSheetRef: React.RefObject<BottomSheetMethods>;
  sharePostSheetRef: React.RefObject<BottomSheetMethods>;

  openCommentSectionSheet: (newEntityId?: string) => void;
  closeCommentSectionSheet: () => void;

  openSaveToListSheet: (newEntityId?: string) => void;
  closeSaveToListSheet: () => void;

  openPostOptionsSheet: (newEntity?: Entity) => void;
  closePostOptionsSheet: () => void;

  openOwnerPostOptionsSheet: (newEntity?: Entity) => void;
  closeOwnerPostOptionsSheet: () => void;

  openReportPostSheet: (newEntity?: Entity) => void;
  closeReportPostSheet: () => void;

  openSharePostSheet: (newEntity?: Entity) => void;
  closeSharePostSheet: () => void;

  commmentsEntityId: string | null;
  setCommentsEntityId: React.Dispatch<React.SetStateAction<string | null>>;

  highlightedCommentId: string | null;
  setHighlightedCommentsId: React.Dispatch<React.SetStateAction<string | null>>;

  collectionsEntityId: string | null;
  setCollectionsEntityId: React.Dispatch<React.SetStateAction<string | null>>;

  optionsEntity: Entity | null;
  setOptionsEntity: React.Dispatch<React.SetStateAction<Entity | null>>;

  reportedPost: Entity | null;
  setReportedPost: React.Dispatch<React.SetStateAction<Entity | null>>;

  sharedPost: Entity | null;
  setSharedPost: React.Dispatch<React.SetStateAction<Entity | null>>;
};

export const SheetManagerContext = createContext<Partial<SheetManagerContext>>(
  {}
);

export const SheetManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const commentSetionSheetRef = useRef<BottomSheet>(null);
  const saveToListSheetRef = useRef<BottomSheet>(null);
  const postOptionsSheetRef = useRef<BottomSheet>(null);
  const ownerPostOptionsSheetRef = useRef<BottomSheet>(null);
  const reportPostSheetRef = useRef<BottomSheet>(null);
  const sharePostSheetRef = useRef<BottomSheet>(null);

  // The entity for which the user is the comment section
  const [commmentsEntityId, setCommentsEntityId] = useState<string | null>(
    null
  );

  const [highlightedCommentId, setHighlightedCommentsId] = useState<
    string | null
  >(null);

  // The entity the user wants to add o list
  const [collectionsEntityId, setCollectionsEntityId] = useState<string | null>(null);

  // The entity to which we show the options sheet
  const [optionsEntity, setOptionsEntity] = useState<Entity | null>(null);

  // The entity the user wants to report
  const [reportedPost, setReportedPost] = useState<Entity | null>(null);

  // The entity the user wants to report
  const [sharedPost, setSharedPost] = useState<Entity | null>(null);

  const openCommentSectionSheet = (newEntityId?: string) => {
    if (newEntityId) setCommentsEntityId(newEntityId);

    commentSetionSheetRef.current?.snapToIndex(0);
  };

  const closeCommentSectionSheet = () => {
    commentSetionSheetRef.current?.close();
  };

  const openSaveToListSheet = (newEntityId?: string) => {
    if (newEntityId) setCollectionsEntityId(newEntityId);
    saveToListSheetRef.current?.snapToIndex(0);
  };

  const closeSaveToListSheet = () => {
    saveToListSheetRef.current?.close();
    setCollectionsEntityId(null);
  };

  const openPostOptionsSheet = (newEntity?: Entity) => {
    if (newEntity) setOptionsEntity(newEntity);
    postOptionsSheetRef.current?.snapToIndex(0);
  };

  const closePostOptionsSheet = () => {
    postOptionsSheetRef.current?.close();
  };

  const openOwnerPostOptionsSheet = (newEntity?: Entity) => {
    if (newEntity) setOptionsEntity(newEntity);
    ownerPostOptionsSheetRef.current?.snapToIndex(0);
  };

  const closeOwnerPostOptionsSheet = () => {
    ownerPostOptionsSheetRef.current?.close();
  };

  const openReportPostSheet = (newEntity?: Entity) => {
    if (newEntity) setOptionsEntity(newEntity);
    reportPostSheetRef.current?.snapToIndex(0);
  };

  const closeReportPostSheet = () => {
    reportPostSheetRef.current?.close();
    setOptionsEntity(null);
  };

  const openSharePostSheet = (newEntity?: Entity) => {
    if (newEntity) setSharedPost(newEntity);
    sharePostSheetRef.current?.snapToIndex(0);
  };

  const closeSharePostSheet = () => {
    sharePostSheetRef.current?.close();
  };

  return (
    <SheetManagerContext.Provider
      value={{
        commentSetionSheetRef,
        saveToListSheetRef,
        postOptionsSheetRef,
        ownerPostOptionsSheetRef,
        reportPostSheetRef,
        sharePostSheetRef,

        openCommentSectionSheet,
        closeCommentSectionSheet,
        openSaveToListSheet,
        closeSaveToListSheet,
        openPostOptionsSheet,
        closePostOptionsSheet,
        openOwnerPostOptionsSheet,
        closeOwnerPostOptionsSheet,
        openReportPostSheet,
        closeReportPostSheet,
        openSharePostSheet,
        closeSharePostSheet,

        commmentsEntityId,
        setCommentsEntityId,

        highlightedCommentId,
        setHighlightedCommentsId,

        collectionsEntityId,
        setCollectionsEntityId,

        optionsEntity,
        setOptionsEntity,

        reportedPost,
        setReportedPost,

        sharedPost,
        setSharedPost,
      }}
    >
      {children}
    </SheetManagerContext.Provider>
  );
};
