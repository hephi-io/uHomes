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

interface Listing {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: boolean;
  documentName: string;
  documentSize: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under review';
  date: string;
}

type ModalStep = 'DETAILS' | 'CONFIRM_REJECT' | 'SUCCESS_REJECT' | 'SUCCESS_APPROVE';

const applications: Listing[] = [
  {
    id: 1,
    name: 'Cynthia Themoon',
    email: 'cynthia.themoon@example.com',
    phone: '+234 803 123 4567',
    document: true,
    documentName: 'National_ID.jpg',
    documentSize: '1.18 MB',
    status: 'Pending',
    date: '12/10/2025',
  },
];

export default function AgentApplications() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<ModalStep>('DETAILS');

  const handleOpenModal = (listing: Listing, step: ModalStep) => {
    setSelectedListing(listing);
    setModalInitialStep(step);
    setIsModalOpen(true);
  };

  const stats = [
    {
      label: 'Total Applications',
      value: '1,300',
      color: 'bg-gradient-to-b from-[#E1EAFD] to-white',
      border: 'border-[#CBDBFC]',
    },
    {
      label: 'Pending Review',
      value: '20',
      color: 'bg-gradient-to-b from-[#FEECE0] to-white',
      border: 'border-[#FFE0D3]',
    },
    {
      label: 'Under Review',
      value: '10',
      color: 'bg-gradient-to-b from-[#D8F6FF] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Approved',
      value: '1,260',
      color: 'bg-gradient-to-b from-[#C8FFDC] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Rejected',
      value: '10',
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
        {stats.map((stat, i) => (
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
          <Select defaultValue="all">
            <SelectTrigger className="w-28 rounded border-[#E4E4E4] bg-white font-Bricolage font-medium text-sm leading-[150%] tracking-[0%] text-black px-3 py-2">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
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
              {applications.map((app) => (
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
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                    {app.date}
                  </td>
                  <td className="px-6 py-3">
                    <Button
                      variant="outline"
                      className="rounded-lg border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
                      onClick={() => handleOpenModal(app, modalInitialStep)}
                    >
                      <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
                        Review
                      </span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-0.5 mt-6">
            <button className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <SVGs.ChevronLeft />
            </button>
            <button className="size-10 rounded-[7px] bg-[#F2F2F5]">
              <span className="font-bold text-sm leading-[21px] tracking-normal text-[#121417]">
                1
              </span>
            </button>
            <button className="group size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <span className="text-sm leading-[21px] tracking-normal text-[#121417] group-hover:font-bold">
                2
              </span>
            </button>
            <button className="group flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <span className="text-sm leading-[21px] tracking-normal text-[#121417] group-hover:font-bold">
                ...
              </span>
            </button>
            <button className="group size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <span className="text-sm leading-[21px] tracking-normal text-[#121417] group-hover:font-bold">
                10
              </span>
            </button>
            <button className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <SVGs.ChevronLeft className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
      {/* The Modal */}
      <ReviewListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        initialStep={modalInitialStep}
      />
    </>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  initialStep: ModalStep;
}

function ReviewListingModal({ isOpen, onClose, listing, initialStep }: ModalProps) {
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
                    {listing.date}
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
                  onClick={() => setStep('SUCCESS_APPROVE')}
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
                onClick={() => setStep('SUCCESS_REJECT')}
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
