from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection

@api_view(["GET"])
def media_channels_list(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                mc.id,
                mc.name,
                mc.slug,
                mc.youtube_channel_id,
                mc.youtube_url,
                mc.logo_url,
                mc.thumbnail_url,
                mc.description,
                mc.influence_score,
                mc.growth_score,
                mc.live_score,
                mc.buzz_score,
                mc.audience_score,
                mc.regularite_score,
                cs.subscribers,
                cs.views,
                cs.videos,
                cs.collected_at
            FROM media_channels mc
            LEFT JOIN LATERAL (
                SELECT subscribers, views, videos, collected_at
                FROM channel_snapshots
                WHERE channel_id = mc.id
                ORDER BY collected_at DESC
                LIMIT 1
            ) cs ON TRUE
            WHERE mc.is_active = TRUE
            ORDER BY cs.subscribers DESC NULLS LAST;
        """)

        rows = cursor.fetchall()

    data = [
        {
            "id": str(row[0]),
            "name": row[1],
            "slug": row[2],
            "youtube_channel_id": row[3],
            "youtube_url": row[4],
            "logo_url": row[5],
            "thumbnail_url": row[6],
            "description": row[7],
            "influence_score": float(row[8] or 0),
            "growth_score": float(row[9] or 0),
            "live_score": float(row[10] or 0),
            "buzz_score": float(row[11] or 0),
            "audience_score": float(row[12] or 0),
            "regularite_score": float(row[13] or 0),
            "subscribers": int(row[14] or 0),
            "views": int(row[15] or 0),
            "videos": int(row[16] or 0),
            "collected_at": row[17],
        }
        for row in rows
    ]

    return Response(data)


@api_view(["GET"])
def live_streams_list(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                ls.id,
                mc.name,
                mc.logo_url,
                ls.title,
                ls.thumbnail_url,
                ls.live_url,
                ls.concurrent_viewers,
                ls.likes,
                ls.comments,
                ls.chat_activity_score,
                ls.messages_per_minute,
                ls.status,
                ls.started_at
            FROM live_streams ls
            JOIN media_channels mc
                ON mc.id = ls.channel_id
            WHERE ls.status = 'live'
            ORDER BY ls.concurrent_viewers DESC;
        """)

        rows = cursor.fetchall()

    data = [
        {
            "id": str(row[0]),
            "channel_name": row[1],
            "channel_logo": row[2],
            "title": row[3],
            "thumbnail": row[4],
            "live_url": row[5],
            "viewers": int(row[6] or 0),
            "likes": int(row[7] or 0),
            "comments": int(row[8] or 0),
            "chat_activity_score": float(row[9] or 0),
            "messages_per_minute": float(row[10] or 0),
            "status": row[11],
            "started_at": row[12],
        }
        for row in rows
    ]

    return Response(data)


@api_view(["GET"])
def channel_analytics(request, channel_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                collected_at,
                subscribers,
                views,
                videos
            FROM channel_snapshots
            WHERE channel_id = %s
            ORDER BY collected_at ASC;
        """, [channel_id])

        rows = cursor.fetchall()

    data = [
        {
            "date": row[0],
            "subscribers": int(row[1] or 0),
            "views": int(row[2] or 0),
            "videos": int(row[3] or 0),
        }
        for row in rows
    ]

    return Response(data)


@api_view(["GET"])
def buzz_alerts(request):

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                id,
                channel_id,
                channel_name,
                alert_type,
                title,
                message,
                severity,
                score,
                created_at
            FROM buzz_alerts
            ORDER BY created_at DESC
            LIMIT 50;
        """)

        rows = cursor.fetchall()

    data = [
        {
            "id": row[0],
            "channel_id": str(row[1]) if row[1] else None,
            "channel_name": row[2],
            "alert_type": row[3],
            "title": row[4],
            "message": row[5],
            "severity": row[6],
            "score": float(row[7] or 0),
            "created_at": row[8],
        }
        for row in rows
    ]

    return Response(data)

@api_view(["GET"])
def youtube_videos_list(request):
    keyword = request.GET.get("keyword", "Ousmane Sonko")
    limit = int(request.GET.get("limit", 30))

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                id,
                channel_id,
                channel_name,
                youtube_video_id,
                title,
                description,
                thumbnail_url,
                video_url,
                published_at,
                views,
                likes,
                comments,
                keyword
            FROM youtube_videos
            WHERE keyword ILIKE %s
              AND published_at >= NOW() - INTERVAL '7 days'
            ORDER BY views DESC
            LIMIT %s;
        """, [f"%{keyword}%", limit])

        rows = cursor.fetchall()

    data = [
        {
            "id": str(row[0]),
            "channel_id": str(row[1]) if row[1] else None,
            "channel_name": row[2],
            "youtube_video_id": row[3],
            "title": row[4],
            "description": row[5],
            "thumbnail_url": row[6],
            "video_url": row[7],
            "published_at": row[8],
            "views": int(row[9] or 0),
            "likes": int(row[10] or 0),
            "comments": int(row[11] or 0),
            "keyword": row[12],
        }
        for row in rows
    ]

    return Response(data)


@api_view(["GET"])
def videos_keywords_summary(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                keyword,
                COUNT(*) AS videos,
                COALESCE(SUM(views), 0) AS views,
                COALESCE(SUM(likes), 0) AS likes,
                COALESCE(SUM(comments), 0) AS comments
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
            GROUP BY keyword
            ORDER BY views DESC;
        """)

        rows = cursor.fetchall()

    data = [
        {
            "keyword": row[0],
            "videos": int(row[1] or 0),
            "views": int(row[2] or 0),
            "likes": int(row[3] or 0),
            "comments": int(row[4] or 0),
            "engagement": int(row[3] or 0) + int(row[4] or 0),
        }
        for row in rows
    ]

    return Response(data)

