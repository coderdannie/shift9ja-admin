import React, { useState, useMemo } from "react";
import { Mail, Users, Filter, Download, Search } from "lucide-react";
import Button from "../../components/common/Button";
import InquiryTabs from "../../components/Modules/WebsiteInquiries/InquiryTabs";
import type { InquiryTabType } from "../../components/Modules/WebsiteInquiries/InquiryTabs";
import ContactTable from "../../components/Modules/WebsiteInquiries/ContactTable";
import WaitlistTable from "../../components/Modules/WebsiteInquiries/WaitlistTable";
import type {
  ContactInquiry,
  WaitlistEntry,
} from "../../types/websiteInquiries";
import { useQuery } from "@tanstack/react-query";
import { getWaitlistEntries } from "../../services/api/waitlist";

const MOCK_CONTACTS: ContactInquiry[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    message:
      "I would like to know more about your services and how I can get started as a helper.",
    date: "2026-04-01T10:00:00Z",
    status: "new",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    message:
      "Hello, I am having trouble with my account verification. Can you assist?",
    date: "2026-03-31T14:30:00Z",
    status: "replied",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    message:
      "Great platform! I just wanted to leave some positive feedback about my experience.",
    date: "2026-03-30T09:15:00Z",
    status: "read",
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@example.com",
    message: "Are there any plans for expanding to other regions soon?",
    date: "2026-03-29T16:45:00Z",
    status: "new",
  },
  {
    id: "5",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    message: "Inquiry regarding corporate partnerships.",
    date: "2026-03-28T11:20:00Z",
    status: "new",
  },
];



const WebsiteInquiries = () => {
  const [activeTab, setActiveTab] = useState<InquiryTabType>("contact");
  const [search, setSearch] = useState("");

  const filteredContacts = useMemo(() => {
    return MOCK_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const { data: waitlistResponse, isLoading: isLoadingWaitlist } = useQuery({
    queryKey: ["waitlist"],
    queryFn: () => getWaitlistEntries({ page: 1, limit: 100 }),
  });

  const waitlistEntries: WaitlistEntry[] = waitlistResponse?.data?.data || [];

  const filteredWaitlist = useMemo(() => {
    return waitlistEntries.filter((w) =>
      w.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, waitlistEntries]);

  const handleExport = () => {
    if (activeTab === "waitlist") {
      const headers = [
        "CONTACT ID",
        "EMAIL",
        "FIRSTNAME",
        "LASTNAME",
        "SMS",
        "LANDLINE_NUMBER",
        "WHATSAPP",
        "INTERESTS"
      ];
      
      const rows = filteredWaitlist.map((entry) => [
        "", // CONTACT ID
        entry.email, // EMAIL
        "", // FIRSTNAME
        "", // LASTNAME
        "", // SMS
        "", // LANDLINE_NUMBER
        "", // WHATSAPP
        "[]" // INTERESTS
      ]);

      const csvContent = [
        headers.map(h => `"${h}"`).join(","),
        ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `waitlist_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ["Name", "Email", "Message", "Date", "Status"];
      const rows = filteredContacts.map((c) => [
        c.name,
        c.email,
        c.message,
        c.date,
        c.status
      ]);
      
      const csvContent = [
        headers.map(h => `"${h}"`).join(","),
        ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828]">
            Website Inquiries
          </h1>
          <p className="text-[#475467] text-sm mt-1">
            Manage contact form submissions and waiting list signups
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            label="Filter"
            variant="outline"
            fullWidth={false}
            className="h-10! border-[#F2F4F7]"
            icon={<Filter size={18} />}
          />
          <Button
            label="Export"
            variant="primary"
            fullWidth={false}
            className="h-10! px-6"
            onClick={handleExport}
            icon={<Download size={18} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Mail size={20} />
            </div>
          </div>
          <p className="text-[#475467] text-sm font-medium">Total Contact Us</p>
          <h3 className="text-2xl font-bold text-[#101828] mt-1">
            {MOCK_CONTACTS.length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-[#475467] text-sm font-medium">Waitlist Count</p>
          <h3 className="text-2xl font-bold text-[#101828] mt-1">
            {waitlistResponse?.data?.meta?.totalItems || waitlistEntries.length}
          </h3>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-[#667085]" />
        </div>
        <input
          type="text"
          placeholder="Search inquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-11 pr-4 py-2.5 rounded-full border border-[#F2F4F7] bg-white text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition hover:border-[#D0D5DD]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm overflow-hidden">
        <InquiryTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          contactCount={MOCK_CONTACTS.length}
          waitlistCount={waitlistResponse?.data?.meta?.totalItems || waitlistEntries.length}
        />

        <div className="p-1">
          {activeTab === "contact" ? (
            <ContactTable inquiries={filteredContacts} />
          ) : (
            <WaitlistTable entries={filteredWaitlist} isLoading={isLoadingWaitlist} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteInquiries;
