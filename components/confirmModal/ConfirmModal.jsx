"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function ConfirmModal({
  isOpen = false,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  isLoading = false,
}) {
  // "Kapat" butonu veya modal dışında tıklama
  const handleClose = () => {
    if (onClose && !isLoading) {
      onClose();
    }
  };

  // "Evet, Sil" butonu
  const handleConfirm = async () => {
    if (onConfirm) {
      // onConfirm fonksiyonunu çağır ve tamamlanmasını bekle
      // Modal'ı kapatma işlemini parent component'e bırak
      await onConfirm();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={handleClose}
      isDismissable={!isLoading}
      hideCloseButton={false}
      size="md"
      classNames={{
        wrapper: "z-[99999]",
        backdrop: "z-[99998] bg-black/60",
      }}
    >
      <ModalContent className="bg-white">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </ModalHeader>
            <ModalBody className="py-6">
              <p className="text-gray-600">{message}</p>
            </ModalBody>
            <ModalFooter className="border-t border-gray-200">
              <Button 
                variant="light" 
                onPress={handleClose}
                isDisabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button 
                color="danger" 
                onPress={handleConfirm}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