@api_view(["GET"])
def influencers_list(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                id,
                full_name,
                slug,
                category,
                role,
                political_party,
                country,
                photo_url,
                facebook_url,
                instagram_url,
                x_url,
                youtube_url,

                facebook_followers,
                instagram_followers,
                x_followers,
                youtube_subscribers,

                facebook_score,
                instagram_score,
                x_score,
                youtube_score,

                influence_score,
                buzz_score,
                engagement_score,
                live_score,
                global_score
            FROM influencers
            WHERE is_active = TRUE
            ORDER BY global_score DESC, full_name ASC;
        """)

        rows = cursor.fetchall()

    data = [
        {
            "id": str(row[0]),
            "full_name": row[1],
            "slug": row[2],
            "category": row[3],
            "role": row[4],
            "political_party": row[5],
            "country": row[6],
            "photo_url": row[7],
            "facebook_url": row[8],
            "instagram_url": row[9],
            "x_url": row[10],
            "youtube_url": row[11],

            "facebook_followers": int(row[12] or 0),
            "instagram_followers": int(row[13] or 0),
            "x_followers": int(row[14] or 0),
            "youtube_subscribers": int(row[15] or 0),

            "facebook_score": float(row[16] or 0),
            "instagram_score": float(row[17] or 0),
            "x_score": float(row[18] or 0),
            "youtube_score": float(row[19] or 0),

            "influence_score": float(row[20] or 0),
            "buzz_score": float(row[21] or 0),
            "engagement_score": float(row[22] or 0),
            "live_score": float(row[23] or 0),
            "global_score": float(row[24] or 0),
        }
        for row in rows
    ]

    return Response(data)

@api_view(["GET"])
def home_dashboard(request):

    with connection.cursor() as cursor:

        # GLOBAL STATS
        cursor.execute("""
            SELECT
                COALESCE(SUM(views), 0),
                COUNT(*),
                COUNT(DISTINCT channel_id)
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days';
        """)

        views, videos, channels = cursor.fetchone()

        # INFLUENCERS
        cursor.execute("""
            SELECT COUNT(*)
            FROM influencers
            WHERE is_active = TRUE;
        """)

        influencers = cursor.fetchone()[0]

        # WEEKLY EVENT
        cursor.execute("""
            SELECT
                keyword,
                COUNT(*) AS videos,
                COALESCE(SUM(views), 0) AS views,
                COALESCE(SUM(likes), 0) AS likes,
                COALESCE(SUM(comments), 0) AS comments,
                COUNT(DISTINCT channel_id) AS channels
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
            GROUP BY keyword
            ORDER BY views DESC
            LIMIT 1;
        """)

        event_row = cursor.fetchone()

        # TRENDS
        cursor.execute("""
            SELECT
                keyword,
                COUNT(*) AS videos,
                COALESCE(SUM(views), 0) AS views
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
            GROUP BY keyword
            ORDER BY views DESC
            LIMIT 6;
        """)

        trend_rows = cursor.fetchall()

        # TOP VIDEOS
        cursor.execute("""
            SELECT
                title,
                channel_name,
                thumbnail_url,
                video_url,
                views,
                likes,
                comments,
                published_at
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
            ORDER BY views DESC
            LIMIT 6;
        """)

        video_rows = cursor.fetchall()

        # TOP INFLUENCERS
        cursor.execute("""
            SELECT
                keyword AS full_name,
                COUNT(*) AS videos,
                COALESCE(SUM(views), 0) AS views,
                COALESCE(SUM(likes), 0) AS likes,
                COALESCE(SUM(comments), 0) AS comments
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
            AND keyword IS NOT NULL
            GROUP BY keyword
            ORDER BY views DESC
            LIMIT 5;
        """)

        influencer_rows = cursor.fetchall()

        # LIVE STREAMS
        cursor.execute("""
            SELECT
                ls.title,
                mc.name,
                ls.thumbnail_url,
                ls.live_url,
                ls.concurrent_viewers,
                ls.likes,
                ls.comments
            FROM live_streams ls
            JOIN media_channels mc
                ON mc.id = ls.channel_id
            WHERE ls.status = 'live'
              AND ls.last_seen_at >= NOW() - INTERVAL '45 minutes'
            ORDER BY ls.concurrent_viewers DESC
            LIMIT 6;
        """)

        live_rows = cursor.fetchall()

        # MEDIA EVENTS
        cursor.execute("""
                SELECT
                    UPPER(TRIM(channel_name)) AS media_name,
                    COUNT(*) AS total_videos,
                    COALESCE(SUM(views), 0) AS total_views,
                    COALESCE(SUM(likes), 0) AS total_likes,
                    COALESCE(SUM(comments), 0) AS total_comments
                FROM youtube_videos
                WHERE published_at >= NOW() - INTERVAL '7 days'
                AND channel_name IS NOT NULL
                GROUP BY UPPER(TRIM(channel_name))
                ORDER BY total_views DESC
                LIMIT 5;
        """)

        media_event_rows = cursor.fetchall()

    weekly_event = None

    if event_row:

        (
            keyword,
            event_videos,
            event_views,
            event_likes,
            event_comments,
            event_channels,
        ) = event_row

        coverage_score = 0

        if channels:
            coverage_score = round(
                (event_channels / channels) * 100,
                1
            )

        weekly_event = {
            "title": keyword,
            "views": int(event_views or 0),
            "videos": int(event_videos or 0),
            "channels": int(event_channels or 0),
            "likes": int(event_likes or 0),
            "comments": int(event_comments or 0),
            "coverage_score": coverage_score,
        }

    data = {

        # STATS
        "stats": {
            "views": int(views or 0),
            "videos": int(videos or 0),
            "channels": int(channels or 0),
            "influencers": int(influencers or 0),
        },

        # WEEKLY EVENT
        "weekly_event": weekly_event,

        # TRENDS
        "trends": [
            {
                "keyword": row[0],
                "videos": int(row[1] or 0),
                "views": int(row[2] or 0),
            }
            for row in trend_rows
        ],

        # TOP VIDEOS
        "top_videos": [
            {
                "title": row[0],
                "channel_name": row[1],
                "thumbnail_url": row[2],
                "video_url": row[3],
                "views": int(row[4] or 0),
                "likes": int(row[5] or 0),
                "comments": int(row[6] or 0),
                "published_at": row[7],
            }
            for row in video_rows
        ],

        # TOP INFLUENCERS
        "top_influencers": [
            {
                "full_name": row[0],
                "role": "Visibilité média",
                "photo_url": "",
                "global_score": round(
                    min((int(row[2] or 0) / 5_800_000) * 100, 100),
                    1
                ),
                "influence_score": round(
                    min((int(row[2] or 0) / 5_800_000) * 100, 100),
                    1
                ),
                "buzz_score": round(
                    min((int(row[3] or 0) / 200_000) * 100, 100),
                    1
                ),
            }
            for row in influencer_rows
        ],

        # LIVE STREAMS
        "live_streams": [
            {
                "title": row[0],
                "channel_name": row[1],
                "thumbnail_url": row[2],
                "live_url": row[3],
                "viewers": int(row[4] or 0),
                "likes": int(row[5] or 0),
                "comments": int(row[6] or 0),
            }
            for row in live_rows
        ],

        # TOP MEDIA CHANNELS
        "media_events": [
            {
                "title": row[0],
                "total_videos": int(row[1] or 0),
                "total_views": int(row[2] or 0),
                "total_likes": int(row[3] or 0),
                "total_comments": int(row[4] or 0),
            }
            for row in media_event_rows
        ],

        # AI ANALYSIS
        "ai_analysis": {
            "title": "Analyse automatique",
            "text": (
                f"{weekly_event['title']} domine actuellement les tendances "
                f"avec {weekly_event['videos']} vidéos et "
                f"{weekly_event['channels']} médias suivis."
                if weekly_event
                else "Aucune tendance dominante détectée."
            ),
        },
    }

    return Response(data)



@api_view(["GET"])
def media_events_list(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                event_key,
                title,
                total_videos,
                total_views,
                total_likes,
                total_comments,
                total_channels,
                coverage_score,
                buzz_score,
                updated_at
            FROM media_events
            ORDER BY buzz_score DESC, total_views DESC
            LIMIT 5;
        """)

        rows = cursor.fetchall()

    data = [
        {
            "event_key": row[0],
            "title": row[1],
            "total_videos": int(row[2] or 0),
            "total_views": int(row[3] or 0),
            "total_likes": int(row[4] or 0),
            "total_comments": int(row[5] or 0),
            "total_channels": int(row[6] or 0),
            "coverage_score": float(row[7] or 0),
            "buzz_score": float(row[8] or 0),
            "updated_at": row[9],
        }
        for row in rows
    ]

    return Response(data)

