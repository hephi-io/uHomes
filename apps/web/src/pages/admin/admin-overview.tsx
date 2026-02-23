import { motion } from 'framer-motion';
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@uhomes/ui-kit';
import { SVGs } from '../../../../../packages/ui-kit/src/assets/svgs/Index';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import {
  getDashboardStats,
  getAllTransactions,
  getAgentApplications,
  type AdminTransaction,
  type AgentApplication,
  type DashboardStats,
} from '@/services/admin';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [reports, setReports] = useState<
    Array<{
      id: number;
      issueId: string;
      user: string;
      reportCategory: string;
      contactMethod: string;
      date: string;
      statusBadge: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [transactionsPage] = useState(1);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [, setTransactionsPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const [applicationsPagination, setApplicationsPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, transactionsRes, applicationsRes] = await Promise.all([
          getDashboardStats(),
          getAllTransactions({ page: transactionsPage, limit: 10 }),
          getAgentApplications({ page: applicationsPage, limit: 10, status: 'pending' }),
        ]);

        if (statsRes.data.status === 'success') {
          setStats(statsRes.data.data);
        }

        if (transactionsRes.data.status === 'success') {
          setTransactions(transactionsRes.data.data.transactions || []);
          setTransactionsPagination(transactionsRes.data.data.pagination);
        }

        if (applicationsRes.data.status === 'success') {
          setApplications(applicationsRes.data.data.applications || []);
          setApplicationsPagination(applicationsRes.data.data.pagination);
        }

        // Reports - using failed transactions as reports for now
        if (transactionsRes.data.status === 'success') {
          const failedTransactions = (transactionsRes.data.data.transactions || []).filter(
            (t: AdminTransaction) => t.status === 'failed'
          );
          setReports(
            failedTransactions.slice(0, 10).map((t: AdminTransaction, idx: number) => ({
              id: idx + 1,
              issueId: t.reference,
              user: typeof t.userId === 'object' ? 'Student' : 'Student',
              reportCategory: 'Payment Issue',
              contactMethod: typeof t.userId === 'object' ? t.userId.email : 'N/A',
              date: new Date(t.createdAt).toLocaleDateString('en-GB'),
              statusBadge: 'Pending',
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Failed to load dashboard data';
          toast.error(errorMessage);
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transactionsPage, applicationsPage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Escrow Held',
      completed: 'Successful',
      failed: 'Failed',
      refunded: 'Refunded',
      verified: 'Approved',
      rejected: 'Rejected',
    };
    return statusMap[status] || status;
  };

  const statsData = stats
    ? [
        {
          label: 'Total Revenue',
          value: formatCurrency(stats.totalRevenue),
          icon: SVGs.MoneyBag,
          color: 'bg-gradient-to-b from-[#E1EAFD] to-[#FFFFFF]',
          border: 'border-[#CBDBFC]',
        },
        {
          label: 'Total Agent',
          value: stats.totalAgents.toLocaleString(),
          icon: SVGs.User,
          color: 'bg-gradient-to-b from-[#FEECE0] to-[#FFFFFF]',
          border: 'border-[#FFE0D3]',
        },
        {
          label: 'Total Clients',
          value: stats.totalClients.toLocaleString(),
          icon: SVGs.UserAccount,
          color: 'bg-gradient-to-b from-[#D8F6FF] to-[#FFFFFF]',
          border: 'border-[#BFF0FC]',
        },
        {
          label: 'Active Listings',
          value: stats.activeListings.toLocaleString(),
          icon: SVGs.ListBullet,
          color: 'bg-gradient-to-b from-[#C8FFDC] to-[#FFFFFF]',
          border: 'border-[#BCF5D5]',
        },
      ]
    : [];

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#878FA1]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded border ${stat.border} ${stat.color} p-6`}
          >
            <div className={`size-10 flex items-center justify-center rounded bg-white`}>
              <stat.icon />
            </div>
            <h3 className="font-semibold text-[32px] leading-[100%] tracking-[0%] text-[#09090B] mt-14">
              {stat.value}
            </h3>
            <p className="font-semibold text-sm leading-[100%] tracking-[0%] text-[#71717A] mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
      {/* Main Table Section */}
      <div className="rounded-[12px] border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] overflow-hidden">
        <Tabs defaultValue="recent" className="w-full">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] p-4 pb-2">
            <TabsList className="rounded-md bg-[#F4F4F5] p-1">
              <TabsTrigger value="recent" className="rounded px-3 py-1.5">
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger value="applications" className="rounded px-3 py-1.5">
                Recent Applications
              </TabsTrigger>
              <TabsTrigger value="reports" className="rounded px-3 py-1.5">
                Recent Reports
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                className="flex gap-2 items-center rounded border-[#E4E4E4] px-3 py-2"
              >
                <SVGs.FunnelFree className="text-black" />
                <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black">
                  Filter
                </span>
              </Button>
              <div className="h-[37px] border-l border-l-[#E4E4E4]"></div>
              <Button className="flex gap-2 items-center rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-blue-600 px-4 py-2">
                <SVGs.AddProperty className="size-4" />
                <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                  Create Ad Campaign
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value="recent" className="p-0 m-0">
            <div className="w-full p-4 pt-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FAFB]">
                    <th className="px-6 py-3">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Transaction Ref
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Agent Name
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Payment Type
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Amount
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Date
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Status Badge
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
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-5 text-center text-[#878FA1]">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => {
                      const userId = typeof txn.userId === 'object' ? txn.userId : null;
                      const agentName = userId?.fullName || 'N/A';
                      return (
                        <tr
                          key={txn._id}
                          className="hover:bg-gray-50 transition-colors border-b border-b-[#E4E7EC]"
                        >
                          <td className="px-6 py-5">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                            {txn.reference}
                          </td>
                          <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                            {agentName}
                          </td>
                          <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                            Bank Transfer
                          </td>
                          <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                            {formatCurrency(txn.amount)}
                          </td>
                          <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                            {formatDate(txn.createdAt)}
                          </td>
                          <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                            <StatusBadge status={getStatusLabel(txn.status)} />
                          </td>
                          <td className="px-6 py-3">
                            <Button
                              variant="outline"
                              className="rounded-lg border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
                            >
                              <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
                                View details
                              </span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
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
          </TabsContent>
          <TabsContent value="applications" className="m-0">
            <div className="w-full p-4 pt-6">
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
              <div className="flex justify-center items-center gap-0.5 mt-6">
                <button
                  onClick={() => setApplicationsPage(Math.max(1, applicationsPage - 1))}
                  disabled={applicationsPage === 1}
                  className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SVGs.ChevronLeft />
                </button>
                {Array.from({ length: Math.min(applicationsPagination.pages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setApplicationsPage(pageNum)}
                      className={`size-10 rounded-[7px] ${
                        applicationsPage === pageNum ? 'bg-[#F2F2F5]' : 'hover:bg-[#F2F2F5]'
                      }`}
                    >
                      <span
                        className={`text-sm leading-[21px] tracking-normal text-[#121417] ${
                          applicationsPage === pageNum ? 'font-bold' : ''
                        }`}
                      >
                        {pageNum}
                      </span>
                    </button>
                  );
                })}
                {applicationsPagination.pages > 5 && (
                  <>
                    <button className="group flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5]">
                      <span className="text-sm leading-[21px] tracking-normal text-[#121417] group-hover:font-bold">
                        ...
                      </span>
                    </button>
                    <button
                      onClick={() => setApplicationsPage(applicationsPagination.pages)}
                      className="size-10 rounded-[7px] hover:bg-[#F2F2F5]"
                    >
                      <span className="text-sm leading-[21px] tracking-normal text-[#121417]">
                        {applicationsPagination.pages}
                      </span>
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    setApplicationsPage(
                      Math.min(applicationsPagination.pages, applicationsPage + 1)
                    )
                  }
                  disabled={applicationsPage >= applicationsPagination.pages}
                  className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SVGs.ChevronLeft className="rotate-180" />
                </button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="m-0">
            <div className="w-full p-4 pt-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FAFB]">
                    <th className="px-6 py-3">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Issue ID
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      User
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Report category
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Contact method
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Date
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Status Badge
                    </th>
                    <th className="font-Bricolage font-medium text-xs leading-4.5 tracking-[0%] text-[#475467] px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors border-b border-b-[#E4E7EC]"
                    >
                      <td className="px-6 py-5">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {report.issueId}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {report.user}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {report.reportCategory}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {report.contactMethod}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {report.date}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        <StatusBadge status={report.statusBadge} />
                      </td>
                      <td className="px-6 py-3">
                        <Button
                          variant="outline"
                          className="rounded-lg border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
                        >
                          <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
                            View details
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const blue: string = 'bg-[#EDF2FE] text-[#3E78FF] border-[#3E78FF]';
  const green: string = 'bg-[#2BCB0014] text-[#176F00] border-[#A8DD9A]';
  const red: string = 'bg-[#ED2A2A14] text-[#B10000] border-[#FF9E9E]';
  const yellow: string = 'bg-[#FFD00014] text-[#C18700] border-[#EAD67B]';

  const styles: Record<string, string> = {
    'Escrow Held': yellow,
    Refunded: red,
    Rejected: red,
    Successful: green,
    Pending: yellow,
    Approved: green,
    'Under review': blue,
    'In Progress': blue,
    Resolved: green,
  };

  return (
    <span
      className={`rounded-full border-[0.5px] font-medium text-sm leading-5 tracking-[0%] px-6 py-2 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
