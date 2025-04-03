import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  onSearch: (query: string) => void;
  onExport: () => void;
  onFilter: () => void;
}

export function DashboardHeader({
  title,
  onSearch,
  onExport,
  onFilter,
}: DashboardHeaderProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full md:w-[300px]"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={onFilter}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
