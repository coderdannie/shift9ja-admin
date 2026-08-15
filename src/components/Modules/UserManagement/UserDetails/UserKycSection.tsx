import React from "react";
import { ShieldCheck } from "lucide-react";
import Button from "../../../common/Button";

interface UserKycSectionProps {
  user: any;
  isKycReviewer: boolean;
  setIsApproveOpen: (isOpen: boolean) => void;
  setIsRejectOpen: (isOpen: boolean) => void;
  setIsRetryOpen: (isOpen: boolean) => void;
}

const UserKycSection: React.FC<UserKycSectionProps> = ({
  user,
  isKycReviewer,
  setIsApproveOpen,
  setIsRejectOpen,
  setIsRetryOpen,
}) => {
  return (
    <div className="mb-12 bg-white rounded-3xl border border-[#F2F4F7] p-4 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0086C9]/10 rounded-lg text-[#0086C9]">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#101828]">
            KYC Verification Details
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {user.kycVerification && (
            <span
              className={`px-3 py-1 rounded-full border text-xs font-bold capitalize ${
                user.kycVerification.status === "verified" ||
                user.kycVerification.status === "approved"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : user.kycVerification.status === "rejected"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              {user.kycVerification.status}
            </span>
          )}
          {isKycReviewer &&
            user.kycVerification &&
            user.kycVerification.status !== "verified" &&
            user.kycVerification.status !== "approved" && (
              <div className="flex items-center gap-2">
                <Button
                  label="Approve"
                  variant="primary"
                  onClick={() => setIsApproveOpen(true)}
                  className="!py-1.5 !px-4 text-xs font-bold shadow-sm bg-green-600 hover:bg-green-700"
                />
                <Button
                  label="Reject"
                  variant="danger"
                  onClick={() => setIsRejectOpen(true)}
                  className="!py-1.5 !px-4 text-xs font-bold shadow-sm"
                />
                <Button
                  label="Retry"
                  variant="primary"
                  onClick={() => setIsRetryOpen(true)}
                  className="!py-1.5 !px-4 text-xs font-bold shadow-sm bg-blue-600 hover:bg-blue-700"
                />
              </div>
            )}
        </div>
      </div>

      {!user.kycVerification ? (
        <div className="py-8 text-center text-[#98A2B3] italic text-sm border border-dashed border-[#EAECF0] rounded-2xl bg-[#F9FAFB]">
          No KYC verification data available for this user.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: ID & Basic KYC Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#F9FAFB] rounded-2xl border border-[#EAECF0] p-5">
              <h3 className="text-sm font-bold text-[#344054] mb-4 uppercase tracking-wider">
                KYC Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <span className="text-[#667085] text-xs font-medium block mb-1">
                    ID Type
                  </span>
                  <span className="text-[#101828] text-sm font-bold uppercase">
                    {user.kycVerification.type || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[#667085] text-xs font-medium block mb-1">
                    ID Number
                  </span>
                  <span className="text-[#101828] text-sm font-bold">
                    {user.kycVerification.idNumber || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[#667085] text-xs font-medium block mb-1">
                    Verification UUID
                  </span>
                  <span className="text-[#101828] text-xs font-mono break-all">
                    {user.kycVerification.uuid}
                  </span>
                </div>
                {user.kycVerification.otpAttempts !== undefined && (
                  <div>
                    <span className="text-[#667085] text-xs font-medium block mb-1">
                      OTP Attempts
                    </span>
                    <span className="text-[#101828] text-sm font-bold">
                      {user.kycVerification.otpAttempts}
                    </span>
                  </div>
                )}
                {user.kycVerification.failureReason && (
                  <div className="sm:col-span-2 bg-rose-50 border border-rose-100 rounded-xl p-3">
                    <span className="text-rose-700 text-xs font-bold block mb-1">
                      Rejection Reason
                    </span>
                    <span className="text-rose-900 text-sm">
                      {user.kycVerification.failureReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Matches Sub-Section */}
            {user.kycVerification.providerResponse && (
              <div className="bg-white rounded-2xl border border-[#EAECF0] p-5">
                <h3 className="text-sm font-bold text-[#344054] mb-4 uppercase tracking-wider">
                  Official Government Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <span className="text-[#667085] text-xs font-medium block mb-1">
                      Legal Full Name
                    </span>
                    <span className="text-[#101828] text-sm font-bold uppercase font-mono">
                      {`${user.kycVerification.providerResponse.first_name || ""} ${user.kycVerification.providerResponse.middle_name || ""} ${user.kycVerification.providerResponse.last_name || ""}`.trim() ||
                        "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#667085] text-xs font-medium block mb-1">
                      Legal Phone Number
                    </span>
                    <span className="text-[#101828] text-sm font-bold">
                      {user.kycVerification.providerResponse.phone_number ||
                        "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#667085] text-xs font-medium block mb-1">
                      Gender
                    </span>
                    <span className="text-[#101828] text-sm font-bold capitalize">
                      {user.kycVerification.providerResponse.gender || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Verification Photo */}
          <div className="flex flex-col items-center justify-start bg-[#F9FAFB] rounded-2xl border border-[#EAECF0] p-6 text-center">
            <h3 className="text-sm font-bold text-[#344054] mb-4 uppercase tracking-wider w-full">
              Government ID Photo
            </h3>
            {user.kycVerification.providerResponse?.photo ? (
              <div className="w-full max-w-[200px] aspect-[3/4] rounded-xl overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center">
                <img
                  src={
                    user.kycVerification.providerResponse.photo
                      .replace(/\s/g, "")
                      .startsWith("data:")
                      ? user.kycVerification.providerResponse.photo.replace(
                          /\s/g,
                          "",
                        )
                      : `data:image/jpeg;base64,${user.kycVerification.providerResponse.photo.replace(/\s/g, "")}`
                  }
                  alt="Government Record"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full max-w-[200px] aspect-[3/4] rounded-xl border border-dashed border-[#D0D5DD] bg-white flex flex-col items-center justify-center p-4">
                <span className="text-gray-400 text-xs italic font-semibold">
                  No photo returned by verification provider
                </span>
              </div>
            )}
            <span className="text-[11px] text-[#667085] mt-4 leading-normal max-w-xs font-semibold">
              This photo is retrieved directly from official government
              databases and can be used to cross-reference with the
              user's avatar.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserKycSection;
