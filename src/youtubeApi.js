import axios from 'axios';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: API_KEY
  }
});

export const fetchChannelData = async (channelUrl) => {
  try {
    // Extract channel username or custom URL
    const channelIdentifier = channelUrl.split('/').pop().replace('@', '');
    console.log('Channel identifier:', channelIdentifier);

    // First, try to get channel by username
    const searchResponse = await youtube.get('/search', {
      params: {
        part: 'snippet',
        type: 'channel',
        q: channelIdentifier
      }
    });

    if (searchResponse.data.items.length === 0) {
      throw new Error('Channel not found. Please check the URL and try again.');
    }

    const channelId = searchResponse.data.items[0].snippet.channelId;
    console.log('Found channel ID:', channelId);

    // Now fetch detailed channel data
    const channelResponse = await youtube.get('/channels', {
      params: {
        part: 'snippet,statistics,brandingSettings',
        id: channelId
      }
    });

    const channelData = channelResponse.data.items[0];

    // Fetch recent videos
    const videosResponse = await youtube.get('/search', {
      params: {
        part: 'snippet',
        channelId: channelId,
        order: 'date',
        type: 'video',
        maxResults: 12
      }
    });

    // Fetch playlists
    const playlistsResponse = await youtube.get('/playlists', {
      params: {
        part: 'snippet,contentDetails',
        channelId: channelId,
        maxResults: 10
      }
    });

    return {
      channelId: channelId,
      name: channelData.snippet.title,
      description: channelData.snippet.description,
      subscribers: channelData.statistics.subscriberCount,
      videoCount: channelData.statistics.videoCount,
      viewCount: channelData.statistics.viewCount,
      createdAt: channelData.snippet.publishedAt,
      bannerUrl: channelData.brandingSettings.image?.bannerExternalUrl,
      thumbnails: channelData.snippet.thumbnails,
      videos: videosResponse.data.items,
      playlists: playlistsResponse.data.items
    };
  } catch (error) {
    console.error('Error fetching channel data:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message);
    }
    throw error;
  }
};
