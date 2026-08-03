import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  Edit2,
  Loader2,
  MessageSquareDashed,
  Plus,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  useCreateSupportFAQ,
  useDeleteSupportFAQ,
  useGetSupportFAQs,
  useGetUnansweredQueue,
  usePromoteToFAQ,
  useUpdateSupportFAQ,
} from '../../services/query/support';
import type {
  CreateFAQPayload,
  FAQ,
  FAQCategory,
  UnansweredQuery,
} from '../../types/support';

const FAQ_CATEGORIES: FAQCategory[] = [
  'general',
  'tasks',
  'escrow',
  'payments',
  'payouts',
  'kyc',
  'disputes',
  'other',
];

const categoryColors: Record<FAQCategory, string> = {
  general: 'bg-gray-100 text-gray-700',
  tasks: 'bg-blue-100 text-blue-700',
  escrow: 'bg-amber-100 text-amber-700',
  payments: 'bg-green-100 text-green-700',
  payouts: 'bg-emerald-100 text-emerald-700',
  kyc: 'bg-purple-100 text-purple-700',
  disputes: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-500',
};

interface FAQModalProps {
  initial?: Partial<CreateFAQPayload>;
  onClose: () => void;
  onSubmit: (payload: CreateFAQPayload) => void;
  isPending: boolean;
  title: string;
}

