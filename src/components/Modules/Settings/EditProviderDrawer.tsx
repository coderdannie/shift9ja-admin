import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { PaymentProvider } from "../../../types/payment";
import { useUpdatePaymentProvider } from "../../../services/query/payment";
import {
  X,
  Save,
  Info,
  Settings2,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import Button from "../../common/Button";

interface EditProviderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  provider: PaymentProvider;
}

const EditProviderDrawer: React.FC<EditProviderDrawerProps> = ({
  isOpen,
  onClose,
  provider,
}) => {
  const updateMutation = useUpdatePaymentProvider();

  const formik = useFormik({
    initialValues: {
      isEnabled: provider.isEnabled,
      priority: provider.priority,
      withdrawalFeeType: provider.withdrawalFeeType,
      withdrawalFeeAmount: provider.withdrawalFeeAmount,
      withdrawalFeeCap: provider.withdrawalFeeCap,
      fundingFeeType: provider.fundingFeeType,
      fundingFeeAmount: provider.fundingFeeAmount,
      fundingFeeCap: provider.fundingFeeCap,
    },
    validationSchema: Yup.object({
      priority: Yup.number().required("Priority is required").min(0, "Min 0"),
      withdrawalFeeAmount: Yup.number()
        .required("Amount is required")
        .min(0, "Min 0"),
      fundingFeeAmount: Yup.number()
        .required("Amount is required")
        .min(0, "Min 0"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      updateMutation.mutate(
        {
          id: provider.uuid,
          data: {
            ...values,
            priority: Number(values.priority),
            withdrawalFeeAmount: Number(values.withdrawalFeeAmount),
            withdrawalFeeCap: Number(values.withdrawalFeeCap),
            fundingFeeAmount: Number(values.fundingFeeAmount),
            fundingFeeCap: Number(values.fundingFeeCap),
          } as unknown as Partial<PaymentProvider>,
        },
        {
          onSuccess: () => onClose(),
        },
      );
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto flex h-full w-screen max-w-md flex-col bg-white shadow-2xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#F2F4F7] flex items-center justify-between bg-white sticky top-0">
                <div>
                  <DialogTitle
                    as="h3"
                    className="text-lg font-bold text-[#101828]"
                  >
                    Configure {provider.name}
                  </DialogTitle>
                  <p className="text-xs text-[#667085]">
                    Update fees and provider settings
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-[#667085]" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={formik.handleSubmit}
                className="flex-1 overflow-y-auto p-6 space-y-8"
              >
                {/* General Settings */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Settings2 size={14} />
                    General Settings
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <div className="text-sm font-bold text-[#101828]">
                        Enable Provider
                      </div>
                      <div className="text-xs text-[#667085]">
                        Allow users to use this gateway
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        name="isEnabled"
                        checked={formik.values.isEnabled}
                        onChange={formik.handleChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#344054]">
                      Execution Priority
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={formik.values.priority}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    />
                    <p className="text-[10px] text-[#667085] flex items-center gap-1">
                      <Info size={10} />
                      Higher numbers have higher precedence in provider
                      selection
                    </p>
                  </div>
                </section>

                {/* Funding Fees */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                    <ArrowDownLeft size={14} />
                    Funding Fees
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#344054]">
                        Fee Type
                      </label>
                      <select
                        name="fundingFeeType"
                        value={formik.values.fundingFeeType}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg bg-white text-sm outline-none"
                      >
                        <option value="FLAT">Flat Rate (NGN)</option>
                        <option value="PERCENTAGE">Percentage (%)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#344054]">
                        Amount
                      </label>
                      <input
                        type="text"
                        name="fundingFeeAmount"
                        value={formik.values.fundingFeeAmount}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#344054]">
                      Max Fee (Cap)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        ₦
                      </span>
                      <input
                        type="text"
                        name="fundingFeeCap"
                        value={formik.values.fundingFeeCap}
                        onChange={formik.handleChange}
                        className="w-full pl-7 pr-3 py-2 border border-[#D0D5DD] rounded-lg text-sm outline-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Withdrawal Fees */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
                    <ArrowUpRight size={14} />
                    Withdrawal Fees
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#344054]">
                        Fee Type
                      </label>
                      <select
                        name="withdrawalFeeType"
                        value={formik.values.withdrawalFeeType}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg bg-white text-sm outline-none"
                      >
                        <option value="FLAT">Flat Rate (NGN)</option>
                        <option value="PERCENTAGE">Percentage (%)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#344054]">
                        Amount
                      </label>
                      <input
                        type="text"
                        name="withdrawalFeeAmount"
                        value={formik.values.withdrawalFeeAmount}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#344054]">
                      Max Fee (Cap)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        ₦
                      </span>
                      <input
                        type="text"
                        name="withdrawalFeeCap"
                        value={formik.values.withdrawalFeeCap}
                        onChange={formik.handleChange}
                        className="w-full pl-7 pr-3 py-2 border border-[#D0D5DD] rounded-lg text-sm outline-none"
                      />
                    </div>
                  </div>
                </section>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#F2F4F7] bg-gray-50 flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={updateMutation.isPending}
                  label="Cancel"
                />
                <Button
                  variant="primary"
                  className="flex-2"
                  onClick={() => formik.handleSubmit()}
                  isLoading={updateMutation.isPending}
                  label="Save Changes"
                  icon={<Save size={18} className="mr-2" />}
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProviderDrawer;
