import { SVGs } from '@/assets/svgs/Index';
import { PaymentColumn, type IPayment } from '@/shared/payments';
import Tableshared from '@/shared/table';
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
} from '@uhomes/ui-kit';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  getPaymentStats,
  getAllPayments,
  type AdminPayment,
  type PaymentStats,
} from '@/services/admin';
// import Viewdetails from './view-details';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

function mapPayment(payment: AdminPayment): IPayment {
  const userId = typeof payment.userId === 'object' ? payment.userId : null;
  return {
    transactionRef: payment.reference || payment._id,
    studentName: userId?.fullName || 'N/A',
    paymentType: payment.paymentMethod || 'Bank Transfer',
    amount: formatCurrency(payment.amount ?? 0),
    date: new Date(payment.createdAt).toLocaleDateString('en-GB'),
    statusBadge:
      payment.status === 'pending'
        ? 'Escrow Held'
        : payment.status === 'completed'
          ? 'Successful'
          : payment.status === 'refunded'
            ? 'Refunded'
            : 'Failed',
  };
}

const defaultStats: PaymentStats = {
  totalRevenue: 0,
  platformFees: 0,
  inEscrow: 0,
  releasedPayments: 0,
  declined: 0,
};

const EscrowPayments = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page] = useState(1);

  const filters = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  const {
    data: paymentsData,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ['adminPayments', search, statusFilter, page],
    queryFn: async () => {
      const response = await getAllPayments(filters);
      if (response.data.status !== 'success') throw new Error('Failed to load payments');
      return response.data.data;
    },
  });

  const { data: stats = defaultStats } = useQuery({
    queryKey: ['adminPaymentStats'],
    queryFn: async () => {
      const response = await getPaymentStats();
      if (response.data.status !== 'success') throw new Error('Failed to load payment stats');
      return response.data.data;
    },
  });

  useEffect(() => {
    if (!isError || !error) return;
    const message =
      error instanceof AxiosError
        ? error.response?.data?.error || error.response?.data?.message || 'Failed to load payments'
        : 'An unexpected error occurred';
    toast.error(message);
  }, [isError, error]);

  const transactions: IPayment[] = paymentsData?.payments?.map(mapPayment) ?? [];

  const statsData = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      color: 'bg-gradient-to-b from-[#E1EAFD] to-white',
      border: 'border-[#CBDBFC]',
    },
    {
      label: 'Platform  Fees',
      value: formatCurrency(stats.platformFees),
      color: 'bg-gradient-to-b from-[#C8FFDC] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'In Escrow',
      value: formatCurrency(stats.inEscrow),
      color: 'bg-gradient-to-b from-[#FEECE0] to-white',
      border: 'border-[#FFE0D3]',
    },
    {
      label: 'Released Payments',
      value: formatCurrency(stats.releasedPayments),
      color: 'bg-gradient-to-b from-[#D8F6FF] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Declined',
      value: formatCurrency(stats.declined),
      color: 'bg-gradient-to-b from-[#FA350766] to-white',
      border: 'border-[#FF383C66]',
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <h1 className="font-semibold text-[22px] leading-[120%] tracking-[0%] text-black">
        Manage Escrow & Payments
      </h1>
      <p className="text-sm leading-[120%] tracking-[0%] text-black mt-1">
        Review and manage booking payments and escrow release
      </p>
      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4 mt-4">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className={`rounded border ${stat.border} ${stat.color} shadow-sm transition-all hover:shadow-md py-6 px-4`}
          >
            <h3 className="font-semibold text-[24px] mb-1 leading-[100%] tracking-[0%] text-[#09090B]">
              {stat.value}
            </h3>
            <p className="font-semibold text-sm leading-[100%] tracking-[0%] text-[#71717A] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-[#E4E7EC] shadow-[0px_1px_2px_0px_#1018280D] overflow-hidden mt-4">
        <div className="flex items-center justify-between px-4">
          <div className="relative max-w-sm w-full ">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SVGs.MagnifyingGlass className="size-4" />
            </span>
            <Input
              type="search"
              placeholder="Search by client or transaction Ref"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[10px] border-[0.8px] border-[#D1D5DC] text-base leading-[100%] tracking-normal text-[#0A0A0A80] focus:text-black focus:ring-1 focus:ring-blue-500 pl-9 pr-4 py-4"
            />
          </div>

          <div className="flex justify-end items-center gap-4 p-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 rounded border-[#E4E4E4] bg-white font-Bricolage font-medium text-sm leading-[150%] tracking-[0%] text-black px-3 py-2">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
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
        </div>
        <div className="border-t border-t-[#E4E7EC]"></div>
        <div className="p-4">
          {loading ? (
            <div className="p-4 text-center text-[#878FA1]">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-4 text-center text-[#878FA1]">No transactions found</div>
          ) : (
            <Tableshared columns={PaymentColumn} data={transactions} />
          )}
        </div>
      </div>
      {/* meant to be in a dialog */}
      {/* <Viewdetails /> */}
    </div>
  );
};

export default EscrowPayments;
