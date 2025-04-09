import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("p-6 overflow-hidden relative", className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon}
      </div>
      <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-4 translate-y-4">
        {icon && <div className="w-24 h-24 text-primary">{icon}</div>}
      </div>
    </Card>
  );
}