@api_view(["GET"])
def facebook_political_ranking(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                leader_name,
                page_name,
                page_url,
                profile_picture,
                followers_count,
                likes_count,
                influence_score,
                updated_at
            FROM facebook_political_pages
            ORDER BY influence_score DESC
            LIMIT 10;
        """)
        rows = cursor.fetchall()

    data = [
        {
            "leader_name": row[0],
            "page_name": row[1],
            "page_url": row[2],
            "profile_picture": row[3],
            "followers_count": int(row[4] or 0),
            "likes_count": int(row[5] or 0),
            "influence_score": float(row[6] or 0),
            "updated_at": row[7],
        }
        for row in rows
    ]

    return Response(data)

@api_view(["GET"])
def facebook_political_posts(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                leader_name,
                post_text,
                post_url,
                thumbnail_url,
                reactions_count,
                comments_count,
                shares_count,
                viral_score,
                published_at
            FROM facebook_political_posts
            ORDER BY viral_score DESC, collected_at DESC
            LIMIT 30;
        """)

        rows = cursor.fetchall()

    return Response([
        {
            "leader_name": row[0],
            "post_text": row[1],
            "post_url": row[2],
            "thumbnail_url": row[3],
            "reactions_count": int(row[4] or 0),
            "comments_count": int(row[5] or 0),
            "shares_count": int(row[6] or 0),
            "viral_score": float(row[7] or 0),
            "published_at": row[8],
        }
        for row in rows
    ])



