import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Star, 
  CheckCircle2, 
  PlusCircle, 
  RefreshCw, 
  AlertCircle, 
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  Wallet,
  TrendingUp,
  TrendingDown,
  Lock,
  Wallet2,
  ChevronLeft,
  ChevronRight,
  X,
  Briefcase,
  DollarSign,
  Send,
  Ban
} from 'lucide-react';
import { PRIVATE_PATHS } from '../../routes/constants';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import { useGetUser, useUpdateUser } from '../../services/query/userMgt';

// Review Card Component

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#F2F4F7] last:border-0">
    <span className="text-[#475467] font-medium text-sm pr-4">{label}:</span>
    <span className="text-[#101828] font-bold text-sm text-right">{value}</span>
  </div>
);

const TaskStatRow: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  count: number;
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray' | 'amber' | 'indigo';
}> = ({ icon, label, count, variant = 'green' }) => {
  const variantStyles = {
    blue: {
      iconBg: 'bg-[#0086C9]',
      badge: 'border-[#B2DDFF] bg-[#EFF8FF] text-[#175CD3]',
    },
    green: {
      iconBg: 'bg-[#067647]',
      badge: 'border-[#A3E9C9] bg-[#ECFDF3] text-[#067647]',
    },
    orange: {
      iconBg: 'bg-[#E05F1B]',
      badge: 'border-[#F9DBAF] bg-[#FFF6ED] text-[#C43C00]',
    },
    red: {
      iconBg: 'bg-[#D92D20]',
      badge: 'border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]',
    },
    purple: {
      iconBg: 'bg-[#7F56D9]',
      badge: 'border-[#E9D7FE] bg-[#F9F5FF] text-[#6941C6]',
    },
    gray: {
      iconBg: 'bg-[#475467]',
      badge: 'border-[#D0D5DD] bg-[#F9FAFB] text-[#344054]',
    },
    amber: {
      iconBg: 'bg-[#D9A70E]',
      badge: 'border-[#FDE293] bg-[#FEFDF0] text-[#B58209]',
    },
    indigo: {
      iconBg: 'bg-[#3538CD]',
      badge: 'border-[#C7D7FE] bg-[#EEF4FF] text-[#312E81]',
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="bg-white rounded-xl border border-[#F2F4F7] p-3 flex items-center justify-between shadow-sm min-w-0 hover:shadow-md hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center text-white shrink-0`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 16 }) : icon}
        </div>
        <span className="text-[#344054] font-semibold text-xs truncate">{label}</span>
      </div>
      <div className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] shrink-0 ${styles.badge}`}>
        {count}
      </div>
    </div>
  );
};

const WalletCard: React.FC<{ label: string; value: string; icon: React.ElementType; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#F2F4F7] shadow-sm hover:shadow-md transition-shadow min-w-0 flex-1">
    <div className={`p-3 rounded-xl ${color} text-white shrink-0`}>
      <Icon size={24} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-medium text-[#475467]">{label}</span>
      <span className="text-xl font-bold text-[#101828] break-words">{value}</span>
    </div>
  </div>
);

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const isHelper = role.toLowerCase() === 'helper';
  const isClient = role.toLowerCase() === 'client';
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest border shadow-sm shrink-0 flex items-center h-fit ${
      isHelper 
        ? 'bg-[#E05F1B]/10 text-[#E05F1B] border-[#E05F1B]/20' 
        : isClient 
          ? 'bg-[#0D8ABC]/10 text-[#0D8ABC] border-[#0D8ABC]/20'
          : 'bg-[#F9FAFB] text-[#475467] border-[#F2F4F7]'
    }`}>
      {role}
    </span>
  );
};

