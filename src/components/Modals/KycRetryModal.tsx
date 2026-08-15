import React, { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import Button from "../common/Button";

interface KycRetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName: string;
  defaultType?: string;
  defaultIdNumber?: string;
  isRetrying: boolean;
  handleRetry: (type: string, idNumber: string) => void;
}

const KycRetryModal: React.FC<KycRetryModalProps> = ({
  isOpen,
  onClose,
  userFullName,
  defaultType = "",
  defaultIdNumber = "",
  isRetrying,
  handleRetry,
}) => {
  const [type, setType] = useState(defaultType);
  const [idNumber, setIdNumber] = useState(defaultIdNumber);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setIdNumber(defaultIdNumber);
    }
  }, [isOpen, defaultType, defaultIdNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <RefreshCw size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Retry KYC Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            You are about to manually retry the KYC verification for{" "}
            <span className="font-bold text-gray-900">{userFullName}</span>{" "}
            via Dojah. Please confirm or correct the ID type and number below.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Type (e.g., bvn, nin)
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. bvn"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Enter ID Number"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button
            label="Cancel"
            variant="outline"
            onClick={onClose}
            fullWidth={false}
            className="!py-2 !px-4 text-sm"
          />
          <Button
            label={isRetrying ? "Retrying..." : "Retry via Dojah"}
            variant="primary"
            onClick={() => handleRetry(type.toLowerCase().trim(), idNumber.trim())}
            fullWidth={false}
            disabled={isRetrying || !type.trim() || !idNumber.trim()}
            className="!py-2 !px-4 text-sm font-bold bg-blue-600 hover:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
};

export default KycRetryModal;
