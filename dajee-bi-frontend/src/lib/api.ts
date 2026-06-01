export const API_BASE_URL = "http://127.0.0.1:8000";

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
    throw new Error("Erreur récupération dashboard accueil");
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
    throw new Error("Erreur récupération classement Facebook");
  }

  return res.json();
}

export async function fetchFacebookPoliticalPosts() {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/facebook-political-posts/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Erreur récupération posts Facebook"
    );
  }

  return res.json();
}