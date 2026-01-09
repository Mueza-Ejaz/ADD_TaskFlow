import React from 'react';
import { Modal } from './Modal'; // Assuming an existing Modal component
import { Button } from './Button'; // Assuming an existing Button component

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean; // To show loading state on confirm button
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="p-4">
        <p className="mb-4 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isConfirming}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isConfirming ? 'Confirming...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
