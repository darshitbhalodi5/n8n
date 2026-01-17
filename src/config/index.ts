/**
 * Configuration
 * Centralized export for all configuration
 */

export { API_CONFIG, buildApiUrl } from "./api";

// Re-export API client utilities
export {
    api,
    apiRequest,
    generateRequestId,
    configureApiClient,
    getLastRequestId,
    formatErrorWithRequestId,
    getErrorReference,
    REQUEST_ID_HEADER,
    type ApiResponse,
    type ApiClientError,
    type ApiRequestOptions,
    type RequestMetadata,
} from "@/lib/api-client";
