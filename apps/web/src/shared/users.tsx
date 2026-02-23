import { Checkbox, type ColumnDef } from '@uhomes/ui-kit';
import { TStatusBadge } from './badge';

export type IUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: 'student' | 'agent' | 'admin' | null;
  isVerified: boolean;
  createdAt: string;
};

export const UserColumn: ColumnDef<IUser>[] = [
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
    accessorKey: 'fullName',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'userType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.userType;
      return <span className="capitalize">{type || 'N/A'}</span>;
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isVerified = row.original.isVerified;
      return <TStatusBadge status={isVerified ? 'Active' : 'Inactive'} />;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <button className="border border-[#DCDCDC] rounded-[8px] py-2 px-4 bg-[#F8F8F9]">
        <span className="text-[#3D3D3D] font-medium text-xs leading-[150%]">View details</span>
      </button>
    ),
  },
];
