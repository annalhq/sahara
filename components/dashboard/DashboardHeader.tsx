import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  onFilter?: () => void;
}

export function DashboardHeader({
  title,
  onSearch,
  onExport,
  onFilter,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {title && (
          <h2 className="text-xl font-bold hidden md:block">{title}</h2>
        )}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search..."
            className="pl-10 w-full"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2"
            onClick={onFilter}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            onClick={onFilter}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
