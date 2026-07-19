import React from "react";
import RoleBadge from "./RoleBadge";
import ReviewCard from "./ReviewCard";
import { InfoItem, statusBadgeStyles } from "./UserDetailShared";

interface UserProfileSectionProps {
  user: any;
  setSelectedImageIndex: (index: number | null) => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
  setSelectedImageIndex,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-12 xl:gap-x-20">
      {/* Left Column: Details, Bio, Skills */}
      <div className="flex flex-col order-1">
        <div className="flex flex-col mb-12">
          <h2 className="text-base font-bold text-[#101828] mb-4 uppercase tracking-wider text-[13px]">
            Location & Contact
          </h2>
          <div className="bg-white rounded-xl border border-[#F2F4F7] px-6">
            <InfoItem label="City" value={user.city} />
            <InfoItem
              label="Account Status"
              value={
                <span
                  className={`px-3 py-1 rounded-full border text-[10px] font-bold capitalize transition-all duration-300 ${statusBadgeStyles[user.status as keyof typeof statusBadgeStyles]}`}
                >
                  {user.status.replace("_", " ")}
                </span>
              }
            />
            <InfoItem
              label="Wallet Balance"
              value={`${user.wallet.currency}${user.wallet.balance.toLocaleString()}`}
            />
            <InfoItem
              label="Active Role"
              value={<RoleBadge role={user.activeRole} />}
            />
            <InfoItem
              label="Assigned Roles"
              value={
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((r: string) => (
                    <RoleBadge key={r} role={r} />
                  ))}
                </div>
              }
            />
            <InfoItem label="Phone Number" value={user.phone} />
            <div className="flex items-center justify-between py-4">
              <span className="text-[#475467] font-medium text-sm pr-4">
                Ratings:
              </span>
              <div className="flex flex-col items-end">
                <span className="text-[#101828] font-bold text-sm">
                  {user.ratingCount > 0
                    ? `${(user.averageRating || 0).toFixed(1)}/5`
                    : "N/A"}
                </span>
                <span className="text-[#667085] text-[11px]">
                  ({user.ratingCount} ratings)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="flex flex-col mb-12">
          <h2 className="text-base font-bold text-[#101828] mb-4 uppercase tracking-wider text-[13px]">
            Professional Details
          </h2>
          <div className="bg-white rounded-xl border border-[#F2F4F7] px-6">
            <InfoItem
              label="Experience Level"
              value={user.experienceLevel}
            />
            <InfoItem
              label="Years of Experience"
              value={`${user.yearsOfExperience} Year(s)`}
            />
            <InfoItem
              label="Minimum Task Fee"
              value={`${user.wallet.currency}${user.minimumTaskFee.toLocaleString()}`}
            />
            <InfoItem
              label="Languages"
              value={user.languagesSpoken?.join(", ") || "N/A"}
            />
            <InfoItem
              label="Emergency Services"
              value={user.offersEmergencyServices ? "Yes" : "No"}
            />
            <InfoItem
              label="Insurance"
              value={user.hasInsurance ? "Yes" : "No"}
            />
            <InfoItem
              label="Service Guarantee"
              value={user.hasServiceGuarantee ? "Yes" : "No"}
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-12">
          <h2 className="text-base font-bold text-[#101828] mb-4 uppercase tracking-wider text-[13px]">
            Bio
          </h2>
          <p className="text-[#667085] text-sm leading-[1.8]">
            {user.bio}
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-[#101828] mb-5 uppercase tracking-wider text-[13px]">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {user.skills?.length > 0 ? (
              user.skills.map((skill: any) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-lg border border-[#EAECF0] bg-[#F9FAFB] text-sm text-[#475467] font-semibold transition-colors hover:border-green-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#98A2B3] italic">
                No skills listed
              </span>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {user.galleryUrls?.length > 0 && (
          <div className="mb-8 lg:mb-0">
            <h2 className="text-base font-bold text-[#101828] mb-5 uppercase tracking-wider text-[13px]">
              Portfolio Gallery
            </h2>
            <div className="flex flex-wrap gap-4">
              {user.galleryUrls.map((url: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="w-24 h-24 rounded-lg overflow-hidden border border-[#EAECF0] shadow-sm cursor-pointer group relative"
                >
                  <img
                    src={url}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Top Reviews */}
      <div className="flex flex-col order-2">
        <h2 className="text-base font-bold text-[#101828] mb-6 uppercase tracking-wider text-[13px]">
          Top Reviews
        </h2>
        <div className="flex flex-col bg-[#F9FAFB]/50 rounded-3xl border border-[#F2F4F7] p-4 sm:p-8">
          {user.recentReviews.length > 0 ? (
            user.recentReviews.map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="py-12 text-center text-[#98A2B3] italic text-sm">
              No reviews found for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
