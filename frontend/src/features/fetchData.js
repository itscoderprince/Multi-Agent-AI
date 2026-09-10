import api from "@/utils/axios";

/**
 * Generic GET request utility for fetching API resources.
 * Sends authenticated requests through the API Gateway to backend microservices.
 *
 * @method  GET
 * @param   {string} url - API endpoint path (e.g. "/chat", "/chats", "/me").
 * @param   {object} [params={}] - Optional URL query parameters.
 * @returns {Promise<any>} The unwrapped response payload (data.data or data), or null on failure.
 */
export const fetchData = async (url, params = {}) => {
  try {
    const { data } = await api.get(url, { params });
    return data?.data ?? data ?? null;
  } catch (error) {
    // 401 is an expected state when a user session is not found; suppress noisy console logs
    if (error.response?.status !== 401) {
      console.error(
        `Failed to fetch [GET ${url}]:`,
        error.response?.data?.message || error.message,
      );
    }
    return null;
  }
};

export default fetchData;
