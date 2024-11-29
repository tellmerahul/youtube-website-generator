export const generateWebsite = (channelData) => {
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${channelData.name || 'YouTube Channel'}</title>
      <script src="https://apis.google.com/js/platform.js"></script>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
          .video-card {
              transition: transform 0.3s ease;
              cursor: pointer;
          }
          .video-card:hover {
              transform: translateY(-5px);
          }
          .modal {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,0.8);
              z-index: 1000;
          }
          .modal-content {
              background: white;
              width: 90%;
              max-width: 1000px;
              margin: 40px auto;
              border-radius: 10px;
              position: relative;
          }
      </style>
  </head>
  <body class="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
      <!-- Navigation Header -->
      <header class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg py-4 fixed w-full z-10">
          <div class="container mx-auto px-4 flex justify-between items-center">
              <div class="flex items-center">
                  <svg class="text-red-600 mr-2" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  <span class="font-bold text-xl text-gray-800">${channelData.name}</span>
              </div>
              <nav class="hidden md:flex items-center space-x-6">
                  <a href="#home" class="text-gray-800 hover:text-red-600 transition-colors duration-300">Home</a>
                  <a href="#about" class="text-gray-800 hover:text-red-600 transition-colors duration-300">About</a>
                  <a href="#videos" class="text-gray-800 hover:text-red-600 transition-colors duration-300">Videos</a>
                  <a href="#playlists" class="text-gray-800 hover:text-red-600 transition-colors duration-300">Playlists</a>
              </nav>
              <div class="g-ytsubscribe" 
                   data-channelid="${channelData.channelId}" 
                   data-layout="default" 
                   data-count="default">
              </div>
          </div>
      </header>

      <main class="pt-20">
          <!-- Banner Section -->
          <section id="home" class="relative h-80 overflow-hidden">
              <img src="${channelData.bannerUrl || ''}" 
                   alt="Channel Banner" 
                   class="w-full h-full object-cover">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <div class="container mx-auto">
                      <h2 class="text-4xl font-bold text-white mb-2">${channelData.name}</h2>
                      <p class="text-white text-lg">
                          ${channelData.subscribers} subscribers • ${channelData.videoCount} videos
                      </p>
                  </div>
              </div>
          </section>

          <!-- About Section -->
          <section id="about" class="py-16 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
              <div class="container mx-auto px-4">
                  <h2 class="text-3xl font-bold mb-6 text-gray-800">About</h2>
                  <p class="text-gray-600 whitespace-pre-line">${channelData.description}</p>
                  <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div class="bg-white rounded-lg p-4 shadow">
                          <h3 class="font-bold text-xl text-gray-800">${channelData.subscribers}</h3>
                          <p class="text-gray-600">Subscribers</p>
                      </div>
                      <div class="bg-white rounded-lg p-4 shadow">
                          <h3 class="font-bold text-xl text-gray-800">${channelData.videoCount}</h3>
                          <p class="text-gray-600">Videos</p>
                      </div>
                      <div class="bg-white rounded-lg p-4 shadow">
                          <h3 class="font-bold text-xl text-gray-800">${formatDate(channelData.createdAt)}</h3>
                          <p class="text-gray-600">Joined</p>
                      </div>
                  </div>
              </div>
          </section>

          <!-- Videos Section -->
          <section id="videos" class="py-16">
              <div class="container mx-auto px-4">
                  <h2 class="text-3xl font-bold mb-8 text-gray-800">Latest Videos</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      ${channelData.videos.map(video => `
                          <div class="video-card bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
                               onclick="openVideoModal('${video.id.videoId}', '${video.snippet.title.replace(/'/g, "\\'")}', \`${video.snippet.description.replace(/`/g, "'")}\`)">
                              <img src="${video.snippet.thumbnails.medium.url}" 
                                   alt="${video.snippet.title}" 
                                   class="w-full aspect-video object-cover">
                              <div class="p-4">
                                  <h3 class="font-bold text-gray-800 mb-2">${video.snippet.title}</h3>
                                  <p class="text-sm text-gray-600">${formatDate(video.snippet.publishedAt)}</p>
                                  <p class="text-sm text-gray-600 mt-2">${video.snippet.description.slice(0, 100)}...</p>
                              </div>
                          </div>
                      `).join('')}
                  </div>
              </div>
          </section>

          <!-- Playlists Section -->
          <section id="playlists" class="py-16 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
              <div class="container mx-auto px-4">
                  <h2 class="text-3xl font-bold mb-8 text-gray-800">Playlists</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      ${channelData.playlists ? channelData.playlists.map(playlist => `
                          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                              <img src="${playlist.snippet?.thumbnails?.medium?.url || ''}" 
                                   alt="${playlist.snippet?.title || ''}" 
                                   class="w-full aspect-video object-cover">
                              <div class="p-4">
                                  <h3 class="font-bold text-gray-800 mb-2">${playlist.snippet?.title || ''}</h3>
                                  <p class="text-sm text-gray-600">${playlist.snippet?.description?.slice(0, 100) || ''}...</p>
                                  <p class="text-sm text-gray-500 mt-2">${playlist.contentDetails?.itemCount || 0} videos</p>
                              </div>
                          </div>
                      `).join('') : '<p class="text-gray-600">No playlists available</p>'}
                  </div>
              </div>
          </section>
      </main>

      <!-- Video Modal -->
      <div id="videoModal" class="modal">
          <div class="modal-content p-6">
              <button onclick="closeVideoModal()" 
                      class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
              </button>
              <div id="videoPlayer" class="aspect-video mb-4"></div>
              <h2 id="videoTitle" class="text-2xl font-bold mb-4"></h2>
              <p id="videoDescription" class="text-gray-600"></p>
              <div id="videoTranscript" class="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 class="font-bold mb-2">Transcript</h3>
                  <div id="transcriptContent" class="text-sm text-gray-600 max-h-60 overflow-y-auto">
                      Loading transcript...
                  </div>
              </div>
          </div>
      </div>

      <footer class="bg-gray-800 text-white py-8">
          <div class="container mx-auto px-4 text-center">
              <p>&copy; ${new Date().getFullYear()} ${channelData.name}. All rights reserved.</p>
          </div>
      </footer>

      <script>
          function openVideoModal(videoId, title, description) {
              const modal = document.getElementById('videoModal');
              const playerDiv = document.getElementById('videoPlayer');
              document.getElementById('videoTitle').textContent = title;
              document.getElementById('videoDescription').textContent = description;
              
              playerDiv.innerHTML = \`
                  <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/\${videoId}?autoplay=1" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen>
                  </iframe>
              \`;

              modal.style.display = 'block';
              document.body.style.overflow = 'hidden';
              fetchTranscript(videoId);
          }

          function closeVideoModal() {
              const modal = document.getElementById('videoModal');
              const playerDiv = document.getElementById('videoPlayer');
              playerDiv.innerHTML = '';
              modal.style.display = 'none';
              document.body.style.overflow = 'auto';
          }

          async function fetchTranscript(videoId) {
              const transcriptDiv = document.getElementById('transcriptContent');
              try {
                  const response = await fetch(\`/api/transcript/\${videoId}\`);
                  const data = await response.json();
                  transcriptDiv.innerHTML = data.transcript || 'Transcript not available';
              } catch (error) {
                  transcriptDiv.innerHTML = 'Transcript not available';
              }
          }

          window.onclick = function(event) {
              const modal = document.getElementById('videoModal');
              if (event.target == modal) {
                  closeVideoModal();
              }
          }
      </script>
  </body>
  </html>
  `;
};