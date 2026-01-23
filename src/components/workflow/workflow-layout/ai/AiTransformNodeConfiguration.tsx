"use client";

import React, { useRef } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { TemplateFieldSelector } from "../shared/TemplateFieldSelector";
import type { AiTransformNodeData } from "@/types/node-data";

interface AiTransformNodeConfigurationProps {
  nodeData: AiTransformNodeData & { id?: string };
  handleDataChange: (updates: Record<string, unknown>) => void;
}

export function AiTransformNodeConfiguration({
  nodeData,
  handleDataChange,
}: AiTransformNodeConfigurationProps) {
  const systemPromptRef = useRef<HTMLTextAreaElement>(null);
  const userPromptRef = useRef<HTMLTextAreaElement>(null);

  const insertIntoField = (
    field: "system" | "user",
    placeholder: string
  ) => {
    const ref = field === "system" ? systemPromptRef : userPromptRef;
    const currentValue = field === "system" 
      ? (nodeData.systemPrompt || "") 
      : (nodeData.userPromptTemplate || "");
    const fieldKey = field === "system" ? "systemPrompt" : "userPromptTemplate";

    if (ref.current) {
      const textarea = ref.current;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const newValue = 
        currentValue.substring(0, start) + 
        placeholder + 
        currentValue.substring(end);
      handleDataChange({ [fieldKey]: newValue });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    } else {
      handleDataChange({ [fieldKey]: currentValue + placeholder });
    }
  };

  return (
    <>
      {/* Model Info Card */}
      <Card className="p-4 space-y-3 bg-linear-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <Typography variant="bodySmall" className="font-semibold text-foreground">
          Model Configuration
        </Typography>

        {/* Provider (read-only) */}
        <div className="space-y-2">
          <Typography variant="caption" className="text-muted-foreground">
            Provider
          </Typography>
          <input
            type="text"
            value={nodeData.llmProvider || ""}
            disabled
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background/50 text-foreground/70 cursor-not-allowed"
          />
        </div>

        {/* Model (read-only) */}
        <div className="space-y-2">
          <Typography variant="caption" className="text-muted-foreground">
            Model
          </Typography>
          <input
            type="text"
            value={nodeData.llmModel || ""}
            disabled
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background/50 text-foreground/70 cursor-not-allowed"
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Typography variant="caption" className="text-muted-foreground">
              Temperature
            </Typography>
            <Typography variant="caption" className="text-foreground font-mono">
              {nodeData.temperature !== undefined ? nodeData.temperature : 0.7}
            </Typography>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={nodeData.temperature !== undefined ? nodeData.temperature : 0.7}
            onChange={(e) => handleDataChange({ temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <Typography variant="caption" className="text-muted-foreground text-xs">
            Lower values make output more focused; higher values make it more creative
          </Typography>
        </div>

        {/* Max Output Tokens */}
        <div className="space-y-2">
          <Typography variant="caption" className="text-muted-foreground">
            Max Output Tokens
          </Typography>
          <input
            type="number"
            value={nodeData.maxOutputTokens || 1000}
            onChange={(e) => handleDataChange({ maxOutputTokens: parseInt(e.target.value, 10) })}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            min={1}
            max={4096}
          />
        </div>
      </Card>

      {/* Prompts Card */}
      <Card className="p-4 space-y-3">
        <Typography variant="bodySmall" className="font-semibold text-foreground">
          Prompts
        </Typography>

        {/* Template Field Selector */}
        <TemplateFieldSelector
          currentNodeId={(nodeData.id as string) || ""}
          onInsertField={(placeholder) => {
            // Insert into the field that currently has focus, or default to user prompt
            if (systemPromptRef.current === document.activeElement) {
              insertIntoField("system", placeholder);
            } else {
              insertIntoField("user", placeholder);
            }
          }}
        />

        {/* System Prompt */}
        <div className="space-y-2">
          <Typography variant="caption" className="text-muted-foreground">
            System Prompt (Optional)
          </Typography>
          <textarea
            ref={systemPromptRef}
            value={nodeData.systemPrompt || ""}
            onChange={(e) => handleDataChange({ systemPrompt: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
            placeholder="You are a helpful assistant that transforms data... Use the field selector above to insert dynamic values."
            rows={3}
          />
        </div>

        {/* User Prompt Template */}
        <div className="space-y-2">
          <Typography variant="caption" className="text-muted-foreground">
            User Prompt Template *
          </Typography>
          <textarea
            ref={userPromptRef}
            id="user-prompt-template"
            value={nodeData.userPromptTemplate || ""}
            onChange={(e) => handleDataChange({ userPromptTemplate: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
            placeholder="Extract key information from: {{body}} Use the field selector above to insert dynamic values."
            rows={5}
            required
          />
          <Typography variant="caption" className="text-muted-foreground text-xs">
            Use {`{{path.to.value}}`} to reference data from previous nodes, or use the field selector above
          </Typography>
        </div>
      </Card>

      {/* Output Schema Card (Optional Advanced Feature) */}
      <Card className="p-4 space-y-3">
        <Typography variant="bodySmall" className="font-semibold text-foreground">
          Output Schema (Optional)
          </Typography>
        <Typography variant="caption" className="text-muted-foreground text-xs">
          Define a JSON schema to structure the AI response. Leave empty for plain text output.
        </Typography>

        <textarea
          value={
            nodeData.outputSchema 
              ? JSON.stringify(nodeData.outputSchema, null, 2) 
              : ""
          }
          onChange={(e) => {
            try {
              const schema = e.target.value.trim() ? JSON.parse(e.target.value) : undefined;
              handleDataChange({ outputSchema: schema });
            } catch {
              // Invalid JSON, don't update
            }
          }}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
          placeholder={`{
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "sentiment": { "type": "string", "enum": ["positive", "negative", "neutral"] }
  },
  "required": ["summary", "sentiment"]
}`}
          rows={8}
        />
      </Card>

      {/* Help Card */}
      <Card className="p-4 space-y-2 bg-blue-500/5 border-blue-500/30">
        <Typography variant="caption" className="font-semibold text-blue-400">
          💡 Tips
        </Typography>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Reference previous node outputs using {`{{nodeName.property}}`}</li>
          <li>• Lower temperature (0.0-0.5) for consistent, factual responses</li>
          <li>• Higher temperature (0.7-2.0) for creative, varied responses</li>
          <li>• Define an output schema to get structured JSON responses</li>
        </ul>
      </Card>
    </>
  );
}