@api_view(["GET"])
def x_political_ranking(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                leader_name,
                username,
                profile_url,
                profile_picture,
                followers_count,
                following_count,
                tweets_count,
                verified,
                bio,
                x_score,
                updated_at
            FROM x_political_profiles
            ORDER BY x_score DESC, followers_count DESC
            LIMIT 20;
        """)
        rows = cursor.fetchall()

    return Response([
        {
            "leader_name": row[0],
            "username": row[1],
            "profile_url": row[2],
            "profile_picture": row[3],
            "followers_count": int(row[4] or 0),
            "following_count": int(row[5] or 0),
            "tweets_count": int(row[6] or 0),
            "verified": bool(row[7]),
            "bio": row[8],
            "x_score": float(row[9] or 0),
            "updated_at": row[10],
        }
        for row in rows
    ])


@api_view(["GET"])
def x_political_posts(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                leader_name,
                username,
                tweet_url,
                tweet_text,
                thumbnail_url,
                likes_count,
                replies_count,
                retweets_count,
                quotes_count,
                views_count,
                x_impact_score,
                published_at
            FROM x_political_posts
            ORDER BY x_impact_score DESC, collected_at DESC
            LIMIT 30;
        """)
        rows = cursor.fetchall()

    return Response([
        {
            "leader_name": row[0],
            "username": row[1],
            "tweet_url": row[2],
            "tweet_text": row[3],
            "thumbnail_url": row[4],
            "likes_count": int(row[5] or 0),
            "replies_count": int(row[6] or 0),
            "retweets_count": int(row[7] or 0),
            "quotes_count": int(row[8] or 0),
            "views_count": int(row[9] or 0),
            "x_impact_score": float(row[10] or 0),
            "published_at": row[11],
        }
        for row in rows
    ])

def save_analysis_history(cursor, leaders):
    for leader in leaders:
        leader_name = leader["leader_name"]

        rows = [
            (
                "Facebook",
                leader.get("facebook_score", 0),
                {
                    "reactions": leader.get("facebook_reactions", 0),
                    "comments": leader.get("facebook_comments", 0),
                    "shares": leader.get("facebook_shares", 0),
                },
            ),
            (
                "X/Twitter",
                leader.get("x_score", 0),
                {
                    "followers": leader.get("followers_count", 0),
                },
            ),
            (
                "YouTube",
                leader.get("youtube_score", 0),
                {
                    "views": leader.get("youtube_views", 0),
                    "videos": leader.get("youtube_videos", 0),
                },
            ),
            (
                "Global",
                leader.get("global_score", 0),
                {},
            ),
        ]

        for platform, score, details in rows:
            cursor.execute(
                """
                INSERT INTO analysis_score_history (
                    leader_name,
                    platform,
                    score,
                    details,
                    collected_at
                )
                VALUES (%s, %s, %s, %s::jsonb, NOW());
                """,
                [
                    leader_name,
                    platform,
                    float(score or 0),
                    json.dumps(details),
                ],
            )


