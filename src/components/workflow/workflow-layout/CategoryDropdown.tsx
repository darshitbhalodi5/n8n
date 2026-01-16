"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui";
import { ChevronDown } from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode | null;
}

interface CategoryDropdownProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  placeholder?: string;
}

export function CategoryDropdown({
  categories,
  activeCategory,
  onCategoryChange,
  placeholder = "Select category",
}: CategoryDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCategory = categories.find((cat) => cat.id === activeCategory);

  return (
    <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 hover:bg-black/90 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-between gap-3 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {selectedCategory?.icon && (
              <span className="shrink-0 w-5 h-5 text-white/80 group-hover:text-white transition-colors">
                {selectedCategory.icon}
              </span>
            )}
            <span className="truncate text-sm font-medium text-white">
              {selectedCategory?.label || placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-white/60 shrink-0 transition-all duration-200 ${
              dropdownOpen ? "rotate-180 text-white" : ""
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2 bg-black border-white/20 shadow-lg"
        align="start"
      >
        <div className="max-h-[320px] overflow-y-auto space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id);
                setDropdownOpen(false);
              }}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-150 text-left ${
                activeCategory === category.id
                  ? "bg-white/10 text-white border border-white/30"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {category.icon && (
                <span
                  className={`shrink-0 w-4 h-4 transition-colors ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-white/60"
                  }`}
                >
                  {category.icon}
                </span>
              )}
              <span className="flex-1">{category.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
