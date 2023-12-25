import { Skeleton } from "@/Components/ui/skeleton"
import { TableCell, TableRow } from "@/Components/ui/table"

const RowSkeleton = () => {
  return (
    <TableRow className="flex items-center space-x-4">
        <TableCell>
            <Skeleton className="h-12 w-12" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-4 w-[250px]" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-4 w-[200px]" />
        </TableCell>
    </TableRow>
  )
}
export default RowSkeleton