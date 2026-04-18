import React, { Fragment, useState } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { CheckCircle, X, ChevronDown, Check } from 'lucide-react';
import Button from '../../common/Button';
import type { ResolveDisputePayload } from '../../../types/task';

interface ResolveDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (payload: ResolveDisputePayload) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { label: 'Mark as Completed', value: 'completed' as const },
  { label: 'Mark as Cancelled', value: 'cancelled' as const },
];

const ResolveDisputeModal: React.FC<ResolveDisputeModalProps> = ({
  isOpen,
  onClose,
  onResolve,
  isLoading = false,
}) => {
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onResolve({
      resolutionNotes: notes.trim(),
      finalStatus: selectedStatus.value,
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-2xl bg-white p-8 text-left shadow-2xl transition-all w-full max-w-md">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#98A2B3] hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
                  <CheckCircle className="text-green-600" size={26} />
                </div>

                <Dialog.Title as="h2" className="text-[20px] font-bold text-[#101828] mb-2 font-inter">
                  Resolve Dispute
                </Dialog.Title>
                <p className="text-[#475467] text-sm leading-relaxed mb-6">
                  Provide resolution notes and select the final status for this task. This action will notify both parties.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#344054] mb-1.5">
                      Resolution Notes
                    </label>
                    <textarea
                      required
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Explain the resolution outcome..."
                      rows={4}
                      className="w-full rounded-xl border-[#D0D5DD] shadow-sm focus:border-primary focus:ring-primary text-sm p-3 min-h-[100px] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#344054] mb-1.5">
                      Final Status
                    </label>
                    <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-[#D0D5DD] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all hover:bg-gray-50">
                          <span className="block truncate font-medium text-[#101828]">
                            {selectedStatus.label}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-5 w-5 text-[#98A2B3]" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-60 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-[#F2F4F7]">
                            {STATUS_OPTIONS.map((option) => (
                              <Listbox.Option
                                key={option.value}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                                    active ? 'bg-primary/5 text-primary' : 'text-[#344054]'
                                  }`
                                }
                                value={option}
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                      {option.label}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                        <Check className="h-4 w-4" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button
                      label="Cancel"
                      variant="outline"
                      className="flex-1 h-11! border-[#D0D5DD] font-semibold"
                      onClick={onClose}
                      disabled={isLoading}
                    />
                    <Button
                      label="Submit Resolution"
                      variant="primary"
                      className="flex-1 h-11! font-semibold"
                      type="submit"
                      isLoading={isLoading}
                      disabled={!notes.trim()}
                    />
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ResolveDisputeModal;
