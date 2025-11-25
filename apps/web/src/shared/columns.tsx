
import { Checkbox, type ColumnDef } from "@uhomes/ui-kit"
import { SVGs } from '@/assets/svgs/Index';

export type Property = {
  id: string
  images: string[]
  name: string
  location: string
  price: string
  bookings: number
  amenities: string
  rating: string
}


export const columns: ColumnDef<Property>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "images",
    header: "Property Images",
    cell: ({ row }) => {
      const imgs = row.getValue("images") as string[]
      return (
        <div className="flex items-center gap-1">
          {imgs.slice(0, 3).map((src, idx) => (
            <img
              key={idx}
              src={src}
              className="w-10 h-10 rounded-md object-cover"
            />
          ))}

          {imgs.length > 3 && (
            <span className="w-10 h-10 rounded-md bg-black text-white text-xs flex items-center justify-center">
              +{imgs.length - 3}
            </span>
          )}
        </div>
      )
    },
  },

  {
    accessorKey: "name",
    header: "Apartment",
  },

  {
    accessorKey: "location",
    header: "Location",
  },

  {
    accessorKey: "price",
    header: "Price",
  },

  {
    accessorKey: "bookings",
    header: "Bookings",
  },

  {
    accessorKey: "amenities",
    header: "Amenities",
  },

  {
    accessorKey: "rating",
    header: "Rating",
  },

  {
    id: "actions",
    header: "Actions",
    cell: () => (
       <div className="flex items-center">
        <button className="py-4 px-6"><SVGs.Pencil /></button>
        <button className="py-4 px-6"><SVGs.Trash /></button>
       </div>
    ),
  },
]






