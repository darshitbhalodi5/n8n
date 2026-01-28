/**
 * AI Category Blocks
 * Export all AI transform blocks
 */

import type { BlockDefinition } from "../types";
import { getAiModelConfig } from "@/config/ai";

/**
 * AI Transform Blocks
 * Each model gets its own block with pre-configured provider/model defaults.
 * Model-specific limits (temperature, max tokens) are derived from local config.
 */

// Base AI Transform block (used as template)
export const createAiTransformBlock = (
  id: string,
  label: string,
  provider: string,
  model: string,
  iconName: string
): BlockDefinition => {
  const modelConfig = getAiModelConfig(model);

  return {
    id,
    label,
    iconName,
    description: `AI-powered data transformation using ${label}`,
    category: "ai",
    nodeType: "ai-transform",
    defaultData: {
      label,
      description: "Transform data with AI",
      status: "idle" as const,
      llmProvider: provider,
      llmModel: model,
      userPromptTemplate: "",
      // Neutral defaults come from internal config, not user input
      temperature: modelConfig.temperature,
      maxOutputTokens: modelConfig.maxOutputTokens,
    },
  };
};

// Static blocks for the 4 hardcoded models
export const aiTransformQwen: BlockDefinition = createAiTransformBlock(
  "ai-openrouter-qwen-free",
  "Qwen",
  "openrouter",
  "openrouter:qwen",
  "QwenLogo"
);

export const aiTransformGLM: BlockDefinition = createAiTransformBlock(
  "ai-openrouter-glm-free",
  "GLM",
  "openrouter",
  "openrouter:glm",
  "GLMLogo"
);

export const aiTransformDeepSeek: BlockDefinition = createAiTransformBlock(
  "ai-openrouter-deepseek-free",
  "DeepSeek",
  "openrouter",
  "openrouter:deepseek",
  "DeepSeekLogo"
);

export const aiTransformChatGPT: BlockDefinition = createAiTransformBlock(
  "ai-openai-chatgpt",
  "ChatGPT",
  "openai",
  "gpt-5-nano",
  "ChatGPTLogo"
);

// Export all AI blocks
export const aiBlocks: BlockDefinition[] = [
  aiTransformQwen,
  aiTransformGLM,
  aiTransformDeepSeek,
  aiTransformChatGPT,
];
