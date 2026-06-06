from django.urls import path
from .views import *

urlpatterns = [
    path("media-channels/", media_channels_list),
    path("live-streams/", live_streams_list),
    path("channel-analytics/<uuid:channel_id>/",channel_analytics),
    path("buzz-alerts/", buzz_alerts),
    path("videos/", youtube_videos_list),
    path("videos-keywords-summary/", videos_keywords_summary),
    path("influencers/", influencers_list),
    path("home-dashboard/", home_dashboard),
    path("media-events/", media_events_list),
    path("facebook-political-ranking/", facebook_political_ranking),
    path("facebook-political-posts/", facebook_political_posts),
    path("x-political-ranking/", x_political_ranking),
    path("x-political-posts/", x_political_posts),
    path("analysis-dashboard/", analysis_dashboard),
    path("live-analytics-report/", live_analytics_report),
    path("live-report-dashboard/", live_report_dashboard),
    path("live-snapshots/<uuid:live_id>/", live_snapshots_by_live),
    path("ended-live-reports/", ended_live_reports),
    
]