import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

export type ConfirmModalVariant = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmModalVariant;
  isLoading?: boolean;
}

const variantStyles: Record<ConfirmModalVariant, {
  icon: string; iconBg: string; confirmVariant: 'primary' | 'secondary' | 'outline'; confirmClass: string;
}> = {
  danger: {
    icon: 'text-red-600',
    iconBg: 'bg-red-50',
    confirmVariant: 'primary',
    confirmClass: '!bg-red-600 hover:!bg-red-700',
  },
  warning: {
    icon: 'text-amber-500',
    iconBg: 'bg-amber-50',
    confirmVariant: 'primary',
    confirmClass: '!bg-amber-500 hover:!bg-amber-600',
  },
  info: {
    icon: 'text-primary',
    iconBg: 'bg-green-50',
    confirmVariant: 'primary',
    confirmClass: '',
  },
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const styles = variantStyles[variant];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-xl transition-all w-full max-w-md">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#98A2B3] hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-full ${styles.iconBg} flex items-center justify-center mb-5`}>
                  <AlertTriangle className={styles.icon} size={26} />
                </div>

                {/* Content */}
                <Dialog.Title as="h2" className="text-[20px] font-bold text-[#101828] mb-2 font-inter">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-[#475467] text-sm leading-relaxed font-inter">
                    {description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center gap-3">
                  <Button
                    label={cancelLabel}
                    variant="outline"
                    fullWidth={false}
                    className="flex-1 !h-11 border-[#D0D5DD] font-semibold"
                    onClick={onClose}
                    disabled={isLoading}
                  />
                  <Button
                    label={confirmLabel}
                    variant={styles.confirmVariant}
                    fullWidth={false}
                    className={`flex-1 !h-11 ${styles.confirmClass} font-semibold`}
                    onClick={onConfirm}
                    isLoading={isLoading}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmModal;
