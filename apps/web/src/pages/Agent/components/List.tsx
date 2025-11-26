import { type ColumnDef } from '@uhomes/ui-kit';

import { flexRender, getCoreRowModel, useReactTable } from '@uhomes/ui-kit';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@uhomes/ui-kit';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
const List = <TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="lg:pt-4 lg:px-4">
      <Table className="border-spacing-3">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-Bricolage text-[#475467] font-medium text-xs leading-[18px] bg-[#F9FAFB]   py-3 px-6 rounded-t-xl  "
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border-b md:border-[#E4E7EC] border-[#E4E7EC] text-[#475467] text-sm leading-5  font-medium font-Bricolage px-6 py-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No properties found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default List;
