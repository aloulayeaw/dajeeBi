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
                event_key,
                title,
                total_videos,
                total_views,
                total_likes,
                total_comments,
                total_channels,
                coverage_score,
                buzz_score
            FROM media_events
            ORDER BY buzz_score DESC, total_views DESC
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

        # MEDIA EVENTS
        "media_events": [
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