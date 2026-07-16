import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircle, X } from 'lucide-react';
import Button from '../../common/Button';

interface CancelTaskModalProps {
  isOpen: boolean;
  taskTitle?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const CancelTaskModal: React.FC<CancelTaskModalProps> = ({
  isOpen,
  taskTitle,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    if (isLoading) return;
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#98A2B3] hover:bg-gray-100 transition-colors disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
                  <XCircle className="text-red-500" size={26} />
                </div>

                <Dialog.Title as="h2" className="text-[20px] font-bold text-[#101828] mb-1 font-inter">
                  Cancel Task
                </Dialog.Title>
                <p className="text-[#475467] text-sm leading-relaxed font-inter mb-6">
                  {taskTitle ? (
                    <>You are about to cancel <span className="font-semibold text-[#101828]">&quot;{taskTitle}&quot;</span>. </>
                  ) : (
                    'You are about to cancel this task. '
                  )}
                  Please provide a reason — this will be recorded and visible to the task client.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#344054] mb-1.5">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Task violates platform terms of service..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] text-sm placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition resize-none disabled:opacity-60"
                  />
                  <p className={`text-xs mt-1 text-right ${reason.trim().length === 0 ? 'text-[#D0D5DD]' : 'text-[#667085]'}`}>
                    {reason.length} characters
                  </p>
                </div>

                <div className="grid gap-3">
                  <Button
                    label="Cancel Task"
                    variant="danger"
                    fullWidth={false}
                    className="flex-1 !h-11 font-semibold shadow-lg shadow-red-500/20"
                    onClick={handleConfirm}
                    isLoading={isLoading}
                    disabled={!reason.trim() || isLoading}
                  />
                  <Button
                    label="Go Back"
                    variant="outline"
                    fullWidth={false}
                    className="flex-1 !h-11 border-[#D0D5DD] font-semibold"
                    onClick={handleClose}
                    disabled={isLoading}
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

export default CancelTaskModal;
