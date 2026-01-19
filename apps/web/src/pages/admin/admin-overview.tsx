import { motion } from 'framer-motion';
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@uhomes/ui-kit';
import { SVGs } from '../../../../../packages/ui-kit/src/assets/svgs/Index';

export function AdminDashboard() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '₦2,000,000',
      icon: SVGs.MoneyBag,
      color: 'bg-[#F0F7FF]',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Total Agent',
      value: '830',
      icon: SVGs.ProfilePic,
      color: 'bg-[#FFF7F0]',
      border: 'border-[#FFE5D3]',
    },
    {
      label: 'Total Clients',
      value: '1,280',
      icon: SVGs.InformationCircle,
      color: 'bg-[#F0FBFF]',
      border: 'border-[#CCF3FF]',
    },
    {
      label: 'Active Listings',
      value: '890',
      icon: SVGs.ListIcon,
      color: 'bg-[#F0FFF6]',
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

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-xl border-2 bg-white ${stat.border} shadow-sm`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-gray-50 border border-gray-100`}
            >
              <stat.icon className="size-5" />
            </div>
            <h3 className="text-3xl font-bold text-[#09090B]">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-sm overflow-hidden">
        <Tabs defaultValue="recent" className="w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <TabsList className="bg-[#F4F4F5] p-1">
              <TabsTrigger
                value="recent"
                className="px-6 py-2 data-[active=true]:text-black text-gray-400"
              >
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="px-6 py-2 data-[active=true]:text-black text-gray-400"
              >
                Recent Applications
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="px-6 py-2 data-[active=true]:text-black text-gray-400"
              >
                Recent Reports
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <Button variant="outline" className="flex gap-2 items-center border-gray-300">
                <SVGs.Filter className="size-4" /> Filter
              </Button>
              <Button className="bg-[#3E78FF] hover:bg-blue-600 flex gap-2 items-center text-white">
                <SVGs.AddProperty className="size-4" /> Create Ad Campaign
              </Button>
            </div>
          </div>

          <TabsContent value="recent" className="m-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-4 font-medium">Transaction Ref</th>
                  <th className="px-6 py-4 font-medium">Agent Name</th>
                  <th className="px-6 py-4 font-medium">Payment Type</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status Badge</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">{txn.ref}</td>
                    <td className="px-6 py-5 text-sm">{txn.agent}</td>
                    <td className="px-6 py-5 text-sm">{txn.type}</td>
                    <td className="px-6 py-5 text-sm font-semibold">{txn.amount}</td>
                    <td className="px-6 py-5 text-sm">{txn.date}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-5">
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        View details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Placeholder */}
            <div className="p-6 border-t border-gray-100 flex justify-center items-center gap-4">
              <button className="text-gray-400">&lt;</button>
              <button className="w-8 h-8 rounded bg-[#F4F4F5] text-sm font-medium">1</button>
              <button className="text-sm font-medium text-gray-400">2</button>
              <span className="text-gray-300">...</span>
              <button className="text-sm font-medium text-gray-400">10</button>
              <button className="text-gray-400">&gt;</button>
            </div>
          </TabsContent>
          <TabsContent value="applications" className="m-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-4 font-medium">Transaction Ref</th>
                  <th className="px-6 py-4 font-medium">Agent Name</th>
                  <th className="px-6 py-4 font-medium">Payment Type</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status Badge</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">{txn.ref}</td>
                    <td className="px-6 py-5 text-sm">{txn.agent}</td>
                    <td className="px-6 py-5 text-sm">{txn.type}</td>
                    <td className="px-6 py-5 text-sm font-semibold">{txn.amount}</td>
                    <td className="px-6 py-5 text-sm">{txn.date}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-5">
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        View details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Placeholder */}
            <div className="p-6 border-t border-gray-100 flex justify-center items-center gap-4">
              <button className="text-gray-400">&lt;</button>
              <button className="w-8 h-8 rounded bg-[#F4F4F5] text-sm font-medium">1</button>
              <button className="text-sm font-medium text-gray-400">2</button>
              <span className="text-gray-300">...</span>
              <button className="text-sm font-medium text-gray-400">10</button>
              <button className="text-gray-400">&gt;</button>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="m-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-4 font-medium">Transaction Ref</th>
                  <th className="px-6 py-4 font-medium">Agent Name</th>
                  <th className="px-6 py-4 font-medium">Payment Type</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status Badge</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">{txn.ref}</td>
                    <td className="px-6 py-5 text-sm">{txn.agent}</td>
                    <td className="px-6 py-5 text-sm">{txn.type}</td>
                    <td className="px-6 py-5 text-sm font-semibold">{txn.amount}</td>
                    <td className="px-6 py-5 text-sm">{txn.date}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-5">
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        View details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Placeholder */}
            <div className="p-6 border-t border-gray-100 flex justify-center items-center gap-4">
              <button className="text-gray-400">&lt;</button>
              <button className="w-8 h-8 rounded bg-[#F4F4F5] text-sm font-medium">1</button>
              <button className="text-sm font-medium text-gray-400">2</button>
              <span className="text-gray-300">...</span>
              <button className="text-sm font-medium text-gray-400">10</button>
              <button className="text-gray-400">&gt;</button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Escrow Held': 'bg-[#FFF9E6] text-[#D99E00]',
    Refunded: 'bg-[#FFF0F0] text-[#FF4D4D]',
    Successful: 'bg-[#F0FFF6] text-[#00B048]',
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
