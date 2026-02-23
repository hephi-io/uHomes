import { SVGs } from '../../../../../packages/ui-kit/src/assets/svgs/Index';
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@uhomes/ui-kit';
import { StatusBadge } from './admin-overview';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgentApplications, verifyAgent, type AgentApplication } from '@/services/admin';

interface Listing {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: boolean;
  documentName: string | null;
  documentSize: string;
  status: 'pending' | 'verified' | 'rejected';
  date: string | Date;
}

type ModalStep = 'DETAILS' | 'CONFIRM_REJECT' | 'SUCCESS_REJECT' | 'SUCCESS_APPROVE';

function mapApplication(app: AgentApplication): Listing {
  return {
    id: app.id,
    name: app.name,
    email: app.email,
    phone: app.phone,
    document: app.document,
    documentName: app.documentName,
    documentSize: '1.18 MB',
    status: app.status,
    date: app.date,
  };
}

export default function AgentApplications() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<ModalStep>('DETAILS');
  const [page, setPage] = useState(1);

  const filters = {
    page,
    limit: 10,
    ...(statusFilter !== 'all' && {
      status: statusFilter as 'pending' | 'verified' | 'rejected',
    }),
  };

  const { data: applicationsData, isLoading: loading } = useQuery({
    queryKey: ['agentApplications', statusFilter, page],
    queryFn: async () => {
      const response = await getAgentApplications(filters);
      if (response.data.status !== 'success') throw new Error('Failed to load applications');
      return response.data.data;
    },
  });

  const { data: stats = { total: 0, pending: 0, verified: 0, rejected: 0 } } = useQuery({
    queryKey: ['agentApplicationsStats'],
    queryFn: async () => {
      const [all, pending, verified, rejected] = await Promise.all([
        getAgentApplications({ limit: 1 }),
        getAgentApplications({ status: 'pending', limit: 1 }),
        getAgentApplications({ status: 'verified', limit: 1 }),
        getAgentApplications({ status: 'rejected', limit: 1 }),
      ]);
      return {
        total: all.data.status === 'success' ? all.data.data.pagination.total : 0,
        pending: pending.data.status === 'success' ? pending.data.data.pagination.total : 0,
        verified: verified.data.status === 'success' ? verified.data.data.pagination.total : 0,
        rejected: rejected.data.status === 'success' ? rejected.data.data.pagination.total : 0,
      };
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'verified' | 'rejected' }) =>
      verifyAgent(id, status),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === 'verified'
          ? 'Agent application approved successfully'
          : 'Agent application rejected successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['agentApplications'] });
      queryClient.invalidateQueries({ queryKey: ['agentApplicationsStats'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });

  const applications: Listing[] = applicationsData?.applications?.map(mapApplication) ?? [];
  const handleOpenModal = (listing: Listing, step: ModalStep) => {
    setSelectedListing(listing);
    setModalInitialStep(step);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    if (!selectedListing) return;
    verifyMutation.mutate({ id: selectedListing.id, status: 'verified' });
    setIsModalOpen(false);
  };

  const handleReject = () => {
    if (!selectedListing) return;
    verifyMutation.mutate({ id: selectedListing.id, status: 'rejected' });
    setIsModalOpen(false);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      verified: 'Approved',
      rejected: 'Rejected',
    };
    return statusMap[status] || status;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const statsData = [
    {
      label: 'Total Applications',
      value: stats.total.toLocaleString(),
      color: 'bg-gradient-to-b from-[#E1EAFD] to-white',
      border: 'border-[#CBDBFC]',
    },
    {
      label: 'Pending Review',
      value: stats.pending.toLocaleString(),
      color: 'bg-gradient-to-b from-[#FEECE0] to-white',
      border: 'border-[#FFE0D3]',
    },
    {
      label: 'Under Review',
      value: '0',
      color: 'bg-gradient-to-b from-[#D8F6FF] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Approved',
      value: stats.verified.toLocaleString(),
      color: 'bg-gradient-to-b from-[#C8FFDC] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Rejected',
      value: stats.rejected.toLocaleString(),
      color: 'bg-gradient-to-b from-[#FA350766] to-white',
      border: 'border-[#FF383C66]',
    },
  ];

  return (
    <>
      {/* Header */}
      <h1 className="font-semibold text-[22px] leading-[120%] tracking-[0%] text-black">
        Agent Applications
      </h1>
      <p className="text-sm leading-[120%] tracking-[0%] text-black mt-1">
        Review and manage agent applications on Uhomes
      </p>
      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4 mt-4">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className={`rounded border ${stat.border} ${stat.color} shadow-sm transition-all hover:shadow-md p-6`}
          >
            <h3 className="font-semibold text-[32px] leading-[100%] tracking-[0%] text-[#09090B]">
              {stat.value}
            </h3>
            <p className="font-semibold text-sm leading-[100%] tracking-[0%] text-[#71717A] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-[12px] border border-[#E4E7EC] shadow-[0px_1px_2px_0px_#1018280D] overflow-hidden mt-4">
        {/* Toolbar */}
        <div className="flex justify-end items-center gap-4 p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 rounded border-[#E4E4E4] bg-white font-Bricolage font-medium text-sm leading-[150%] tracking-[0%] text-black px-3 py-2">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="h-[37px] border-l border-l-[#E4E4E4]"></div>
          <Button className="flex gap-2 items-center rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-blue-600 px-4 py-2">
            <SVGs.AddProperty className="size-4" />
            <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
              Create Ad Campaign
            </span>
          </Button>
        </div>
        <div className="border-t border-t-[#E4E7EC]"></div>
        <div className="p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th className="px-6 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                  Name
                </th>
                <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                  Email address
                </th>
                <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                  Phone number
                </th>
                <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                  Document
                </th>
                <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                  Status Badge
                </th>
                <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                  Date
                </th>
                <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-5 text-center text-[#878FA1]">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-5 text-center text-[#878FA1]">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors border-b border-b-[#E4E7EC]"
                  >
                    <td className="px-6 py-5">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                      {app.name}
                    </td>
                    <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                      {app.email}
                    </td>
                    <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                      {app.phone}
                    </td>
                    <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                      <div className="flex gap-x-2 items-center">
                        <span className="font-medium text-sm leading-5 tracking-[0%] text-[#475467]">
                          {app.document ? '1/1' : '0/1'}
                        </span>
                        {app.document ? (
                          <SVGs.TaskChecked className="text-[#589E67]" />
                        ) : (
                          <SVGs.WarningLine className="text-[#FF383C]" />
                        )}
                      </div>
                    </td>
                    <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                      <StatusBadge status={getStatusLabel(app.status)} />
                    </td>
                    <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                      {formatDate(app.date)}
                    </td>
                    <td className="px-6 py-3">
                      <Button
                        variant="outline"
                        className="rounded-lg border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
                        onClick={() => handleOpenModal(app, 'DETAILS')}
                      >
                        <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
                          Review
                        </span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {applicationsData?.pagination && applicationsData.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-0.5 mt-6">
              <button
                type="button"
                className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5] disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <SVGs.ChevronLeft />
              </button>
              {Array.from({ length: applicationsData.pagination.pages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    className={`size-10 rounded-[7px] ${
                      page === p ? 'bg-[#F2F2F5]' : 'hover:bg-[#F2F2F5]'
                    }`}
                    onClick={() => setPage(p)}
                  >
                    <span
                      className={`text-sm leading-[21px] tracking-normal text-[#121417] ${
                        page === p ? 'font-bold' : ''
                      }`}
                    >
                      {p}
                    </span>
                  </button>
                )
              )}
              <button
                type="button"
                className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5] disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(applicationsData.pagination.pages, p + 1))}
                disabled={page >= applicationsData.pagination.pages}
              >
                <SVGs.ChevronLeft className="rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* The Modal */}
      <ReviewListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        initialStep={modalInitialStep}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  initialStep: ModalStep;
  onApprove: () => void;
  onReject: () => void;
}

