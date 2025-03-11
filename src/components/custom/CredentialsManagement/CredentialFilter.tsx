"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";

interface BusinessUnit {
  id: number;
  name: string;
}

interface BusinessUnitFilterProps {
  onFilterChange: (filterName: string, value: string) => void;
  businessUnits: BusinessUnit[];
  searchValue?: string;
  business_unit?: string;
}

export function BusinessUnitFilter({
  onFilterChange,
  businessUnits,
  searchValue = "",
  business_unit = "",
}: BusinessUnitFilterProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [localBusinessUnit, setLocalBusinessUnit] = useState(business_unit);
  
  // Initialize local state from props
  useEffect(() => {
    setLocalSearch(searchValue);
    setLocalBusinessUnit(business_unit);
  }, [searchValue, business_unit]);
  
  const hasActiveFilters = (localBusinessUnit !== "" && localBusinessUnit !== "all");
  
  // Memoize the filter change function to prevent re-renders
  const applyFilters = useCallback(() => {
    if (typeof onFilterChange === 'function') {
      onFilterChange('business_unit', localBusinessUnit === "all" ? "" : localBusinessUnit);
      onFilterChange('search', localSearch);
    }
  }, [localBusinessUnit, localSearch, onFilterChange]);
  
  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  const clearFilters = () => {
    setLocalBusinessUnit("all");
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <div className="relative flex-1 w-full md:max-w-md">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, employee code..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 w-full border-gray-300 h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
            onClick={() => {
              setLocalSearch("");
              onFilterChange('search', "");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 gap-1.5 dark:bg-gray-900">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1 rounded-full px-1.5 py-px text-xs">
                  {(localBusinessUnit !== "all" && localBusinessUnit !== "") ? 1 : 0}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 dark:bg-gray-900 bg-gray-100" align="end">
            <div className="space-y-4 p-1">
              {businessUnits && businessUnits.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Business Unit</h4>
                  <Select value={localBusinessUnit || "all"} onValueChange={setLocalBusinessUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by business unit" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 bg-gray-100">
                      <SelectItem value="all">All Business Units</SelectItem>
                      {businessUnits.filter(unit => unit.name && unit.name.trim() !== "").map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    clearFilters();
                    setIsFiltersOpen(false);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}