import { Checkbox, type ColumnDef } from '@uhomes/ui-kit';
import { TStatusBadge } from './badge';
import { SVGs } from '@/assets/svgs/Index';

export type ITransaction = {
  transactionRef: string;
  studentName: string;
  paymentType: string;
  amount: string;
  date: string;
  statusBadge: 'Escrow Held' | 'Refunded' | 'Successful';
};

export const transactionColumn: ColumnDef<ITransaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'transactionRef',
    header: 'Transaction Ref',
  },

  {
    accessorKey: 'studentName',
    header: 'Student Name',
  },

  {
    accessorKey: 'paymentType',
    header: 'Payment Type',
  },

  {
    accessorKey: 'amount',
    header: 'Amount',
  },

  {
    accessorKey: 'date',
    header: 'Date',
  },

  {
    id: 'statusBadge',
    header: 'Status Badge',
    cell: ({ row }) => {
      const status = row.original.statusBadge;
      return <TStatusBadge status={status} />;
    },
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <button className="flex items-center gap-2 border border-[#DCDCDC] rounded-[8px] py-2 px-4 bg-[#F8F8F9]">
        <SVGs.Download className="text-[#141B34] w-4 h-4" />
        <span className="text-[#3D3D3D] font-medium text-xs leading-[150%]">Download Receipt</span>
      </button>
    ),
  },
];
