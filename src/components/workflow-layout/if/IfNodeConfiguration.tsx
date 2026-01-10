"use client";

import React from "react";
import { GitBranch } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

interface IfNodeConfigurationProps {
  nodeData: Record<string, unknown>;
  handleDataChange: (updates: Record<string, unknown>) => void;
}

const OPERATORS = [
  { value: "equals", label: "Equals (==)" },
  { value: "notEquals", label: "Not Equals (!=)" },
  { value: "contains", label: "Contains" },
  { value: "gt", label: "Greater Than (>)" },
  { value: "lt", label: "Less Than (<)" },
  { value: "gte", label: "Greater or Equal (>=)" },
  { value: "lte", label: "Less or Equal (<=)" },
  { value: "isEmpty", label: "Is Empty" },
] as const;

/**
 * If Node Configuration Component
 *
 * Allows users to configure a single conditional rule:
 * - leftPath: path to value to test (e.g., "input.amount")
 * - operator: comparison operator
 * - rightValue: value to compare against
 */
export function IfNodeConfiguration({
  nodeData,
  handleDataChange,
}: IfNodeConfigurationProps) {
  const leftPath = (nodeData.leftPath as string) || "";
  const operator = (nodeData.operator as string) || "equals";
  const rightValue = (nodeData.rightValue as string) || "";

  const handleLeftPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDataChange({ leftPath: e.target.value });
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleDataChange({ operator: e.target.value });
  };

  const handleRightValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDataChange({ rightValue: e.target.value });
  };

  return (
    <div className="space-y-4">
      {/* Condition Configuration Card */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <Typography
            variant="bodySmall"
            className="font-semibold text-foreground"
          >
            Condition Rule
          </Typography>
        </div>

        <div className="space-y-3">
          {/* Left Path Input */}
          <div className="space-y-1.5">
            <Label htmlFor="if-left-path" className="text-xs">
              Value Path
            </Label>
            <Input
              id="if-left-path"
              value={leftPath}
              onChange={handleLeftPathChange}
              placeholder="input.amount"
              className="text-sm"
            />
            <Typography variant="caption" className="text-muted-foreground">
              Path to the value to test (e.g., input.amount, data.status)
            </Typography>
          </div>

          {/* Operator Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="if-operator" className="text-xs">
              Operator
            </Label>
            <select
              id="if-operator"
              value={operator}
              onChange={handleOperatorChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {/* Right Value Input (disabled for isEmpty) */}
          {operator !== "isEmpty" && (
            <div className="space-y-1.5">
              <Label htmlFor="if-right-value" className="text-xs">
                Compare Value
              </Label>
              <Input
                id="if-right-value"
                value={rightValue}
                onChange={handleRightValueChange}
                placeholder="100"
                className="text-sm"
              />
              <Typography variant="caption" className="text-muted-foreground">
                Value to compare against (string or number)
              </Typography>
            </div>
          )}
        </div>
      </Card>

      {/* Branching Info Card */}
      <Card className="p-4 space-y-3 border-border bg-secondary/20">
        <Typography
          variant="bodySmall"
          className="font-semibold text-foreground"
        >
          💡 How Branching Works
        </Typography>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 mt-0.5 rounded-full bg-green-500 shrink-0" />
            <div>
              <span className="font-medium text-green-600 dark:text-green-400">
                True path:
              </span>{" "}
              Connect the top handle to blocks that should run when condition is true
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 mt-0.5 rounded-full bg-red-500 shrink-0" />
            <div>
              <span className="font-medium text-red-600 dark:text-red-400">
                False path:
              </span>{" "}
              Connect the bottom handle to blocks that should run when condition is false
            </div>
          </div>
        </div>
        <Typography variant="caption" className="text-muted-foreground">
          The edge will automatically show &quot;True&quot; or &quot;False&quot; label based on
          which handle you connect from.
        </Typography>
      </Card>
    </div>
  );
}

