"use client";

import React, { useCallback, useMemo } from "react";
import { GitMerge, Plus, Trash2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  MAX_SWITCH_CASES,
  createNewCase,
  createDefaultCase,
  type SwitchCaseData,
} from "@/components/blocks";

interface SwitchNodeConfigurationProps {
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
  { value: "regex", label: "Regex Match" },
] as const;

// Color mapping for case labels/badges
const CASE_COLORS = [
  {
    bg: "bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
  },
  {
    bg: "bg-green-500/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/30",
  },
  {
    bg: "bg-yellow-500/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-500/30",
  },
  {
    bg: "bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
  },
];

const DEFAULT_CASE_COLOR = {
  bg: "bg-gray-500/20",
  text: "text-gray-600 dark:text-gray-400",
  border: "border-gray-500/30",
};

/**
 * Switch Node Configuration Component
 *
 * Allows users to configure multi-branch routing:
 * - valuePath: path to value to test (e.g., "input.status")
 * - cases: array of case conditions (max 5, including default)
 *
 * Features:
 * - One default case that cannot be removed
 * - Add up to 4 additional cases
 * - Each case has its own operator and compare value
 */
export function SwitchNodeConfiguration({
  nodeData,
  handleDataChange,
}: SwitchNodeConfigurationProps) {
  const valuePath = (nodeData.valuePath as string) || "";

  // Initialize cases with default if empty - memoized to prevent unnecessary recalculations
  const cases = useMemo<SwitchCaseData[]>(
    () => (nodeData.cases as SwitchCaseData[]) || [createDefaultCase()],
    [nodeData.cases]
  );

  // Ensure default case exists - memoized to prevent unnecessary recalculations
  const normalizedCases = useMemo(() => {
    const hasDefaultCase = cases.some((c) => c.isDefault);
    return hasDefaultCase ? cases : [...cases, createDefaultCase()];
  }, [cases]);

  // Non-default cases for counting and display
  const nonDefaultCases = useMemo(
    () => normalizedCases.filter((c) => !c.isDefault),
    [normalizedCases]
  );
  const defaultCase = useMemo(
    () => normalizedCases.find((c) => c.isDefault),
    [normalizedCases]
  );

  const canAddCase = normalizedCases.length < MAX_SWITCH_CASES;

  // Update value path
  const handleValuePathChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleDataChange({ valuePath: e.target.value });
    },
    [handleDataChange]
  );

  // Add a new case
  const handleAddCase = useCallback(() => {
    if (!canAddCase) return;

    const newCaseNumber = nonDefaultCases.length + 1;
    const newCase = createNewCase(newCaseNumber);

    // Insert before default case
    const updatedCases = [...nonDefaultCases, newCase];
    if (defaultCase) {
      updatedCases.push(defaultCase);
    }

    handleDataChange({ cases: updatedCases });
  }, [canAddCase, nonDefaultCases, defaultCase, handleDataChange]);

  // Remove a case
  const handleRemoveCase = useCallback(
    (caseId: string) => {
      // Cannot remove default case
      const updatedCases = normalizedCases.filter((c) => c.id !== caseId);
      handleDataChange({ cases: updatedCases });
    },
    [normalizedCases, handleDataChange]
  );

  // Update a specific case
  const handleCaseChange = useCallback(
    (caseId: string, field: keyof SwitchCaseData, value: string) => {
      const updatedCases = normalizedCases.map((c) =>
        c.id === caseId ? { ...c, [field]: value } : c
      );
      handleDataChange({ cases: updatedCases });
    },
    [normalizedCases, handleDataChange]
  );

  // Get color for a case index
  const getCaseColor = (index: number) => {
    return CASE_COLORS[index % CASE_COLORS.length];
  };

  return (
    <div className="space-y-4">
      {/* Value Path Configuration */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-primary" />
          <Typography
            variant="bodySmall"
            className="font-semibold text-foreground"
          >
            Switch Configuration
          </Typography>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="switch-value-path" className="text-xs">
            Value Path
          </Label>
          <Input
            id="switch-value-path"
            value={valuePath}
            onChange={handleValuePathChange}
            placeholder="100"
            className="text-sm"
          />
          <Typography variant="caption" className="text-muted-foreground">
            Value to compare
          </Typography>
        </div>
      </Card>

      {/* Cases Configuration */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Typography
              variant="bodySmall"
              className="font-semibold text-foreground"
            >
              Cases ({normalizedCases.length}/{MAX_SWITCH_CASES})
            </Typography>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCase}
            disabled={!canAddCase}
            className="h-7 text-xs gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Case
          </Button>
        </div>

        {!canAddCase && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md p-2">
            <AlertCircle className="w-3.5 h-3.5" />
            Maximum {MAX_SWITCH_CASES} cases reached
          </div>
        )}

        <div className="space-y-3">
          {/* Non-default cases */}
          {nonDefaultCases.map((switchCase, index) => {
            const color = getCaseColor(index);
            return (
              <div
                key={switchCase.id}
                className={`p-3 rounded-lg ${color.bg} space-y-3`}
              >
                {/* Case header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${color.bg.replace(
                        "/20",
                        ""
                      )}`}
                    />
                    <Input
                      value={switchCase.label}
                      onChange={(e) =>
                        handleCaseChange(switchCase.id, "label", e.target.value)
                      }
                      className="h-auto text-xs font-medium bg-transparent border-none p-0 focus:ring-0 focus-visible:ring-0 shadow-none"
                      placeholder={`Case ${index + 1}`}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCase(switchCase.id)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    aria-label={`Remove ${switchCase.label}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Operator selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Operator
                  </Label>
                  <select
                    value={switchCase.operator}
                    onChange={(e) =>
                      handleCaseChange(
                        switchCase.id,
                        "operator",
                        e.target.value
                      )
                    }
                    className="w-full h-8 px-2 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    {OPERATORS.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Compare value (not shown for isEmpty) */}
                {switchCase.operator !== "isEmpty" && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Compare Value
                    </Label>
                    <Input
                      value={switchCase.compareValue}
                      onChange={(e) =>
                        handleCaseChange(
                          switchCase.id,
                          "compareValue",
                          e.target.value
                        )
                      }
                      placeholder="value to match"
                      className="h-8 text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Default case - always last, cannot be removed */}
          {defaultCase && (
            <div
              className={`p-3 rounded-lg border ${DEFAULT_CASE_COLOR.border} ${DEFAULT_CASE_COLOR.bg} space-y-2`}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <Typography
                  variant="bodySmall"
                  className={`font-medium ${DEFAULT_CASE_COLOR.text}`}
                >
                  Default Case
                </Typography>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Required
                </span>
              </div>
              <Typography variant="caption" className="text-muted-foreground">
                Executes when no other case matches
              </Typography>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
