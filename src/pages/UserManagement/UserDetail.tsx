import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { PRIVATE_PATHS } from '../../routes/constants';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';

// Updated Mock data with task statistics and bio/skills
const MOCK_USERS: Record<string, {
  id: string; fullName: string; email: string; phone: string;
  city: string; status: 'verified' | 'not_verified' | 'suspended'; 
  taskPosted: number; amountSpent: string; ratings: string; ratingCount: number; role: string;
  bio: string; skills: string[];
  taskStats: {
    posted: number;
    completed: number;
    inProgress: number;
    disputed: number;
    cancelled: number;
  }
}> = {
  '1': { 
    id: '1', 
    fullName: 'Seun Adebayo', 
    email: 'seunadebayo@gmail.com', 
    phone: '+2347012345678', 
    city: 'Ibadan', 
    status: 'verified', 
    taskPosted: 128, 
    amountSpent: 'NGN 28,560', 
    ratings: '4.5/5', 
    ratingCount: 24, 
    role: 'Client',
    bio: 'Professional house inspector with over 5 years of experience in the real estate industry. I am dedicated to providing thorough and detailed reports to help my clients make informed decisions.',
    skills: ['House Inspection', 'Reporting', 'Real Estate', 'Consultation', 'Quality Assurance'],
    taskStats: {
      posted: 128,
      completed: 85,
      inProgress: 12,
      disputed: 3,
      cancelled: 5
    }
  },
};

const MOCK_REVIEWS = [
  { id: 1, author: 'Tunde Adewale', date: '2 days ago', text: 'Showed up on time, communicated clearly, and delivered exactly what I asked for.', rating: 5, verified: false },
  { id: 2, author: 'Tunde Adewale', date: '5 days ago', text: 'Very reliable. I felt at ease the entire time, even from abroad.', rating: 4, verified: true },
  { id: 3, author: 'Tunde Adewale', date: '7 days ago', text: 'Professional, calm, and respectful. Everything went smoothly.', rating: 4, verified: true },
  { id: 4, author: 'Tunde Adewale', date: '2 weeks ago', text: 'I trusted him with something important and he delivered.', rating: 4, verified: true },
];

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#F2F4F7] last:border-0">
    <span className="text-[#475467] font-medium text-sm pr-4">{label}:</span>
    <span className="text-[#101828] font-bold text-sm text-right">{value}</span>
  </div>
);

const TaskStatRow: React.FC<{ icon: React.ReactNode; label: string; count: number }> = ({ icon, label, count }) => (
  <div className="bg-white rounded-xl border border-[#F2F4F7] p-3 flex items-center justify-between shadow-sm min-w-0">
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-8 h-8 rounded-full bg-[#067647] flex items-center justify-center text-white shrink-0">
        {React.cloneElement(icon as React.ReactElement, { size: 16 })}
      </div>
      <span className="text-[#344054] font-semibold text-xs truncate">{label}</span>
    </div>
    <div className="px-2.5 py-0.5 rounded-full border border-[#067647] bg-[#ECFDF3] text-[#067647] font-bold text-[11px] shrink-0">
      {count}
    </div>
  </div>
);

const ReviewCard: React.FC<{ review: typeof MOCK_REVIEWS[0] }> = ({ review }) => (
  <div className="flex flex-col gap-3 py-6 last:pb-0 border-b border-[#F2F4F7] last:border-0">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
          <img src={`https://ui-avatars.com/api/?name=${review.author}&background=random`} alt={review.author} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-[#101828] truncate">{review.author}</span>
          <span className="text-[#98A2B3] text-sm shrink-0">•</span>
          <span className="text-[#98A2B3] text-sm shrink-0">{review.date}</span>
        </div>
      </div>
      {review.verified && (
        <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-[10px] font-bold text-green-700 uppercase tracking-tight">
          <CheckCircle2 size={10} />
          Verified
        </span>
      )}
    </div>
    <p className="text-[#667085] text-sm italic line-clamp-3">
      "{review.text}"
    </p>
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
      ))}
    </div>
  </div>
);

const editSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  city: Yup.string().required('City is required'),
});

