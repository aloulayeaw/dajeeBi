// export const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://backend:5500";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dajee-bi.com";

export async function fetchLiveStreams() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/live-streams/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération lives");
  }

  return res.json();
}

export async function fetchLiveReportDashboard() {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/live-report-dashboard/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erreur récupération dashboard live");
  }

  return res.json();
}

export async function fetchEndedLiveReports() {
  const res = await fetch(`${API_BASE_URL}/api/youtube/ended-live-reports/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération bilans lives terminés");
  }

  return res.json();
}

export async function fetchLiveSnapshots(liveId: string) {
  const res = await fetch(
    `${API_BASE_URL}/api/youtube/live-snapshots/${liveId}/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erreur récupération snapshots live");
  }

  return res.json();
}