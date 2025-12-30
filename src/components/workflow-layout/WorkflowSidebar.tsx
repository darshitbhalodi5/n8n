"use client";

import { FileText, FolderPlus, Upload } from "lucide-react";
import { Typography } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function SidebarItem({ icon, label, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-sm",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-secondary/50 transition-colors",
        "rounded-lg"
      )}
    >
      <div className="w-4 h-4 shrink-0">{icon}</div>
      <Typography variant="bodySmall" className="text-left">
        {label}
      </Typography>
    </button>
  );
}

export function WorkflowSidebar() {
  return (
    <div className="p-4 space-y-6">
      {/* Create Section */}
      <div className="space-y-2">
        <Typography
          variant="caption"
          className="px-4 text-muted-foreground uppercase tracking-wider"
        >
          Create Workflow
        </Typography>
        <div className="space-y-1">
          <SidebarItem
            icon={<FileText className="w-4 h-4" />}
            label="Create from Blank"
            onClick={() => console.log("Create from blank")}
          />
          <SidebarItem
            icon={<FolderPlus className="w-4 h-4" />}
            label="Create from Template"
            onClick={() => console.log("Create from template")}
          />
          <SidebarItem
            icon={<Upload className="w-4 h-4" />}
            label="Import Workflow"
            onClick={() => console.log("Import workflow")}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Recent Section */}
      <div className="space-y-2">
        <Typography
          variant="caption"
          className="px-4 text-muted-foreground uppercase tracking-wider"
        >
          Recent
        </Typography>
        <div className="px-4 py-8 text-center">
          <Typography variant="bodySmall" className="text-muted-foreground">
            No recent workflows
          </Typography>
        </div>
      </div>
    </div>
  );
}

