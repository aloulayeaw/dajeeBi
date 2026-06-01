from django.conf import settings
from googleapiclient.discovery import build


CHANNELS = [
    {
        "name": "TFM",
        "channel_id": "UC5NQ49FVRIAuWE1e16L2gkg",
    },
    {
        "name": "Seneweb TV",
        "channel_id": "UCUotxi5bHz02hVxyn6s56RQ",
    },
    {
        "name": "Walfadjri TV",
        "channel_id": "UC0iZt0lSE7O3n0Z8K6nM4Yg",
    },
    {
        "name": "2STV Sénégal",
        "channel_id": "UC0g7QbY8H9P8k4n3zR9hW2Q",
    },
    {
        "name": "iTV Sénégal",
        "channel_id": "UC9V8w6vP0mT7nK8sA3jL2Fg",
    },
    {
        "name": "Xalaat TV",
        "channel_id": "UCmM4gB2bK6n8sR5wA1vY7Hg",
    },
    {
        "name": "Dakarbuzz TV",
        "channel_id": "UCmJzAkeiT6dMvibVF8zDHjw",
    },
    {
        "name": "Sans Limites TV",
        "channel_id": "UC8xWnQy2lK7vF0mB6zH9Y1Q",
    },
]

def get_senegal_media_channels():
    youtube = get_youtube_client()

    channel_ids = ",".join(
        [channel["channel_id"] for channel in CHANNELS]
    )

    response = youtube.channels().list(
        part="snippet,statistics",
        id=channel_ids,
    ).execute()

    results = []

    for item in response.get("items", []):
        results.append({
            "id": item["id"],
            "title": item["snippet"]["title"],
            "description": item["snippet"].get("description", ""),
            "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
            "subscribers": item["statistics"].get("subscriberCount", "0"),
            "views": item["statistics"].get("viewCount", "0"),
            "videos": item["statistics"].get("videoCount", "0"),
        })

    results.sort(
        key=lambda x: int(x["subscribers"]),
        reverse=True
    )

    return results

def get_youtube_client():
    return build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)


def search_channel_by_name(name: str):
    youtube = get_youtube_client()

    response = youtube.search().list(
        part="snippet",
        q=name,
        type="channel",
        maxResults=1,
    ).execute()

    items = response.get("items", [])

    if not items:
        return None

    return items[0]["snippet"]["channelId"]


def get_channel_details(channel_id: str):
    youtube = get_youtube_client()

    response = youtube.channels().list(
        part="snippet,statistics",
        id=channel_id,
    ).execute()

    items = response.get("items", [])

    if not items:
        return None

    item = items[0]

    return {
        "id": item["id"],
        "title": item["snippet"]["title"],
        "description": item["snippet"].get("description", ""),
        "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
        "subscribers": item["statistics"].get("subscriberCount", "0"),
        "views": item["statistics"].get("viewCount", "0"),
        "videos": item["statistics"].get("videoCount", "0"),
    }


# def get_senegal_media_channels():
#     results = []

#     for name in CHANNELS_TO_SEARCH:
#         channel_id = search_channel_by_name(name)

#         if channel_id:
#             details = get_channel_details(channel_id)
#             if details:
#                 results.append(details)

#     results.sort(key=lambda x: int(x["subscribers"]), reverse=True)

#     return results