@api_view(["GET"])
def analysis_dashboard(request):
    with connection.cursor() as cursor:

        # FACEBOOK
        cursor.execute("""
            SELECT
                leader_name,
                COALESCE(SUM(reactions_count), 0) AS reactions,
                COALESCE(SUM(comments_count), 0) AS comments,
                COALESCE(SUM(shares_count), 0) AS shares,
                COALESCE(SUM(viral_score), 0) AS facebook_score
            FROM facebook_political_posts
            GROUP BY leader_name;
        """)
        facebook_rows = cursor.fetchall()

        facebook_map = {
            row[0]: {
                "reactions": int(row[1] or 0),
                "comments": int(row[2] or 0),
                "shares": int(row[3] or 0),
                "facebook_score": float(row[4] or 0),
            }
            for row in facebook_rows
        }

        # X / TWITTER
        cursor.execute("""
            SELECT
                leader_name,
                username,
                profile_picture,
                followers_count,
                x_score
            FROM x_political_profiles;
        """)
        x_rows = cursor.fetchall()

        x_map = {
            row[0]: {
                "username": row[1],
                "profile_picture": row[2],
                "followers_count": int(row[3] or 0),
                "x_score": float(row[4] or 0),
            }
            for row in x_rows
        }

        # YOUTUBE PAR MOT-CLÉ / LEADER
        cursor.execute("""
            SELECT
                keyword,
                COUNT(*) AS videos,
                COALESCE(SUM(views), 0) AS views,
                COALESCE(SUM(likes), 0) AS likes,
                COALESCE(SUM(comments), 0) AS comments
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
              AND keyword IS NOT NULL
            GROUP BY keyword;
        """)
        youtube_rows = cursor.fetchall()

        youtube_map = {
            row[0]: {
                "youtube_videos": int(row[1] or 0),
                "youtube_views": int(row[2] or 0),
                "youtube_likes": int(row[3] or 0),
                "youtube_comments": int(row[4] or 0),
            }
            for row in youtube_rows
        }

        # MÉDIAS LES PLUS INFLUENTS
        cursor.execute("""
            SELECT
                MIN(channel_name) AS media_name,
                COUNT(*) AS videos,
                COALESCE(SUM(views), 0) AS views,
                COALESCE(SUM(likes), 0) AS likes,
                COALESCE(SUM(comments), 0) AS comments
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
              AND channel_name IS NOT NULL
            GROUP BY LOWER(TRIM(channel_name))
            ORDER BY views DESC
            LIMIT 10;
        """)
        media_rows = cursor.fetchall()

        # SUJETS QUI MONTENT
        cursor.execute("""
            SELECT
                keyword,
                COUNT(*) AS videos,
                COALESCE(SUM(views), 0) AS views,
                COALESCE(SUM(likes + comments), 0) AS engagement
            FROM youtube_videos
            WHERE published_at >= NOW() - INTERVAL '7 days'
              AND keyword IS NOT NULL
            GROUP BY keyword
            ORDER BY views DESC
            LIMIT 10;
        """)
        trend_rows = cursor.fetchall()

    all_leaders = set(facebook_map.keys()) | set(x_map.keys()) | set(youtube_map.keys())

    leaders = []

    for leader in all_leaders:
        fb = facebook_map.get(leader, {})
        x = x_map.get(leader, {})
        yt = youtube_map.get(leader, {})

        facebook_score = float(fb.get("facebook_score", 0))
        x_score = float(x.get("x_score", 0))
        youtube_score = (
            float(yt.get("youtube_views", 0)) * 0.02
            + float(yt.get("youtube_likes", 0)) * 0.5
            + float(yt.get("youtube_comments", 0)) * 1
        )

        global_score = round(
            facebook_score * 1.15
            + x_score * 1.25
            + youtube_score,
            2
        )

        leaders.append({
            "leader_name": leader,
            "username": x.get("username", ""),
            "profile_picture": x.get("profile_picture", ""),
            "followers_count": x.get("followers_count", 0),

            "facebook_score": round(facebook_score, 2),
            "x_score": round(x_score, 2),
            "youtube_score": round(youtube_score, 2),
            "global_score": global_score,

            "facebook_reactions": fb.get("reactions", 0),
            "facebook_comments": fb.get("comments", 0),
            "facebook_shares": fb.get("shares", 0),

            "youtube_views": yt.get("youtube_views", 0),
            "youtube_videos": yt.get("youtube_videos", 0),
        })

    leaders = sorted(leaders, key=lambda x: x["global_score"], reverse=True)

    total_global = sum(item["global_score"] for item in leaders)
    total_facebook = sum(item["facebook_score"] for item in leaders)
    total_x = sum(item["x_score"] for item in leaders)
    total_youtube = sum(item["youtube_score"] for item in leaders)

    top_leader = leaders[0] if leaders else None

    predictions = []
    alerts = []

    if top_leader:
        predictions.append({
            "title": top_leader["leader_name"],
            "text": "Peut conserver sa domination numérique dans les prochaines 24h si le rythme d’engagement reste stable.",
            "probability": 84,
            "estimated_impact": round(top_leader["global_score"] * 1.18),
        })

    for leader in leaders[:5]:
        if leader["facebook_score"] > leader["x_score"]:
            alerts.append({
                "type": "Facebook",
                "message": f"{leader['leader_name']} domine surtout par l’engagement Facebook.",
                "value": round(leader["facebook_score"]),
            })
        else:
            alerts.append({
                "type": "X",
                "message": f"{leader['leader_name']} accélère davantage sur X/Twitter.",
                "value": round(leader["x_score"]),
            })

    return Response({
        "kpis": {
            "global_score": round(total_global),
            "facebook_total": round(total_facebook),
            "x_total": round(total_x),
            "youtube_total": round(total_youtube),
            "leaders_count": len(leaders),
        },

        "top_leader": top_leader,

        "leaders": leaders[:10],

        "platform_distribution": [
            {"platform": "Facebook", "value": round(total_facebook)},
            {"platform": "X/Twitter", "value": round(total_x)},
            {"platform": "YouTube", "value": round(total_youtube)},
        ],

        "media_ranking": [
            {
                "media_name": row[0],
                "videos": int(row[1] or 0),
                "views": int(row[2] or 0),
                "likes": int(row[3] or 0),
                "comments": int(row[4] or 0),
            }
            for row in media_rows
        ],

        "trending_topics": [
            {
                "keyword": row[0],
                "videos": int(row[1] or 0),
                "views": int(row[2] or 0),
                "engagement": int(row[3] or 0),
            }
            for row in trend_rows
        ],

        "predictions": predictions,
        "alerts": alerts,

        "ai_summary": (
            f"{top_leader['leader_name']} domine actuellement l’écosystème numérique "
            f"avec un score global de {round(top_leader['global_score'])}. "
            f"L’analyse combine Facebook, X/Twitter et YouTube pour mesurer l’impact réel."
            if top_leader
            else "Aucune donnée suffisante pour générer une analyse."
        ),
    })


