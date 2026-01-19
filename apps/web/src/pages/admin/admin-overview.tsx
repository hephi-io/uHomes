import { motion } from 'framer-motion';
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@uhomes/ui-kit';
import { SVGs } from '../../../../../packages/ui-kit/src/assets/svgs/Index';

export function AdminDashboard() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '₦2,000,000',
      icon: SVGs.MoneyBag,
      color: 'bg-gradient-to-b from-[#E1EAFD] to-[#FFFFFF]',
      border: 'border-[#CBDBFC]',
    },
    {
      label: 'Total Agent',
      value: '830',
      icon: SVGs.User,
      color: 'bg-gradient-to-b from-[#FEECE0] to-[#FFFFFF]',
      border: 'border-[#FFE0D3]',
    },
    {
      label: 'Total Clients',
      value: '1,280',
      icon: SVGs.UserAccount,
      color: 'bg-gradient-to-b from-[#D8F6FF] to-[#FFFFFF]',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Active Listings',
      value: '890',
      icon: SVGs.ListBullet,
      color: 'bg-gradient-to-b from-[#C8FFDC] to-[#FFFFFF]',
      border: 'border-[#BCF5D5]',
    },
  ];

  const transactions = [
    {
      ref: 'TXN-20251104-108',
      agent: 'Cynthia Themoon',
      type: 'Bank Transfer',
      amount: '₦300,000',
      date: '12/10/2025',
      status: 'Escrow Held',
    },
    {
      ref: 'TXN-20251104-108',
      agent: 'Ebuka Ezeani',
      type: 'Bank Transfer',
      amount: '₦400,000',
      date: '04/11/2025',
      status: 'Refunded',
    },
    {
      ref: 'TXN-20251104-108',
      agent: 'Paul Olutusoye',
      type: 'Card Payment',
      amount: '₦350,000',
      date: '11/11/2025',
      status: 'Escrow Held',
    },
    {
      ref: 'TXN-20251104-108',
      agent: 'Grace Ekele',
      type: 'Bank Transfer',
      amount: '₦220,000',
      date: '18/09/2025',
      status: 'Successful',
    },
  ];

  const applications = [
    {
      id: 1,
      name: 'Cynthia Themoon',
      email: 'cynthia.themoon@example.com',
      phone: '+234 803 123 4567',
      document: true,
      statusBadge: 'Pending',
      date: '12/10/2025',
    },
  ];

  const reports = [
    {
      id: 1,
      issueId: 'Ref-20251104-108',
      user: 'Student',
      reportCategory: 'Payment Issue',
      contactMethod: 'cynthia@gmail.com',
      date: '12/10/2025',
      statusBadge: 'Pending',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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
                  {transactions.map((txn, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors border-b border-b-[#E4E7EC]"
                    >
                      <td className="px-6 py-5">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {txn.ref}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {txn.agent}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {txn.type}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {txn.amount}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {txn.date}
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        <StatusBadge status={txn.status} />
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
                        <StatusBadge status={app.statusBadge} />
                      </td>
                      <td className="font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#475467] px-6 py-3">
                        {app.date}
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
