export const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchLiveStreams() {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/live-streams/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erreur récupération lives");
  }

  return res.json();
}