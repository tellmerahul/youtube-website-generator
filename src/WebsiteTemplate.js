export const generateWebsite = (channelData) => {
    const formatDate = (dateString) => {
      return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
    };
  
    const renderVideos = () => {
      if (!channelData.videos || channelData.videos.length === 0) {
        return '<p>No videos available.</p>';
      }
      return channelData.videos.map(video => `
        <div class="bg-white rounded shadow">
          <img src="${video.snippet?.thumbnails?.medium?.url || ''}" alt="${video.snippet?.title || 'Video thumbnail'}" class="w-full">
          <div class="p-4">
            <h3 class="font-bold">${video.snippet?.title || 'Untitled Video'}</h3>
            <p class="text-sm text-gray-600">${formatDate(video.snippet?.publishedAt)}</p>
          </div>
        </div>
      `).join('');
    };
  
    const renderPlaylists = () => {
      if (!channelData.playlists || channelData.playlists.length === 0) {
        return '<p>No playlists available.</p>';
      }
      return channelData.playlists.map(playlist => `
        <div class="bg-white rounded shadow">
          <img src="${playlist.snippet?.thumbnails?.medium?.url || ''}" alt="${playlist.snippet?.title || 'Playlist thumbnail'}" class="w-full">
          <div class="p-4">
            <h3 class="font-bold">${playlist.snippet?.title || 'Untitled Playlist'}</h3>
          </div>
        </div>
      `).join('');
    };
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${channelData.name || 'YouTube Channel'} - YouTube Channel</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-100">
      <header class="bg-red-600 text-white fixed w-full z-10">
          <div class="container mx-auto px-4 py-2 flex justify-between items-center">
              <h1 class="text-2xl font-bold">${channelData.name || 'YouTube Channel'}</h1>
              <nav>
                  <a href="#about" class="mx-2">About</a>
                  <a href="#videos" class="mx-2">Videos</a>
                  <a href="#playlists" class="mx-2">Playlists</a>
              </nav>
              <button class="bg-white text-red-600 px-4 py-2 rounded">Subscribe</button>
          </div>
      </header>
  
      <main class="pt-16">
          <div class="relative">
              <img src="${channelData.bannerUrl || ''}" alt="Channel Banner" class="w-full h-64 object-cover">
              <div class="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4">
                  <h2 class="text-3xl font-bold">${channelData.name || 'YouTube Channel'}</h2>
                  <p>${channelData.subscribers || 0} subscribers • ${channelData.videoCount || 0} videos</p>
                  <p>Channel created on ${formatDate(channelData.createdAt)}</p>
              </div>
          </div>
  
          <section id="about" class="container mx-auto px-4 py-8">
              <h2 class="text-2xl font-bold mb-4">About</h2>
              <p>${channelData.description || 'No description available.'}</p>
          </section>
  
          <section id="videos" class="container mx-auto px-4 py-8">
              <h2 class="text-2xl font-bold mb-4">Latest Videos</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  ${renderVideos()}
              </div>
          </section>
  
          <section id="playlists" class="container mx-auto px-4 py-8">
              <h2 class="text-2xl font-bold mb-4">Playlists</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  ${renderPlaylists()}
              </div>
          </section>
      </main>
  
      <footer class="bg-gray-800 text-white py-4">
          <div class="container mx-auto px-4 text-center">
              <p>&copy; ${new Date().getFullYear()} ${channelData.name || 'YouTube Channel'}. All rights reserved.</p>
          </div>
      </footer>
  </body>
  </html>
    `;
  };