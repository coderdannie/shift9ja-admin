import React, { useState } from "react";
import {
  useGetPaymentProviders,
  useActivatePaymentProvider,
} from "../../../services/query/payment";
import type { PaymentProvider } from "../../../types/payment";
import {
  Settings2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
} from "lucide-react";
import EditProviderDrawer from "./EditProviderDrawer";
import Button from "../../common/Button";

const PaymentProviders: React.FC = () => {
  const { data: providersResponse, isLoading } = useGetPaymentProviders();
  const activateMutation = useActivatePaymentProvider();

  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const providers = providersResponse?.data || [];

  const handleEdit = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    setIsDrawerOpen(true);
  };

  const handleActivate = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to set this provider as default and high priority?",
      )
    ) {
      activateMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-[#101828]">Payment Gateways</h2>
        <p className="text-sm text-[#667085]">
          Manage your payment providers, fee structures and priorities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.uuid}
            className={`relative bg-white border rounded-2xl p-6 transition-all hover:shadow-md ${
              provider.isDefault
                ? "border-primary ring-1 ring-primary/20"
                : "border-[#EAECF0]"
            }`}
          >
            {provider.isDefault && (
              <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1">
                <ShieldCheck size={12} />
                DEFAULT PROVIDER
              </div>
            )}

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    provider.isDefault
                      ? "bg-primary/5 border-primary/20 text-primary"
                      : "bg-gray-50 border-gray-100 text-gray-400"
                  }`}
                >
                  <span className="font-bold text-lg uppercase">
                    {provider.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#101828] capitalize">
                    {provider.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        provider.isEnabled
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${provider.isEnabled ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      {provider.isEnabled ? "Active" : "Disabled"}
                    </span>
                    <span className="text-[#98A2B3] text-xs">
                      Priority: {provider.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-9 px-3 w-fit"
                  onClick={() => handleEdit(provider)}
                  label=""
                  icon={<Settings2 size={16} />}
                />
                {!provider.isDefault && (
                  <Button
                    variant="primary"
                    className="h-9 px-3 w-fit"
                    onClick={() => handleActivate(provider.uuid)}
                    isLoading={
                      activateMutation.isPending &&
                      activateMutation.variables === provider.uuid
                    }
                    label="Make Default"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Funding Fee */}
              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F2F4F7]">
                <div className="flex items-center gap-2 text-[#667085] text-xs mb-2 font-medium">
                  <ArrowDownLeft size={14} className="text-blue-500" />
                  FUNDING FEE
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#101828]">
                    {provider.fundingFeeAmount}
                  </span>
                  <span className="text-xs font-bold text-[#475467]">
                    {provider.fundingFeeType === "PERCENTAGE" ? "%" : "NGN"}
                  </span>
                </div>
                <div className="text-[10px] text-[#98A2B3] mt-1 font-medium italic">
                  Cap:{" "}
                  {parseFloat(provider.fundingFeeCap) > 0
                    ? `₦${provider.fundingFeeCap}`
                    : "None"}
                </div>
              </div>

              {/* Withdrawal Fee */}
              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F2F4F7]">
                <div className="flex items-center gap-2 text-[#667085] text-xs mb-2 font-medium">
                  <ArrowUpRight size={14} className="text-orange-500" />
                  WITHDRAWAL FEE
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#101828]">
                    {provider.withdrawalFeeAmount}
                  </span>
                  <span className="text-xs font-bold text-[#475467]">
                    {provider.withdrawalFeeType === "PERCENTAGE" ? "%" : "NGN"}
                  </span>
                </div>
                <div className="text-[10px] text-[#98A2B3] mt-1 font-medium italic">
                  Cap:{" "}
                  {parseFloat(provider.withdrawalFeeCap) > 0
                    ? `₦${provider.withdrawalFeeCap}`
                    : "None"}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F2F4F7] flex items-center justify-between text-[11px] text-[#98A2B3]">
              <span>
                Last updated:{" "}
                {provider.updatedAt
                  ? new Date(provider.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
              <div className="flex items-center gap-1 group cursor-pointer hover:text-primary transition-colors">
                View logs{" "}
                <ChevronRight
                  size={12}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProvider && (
        <EditProviderDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          provider={selectedProvider}
        />
      )}
    </div>
  );
};

export default PaymentProviders;