function ReviewListingModal({
  isOpen,
  onClose,
  listing,
  initialStep,
  onApprove,
  onReject,
}: ModalProps) {
  const [step, setStep] = useState<ModalStep>(initialStep);
  const [notes, setNotes] = useState('');

  // Sync internal state with the trigger step whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  if (!isOpen || !listing) return null;

  const handleResetAndClose = () => {
    setStep('DETAILS');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {/* --- STEP: DETAILS --- */}
        {step === 'DETAILS' && (
          <div className="w-full max-w-[640px] rounded-xl bg-white p-6">
            <h2 className="font-semibold text-lg leading-[130%] tracking-[0%] text-[#101828]">
              Review Application
            </h2>
            <p className="font-medium text-sm leading-[120%] tracking-[0%] text-[#475467] mt-1">
              Applicant information
            </p>
            <div className="border border-[#E0E0E0] mt-4"></div>
            <div className="max-h-[70vh] overflow-y-auto mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">Full name</h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    {listing.name}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">Location</h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    {listing.email}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                    Phone number
                  </h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    {listing.phone}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                    Application Date
                  </h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    {new Date(listing.date).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
              <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6">Document</h4>
              <div className="flex justify-between items-center rounded bg-[#FAFAFA] p-3 mt-2">
                {listing.document && (
                  <>
                    <div className="flex gap-x-3 items-center">
                      <div className="flex items-center">
                        <div className="size-10 flex justify-center items-center bg-[#F3F4F6]">
                          <SVGs.PictureIcon className="text-[#101828]" />
                        </div>
                        <span className="text-sm leading-6 tracking-normal text-[#101828]">
                          {listing.documentName}
                        </span>
                      </div>
                      <SVGs.Dot className="text-[#101828]" />
                      <span className="text-sm leading-6 tracking-normal text-[#101828]">
                        {listing.documentSize}
                      </span>
                    </div>
                    <div className="flex gap-x-2 items-center">
                      <SVGs.TaskChecked className="text-[#589E67]" />
                      <a className="text-[13px] leading-[100%] tracking-[0%] text-[#4976F4]">
                        view document
                      </a>
                    </div>
                  </>
                )}
              </div>
              <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6 mb-2">
                Review Notes (optional)
              </h4>
              <textarea
                className="w-full h-[86px] rounded-xl border border-[#E4E4E7] bg-white font-Bricolage text-sm leading-[130%] tracking-[0%] text-[#999999] focus:text-black focus:ring-1 focus:ring-blue-500 outline-none resize-none p-3"
                placeholder="Add notes or feedback about this application"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center mt-12">
              <Button
                onClick={handleResetAndClose}
                variant="outline"
                className="rounded-[6px] border-[#E4E4E7] px-4 py-2"
              >
                <span className="font-medium text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                  close
                </span>
              </Button>
              <div className="flex gap-4 items-center">
                <Button
                  onClick={() => setStep('CONFIRM_REJECT')}
                  variant="outline"
                  className="rounded-[5px] border-[#EF3826EE] px-4 py-2"
                >
                  <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#EF3826]">
                    Reject
                  </span>
                </Button>
                <Button
                  onClick={onApprove}
                  className="rounded-[5px] border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2"
                >
                  <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                    Approve
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP: CONFIRM REJECT --- */}
        {step === 'CONFIRM_REJECT' && (
          <div className="w-[466px] max-w-[600px] flex flex-col items-center rounded-xl border border-[#D9D9D9] bg-white shadow p-8">
            <SVGs.WarningLine className="size-12 text-[#F58700] mb-6" />
            <h3 className="font-bold text-lg leading-[120%] tracking-[0%] text-center text-[#1E1E1E] mt-8">
              Are you sure you want to reject this application?
            </h3>
            <p className="text-sm leading-[140%] tracking-[0%] text-center text-[#1E1E1E] mt-4">
              Note that once rejected, this action cannot be undone.
            </p>
            <div className="w-full flex gap-x-8 items-center mt-8">
              <Button
                onClick={() => setStep('DETAILS')}
                variant="outline"
                className="w-[46.02%] rounded border-[#E4E4E4] bg-whitepx-3 py-2"
              >
                <span className="font-medium text-sm leading-[120%] tracking-[0%] text-[#09090B]">
                  Cancel
                </span>
              </Button>
              <Button
                onClick={onReject}
                className="w-[46.02%] rounded-[5px] border-[#E4E4E4EE] bg-[#EF3826] px-4 py-2"
              >
                <span className="font-medium text-sm leading-[120%] tracking-[0%] text-white">
                  Reject
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP: SUCCESS --- */}
        {(step === 'SUCCESS_APPROVE' || step === 'SUCCESS_REJECT') && (
          <div className="w-[466px] max-w-[600px] flex flex-col items-center rounded-xl border border-[#D9D9D9] bg-white shadow p-8">
            <SVGs.TaskChecked className="size-[46.67px] text-[#589E67]" />
            <h3 className="font-bold text-lg leading-[120%] tracking-[0%] text-center text-[#1E1E1E] mt-8">
              Application {step === 'SUCCESS_APPROVE' ? 'Approval' : 'Rejection'} Successful
            </h3>
            <Button
              onClick={handleResetAndClose}
              variant="outline"
              className="w-full rounded border-[#E4E4E4] bg-white px-3 py-2 mt-8"
            >
              <span className="font-medium text-sm leading-[120%] tracking-[0%] text-[#09090B]">
                Close
              </span>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
