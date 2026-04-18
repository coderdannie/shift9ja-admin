import React, { Fragment } from 'react';
import { Eye, Send, ChevronDown, Check } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import { useSendBulkNotification } from '../../../services/query/notifications';
import type { BulkNotificationPayload } from '../../../types/notifications';
import { Listbox, Transition } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-6 w-full">
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-bold text-[#101828]">{title}</h3>
      <p className="text-sm text-[#475467] leading-relaxed">{description}</p>
    </div>
    <div className="flex flex-col gap-5 pt-4 border-t border-[#F2F4F7]">
      {children}
    </div>
  </div>
);

const priorities = [
  { id: 'normal', name: 'Normal', color: 'bg-green-500' },
  { id: 'high', name: 'High', color: 'bg-orange-500' },
];

const BulkNotificationForm: React.FC = () => {
  const { mutate: sendBulk, isPending: isSendingBulk } = useSendBulkNotification();

  const bulkSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').min(5, 'Too short'),
    content: Yup.string().required('Message content is required').min(20, 'Please provide more detail'),
    targetGroup: Yup.string().oneOf(['all', 'clients', 'helpers']).required('Required'),
    priority: Yup.string().oneOf(['normal', 'high']).required('Required')
  });

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-2xl mx-auto">
      <SettingsSection 
          title="Bulk Message Center" 
          description="Broadcast important announcements to specific segments of the user base."
      >
          <Formik
              initialValues={{ 
                title: '', 
                content: '', 
                targetGroup: 'all' as any,
                priority: 'normal' as any 
              }}
              validationSchema={bulkSchema}
              onSubmit={(values, { resetForm }) => {
                  sendBulk(values as BulkNotificationPayload, {
                      onSuccess: () => resetForm()
                  });
              }}
          >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                  <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                      <div className="space-y-6">
                           <FormInput 
                              name="title"
                              label="Notification Title"
                              type="text"
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Important System Update..."
                              error={touched.title && errors.title ? errors.title : undefined}
                           />

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex flex-col gap-1.5">
                                  <label className="text-sm font-bold text-[#101828]">Target Group</label>
                                  <div className="grid grid-cols-3 gap-2">
                                      {['all', 'clients', 'helpers'].map((target) => (
                                          <label 
                                              key={target} 
                                              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-primary/30 transition-all has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-2 has-checked:ring-primary/10"
                                          >
                                              <Field type="radio" name="targetGroup" value={target} className="hidden" />
                                              <span className="text-xs font-bold capitalize">{target}</span>
                                          </label>
                                      ))}
                                  </div>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                  <label className="text-sm font-bold text-[#101828]">Message Priority</label>
                                  <Listbox value={values.priority} onChange={(val) => setFieldValue('priority', val)}>
                                    <div className="relative">
                                      <Listbox.Button className="relative w-full cursor-pointer rounded-xl border border-[#D0D5DD] bg-white py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-4 focus:ring-primary/10 sm:text-sm font-bold transition-all hover:border-primary/30">
                                        <span className="flex items-center gap-2 truncate">
                                          <span className={classNames(
                                            "w-2 h-2 rounded-full",
                                            priorities.find(p => p.id === values.priority)?.color || 'bg-gray-400'
                                          )} />
                                          <span className="capitalize">{values.priority}</span>
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                        </span>
                                      </Listbox.Button>
                                      <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                      >
                                        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white p-1 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                          {priorities.map((priority) => (
                                            <Listbox.Option
                                              key={priority.id}
                                              className={({ active }) =>
                                                `relative cursor-pointer select-none py-2.5 pl-10 pr-4 rounded-lg transition-colors ${
                                                  active ? 'bg-primary/5 text-primary' : 'text-gray-900'
                                                }`
                                              }
                                              value={priority.id}
                                            >
                                              {({ selected }) => (
                                                <>
                                                  <span className={`flex items-center gap-2 truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                                    <span className={classNames("w-2 h-2 rounded-full", priority.color)} />
                                                    {priority.name}
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
                           </div>

                           <div className="flex flex-col gap-1.5">
                              <label className="text-sm font-bold text-[#101828]">Message Content</label>
                              <Field 
                                  as="textarea" 
                                  name="content" 
                                  rows={5} 
                                  placeholder="Write your message here..."
                                  className={classNames(
                                      "w-full h-auto p-4 rounded-xl border outline-none transition-all text-sm leading-relaxed",
                                      touched.content && errors.content ? "border-red-300 focus:border-red-500" : "border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10"
                                  )}
                              />
                              {touched.content && errors.content && <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.content}</p>}
                           </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                          <Button 
                              label="Preview" 
                              type="button"
                              variant="secondary"
                              className="gap-2"
                              icon={<Eye size={18} />}
                              fullWidth={false}
                          />
                          <Button 
                              label="Send Notification" 
                              type="submit"
                              className="gap-2"
                              isLoading={isSendingBulk}
                              icon={<Send size={18} />}
                              fullWidth={false}
                          />
                      </div>
                  </Form>
              )}
          </Formik>
      </SettingsSection>
    </div>
  );
};

export default BulkNotificationForm;
