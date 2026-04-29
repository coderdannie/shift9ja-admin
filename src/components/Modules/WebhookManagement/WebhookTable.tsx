import React from 'react';
import CustomTable from '../../common/CustomTable';
import type { Webhook } from '../../../types';
import { format } from 'date-fns';
import { Eye, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import PermissionGuard from '../../common/PermissionGuard';

interface WebhookTableProps {
  webhooks: Webhook[];
  isLoading: boolean;
  onView: (webhook: Webhook) => void;
  onRetry: (uuid: string) => void;
  isRetrying: string | null;
}

const WebhookTable: React.FC<WebhookTableProps> = ({ webhooks, isLoading, onView, onRetry, isRetrying }) => {
  const headers = ['Event', 'Provider', 'Status', 'Date', 'Retry Count', 'Actions'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
            <CheckCircle size={12} />
            Success
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
            <XCircle size={12} />
            Failed
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
            <Clock size={12} />
            Pending
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
            {status}
          </span>
        );
    }
  };

  return (
    <CustomTable headers={headers} isLoading={isLoading}>
      {webhooks.map((webhook) => (
        <tr key={webhook.uuid} className="hover:bg-gray-50 transition-colors group">
          <td className="px-6 py-4">
            <div className="flex flex-col">
              <span className="font-bold text-[#101828]">{webhook.event}</span>
              <span className="text-xs text-gray-500 font-normal truncate max-w-[200px]">{webhook.uuid}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <span className="capitalize text-gray-700">{webhook.provider}</span>
          </td>
          <td className="px-6 py-4">
            {getStatusBadge(webhook.status)}
          </td>
          <td className="px-6 py-4">
            <span className="text-gray-600 whitespace-nowrap">
              {format(new Date(webhook.createdAt), 'MMM d, yyyy • HH:mm')}
            </span>
          </td>
          <td className="px-6 py-4">
            <span className="text-gray-600">{webhook.retryCount}</span>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(webhook)}
                className="p-2 rounded-full hover:bg-primary/5 text-primary transition-colors flex items-center justify-center"
                title="View Details"
              >
                <Eye size={18} />
              </button>
              {webhook.status === 'FAILED' && (
                <PermissionGuard permission="webhook_management.retry_webhooks">
                  <button
                    onClick={() => onRetry(webhook.uuid)}
                    disabled={isRetrying === webhook.uuid}
                    className={`p-2 rounded-full hover:bg-amber-50 text-amber-600 transition-colors flex items-center justify-center ${
                      isRetrying === webhook.uuid ? 'animate-spin' : ''
                    }`}
                    title="Retry Webhook"
                  >
                    <RotateCcw size={18} />
                  </button>
                </PermissionGuard>
              )}
            </div>
          </td>
        </tr>
      ))}
      {!isLoading && webhooks.length === 0 && (
        <tr>
          <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-500">
            No webhooks found
          </td>
        </tr>
      )}
    </CustomTable>
  );
};

export default WebhookTable;
