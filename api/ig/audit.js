// Vercel Serverless Function: GET /api/ig/audit?handle={handle}&max_posts=24

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const handle = url.searchParams.get("handle");
    const maxPosts = parseInt(url.searchParams.get("max_posts") || "24", 10);

    if (!handle) {
      return res.status(400).json({ error: "handle required" });
    }

    const MOCK_MODE = (process.env.MOCK_MODE || "false").toLowerCase() === "true";

    if (MOCK_MODE) {
      return res.status(200).json(mockPayload(handle, maxPosts));
    }

    return res.status(200).json({ profile: { handle }, posts: [] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "internal_error" });
  }
}

function mockPayload(handle, maxPosts) {
  const now = new Date();
  const posts = Array.from({ length: Math.min(maxPosts, 5) }).map((_, i) => ({
    id: `mock_${i + 1}`,
    media_type: i % 2 === 0 ? "VIDEO" : "IMAGE",
    caption: `Exemplo de post ${i + 1}`,
    timestamp: new Date(now.getTime() - i * 86400000).toISOString(),
    like_count: 5 + i,
    comment_count: i % 2,
    view_count: 100 + i * 10,
    thumbnail_url: `https://via.placeholder.com/640x640.png?text=Post+${i + 1}`,
  }));

  return {
    profile: {
      handle,
      name: "Perfil Mock",
      bio: "Bio de teste com MOCK_MODE ativo",
      followers: 123,
      following: 45,
      posts_count: posts.length,
      external_url: null,
      is_business: true,
      profile_pic_url: "https://via.placeholder.com/320.png?text=Logo",
      categories: ["Teste"],
      highlights: [{ title: "Catálogo" }, { title: "Orçamentos" }],
    },
    posts,
  };
}
