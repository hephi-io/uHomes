import { Checkbox, type ColumnDef } from '@uhomes/ui-kit';
import { StatusBadge } from './badge';

export type IBooking = {
  bookingID: string;
  studentName: string;
  apartment: string;
  roomType: string;
  duration: string;
  bookingStatus: 'Pending' | 'Accepted' | 'Cancelled';
  MoveInDate: string;
};

export const bookingColumns: ColumnDef<IBooking>[] = [
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
    accessorKey: 'bookingID',
    header: 'Booking ID',
  },

  {
    accessorKey: 'studentName',
    header: 'Student Name',
  },

  {
    accessorKey: 'apartment',
    header: 'Apartment',
  },

  {
    accessorKey: 'roomType',
    header: 'Room Type',
  },

  {
    accessorKey: 'duration',
    header: 'Duration',
  },

  {
    id: 'bookingStatus',
    header: 'Booking Status',
    cell: ({ row }) => {
      const status = row.original.bookingStatus;
      return <StatusBadge status={status} />;
    },
  },

  {
    accessorKey: 'MoveInDate',
    header: 'Move-in Date',
  },
];