const ReviewCard: React.FC<{ review: any }> = ({ review }) => {
  const authorName = `${review.reviewer?.firstName} ${review.reviewer?.lastName}`;
  const date = new Date(review.createdAt).toLocaleDateString();
  
  const subRatings = [
    { label: 'Clarity', value: review.clarityRating },
    { label: 'Communication', value: review.communicationRating },
    { label: 'Cooperation', value: review.cooperationRating },
  ].filter(r => r.value !== null && r.value !== undefined);

  return (
    <div className="flex flex-col gap-4 py-6 last:pb-0 border-b border-[#F2F4F7] last:border-0 hover:bg-gray-50/50 transition-colors px-4 -mx-4 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0 overflow-hidden">
            {review.reviewer?.avatarUrl ? (
              <img src={review.reviewer.avatarUrl} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs">{review.reviewer?.firstName?.[0]}{review.reviewer?.lastName?.[0]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#101828] truncate">{authorName}</span>
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
              <Star key={i} size={14} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
            ))}
          </div>
          
          {subRatings.length > 0 && (
            <div className="flex flex-wrap gap-3 border-l border-gray-200 pl-4 ml-1">
              {subRatings.map((sr) => (
                <div key={sr.label} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{sr.label}:</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full mr-0.5 ${i < (sr.value || 0) ? 'bg-primary' : 'bg-gray-200'}`} />
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

const editSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string(),
});

const statusBadgeStyles = {
  verified: 'border-green-200 bg-green-50 text-green-700',
  not_verified: 'border-red-200 bg-red-50 text-red-700',
  suspended: 'border-amber-200 bg-amber-50 text-amber-700',
  pending: 'border-blue-200 bg-blue-50 text-blue-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
};

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = window.location.pathname.endsWith('/edit');

  const { data: userData, isPending: isLoading, isError } = useGetUser(id || '');
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(id || '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeStatsTab, setActiveStatsTab] = useState<'client' | 'helper'>('client');

  const apiData = userData?.data;

  useEffect(() => {
    if (apiData?.activeRole === 'helper') {
      setActiveStatsTab('helper');
    } else if (apiData?.activeRole === 'client') {
      setActiveStatsTab('client');
    }
  }, [apiData?.activeRole]);

  const user = useMemo(() => {
    if (!apiData) return null;
    return {
      id: apiData.uuid,
      fullName: `${apiData.firstName} ${apiData.lastName}`,
      email: apiData.email,
      phone: apiData.phoneNumber || 'N/A',
      city: apiData.location?.city || apiData.profile?.address || 'N/A',
      status: (apiData.isSuspended || apiData.status === 'SUSPENDED') 
        ? 'suspended' 
        : apiData.kycVerification?.status === 'approved' 
          ? 'verified' 
          : (apiData.kycVerification?.status || 'not_verified'),
      activeRole: apiData.activeRole || 'User',
      roles: apiData.roles || [],
      bio: apiData.profile?.bio || 'No bio available.',
      skills: apiData.profile?.skills || [],
      experienceLevel: apiData.profile?.experienceLevel || 'N/A',
      yearsOfExperience: apiData.profile?.yearsOfExperience || 0,
      galleryUrls: apiData.profile?.galleryUrls || [],
      hasInsurance: apiData.profile?.hasInsurance || false,
      hasServiceGuarantee: apiData.profile?.hasServiceGuarantee || false,
      languagesSpoken: apiData.profile?.languagesSpoken || [],
      minimumTaskFee: apiData.profile?.minimumTaskFee || 0,
      offersEmergencyServices: apiData.profile?.offersEmergencyServices || false,
      ratingCount: apiData.profile?.ratingCount || 0,
      wallet: {
        balance: apiData.wallet?.balance || 0,
        currency: apiData.wallet?.currency === 'NGN' ? '₦' : (apiData.wallet?.currency || '₦'),
        totalFunding: apiData.wallet?.totalFunding || 0,
        totalWithdrawal: apiData.wallet?.totalWithdrawal || 0,
        escrowBalance: apiData.wallet?.escrowBalance || 0,
      },
      taskStats: {
        asClient: {
          open: apiData.taskStats?.asClient?.open || 0,
          assigned: apiData.taskStats?.asClient?.assigned || 0,
          completed: apiData.taskStats?.asClient?.completed || 0,
          cancelled: apiData.taskStats?.asClient?.cancelled || 0,
          disputed: apiData.taskStats?.asClient?.disputed || 0,
          paid: apiData.taskStats?.asClient?.paid || 0,
          offered: apiData.taskStats?.asClient?.offered || 0,
          rejected: apiData.taskStats?.asClient?.rejected || 0,
        },
        asHelper: {
          open: apiData.taskStats?.asHelper?.open || 0,
          assigned: apiData.taskStats?.asHelper?.assigned || 0,
          completed: apiData.taskStats?.asHelper?.completed || 0,
          cancelled: apiData.taskStats?.asHelper?.cancelled || 0,
          disputed: apiData.taskStats?.asHelper?.disputed || 0,
          paid: apiData.taskStats?.asHelper?.paid || 0,
          offered: apiData.taskStats?.asHelper?.offered || 0,
          rejected: apiData.taskStats?.asHelper?.rejected || 0,
        }
      },
      recentReviews: apiData.recentReviews || [],
      averageRating: apiData.profile?.averageRating || 0,
    };
  }, [apiData]);

  const currentStats = useMemo(() => {
    if (!user) return { open: 0, assigned: 0, completed: 0, cancelled: 0, disputed: 0, paid: 0, offered: 0, rejected: 0 };
    return activeStatsTab === 'helper' ? user.taskStats.asHelper : user.taskStats.asClient;
  }, [user, activeStatsTab]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[#475467] font-medium">Loading user details...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-[#475467]">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-lg font-semibold">User not found or an error occurred.</p>
        <Button label="Back to Users" fullWidth={false} onClick={() => navigate(PRIVATE_PATHS.USER_MANAGEMENT)} />
      </div>
    );
  }

  const handleCopyId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast.success('User ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusToggle = () => {
    if (!user) return;
    setIsSuspending(true);
    // TODO: Implement actual mutation
    setTimeout(() => {
      toast.success(user.status === 'suspended' ? 'User unsuspended successfully' : 'User suspended successfully');
      setIsSuspending(false);
      setIsModalOpen(false);
    }, 1000);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!user || selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % user.galleryUrls.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!user || selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + user.galleryUrls.length) % user.galleryUrls.length);
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4 px-1 sm:px-4">
      <Toaster position="top-right" />

      {/* Header Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <Link
          to={PRIVATE_PATHS.USER_MANAGEMENT}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-green-700"
        >
          <ArrowLeft size={18} />
          Back to User Management
        </Link>

        {!isEdit && (
          <div className="flex items-center gap-3">
            <Button
              label={user.status === 'suspended' ? "Unsuspend User" : "Suspend User"}
              icon={user.status === 'suspended' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              fullWidth={false}
              variant="outline"
              className={`py-2 px-5 w-fit font-bold border-2 transition-all ${
                user.status === 'suspended' 
                  ? 'border-green-600 text-green-600 hover:bg-green-50' 
                  : 'border-amber-600 text-amber-600 hover:bg-amber-50'
              }`}
              onClick={() => setIsModalOpen(true)}
            />
            <Button
              label="Edit User"
              icon={<Edit2 size={16} />}
              fullWidth={false}
              className="py-2 px-5 w-fit"
              onClick={() => navigate(`/user-management/${id}/edit`)}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[800px]">
        {/* Profile Header & Stats */}
        <div className="p-4 sm:p-8 border-b border-[#F2F4F7] bg-white">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
              <div className="w-24 h-24 rounded-full bg-[#0D8ABC] flex items-center justify-center text-white font-bold text-3xl shrink-0 border-2 border-white shadow-sm">
                {(user.fullName || '').split(' ').map((n: any) => n[0]).join('')}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#101828] break-words">{user.fullName}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[#475467] text-sm sm:text-base">
                  <span className="truncate">{user.email}</span>
                  <span className="hidden sm:inline text-[#D0D5DD]">•</span>
                  <div className="flex items-center gap-1.5 bg-[#F9FAFB] px-2 py-0.5 rounded-md border border-[#F2F4F7] group cursor-pointer" onClick={handleCopyId} title="Click to copy full ID">
                    <span className="text-[#667085] text-xs font-mono truncate max-w-[120px] sm:max-w-none">ID: {user.id}</span>
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-[#98A2B3] group-hover:text-primary transition-colors" />}
                  </div>
                  <span className="hidden sm:inline text-[#D0D5DD]">•</span>
                  <RoleBadge role={user.activeRole} />
                </div>
              </div>
            </div>

            {/* Task Statistics Bar - Responsive Tabs & Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
                <span className="text-xs font-bold text-[#344054] uppercase tracking-wider">Task Statistics</span>
                {user.roles.length > 1 && (
                  <div className="flex bg-[#F2F4F7] p-1 rounded-xl border border-[#EAECF0]">
                    <button
                      onClick={() => setActiveStatsTab('client')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        activeStatsTab === 'client'
                          ? 'bg-white text-[#101828] shadow-sm'
                          : 'text-[#667085] hover:text-[#344054]'
                      }`}
                    >
                      As Client
                    </button>
                    <button
                      onClick={() => setActiveStatsTab('helper')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        activeStatsTab === 'helper'
                          ? 'bg-white text-[#101828] shadow-sm'
                          : 'text-[#667085] hover:text-[#344054]'
                      }`}
                    >
                      As Helper
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <TaskStatRow icon={<PlusCircle />} label="Open Tasks" count={currentStats.open} variant="blue" />
                <TaskStatRow icon={<Briefcase />} label="Assigned" count={currentStats.assigned} variant="indigo" />
                <TaskStatRow icon={<CheckCircle2 />} label="Completed" count={currentStats.completed} variant="green" />
                <TaskStatRow icon={<AlertCircle />} label="Disputed" count={currentStats.disputed} variant="amber" />
                <TaskStatRow icon={<XCircle />} label="Cancelled" count={currentStats.cancelled} variant="red" />
                <TaskStatRow icon={<DollarSign />} label="Paid Tasks" count={currentStats.paid} variant="green" />
                <TaskStatRow icon={<Send />} label="Offered" count={currentStats.offered} variant="purple" />
                <TaskStatRow icon={<Ban />} label="Rejected" count={currentStats.rejected} variant="gray" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isEdit ? (
          <div className="p-4 sm:p-8 pt-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#101828] mb-8">Edit User Details</h2>
            <Formik
              initialValues={{
                firstName: apiData?.firstName || '',
                lastName: apiData?.lastName || '',
                email: user.email,
                phone: user.phone !== 'N/A' ? user.phone : '',
                address: user.city !== 'N/A' ? user.city : '',
              }}
              validationSchema={editSchema}
              enableReinitialize
              onSubmit={(values, { setSubmitting }) => {
                updateUser(
                  {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phoneNumber: values.phone,
                    address: values.address,
                  },
                  {
                    onSuccess: () => {
                      toast.success('User updated successfully!');
                      navigate(`/user-management/${id}`);
                    },
                    onSettled: () => setSubmitting(false),
                  }
                );
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, isSubmitting }) => (
                <Form className="grid grid-cols-1 gap-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormInput label="First Name" name="firstName" type="text" value={values.firstName} onChange={handleChange} onBlur={handleBlur} error={touched.firstName && errors.firstName} placeholder="First Name" />
                    <FormInput label="Last Name" name="lastName" type="text" value={values.lastName} onChange={handleChange} onBlur={handleBlur} error={touched.lastName && errors.lastName} placeholder="Last Name" />
                  </div>
                  <FormInput label="Email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email} placeholder="Email" />
                  <FormInput label="Phone Number" name="phone" type="text" value={values.phone} onChange={handleChange} onBlur={handleBlur} error={touched.phone && errors.phone} placeholder="e.g. +2348012345678" />
                  <FormInput label="Address" name="address" type="text" value={values.address} onChange={handleChange} onBlur={handleBlur} error={touched.address && errors.address} placeholder="Address" />

                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                    <Button label="Cancel" variant="outline" fullWidth={true} className="sm:w-32 py-3 border-[#D0D5DD]" onClick={() => navigate(`/user-management/${id}`)} />
                    <Button label="Save Changes" isLoading={isSubmitting || isUpdating} disabled={!isValid || !dirty} fullWidth={true} className="py-3 flex-1" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="p-4 sm:p-8 pt-10">
            {/* Wallet Statistics Section */}
            <div className="mb-12 bg-white rounded-3xl border border-[#F2F4F7] p-4 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Wallet2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-[#101828]">Wallet Details</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <WalletCard 
                  label="Available Balance" 
                  value={`${user.wallet.currency}${user.wallet.balance.toLocaleString()}`} 
                  icon={Wallet} 
                  color="bg-green-600" 
                />
                <WalletCard 
                  label="Escrow Balance" 
                  value={`${user.wallet.currency}${user.wallet.escrowBalance.toLocaleString()}`} 
                  icon={Lock} 
                  color="bg-amber-600" 
                />
                <WalletCard 
                  label="Total Funding" 
                  value={`${user.wallet.currency}${user.wallet.totalFunding.toLocaleString()}`} 
                  icon={TrendingUp} 
                  color="bg-blue-600" 
                />
                <WalletCard 
                  label="Total Withdrawal" 
                  value={`${user.wallet.currency}${user.wallet.totalWithdrawal.toLocaleString()}`} 
                  icon={TrendingDown} 
                  color="bg-rose-600" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-12 xl:gap-x-20">
              {/* Left Column: Details, Bio, Skills */}
              <div className="flex flex-col order-1">
                <div className="flex flex-col mb-12">
                  <h2 className="text-base font-bold text-[#101828] mb-4 uppercase tracking-wider text-[13px]">Location & Contact</h2>
                  <div className="bg-white rounded-xl border border-[#F2F4F7] px-6">
                    <InfoItem label="City" value={user.city} />
                    <InfoItem 
                      label="Account Status" 
                      value={
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold capitalize transition-all duration-300 ${statusBadgeStyles[user.status as keyof typeof statusBadgeStyles]}`}>
                          {user.status.replace('_', ' ')}
                        </span>
                      } 
                    />
                    <InfoItem label="Wallet Balance" value={`${user.wallet.currency}${user.wallet.balance.toLocaleString()}`} />
                    <InfoItem label="Active Role" value={<RoleBadge role={user.activeRole} />} />
                    <InfoItem label="Assigned Roles" value={
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((r: string) => <RoleBadge key={r} role={r} />)}
                      </div>
                    } />
                    <InfoItem label="Phone Number" value={user.phone} />
                    <div className="flex items-center justify-between py-4">
                      <span className="text-[#475467] font-medium text-sm pr-4">Ratings:</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[#101828] font-bold text-sm">{user.ratingCount > 0 ? `${(user.averageRating || 0).toFixed(1)}/5` : 'N/A'}</span>
                        <span className="text-[#667085] text-[11px]">({user.ratingCount} ratings)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="flex flex-col mb-12">
                  <h2 className="text-base font-bold text-[#101828] mb-4 uppercase tracking-wider text-[13px]">Professional Details</h2>
                  <div className="bg-white rounded-xl border border-[#F2F4F7] px-6">
                    <InfoItem label="Experience Level" value={user.experienceLevel} />
                    <InfoItem label="Years of Experience" value={`${user.yearsOfExperience} Year(s)`} />
                    <InfoItem label="Minimum Task Fee" value={`${user.wallet.currency}${user.minimumTaskFee.toLocaleString()}`} />
                    <InfoItem label="Languages" value={user.languagesSpoken?.join(', ') || 'N/A'} />
                    <InfoItem label="Emergency Services" value={user.offersEmergencyServices ? 'Yes' : 'No'} />
                    <InfoItem label="Insurance" value={user.hasInsurance ? 'Yes' : 'No'} />
                    <InfoItem label="Service Guarantee" value={user.hasServiceGuarantee ? 'Yes' : 'No'} />
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-12">
                  <h2 className="text-base font-bold text-[#101828] mb-4 uppercase tracking-wider text-[13px]">Bio</h2>
                  <p className="text-[#667085] text-sm leading-[1.8]">
                    {user.bio}
                  </p>
                </div>

                {/* Skills Section */}
                <div className="mb-8">
                  <h2 className="text-base font-bold text-[#101828] mb-5 uppercase tracking-wider text-[13px]">Skills</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {user.skills?.length > 0 ? user.skills.map((skill: any) => (
                      <span key={skill} className="px-4 py-2 rounded-lg border border-[#EAECF0] bg-[#F9FAFB] text-sm text-[#475467] font-semibold transition-colors hover:border-green-200">
                        {skill}
                      </span>
                    )) : <span className="text-sm text-[#98A2B3] italic">No skills listed</span>}
                  </div>
                </div>

                {/* Gallery Section */}
                {user.galleryUrls?.length > 0 && (
                  <div className="mb-8 lg:mb-0">
                    <h2 className="text-base font-bold text-[#101828] mb-5 uppercase tracking-wider text-[13px]">Portfolio Gallery</h2>
                    <div className="flex flex-wrap gap-4">
                      {user.galleryUrls.map((url: string, index: number) => (
                        <div 
                          key={index} 
                          onClick={() => setSelectedImageIndex(index)}
                          className="w-24 h-24 rounded-lg overflow-hidden border border-[#EAECF0] shadow-sm cursor-pointer group relative"
                        >
                          <img src={url} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Top Reviews */}
              <div className="flex flex-col order-2">
                <h2 className="text-base font-bold text-[#101828] mb-6 uppercase tracking-wider text-[13px]">Top Reviews</h2>
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

          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStatusToggle}
        title={user.status === 'suspended' ? "Unsuspend User Account" : "Suspend User Account"}
        description={
          user.status === 'suspended' 
            ? `Are you sure you want to unsuspend ${user.fullName}'s account? This will restore their access to all platform features.`
            : `Are you sure you want to suspend ${user.fullName}'s account? They will lose access to their profile and all active tasks until unsuspended.`
        }
        confirmLabel={user.status === 'suspended' ? "Unsuspend User" : "Suspend User"}
        variant={user.status === 'suspended' ? "info" : "warning"}
        isLoading={isSuspending}
      />

      {/* Lightbox / Gallery Carousel */}
      {selectedImageIndex !== null && user?.galleryUrls && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImageIndex(null)}>
          <button 
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
            onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }}
          >
            <X size={24} />
          </button>

          {user.galleryUrls.length > 1 && (
            <button 
              className="absolute left-4 sm:left-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
              onClick={handlePrevImage}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <div className="w-full h-full max-w-5xl max-h-[85vh] p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={user.galleryUrls[selectedImageIndex]} 
              alt={`Gallery preview ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {user.galleryUrls.length > 1 && (
            <button 
              className="absolute right-4 sm:right-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
              onClick={handleNextImage}
            >
              <ChevronRight size={32} />
            </button>
          )}
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full">
            <span className="text-white text-sm font-medium">{selectedImageIndex + 1} / {user.galleryUrls.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