@api_view(["GET"])
def live_analytics_report(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                COALESCE(mc.name, ls.channel_name, 'Chaîne inconnue') AS channel_name,
                COUNT(DISTINCT ls.id) AS total_lives,
                COALESCE(MAX(ls.concurrent_viewers), 0) AS peak_viewers,
                COALESCE(AVG(ls.concurrent_viewers), 0) AS avg_viewers,
                COALESCE(MAX(ls.likes), 0) AS likes,
                COALESCE(MAX(ls.comments), 0) AS comments,
                COALESCE(MAX(ls.chat_activity_score), 0) AS chat_score
            FROM live_streams ls
            LEFT JOIN media_channels mc ON mc.id = ls.channel_id
            WHERE ls.last_seen_at >= NOW() - INTERVAL '24 hours'
            GROUP BY COALESCE(mc.name, ls.channel_name, 'Chaîne inconnue')
            ORDER BY peak_viewers DESC;
        """)
        channels = cursor.fetchall()

        cursor.execute("""
            SELECT
                COALESCE(mc.name, ls.channel_name, 'Chaîne inconnue') AS channel_name,
                TO_CHAR(s.collected_at, 'HH24:MI') AS time,
                COALESCE(s.concurrent_viewers, 0) AS viewers
            FROM live_snapshots s
            JOIN live_streams ls ON ls.id = s.live_id
            LEFT JOIN media_channels mc ON mc.id = ls.channel_id
            WHERE s.collected_at >= NOW() - INTERVAL '24 hours'
            ORDER BY s.collected_at ASC;
        """)
        evolution_rows = cursor.fetchall()

    return Response({
        "channels": [
            {
                "channel_name": row[0],
                "total_lives": int(row[1] or 0),
                "peak_viewers": int(row[2] or 0),
                "avg_viewers": int(row[3] or 0),
                "likes": int(row[4] or 0),
                "comments": int(row[5] or 0),
                "chat_score": float(row[6] or 0),
            }
            for row in channels
        ],
        "evolution": [
            {
                "channel_name": row[0],
                "time": row[1],
                "viewers": int(row[2] or 0),
            }
            for row in evolution_rows
        ],
    })

from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response


def row_datetime(value):
    return value.isoformat() if value else None


@api_view(["GET"])
def live_report_dashboard(request):
    """
    Dashboard live complet :
    - active_lives : lives encore actifs
    - active_snapshots : courbes des lives actifs
    - ended_reports : bilans des lives terminés sur 47h
    - channel_ranking : classement chaînes sur 47h
    - events : pics détectés sur 47h
    """

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                ls.id,
                ls.youtube_video_id,
                COALESCE(ls.channel_name, mc.name, 'Chaîne inconnue') AS channel_name,
                ls.title,
                ls.live_url,
                ls.thumbnail_url,
                ls.status,
                COALESCE(ls.concurrent_viewers, 0),
                COALESCE(ls.peak_viewers, 0),
                COALESCE(ls.avg_viewers, 0),
                COALESCE(ls.likes, 0),
                COALESCE(ls.comments, 0),
                COALESCE(ls.snapshots_count, 0),
                COALESCE(ls.duration_minutes, 0),
                ls.started_at,
                ls.ended_at,
                ls.last_seen_at
            FROM live_streams ls
            LEFT JOIN media_channels mc ON mc.id = ls.channel_id
            WHERE ls.status = 'live'
              AND ls.last_seen_at >= NOW() - INTERVAL '47 hours'
            ORDER BY ls.peak_viewers DESC NULLS LAST;
        """)
        active_rows = cursor.fetchall()

        cursor.execute("""
            SELECT
                s.live_id,
                COALESCE(ls.channel_name, mc.name, 'Chaîne inconnue') AS channel_name,
                TO_CHAR(s.collected_at, 'HH24:MI') AS time,
                COALESCE(s.concurrent_viewers, 0) AS viewers,
                COALESCE(s.likes, 0) AS likes,
                COALESCE(s.comments, 0) AS comments,
                COALESCE(s.chat_activity_score, 0) AS chat_activity_score,
                COALESCE(s.messages_per_minute, 0) AS messages_per_minute,
                s.collected_at
            FROM live_snapshots s
            JOIN live_streams ls ON ls.id = s.live_id
            LEFT JOIN media_channels mc ON mc.id = ls.channel_id
            WHERE ls.status = 'live'
              AND s.collected_at >= NOW() - INTERVAL '47 hours'
            ORDER BY s.collected_at ASC;
        """)
        active_snapshot_rows = cursor.fetchall()

        cursor.execute("""
            SELECT
                lr.live_id,
                lr.youtube_video_id,
                COALESCE(lr.channel_name, 'Chaîne inconnue') AS channel_name,
                lr.title,
                lr.live_url,
                lr.thumbnail_url,
                lr.status,
                COALESCE(lr.peak_viewers, 0),
                COALESCE(lr.avg_viewers, 0),
                COALESCE(lr.min_viewers, 0),
                COALESCE(lr.last_viewers, 0),
                COALESCE(lr.total_likes, 0),
                COALESCE(lr.total_comments, 0),
                COALESCE(lr.chat_activity_score, 0),
                COALESCE(lr.avg_messages_per_minute, 0),
                COALESCE(lr.snapshots_count, 0),
                COALESCE(lr.duration_minutes, 0),
                lr.started_at,
                lr.ended_at,
                lr.first_seen_at,
                lr.last_seen_at
            FROM live_reports lr
            WHERE lr.status IN ('ended', 'archived')
              AND COALESCE(lr.ended_at, lr.last_seen_at, lr.updated_at) >= NOW() - INTERVAL '47 hours'
            ORDER BY lr.peak_viewers DESC, lr.last_seen_at DESC;
        """)
        ended_report_rows = cursor.fetchall()

        cursor.execute("""
            SELECT
                COALESCE(lcdr.channel_name, 'Chaîne inconnue') AS channel_name,
                COALESCE(SUM(lcdr.total_lives), 0) AS total_lives,
                COALESCE(MAX(lcdr.peak_viewers), 0) AS peak_viewers,
                COALESCE(AVG(lcdr.avg_viewers), 0) AS avg_viewers,
                COALESCE(MAX(lcdr.total_likes), 0) AS total_likes,
                COALESCE(MAX(lcdr.total_comments), 0) AS total_comments,
                COALESCE(MAX(lcdr.engagement_score), 0) AS engagement_score,
                COALESCE(MAX(lcdr.live_score), 0) AS live_score
            FROM live_channel_daily_reports lcdr
            WHERE lcdr.report_date >= CURRENT_DATE - INTERVAL '2 days'
            GROUP BY lcdr.channel_name
            ORDER BY live_score DESC, peak_viewers DESC;
        """)
        channel_rows = cursor.fetchall()

        cursor.execute("""
            SELECT
                le.live_id,
                COALESCE(ls.channel_name, 'Chaîne inconnue') AS channel_name,
                le.event_type,
                le.event_title,
                le.event_description,
                COALESCE(le.value, 0),
                COALESCE(le.previous_value, 0),
                COALESCE(le.growth_percent, 0),
                le.detected_at
            FROM live_events le
            LEFT JOIN live_streams ls ON ls.id = le.live_id
            WHERE le.detected_at >= NOW() - INTERVAL '47 hours'
            ORDER BY le.detected_at DESC
            LIMIT 50;
        """)
        event_rows = cursor.fetchall()

    return Response({
        "active_lives": [
            {
                "live_id": str(row[0]),
                "youtube_video_id": row[1],
                "channel_name": row[2],
                "title": row[3],
                "live_url": row[4],
                "thumbnail_url": row[5],
                "status": row[6],
                "current_viewers": int(row[7] or 0),
                "peak_viewers": int(row[8] or 0),
                "avg_viewers": int(row[9] or 0),
                "likes": int(row[10] or 0),
                "comments": int(row[11] or 0),
                "snapshots_count": int(row[12] or 0),
                "duration_minutes": int(row[13] or 0),
                "started_at": row_datetime(row[14]),
                "ended_at": row_datetime(row[15]),
                "last_seen_at": row_datetime(row[16]),
            }
            for row in active_rows
        ],

        "active_snapshots": [
            {
                "live_id": str(row[0]),
                "channel_name": row[1],
                "time": row[2],
                "viewers": int(row[3] or 0),
                "likes": int(row[4] or 0),
                "comments": int(row[5] or 0),
                "chat_activity_score": float(row[6] or 0),
                "messages_per_minute": float(row[7] or 0),
                "collected_at": row_datetime(row[8]),
            }
            for row in active_snapshot_rows
        ],

        "ended_reports": [
            {
                "live_id": str(row[0]),
                "youtube_video_id": row[1],
                "channel_name": row[2],
                "title": row[3],
                "live_url": row[4],
                "thumbnail_url": row[5],
                "status": row[6],
                "peak_viewers": int(row[7] or 0),
                "avg_viewers": int(row[8] or 0),
                "min_viewers": int(row[9] or 0),
                "last_viewers": int(row[10] or 0),
                "total_likes": int(row[11] or 0),
                "total_comments": int(row[12] or 0),
                "chat_activity_score": float(row[13] or 0),
                "avg_messages_per_minute": float(row[14] or 0),
                "snapshots_count": int(row[15] or 0),
                "duration_minutes": int(row[16] or 0),
                "started_at": row_datetime(row[17]),
                "ended_at": row_datetime(row[18]),
                "first_seen_at": row_datetime(row[19]),
                "last_seen_at": row_datetime(row[20]),
            }
            for row in ended_report_rows
        ],

        "channel_ranking": [
            {
                "channel_name": row[0],
                "total_lives": int(row[1] or 0),
                "peak_viewers": int(row[2] or 0),
                "avg_viewers": int(row[3] or 0),
                "total_likes": int(row[4] or 0),
                "total_comments": int(row[5] or 0),
                "engagement_score": float(row[6] or 0),
                "live_score": float(row[7] or 0),
            }
            for row in channel_rows
        ],

        "events": [
            {
                "live_id": str(row[0]),
                "channel_name": row[1],
                "event_type": row[2],
                "event_title": row[3],
                "event_description": row[4],
                "value": int(row[5] or 0),
                "previous_value": int(row[6] or 0),
                "growth_percent": float(row[7] or 0),
                "detected_at": row_datetime(row[8]),
            }
            for row in event_rows
        ],
    })


