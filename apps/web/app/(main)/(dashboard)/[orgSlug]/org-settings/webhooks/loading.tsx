import { Skeleton } from "@shipyard/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shipyard/ui/components/table";

function WebhookRowSkeleton() {
  return (
    <TableRow>
      {/* Event type — mono name + event ID */}
      <TableCell>
        <Skeleton className="h-4 w-40 mb-1.5" />
        <Skeleton className="h-3 w-56" />
      </TableCell>
      {/* Status badge */}
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      {/* Retries */}
      <TableCell className="text-right">
        <Skeleton className="h-3.5 w-8 ml-auto" />
      </TableCell>
      {/* Received */}
      <TableCell className="text-right">
        <Skeleton className="h-3.5 w-24 ml-auto" />
      </TableCell>
    </TableRow>
  );
}

export default function WebhooksLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-3.5 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-3.5 w-12" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-3.5 w-10 ml-auto" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-3.5 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <WebhookRowSkeleton key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
