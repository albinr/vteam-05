export const apiClient = {
    async get(url, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...options.headers },
            ...options,
        });
        return handleResponse(response);
    },

    async post(url, body, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...options.headers },
            body: JSON.stringify(body),
            ...options,
        });
        return handleResponse(response);
    },

    async delete(url, body = null, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...options.headers },
            ...(body ? { body: JSON.stringify(body) } : {}),
            ...options,
        });
        return handleResponse(response);
    },

    async put(url, body, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...options.headers },
            body: JSON.stringify(body),
            ...options,
        });
        return handleResponse(response);
    },
};

async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const contentType = response.headers.get("Content-Type");
    return contentType && contentType.includes("application/json")
        ? response.json()
        : response.text();
}
