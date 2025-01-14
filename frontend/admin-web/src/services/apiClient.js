import Cookies from "js-cookie";

const getHeaders = (options) => {
    const token = Cookies.get("token");
    if (!token) {
        console.warn("Ingen token hittades i cookies.");
    }
    return {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
        ...options.headers,
    };
};

export const apiClient = {
    async get(url, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "GET",
            headers: getHeaders(options),
            credentials: "include", // Skicka cookies vid behov
            ...options,
        });
        return handleResponse(response);
    },

    async post(url, body, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "POST",
            headers: getHeaders(options),
            body: JSON.stringify(body),
            credentials: "include", // Skicka cookies vid behov
            ...options,
        });
        return handleResponse(response);
    },

    async delete(url, body = null, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "DELETE",
            headers: getHeaders(options),
            ...(body ? { body: JSON.stringify(body) } : {}),
            credentials: "include", // Skicka cookies vid behov
            ...options,
        });
        return handleResponse(response);
    },

    async put(url, body, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "PUT",
            headers: getHeaders(options),
            body: JSON.stringify(body),
            credentials: "include", // Skicka cookies vid behov
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
