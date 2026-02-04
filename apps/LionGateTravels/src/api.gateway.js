// api.gateway.ts
// Centralized API handling for LionGateOS Travels
export const API_CONFIG = {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 5000,
};
export const apiGateway = {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`);
            const data = await response.json();
            return {
                data,
                error: response.ok ? null : data.message || 'Unknown error',
                status: response.status,
            };
        }
        catch (error) {
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Network error',
                status: 0,
            };
        }
    },
    async post(endpoint, body) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return {
                data,
                error: response.ok ? null : data.message || 'Unknown error',
                status: response.status,
            };
        }
        catch (error) {
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Network error',
                status: 0,
            };
        }
    }
};
