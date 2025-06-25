import React from "react";
import Modal from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirmação",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="mb-6 text-gray-800 dark:text-gray-200">{message}</div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
