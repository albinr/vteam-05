export const apiClient = {
    async get(url, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...options.headers },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    },

    async post(url, body, options = {}) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...options.headers },
            body: JSON.stringify(body),
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    },

};
