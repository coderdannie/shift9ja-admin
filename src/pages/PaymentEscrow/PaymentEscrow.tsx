import React, { useState, useMemo } from "react";
import { Search, Wallet, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import EscrowStatsBar from "../../components/Modules/PaymentEscrow/EscrowStatsBar";
import EscrowTable from "../../components/Modules/PaymentEscrow/EscrowTable";
import type { EscrowTransaction } from "../../components/Modules/PaymentEscrow/EscrowTable";
import EscrowTransactionDrawer from "../../components/Modules/PaymentEscrow/EscrowTransactionDrawer";
import {
  useGetPaymentStats,
  useGetTransactions,
} from "../../services/query/payment";
import { exportPayments } from "../../services/api/payment";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Portal,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  ChevronDown,
  Calendar as CalendarIcon,
  Filter,
  X,
  Download,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Helper to get YYYY-MM-DD in local time
const toLocalISOString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDateReadable = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const PaymentEscrow: React.FC = () => {
  const { data: paymentStats, isPending: isLoadingStats } =
    useGetPaymentStats();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // New States for Filters and Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { data: transactionsData, isPending: isLoadingTransactions } =
    useGetTransactions({
      page: currentPage,
      limit: 10,
      type: typeFilter,
      status: statusFilter,
      search: searchQuery,
      startDate,
      endDate,
    });

  const statsData = paymentStats?.data;

  const stats = useMemo(
    () => [
      {
        title: "Pending Release",
        value: `₦${statsData?.pendingRelease?.toLocaleString() || "0"}`,
        icon: Clock,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        title: "Completed Payouts",
        value: statsData?.completedPayouts?.toLocaleString() || "0",
        icon: CheckCircle2,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
      },
      {
        title: "Failed Payments",
        value: statsData?.failedPayments?.toLocaleString() || "0",
        icon: AlertCircle,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
      },
    ],
    [statsData],
  );

  const transactions = useMemo(() => {
    return (
      transactionsData?.data?.items?.map((item: any) => ({
        id: item.uuid,
        taskId: item.metadata?.taskId
          ? `TC-${item.metadata.taskId.toString().padStart(5, "0")}`
          : item.reference,
        taskTitle:
          item.metadata?.description ||
          item.type
            .replace("_", " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
        amount: `₦${item.amount.toLocaleString()}`,
        client: item.user
          ? `${item.user.firstName} ${item.user.lastName}`
          : "System",
        helper: "Platform", // Backend doesn't explicitly show helper in this endpoint yet
        status: item.status, // pending, success, failed
      })) || []
    );
  }, [transactionsData]);

  const handleReview = (tx: any) => {
    setSelectedTransaction(tx);
    setIsDrawerOpen(true);
  };

  const handleExport = async (format: "csv" | "excel" = "csv") => {
    try {
      setIsExporting(true);
      await exportPayments({
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        format,
      });
    } catch (error) {
      console.error("Export failed:", error);
      // You could add a toast notification here if available
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
      {/* 1. Stats Section */}
      <EscrowStatsBar stats={stats} isLoading={isLoadingStats} />

      {/* 2. Search and Filtering Section */}
      <div className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[600px]">
        {/* Search Bar and Filters Container */}
        <div className="p-6 border-b border-[#F2F4F7] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative max-w-xl flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
            />
            <input
              type="text"
              placeholder="Search task by ID, reference or client"
              className="w-full pl-11 pr-4 py-3 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-sm font-bold text-[#344054] hover:bg-gray-50 transition-all">
                <Filter size={16} className="text-[#667085]" />
                Type:{" "}
                {typeFilter === "all"
                  ? "All"
                  : typeFilter
                      .replace("_", " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                <ChevronDown size={16} className="text-[#667085]" />
              </MenuButton>
              <Portal>
                <MenuItems
                  anchor="bottom end"
                  className="z-[9999] mt-2 w-48 origin-top-right rounded-xl border border-[#F2F4F7] bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  {[
                    "all",
                    "funding",
                    "escrow_lock",
                    "escrow_release",
                    "escrow_refund",
                    "transfer",
                  ].map((type) => (
                    <MenuItem key={type}>
                      {({ focus }) => (
                        <button
                          onClick={() => {
                            setTypeFilter(type);
                            setCurrentPage(1);
                          }}
                          className={`${
                            focus ? "bg-gray-50" : ""
                          } flex w-full items-center px-3 py-2 text-sm font-medium rounded-lg text-[#344054]`}
                        >
                          {type === "all"
                            ? "All Types"
                            : type
                                .replace("_", " ")
                                .replace(/\b\w/g, (l: string) =>
                                  l.toUpperCase(),
                                )}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Portal>
            </Menu>

            {/* Status Filter */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-sm font-bold text-[#344054] hover:bg-gray-50 transition-all">
                Status:{" "}
                {statusFilter === "all"
                  ? "All"
                  : statusFilter.replace(/\b\w/g, (l: string) =>
                      l.toUpperCase(),
                    )}
                <ChevronDown size={16} className="text-[#667085]" />
              </MenuButton>
              <Portal>
                <MenuItems
                  anchor="bottom end"
                  className="z-[9999] mt-2 w-40 origin-top-right rounded-xl border border-[#F2F4F7] bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  {["all", "pending", "success", "failed"].map((status) => (
                    <MenuItem key={status}>
                      {({ focus }) => (
                        <button
                          onClick={() => {
                            setStatusFilter(status);
                            setCurrentPage(1);
                          }}
                          className={`${
                            focus ? "bg-gray-50" : ""
                          } flex w-full items-center px-3 py-2 text-sm font-medium rounded-lg text-[#344054]`}
                        >
                          {status === "all"
                            ? "All Statuses"
                            : status.replace(/\b\w/g, (l) => l.toUpperCase())}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Portal>
            </Menu>

            {/* Date Range Filter (React Calendar) */}
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-2 px-4 py-2.5 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-sm font-bold text-[#344054] hover:bg-gray-50 transition-all shadow-sm">
                <CalendarIcon size={16} className="text-[#667085]" />
                {startDate && endDate ? (
                  <span className="flex items-center gap-1">
                    {formatDateReadable(startDate)}{" "}
                    <span className="text-[#98A2B3]">→</span>{" "}
                    {formatDateReadable(endDate)}
                  </span>
                ) : (
                  "Select Date Range"
                )}
                <ChevronDown size={16} className="text-[#667085]" />
              </PopoverButton>

              <Portal>
                <PopoverPanel
                  anchor="bottom end"
                  className="z-[9999] mt-2 bg-white rounded-2xl border border-[#F2F4F7] shadow-xl p-4 focus:outline-none"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
                      <h3 className="text-sm font-bold text-[#101828]">
                        Select Date Range
                      </h3>
                      <button
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                          setCurrentPage(1);
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <X size={14} /> Clear
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-[#667085] mb-2">
                      <div>
                        <span className="block mb-1 text-[10px] uppercase tracking-wider">
                          START DATE
                        </span>
                        <div className="p-2 bg-gray-50 rounded-lg border border-[#EAECF0] text-[#101828]">
                          {startDate ? formatDateReadable(startDate) : "---"}
                        </div>
                      </div>
                      <div>
                        <span className="block mb-1 text-[10px] uppercase tracking-wider">
                          END DATE
                        </span>
                        <div className="p-2 bg-gray-50 rounded-lg border border-[#EAECF0] text-[#101828]">
                          {endDate ? formatDateReadable(endDate) : "---"}
                        </div>
                      </div>
                    </div>

                    <Calendar
                      selectRange={true}
                      defaultValue={
                        startDate && endDate
                          ? [new Date(startDate), new Date(endDate)]
                          : undefined
                      }
                      onChange={(value: any) => {
                        if (Array.isArray(value)) {
                          const [start, end] = value;
                          if (start && end) {
                            setStartDate(toLocalISOString(start));
                            setEndDate(toLocalISOString(end));
                            setCurrentPage(1);
                          }
                        }
                      }}
                      className="border-none"
                    />
                  </div>
                </PopoverPanel>
              </Portal>
            </Popover>

            <button
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <span className="animate-spin duration-1000">○</span>
              ) : (
                <Download size={16} />
              )}
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="p-6">
          <EscrowTable
            transactions={transactions}
            isLoading={isLoadingTransactions}
            onReview={handleReview}
          />
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-[#F2F4F7]">
          <Pagination
            currentPage={currentPage}
            totalPages={transactionsData?.data?.meta?.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Escrow Transaction Drawer */}
      <EscrowTransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default PaymentEscrow;
