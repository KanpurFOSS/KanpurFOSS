/**
 * KanpurFOSS Meetup Events Display
 * 
 * This script loads events from a static JSON file for instant, reliable display.
 * The JSON file can be updated manually or via GitHub Actions.
 */

const groups = [
  { urlname: "WordPress-Kanpur", icon: "wordpress", name: "Kanpur WordPress Meetup" },
  { urlname: "Docker-Kanpur", icon: "docker", name: "Docker Kanpur" },
  { urlname: "hackerspace-kanpur", icon: "hackerspace", name: "HS4: Hackerspace" },
  { urlname: "PyDataKanpur", icon: "pydata", name: "PyData Kanpur" },
  { urlname: "KanpurPython", icon: "python", name: "Kanpur Python" },
  { urlname: "makerspacekanpur", icon: "arduino", name: "Makers and Coders of Kanpur" },
  { urlname: "kanpur-js", icon: "javascript", name: "kanpur.js" },
];

$(document).ready(() => {
  const $container = $("#events-container");
  
  // Check if container exists
  if (!$container.length) return;

  // Render a single event card (Horizontal layout matching kanpurfoss.org)
  const renderEvent = (event, cardId) => {
    const { title, eventUrl, group, image, dateTime } = event;
    const imageUrl = image || `/assets/images/${group.icon}.png`;
    
    // Format the date
    const eventDate = new Date(dateTime);
    const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    return `
      <div id="${cardId}" class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row mb-6 border border-gray-100">
        
        <!-- Image Section (Left) -->
        <div class="h-48 md:h-auto md:w-2/5 relative shrink-0">
          <img src="${imageUrl}" alt="${title}" class="absolute inset-0 w-full h-full object-cover" />
        </div>
        
        <!-- Content Section (Right) -->
        <div class="p-6 flex-1 flex flex-col">
          
          <!-- Title -->
          <a href="${eventUrl}" target="_blank" class="text-xl font-bold text-gray-900 hover:underline mb-1 leading-tight">
            ${title}
          </a>
          
          <!-- Organizer -->
          <p class="text-sm text-gray-500 mb-4">by ${group.name}</p>
          
          <!-- Date & Time -->
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${dateStr} • ${timeStr}</span>
          </div>
          
          <!-- Location -->
          ${event.venue && event.venue.name ? `
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${event.venue.name}</span>
          </div>
          ` : '<div class="mb-4"></div>'}
          
          <!-- Actions (Bottom) -->
          <div class="flex items-center justify-between mt-auto pt-4">
            <a href="${eventUrl}" target="_blank" class="inline-block px-5 py-2 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors">
              RSVP
            </a>
            
            <!-- Social Sharing -->
            <div class="flex items-center gap-3">
              <a href="https://www.facebook.com/sharer/sharer.php?u=${eventUrl}" target="_blank" title="Share on Facebook" class="text-gray-400 hover:text-[#1877F2] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}%20${eventUrl}&via=KanpurFOSS" target="_blank" title="Share on Twitter" class="text-gray-400 hover:text-[#1DA1F2] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}" target="_blank" title="Share on LinkedIn" class="text-gray-400 hover:text-[#0A66C2] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Load and display events
  fetch('/assets/data/meetup-events.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      const events = data.events || [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const upcoming = events.filter(e => new Date(e.dateTime) >= now);
      upcoming.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      
      $container.empty();
      
      if (upcoming.length > 0) {
        upcoming.forEach((event, index) => {
          $container.append(renderEvent(event, `event-${index}`));
        });
      } else {
        $container.html(`
          <div class="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><calendar></calendar><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">No upcoming meetups</h3>
            <p class="text-gray-500 text-sm">We are planning something exciting. Stay tuned!</p>
          </div>
        `);
      }

      // Render Groups Section (Exact copy of event cards, but image on RIGHT)
      const renderGroups = () => {
        const $groupsContainer = $("#groups-container");
        if (!$groupsContainer.length) return;

        groups.forEach((group, index) => {
          const groupUrl = `https://www.meetup.com/${group.urlname}/`;
          const groupHtml = `
            <div id="group-${index}" class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row-reverse mb-6 border border-gray-100">
              
              <!-- Image Section (Right) -->
              <div class="md:w-2/5 shrink-0 flex items-stretch">
                <img src="/assets/images/${group.icon}.png" alt="${group.name}" class="w-full h-full object-cover block" loading="lazy">
              </div>
              
              <!-- Content Section (Left) -->
              <div class="p-5 flex-1 flex flex-col justify-center">
                
                <!-- Title -->
                <a href="${groupUrl}" target="_blank" class="text-xl font-bold text-gray-900 hover:underline mb-1 leading-tight">
                  ${group.name}
                </a>
                
                <!-- Actions (Bottom) -->
                <div class="flex items-center justify-start mt-5 pt-0">
                  <a href="${groupUrl}" target="_blank" class="inline-block px-5 py-2 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors">
                    Join Group
                  </a>
                </div>
              </div>
            </div>
          `;
          $groupsContainer.append($(groupHtml));
        });
      };

      // Call renderGroups
      renderGroups();

      // Trigger GSAP animations
      if (window.initScrollAnimations) {
        window.initScrollAnimations();
      }
    })
    .catch(() => {
      // Error State
      $container.html(`
        <div class="text-center py-20 text-gray-400">
          <h3 class="text-xl font-medium mb-4">Visit our Meetup groups</h3>
          <div class="flex flex-wrap justify-center gap-3">
            ${groups.map(g => `<a href="https://www.meetup.com/${g.urlname}/" target="_blank" class="px-4 py-2 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors">${g.name}</a>`).join('')}
          </div>
        </div>
      `);
    });
});
