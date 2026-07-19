import React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import RoleBadge from "./RoleBadge";

const ReviewCard: React.FC<{ review: any }> = ({ review }) => {
  const authorName = `${review.reviewer?.firstName} ${review.reviewer?.lastName}`;
  const date = new Date(review.createdAt).toLocaleDateString();

  const subRatings = [
    { label: "Clarity", value: review.clarityRating },
    { label: "Communication", value: review.communicationRating },
    { label: "Cooperation", value: review.cooperationRating },
  ].filter((r) => r.value !== null && r.value !== undefined);

  return (
    <div className="flex flex-col gap-4 py-6 last:pb-0 border-b border-[#F2F4F7] last:border-0 hover:bg-gray-50/50 transition-colors px-4 -mx-4 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0 overflow-hidden">
            {review.reviewer?.avatarUrl ? (
              <img
                src={review.reviewer.avatarUrl}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs">
                {review.reviewer?.firstName?.[0]}
                {review.reviewer?.lastName?.[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#101828] truncate">
                {authorName}
              </span>
              <RoleBadge role={review.reviewerRole} />
            </div>
            <span className="text-[#98A2B3] text-xs">{date}</span>
          </div>
        </div>
        {review.reviewer?.isEmailVerified && (
          <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-[10px] font-bold text-green-700 uppercase tracking-tight">
            <CheckCircle2 size={10} />
            Verified
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[#475467] text-sm italic leading-relaxed">
          "{review.comment}"
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>

          {subRatings.length > 0 && (
            <div className="flex flex-wrap gap-3 border-l border-gray-200 pl-4 ml-1">
              {subRatings.map((sr) => (
                <div key={sr.label} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {sr.label}:
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full mr-0.5 ${i < (sr.value || 0) ? "bg-primary" : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
