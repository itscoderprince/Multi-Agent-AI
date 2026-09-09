import api from "@/utils/axios";

/**
 * Simple GET fetcher for API requests.
 * @param {string} url - The API endpoint to call.
 * @param {object} [params] - Optional query parameters.
 * @returns {Promise<any>} The response data or null on failure.
 */
export const fetchData = async (url, params = {}) => {
  try {
    const { data } = await api.get(url, { params });
    return data?.data ?? data ?? null;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error(
        `Error fetching ${url}:`,
        error.response?.data?.message || error.message,
      );
    }
    return null;
  }
};

export default fetchData;
