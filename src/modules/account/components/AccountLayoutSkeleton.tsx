import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLayoutSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Account sections */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-sm p-4 flex items-center space-x-4"
        >
          <Skeleton className="h-4 w-4" />
          <div className="flex items-center space-x-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
}