@api_view(["GET"])
def live_snapshots_by_live(request, live_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                s.live_id,
                COALESCE(ls.channel_name, mc.name, 'Chaîne inconnue') AS channel_name,
                TO_CHAR(s.collected_at, 'HH24:MI') AS time,
                COALESCE(s.concurrent_viewers, 0),
                COALESCE(s.likes, 0),
                COALESCE(s.comments, 0),
                COALESCE(s.chat_activity_score, 0),
                COALESCE(s.messages_per_minute, 0),
                s.collected_at
            FROM live_snapshots s
            JOIN live_streams ls ON ls.id = s.live_id
            LEFT JOIN media_channels mc ON mc.id = ls.channel_id
            WHERE s.live_id = %s
            ORDER BY s.collected_at ASC;
        """, [live_id])

        rows = cursor.fetchall()

    return Response([
        {
            "live_id": str(row[0]),
            "channel_name": row[1],
            "time": row[2],
            "viewers": int(row[3] or 0),
            "likes": int(row[4] or 0),
            "comments": int(row[5] or 0),
            "chat_activity_score": float(row[6] or 0),
            "messages_per_minute": float(row[7] or 0),
            "collected_at": row_datetime(row[8]),
        }
        for row in rows
    ])


@api_view(["GET"])
def ended_live_reports(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                lr.live_id,
                lr.youtube_video_id,
                COALESCE(lr.channel_name, 'Chaîne inconnue') AS channel_name,
                lr.title,
                lr.live_url,
                lr.thumbnail_url,
                lr.status,
                COALESCE(lr.peak_viewers, 0),
                COALESCE(lr.avg_viewers, 0),
                COALESCE(lr.total_likes, 0),
                COALESCE(lr.total_comments, 0),
                COALESCE(lr.snapshots_count, 0),
                COALESCE(lr.duration_minutes, 0),
                lr.started_at,
                lr.ended_at,
                lr.first_seen_at,
                lr.last_seen_at
            FROM live_reports lr
            WHERE lr.status IN ('ended', 'archived')
              AND COALESCE(lr.ended_at, lr.last_seen_at, lr.updated_at) >= NOW() - INTERVAL '47 hours'
            ORDER BY lr.peak_viewers DESC, lr.last_seen_at DESC;
        """)
        rows = cursor.fetchall()

    return Response([
        {
            "live_id": str(row[0]),
            "youtube_video_id": row[1],
            "channel_name": row[2],
            "title": row[3],
            "live_url": row[4],
            "thumbnail_url": row[5],
            "status": row[6],
            "peak_viewers": int(row[7] or 0),
            "avg_viewers": int(row[8] or 0),
            "total_likes": int(row[9] or 0),
            "total_comments": int(row[10] or 0),
            "snapshots_count": int(row[11] or 0),
            "duration_minutes": int(row[12] or 0),
            "started_at": row_datetime(row[13]),
            "ended_at": row_datetime(row[14]),
            "first_seen_at": row_datetime(row[15]),
            "last_seen_at": row_datetime(row[16]),
        }
        for row in rows
    ])