const FAQModal: React.FC<FAQModalProps> = ({
  initial,
  onClose,
  onSubmit,
  isPending,
  title,
}) => {
  const [question, setQuestion] = useState(initial?.question || '');
  const [answer, setAnswer] = useState(initial?.answer || '');
  const [category, setCategory] = useState<FAQCategory>(
    initial?.category || 'general',
  );
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error('Question and answer are required.');
      return;
    }
    onSubmit({ question, answer, category, isPublished });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2F4F7]">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <h3 className="text-base font-bold text-[#101828]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How long does escrow hold last?"
              className="w-full border border-[#EAECF0] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Provide a clear, concise answer..."
              rows={5}
              className="w-full border border-[#EAECF0] rounded-xl px-3 py-2.5 text-sm resize-none focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FAQCategory)}
                className="w-full border border-[#EAECF0] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none capitalize"
              >
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Published
              </label>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  isPublished
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                {isPublished ? <Check size={14} /> : <X size={14} />}
                {isPublished ? 'Published' : 'Draft'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#EAECF0] rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {isPending ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const SupportFAQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'queue'>('faqs');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FAQCategory | 'all'>('all');
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    faq?: FAQ;
    prefill?: Partial<CreateFAQPayload>;
  }>({ open: false, mode: 'create' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: faqsData, isLoading: isLoadingFaqs } = useGetSupportFAQs({
    search: search || undefined,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });
  const faqs: FAQ[] = ((faqsData as any)?.data as FAQ[]) || [];

  const { data: queueData, isLoading: isLoadingQueue } = useGetUnansweredQueue();
  const queue: UnansweredQuery[] = ((queueData as any)?.data as UnansweredQuery[]) || [];

  const { mutate: createFAQ, isPending: isCreating } = useCreateSupportFAQ();
  const { mutate: updateFAQ, isPending: isUpdating } = useUpdateSupportFAQ();
  const { mutate: deleteFAQ, isPending: isDeleting } = useDeleteSupportFAQ();
  const { mutate: promoteFAQ, isPending: isPromoting } = usePromoteToFAQ();

  const openCreate = (prefill?: Partial<CreateFAQPayload>) => {
    setModalState({ open: true, mode: 'create', prefill });
  };
  const openEdit = (faq: FAQ) => {
    setModalState({ open: true, mode: 'edit', faq });
  };
  const closeModal = () =>
    setModalState({ open: false, mode: 'create' });

  const handleCreate = (payload: CreateFAQPayload) => {
    createFAQ(payload, {
      onSuccess: () => {
        toast.success('FAQ created successfully.');
        closeModal();
      },
      onError: () => toast.error('Failed to create FAQ.'),
    });
  };

  const handleUpdate = (payload: CreateFAQPayload) => {
    if (!modalState.faq) return;
    updateFAQ(
      { uuid: modalState.faq.uuid, payload },
      {
        onSuccess: () => {
          toast.success('FAQ updated.');
          closeModal();
        },
        onError: () => toast.error('Failed to update FAQ.'),
      },
    );
  };

  const handleDelete = (uuid: string) => {
    deleteFAQ(uuid, {
      onSuccess: () => {
        toast.success('FAQ deleted.');
        setDeleteConfirm(null);
      },
      onError: () => toast.error('Failed to delete FAQ.'),
    });
  };

  const handlePromote = (query: UnansweredQuery) => {
    openCreate({ question: query.question, category: 'general' });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">Support Knowledge Base</h1>
          <p className="text-sm text-[#475467] mt-0.5">
            Manage FAQs and review unanswered AI queries
          </p>
        </div>
        <button
          onClick={() => openCreate()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(
          [
            { value: 'faqs', label: 'FAQs', icon: <BookOpen size={14} /> },
            {
              value: 'queue',
              label: `Unanswered Queue${queue.length ? ` (${queue.length})` : ''}`,
              icon: <MessageSquareDashed size={14} />,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.value
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQs tab */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-[#F2F4F7] flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-[#EAECF0] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {FAQ_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border capitalize transition-all ${
                    categoryFilter === c
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {isLoadingFaqs ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <BookOpen size={40} className="text-gray-200 mb-4" />
              <h3 className="text-base font-semibold text-[#101828]">No FAQs yet</h3>
              <p className="text-sm text-[#475467] mt-1 max-w-xs">
                Add FAQs to improve AI response accuracy for common user questions.
              </p>
              <button
                onClick={() => openCreate()}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl"
              >
                <Plus size={14} />
                Add your first FAQ
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#F2F4F7] bg-gray-50/50">
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Question
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                      Updated
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {faqs.map((faq) => (
                    <tr key={faq.uuid} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#101828] line-clamp-2 max-w-sm">
                          {faq.question}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-sm">
                          {faq.answer}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${categoryColors[faq.category]}`}
                        >
                          <Tag size={10} />
                          {faq.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            faq.isPublished
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {faq.isPublished ? <Check size={10} /> : <X size={10} />}
                          {faq.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">
                        {format(new Date(faq.updatedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(faq)}
                            className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-400 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(faq.uuid)}
                            className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Unanswered Queue tab */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm overflow-hidden">
          {isLoadingQueue ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          ) : queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <MessageSquareDashed size={40} className="text-gray-200 mb-4" />
              <h3 className="text-base font-semibold text-[#101828]">
                No unanswered queries
              </h3>
              <p className="text-sm text-[#475467] mt-1">
                Queries where AI confidence was low will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#F2F4F7] bg-gray-50/50">
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      User Question
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center hidden sm:table-cell">
                      Asked
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                      Last Asked
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {queue.map((q) => (
                    <tr key={q.uuid} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm text-[#101828] font-medium max-w-md">
                          {q.question}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                          <TrendingUp size={10} />
                          {q.askedCount}×
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 hidden md:table-cell">
                        {format(new Date(q.lastAskedAt), 'MMM d, HH:mm')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handlePromote(q)}
                          disabled={isPromoting}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg transition-all ml-auto"
                        >
                          <Plus size={12} />
                          Add as FAQ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FAQ Create / Edit Modal */}
      {modalState.open && (
        <FAQModal
          title={modalState.mode === 'create' ? 'Add New FAQ' : 'Edit FAQ'}
          initial={
            modalState.mode === 'edit'
              ? {
                  question: modalState.faq?.question,
                  answer: modalState.faq?.answer,
                  category: modalState.faq?.category,
                  isPublished: modalState.faq?.isPublished,
                }
              : modalState.prefill
          }
          onClose={closeModal}
          onSubmit={modalState.mode === 'create' ? handleCreate : handleUpdate}
          isPending={modalState.mode === 'create' ? isCreating : isUpdating}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
              <Trash2 size={20} />
            </div>
            <h3 className="text-base font-bold text-[#101828] mb-1">Delete FAQ?</h3>
            <p className="text-sm text-[#475467] mb-5">
              This FAQ will be permanently removed and the AI will no longer use it.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#EAECF0] rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportFAQ;
