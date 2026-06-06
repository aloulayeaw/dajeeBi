// export const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://backend:5500";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dajee-bi.com";

export async function fetchMediaChannels() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/media-channels/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération chaînes médias");
  }

  return res.json();
}

export async function fetchChannelAnalytics(channelId: string) {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/channel-analytics/${channelId}/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erreur récupération analytics chaîne");
  }

  return res.json();
}

export async function fetchLiveStreams() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/live-streams/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération lives");
  }

  return res.json();
}

export async function fetchYoutubeVideos(keyword = "Ousmane Sonko") {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/videos/?keyword=${encodeURIComponent(keyword)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Erreur récupération vidéos YouTube");
  }

  return res.json();
}

export async function fetchKeywordsSummary() {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/videos-keywords-summary/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erreur récupération résumé keywords");
  }

  return res.json();
}

export async function fetchInfluencers() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/influencers/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération influenceurs");
  }

  return res.json();
}

export async function fetchHomeDashboard() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/home-dashboard/`, {
    cache: "no-store",
  });

    if (!res.ok) {
      return null;
    }
    
  return res.json();
}

export async function fetchFacebookPoliticalRanking() {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/facebook-political-ranking/`,
    {
      cache: "no-store",
    }
  );

    if (!res.ok) {
      return null;
    }

  return res.json();
}

export async function fetchFacebookPoliticalPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/youtube/facebook-political-posts/`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

// export async function fetchFacebookPoliticalPosts() {
//   const res = await fetch(
//     `${API_BASE_URL}/api/youtube/facebook-political-posts/`,
//     {
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     throw new Error(
//       "Erreur récupération posts Facebook"
//     );
//   }

//   return res.json();
// }

export async function fetchXPoliticalRanking() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/x-political-ranking/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération classement X");
  }

  return res.json();
}

export async function fetchXPoliticalPosts() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/x-political-posts/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération posts X");
  }

  return res.json();
}

export async function fetchAnalysisDashboard() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/analysis-dashboard/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération analyse dashboard");
  }

  return res.json();
}

export async function fetchLiveAnalyticsReport() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/youtube/live-analytics-report/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Erreur live analytics:", res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Erreur récupération analytics live:", error);
    return null;
  }
}