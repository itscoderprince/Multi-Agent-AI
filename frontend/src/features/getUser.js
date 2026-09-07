import api from "@/utils/axios";

/**
 * Fetches the currently authenticated user from the Gateway (/me).
 * The HTTP-only session cookie is sent automatically (withCredentials: true).
 * The Gateway's checkAuth middleware validates the session against Redis.
 *
 * @returns {Promise<object|null>} The user object ({ userId, name, email, avatar }) or null if unauthenticated.
 */
export const getUser = async () => {
  try {
    const { data } = await api.get("/me");
    return data?.data || data?.user || null;
  } catch (error) {
    // 401 is expected when user has no active session or session has expired
    if (error.response?.status === 401) {
      return null;
    }
    console.error("Failed to fetch user session:", error.response?.data?.message || error.message);
    return null;
  }
};

export default getUser;