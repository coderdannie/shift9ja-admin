import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, XCircle } from 'lucide-react';
import Button from '../common/Button';

interface KycRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName: string;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  isUpdatingKyc: boolean;
  handleReject: () => void;
}

const KycRejectModal: React.FC<KycRejectModalProps> = ({
  isOpen,
  onClose,
  userFullName,
  rejectionReason,
  setRejectionReason,
  isUpdatingKyc,
  handleReject,
}) => {
  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={React.Fragment}
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
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-xl transition-all w-full max-w-md">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#98A2B3] hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-5 text-rose-600">
                  <XCircle size={26} />
                </div>

                <Dialog.Title
                  as="h2"
                  className="text-[20px] font-bold text-[#101828] mb-2 font-inter"
                >
                  Reject User KYC
                </Dialog.Title>

                <div className="mt-2">
                  <p className="text-[#475467] text-sm leading-relaxed mb-4 font-inter">
                    Please enter a clear, descriptive reason for rejecting
                    the KYC submission for {userFullName}. This reason will
                    be sent as a push notification to the user.
                  </p>
                  <textarea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. The uploaded ID document is blurry and unreadable. Please upload a clear photo of your government-issued ID."
                    className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none font-inter text-[#101828]"
                  />
                </div>

                <div className="mt-8 flex gap-3">
                  <Button
                    label="Cancel"
                    variant="outline"
                    className="flex-1 !h-11 border-[#D0D5DD] font-semibold"
                    onClick={onClose}
                    disabled={isUpdatingKyc}
                  />
                  <Button
                    label={isUpdatingKyc ? "Rejecting..." : "Reject KYC"}
                    variant="danger"
                    className="flex-1 !h-11 font-semibold"
                    onClick={handleReject}
                    disabled={!rejectionReason.trim() || isUpdatingKyc}
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

export default KycRejectModal;
