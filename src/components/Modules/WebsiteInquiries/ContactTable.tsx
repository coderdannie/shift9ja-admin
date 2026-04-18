import React from "react";
import type { ContactInquiry } from "../../../types/websiteInquiries";
import { Mail, Clock, CheckCircle2 } from "lucide-react";

interface ContactTableProps {
  inquiries: ContactInquiry[];
  isLoading?: boolean;
}

const ContactTable: React.FC<ContactTableProps> = ({
  inquiries,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-[#EAECF0] overflow-hidden p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-[#EAECF0] overflow-hidden p-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Mail size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[#101828]">
          No inquiries found
        </h3>
        <p className="text-[#475467]">
          There are no contact form submissions to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-[#EAECF0] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#EAECF0]">
              <th className="px-6 py-4 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {inquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-[#101828]">
                    {inquiry.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#475467]">
                    {inquiry.email}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-sm text-[#475467] line-clamp-2">
                    {inquiry.message}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#475467]">
                    {new Date(inquiry.date).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === "new"
                        ? "bg-blue-50 text-blue-700"
                        : inquiry.status === "replied"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {inquiry.status === "new" && <Clock size={12} />}
                    {inquiry.status === "replied" && <CheckCircle2 size={12} />}
                    <span className="capitalize">{inquiry.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
