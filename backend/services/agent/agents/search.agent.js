import { SearchTool, VisualSearchTool } from "../configs/Tavily.js";

// Queries with visual or appearance intent
const VISUAL_QUERY_PATTERN =
  /\b(image|images|picture|pictures|photo|photos|pic|pics|look|looks|visual|visuals|clothing|clothes|wear|dress|dresses|outfit|outfits|wallpaper|actor|actress|star|celebrity|poster)\b/i;

/**
 * Web Search Agent Node
 * Performs real-time web retrieval via Tavily. Includes images only when visual intent is detected.
 *
 * @param {object} state - Current graph state
 * @param {string} state.prompt - Search query
 * @returns {Promise<{ searchResults: string, images: Array<string> }>}
 */
export const searchAgent = async (state) => {
  const prompt = state.prompt || "";
  const wantsImages = VISUAL_QUERY_PATTERN.test(prompt);
  const tool = wantsImages ? VisualSearchTool : SearchTool;

  try {
    const res = await tool.invoke({
      query: prompt,
    });

    const results = res?.results || [];
    const formatted = results
      .slice(0, 5)
      .map((r) => {
        const text = (r.content || "").trim();
        const snippet = text.length > 350 ? text.slice(0, 350) + "..." : text;
        return `- [${r.title}](${r.url}): ${snippet}`;
      })
      .join("\n\n");

    // Collect and sanitize candidate images
    let collectedImages = [];
    if (wantsImages) {
      const rawCandidates = [
        ...(Array.isArray(res?.images) ? res.images : []),
        ...results.flatMap((r) => (Array.isArray(r.images) ? r.images.slice(0, 3) : [])),
      ];

      const junkRegex = /(logo|icon|avatar|favicon|flag|\.svg|banner|advert|pixel|spacer)/i;
      const seen = new Set();

      for (const img of rawCandidates) {
        if (typeof img !== "string") continue;
        const clean = img.trim();
        if (!clean || seen.has(clean)) continue;
        if (!clean.startsWith("http://") && !clean.startsWith("https://")) continue;
        if (junkRegex.test(clean)) continue;

        seen.add(clean);
        collectedImages.push(clean);
        if (collectedImages.length >= 10) break;
      }
    }

    return {
      searchResults: formatted,
      images: collectedImages,
    };
  } catch (error) {
    console.error("[searchAgent]: Failed to fetch web results:", error.message);
    return {
      searchResults: "",
      images: [],
    };
  }
};

export default searchAgent;