const statusBadgeStyles = {
  verified: 'border-green-200 bg-green-50 text-green-700',
  not_verified: 'border-red-200 bg-red-50 text-red-700',
  suspended: 'border-amber-200 bg-amber-50 text-amber-700',
};

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = window.location.pathname.endsWith('/edit');

  const initialUser = id === '1' ? MOCK_USERS['1'] : MOCK_USERS[id ?? '']; 
  const [userStatus, setUserStatus] = useState(initialUser?.status || 'verified');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);

  if (!initialUser) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-[#475467]">
        <p className="text-lg font-semibold">User not found.</p>
        <Button label="Back to Users" fullWidth={false} onClick={() => navigate(PRIVATE_PATHS.USER_MANAGEMENT)} />
      </div>
    );
  }

  const user = { ...initialUser, status: userStatus };

  const handleStatusToggle = () => {
    setIsSuspending(true);
    setTimeout(() => {
      const newStatus = userStatus === 'suspended' ? 'verified' : 'suspended';
      setUserStatus(newStatus);
      setIsSuspending(false);
      setIsModalOpen(false);
      toast.success(newStatus === 'suspended' ? 'User suspended successfully' : 'User unsuspended successfully');
    }, 1000);
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
              label={userStatus === 'suspended' ? "Unsuspend User" : "Suspend User"}
              icon={userStatus === 'suspended' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              fullWidth={false}
              variant="outline"
              className={`!h-9 px-5 w-fit font-bold border-2 transition-all ${
                userStatus === 'suspended' 
                  ? 'border-green-600 text-green-600 hover:bg-green-50' 
                  : 'border-amber-600 text-amber-600 hover:bg-amber-50'
              }`}
              onClick={() => setIsModalOpen(true)}
            />
            <Button
              label="Edit User"
              icon={<Edit2 size={16} />}
              fullWidth={false}
              className="!h-9 px-5 w-fit"
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
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#101828] break-words">{user.fullName}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[#475467] text-sm sm:text-base">
                  <span className="truncate">{user.email}</span>
                  <span className="hidden sm:inline text-[#D0D5DD]">•</span>
                  <span className="font-medium">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Task Statistics Bar - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <TaskStatRow icon={<PlusCircle />} label="Tasks Posted" count={user.taskStats.posted} />
              <TaskStatRow icon={<CheckCircle2 />} label="Completed" count={user.taskStats.completed} />
              <TaskStatRow icon={<RefreshCw />} label="In progress" count={user.taskStats.inProgress} />
              <TaskStatRow icon={<AlertCircle />} label="Disputed" count={user.taskStats.disputed} />
              <TaskStatRow icon={<XCircle />} label="Cancelled" count={user.taskStats.cancelled} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isEdit ? (
          <div className="p-4 sm:p-8 pt-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#101828] mb-8">Edit User Details</h2>
            <Formik
              initialValues={{
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                city: user.city,
              }}
              validationSchema={editSchema}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  toast.success('User updated successfully!');
                  setSubmitting(false);
                  navigate(`/user-management/${id}`);
                }, 1000);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, isSubmitting }) => (
                <Form className="grid grid-cols-1 gap-y-5">
                  <FormInput label="Full Name" name="fullName" type="text" value={values.fullName} onChange={handleChange} onBlur={handleBlur} error={touched.fullName && errors.fullName} placeholder="Full Name" />
                  <FormInput label="Email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email} placeholder="Email" />
                  <FormInput label="Phone" name="phone" type="text" value={values.phone} onChange={handleChange} onBlur={handleBlur} error={touched.phone && errors.phone} placeholder="Phone" />
                  <FormInput label="City" name="city" type="text" value={values.city} onChange={handleChange} onBlur={handleBlur} error={touched.city && errors.city} placeholder="City" />

                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                    <Button label="Cancel" variant="outline" fullWidth={true} className="sm:w-32 !h-11 border-[#D0D5DD]" onClick={() => navigate(`/user-management/${id}`)} />
                    <Button label="Save Changes" isLoading={isSubmitting} disabled={!isValid || !dirty} fullWidth={true} className="!h-11 flex-1" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="p-4 sm:p-8 pt-10">
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
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold capitalize transition-all duration-300 ${statusBadgeStyles[userStatus]}`}>
                          {userStatus.replace('_', ' ')}
                        </span>
                      } 
                    />
                    <InfoItem label="Total Amount Spent" value={user.amountSpent} />
                    <InfoItem label="Phone Number" value={user.phone} />
                    <div className="flex items-center justify-between py-4">
                      <span className="text-[#475467] font-medium text-sm pr-4">Ratings:</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[#101828] font-bold text-sm">{user.ratings}</span>
                        <span className="text-[#667085] text-[11px]">({user.ratingCount} ratings)</span>
                      </div>
                    </div>
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
                <div className="mb-8 lg:mb-0">
                  <h2 className="text-base font-bold text-[#101828] mb-5 uppercase tracking-wider text-[13px]">Skills</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {user.skills.map(skill => (
                      <span key={skill} className="px-4 py-2 rounded-lg border border-[#EAECF0] bg-[#F9FAFB] text-sm text-[#475467] font-semibold transition-colors hover:border-green-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Top Reviews */}
              <div className="flex flex-col order-2">
                <h2 className="text-base font-bold text-[#101828] mb-6 uppercase tracking-wider text-[13px]">Top Reviews</h2>
                <div className="flex flex-col bg-[#F9FAFB]/50 rounded-3xl border border-[#F2F4F7] p-4 sm:p-8">
                  {MOCK_REVIEWS.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
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
        title={userStatus === 'suspended' ? "Unsuspend User Account" : "Suspend User Account"}
        description={
          userStatus === 'suspended' 
            ? `Are you sure you want to unsuspend ${user.fullName}'s account? This will restore their access to all platform features.`
            : `Are you sure you want to suspend ${user.fullName}'s account? They will lose access to their profile and all active tasks until unsuspended.`
        }
        confirmLabel={userStatus === 'suspended' ? "Unsuspend User" : "Suspend User"}
        variant={userStatus === 'suspended' ? "info" : "warning"}
        isLoading={isSuspending}
      />
    </div>
  );
};

export default UserDetail;
