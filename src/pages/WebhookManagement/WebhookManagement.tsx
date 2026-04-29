import React, { useState } from 'react';
import { Terminal, RefreshCw, Filter, ChevronDown, Calendar, Search } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Portal } from '@headlessui/react';
import { Toaster, toast } from 'react-hot-toast';
import { useGetWebhooks, useRetryWebhook } from '../../services/query/webhook';
import WebhookTable from '../../components/Modules/WebhookManagement/WebhookTable';
import WebhookDetailModal from '../../components/Modules/WebhookManagement/WebhookDetailModal';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import type { Webhook } from '../../types';

const ITEMS_PER_PAGE = 10;

const WebhookManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetWebhooks(
    currentPage,
    ITEMS_PER_PAGE,
    provider || undefined,
    event || undefined,
    status || undefined
  );

  const { mutate: retry } = useRetryWebhook();

  const handleRetry = (uuid: string) => {
    setRetryingId(uuid);
    retry(uuid, {
      onSuccess: () => {
        toast.success('Webhook retry initiated successfully');
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to retry webhook');
      },
      onSettled: () => {
        setRetryingId(null);
      },
    });
  };

  const webhooks = data?.data?.items || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  const handleViewDetails = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsDetailModalOpen(true);
  };

  const resetFilters = () => {
    setStatus('');
    setProvider('');
    setEvent('');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      <Toaster position="top-right" />
      
      <WebhookDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        webhook={selectedWebhook} 
        onRetry={handleRetry}
        isRetrying={retryingId === selectedWebhook?.uuid}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828] flex items-center gap-3">
            Webhook Management
            <div className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              System
            </div>
          </h1>
          <p className="text-[#475467] text-sm mt-1">
            Monitor and debug incoming webhook events from payment providers and third-party services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            label={isFetching ? "Refreshing..." : "Refresh"}
            variant="outline"
            onClick={() => refetch()}
            fullWidth={false}
            className="!h-10 border-[#F2F4F7]"
            icon={<RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">
            Provider
          </label>
          <div className="relative group">
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-12 pl-4 pr-10 rounded-2xl border border-[#F2F4F7] bg-[#F9FAFB] text-[#101828] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition appearance-none cursor-pointer"
            >
              <option value="">All Providers</option>
              <option value="paystack">Paystack</option>
              <option value="budpay">BudPay</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">
            Event Name
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Filter by event (e.g. charge.success)"
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#F2F4F7] bg-[#F9FAFB] text-[#101828] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">
            Status
          </label>
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center justify-between w-full h-12 px-5 rounded-2xl border border-[#F2F4F7] bg-[#F9FAFB] text-[#101828] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 transition hover:border-[#D0D5DD]">
              <span className="capitalize font-semibold">
                {status === "" ? "All Status" : status.toLowerCase()}
              </span>
              <ChevronDown size={18} className="text-gray-400" />
            </MenuButton>
            <Portal>
              <MenuItems
                anchor="bottom start"
                className="z-[99] w-48 origin-top-right rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 focus:outline-none focus:ring-0 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                {[
                  { label: "All Status", value: "" },
                  { label: "Success", value: "SUCCESS" },
                  { label: "Failed", value: "FAILED" },
                  { label: "Pending", value: "PENDING" },
                ].map((opt) => (
                  <MenuItem key={opt.label}>
                    <button
                      onClick={() => {
                        setStatus(opt.value);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center w-full px-4 py-2.5 text-sm rounded-xl transition-all ${
                        status === opt.value
                          ? "bg-primary/5 text-primary font-bold shadow-sm"
                          : "text-[#475467] hover:bg-gray-50 hover:text-[#101828]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  </MenuItem>
                ))}
              </MenuItems>
            </Portal>
          </Menu>
        </div>

        <div className="w-full">
          <Button
            label="Reset Filters"
            variant="outline"
            onClick={resetFilters}
            className="!h-12 rounded-2xl w-full font-bold border-gray-200 text-gray-500 hover:bg-gray-50 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <WebhookTable 
          webhooks={webhooks} 
          isLoading={isLoading} 
          onView={handleViewDetails} 
          onRetry={handleRetry}
          isRetrying={retryingId}
        />
      </div>

      <div className="mt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default WebhookManagement;
