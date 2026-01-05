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
      <div id="${cardId}" class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row mb-6 border border-gray-100" style="margin-bottom: 1.618rem;">
        
        <!-- Image Section (Left) -->
        <div class="h-48 md:h-auto md:w-2/5 relative shrink-0">
          <img src="${imageUrl}" alt="${title}" class="absolute inset-0 w-full h-full object-cover" />
        </div>
        
        <!-- Content Section (Right) -->
        <div class="flex-1 flex flex-col" style="padding: 1.618rem;">
          
          <!-- Title -->
          <a href="${eventUrl}" target="_blank" class="font-bold text-gray-900 hover:underline leading-tight" style="font-size: 1.618rem; line-height: 1.618; margin-bottom: 0.382rem; display: block;">
            ${title}
          </a>
          
          <!-- Organizer -->
          <p class="text-sm text-gray-500 mb-4" style="margin-bottom: 1rem;">by ${group.name}</p>
          
          <!-- Date & Time -->
          <div class="flex items-center text-sm text-gray-600" style="gap: 0.618rem; margin-bottom: 0.618rem;">
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
          <div class="flex items-center text-sm text-gray-600" style="gap: 0.618rem; margin-bottom: 1rem;">
            <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${event.venue.name}</span>
          </div>
          ` : '<div style="margin-bottom: 1rem;"></div>'}
          
          <!-- Actions (Bottom) -->
          <div class="flex items-center justify-between mt-auto" style="padding-top: 1rem;">
            <a href="${eventUrl}" target="_blank" class="inline-block px-5 py-2 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors">
              RSVP
            </a>
            
            <!-- Social Sharing -->
            <div class="flex items-center" style="gap: 1rem;">
              <a href="https://www.facebook.com/sharer/sharer.php?u=${eventUrl}" target="_blank" title="Share on Facebook" class="text-gray-400 hover:text-[#1877F2] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}%20${eventUrl}&via=KanpurFOSS" target="_blank" title="Share on X" class="text-gray-400 hover:text-[#000000] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
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
          <div class="text-center border-2 border-dashed border-gray-100 rounded-2xl bg-white" style="padding: 2.618rem 1rem;">
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-white" style="margin-bottom: 1rem;">
               <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><calendar></calendar><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h3 class="font-bold text-black" style="font-size: 1.618rem; margin-bottom: 0.382rem;">No upcoming meetups</h3>
            <p class="text-black text-sm" style="margin-bottom: 0.618rem;">We are planning something exciting. Stay tuned!</p>
            <p class="text-gray-600 text-base max-w-lg mx-auto" style="line-height: 1.6;">
              Got a topic in mind? 💡 We'd love to help you host it! <br>
              Drop a message in <a href="https://join.slack.com/t/wpkanpur/shared_invite/zt-3mqkin729-LvSXyZ787rOPNTt9dKWePw" target="_blank" class="text-black font-bold hover:text-gray-700 underline decoration-2 underline-offset-2">#discussions</a>.
            </p>
          </div>
        `);
      }

      // Sort groups by most recent event (past or future)
      groups.forEach(g => {
        const groupEvents = events.filter(e => e.group && e.group.urlname.toLowerCase() === g.urlname.toLowerCase());
        if (groupEvents.length > 0) {
          // Get the latest date (can be future or past)
          const dates = groupEvents.map(e => new Date(e.dateTime).getTime());
          g.lastEventDate = Math.max(...dates);
        } else {
          g.lastEventDate = 0;
        }
      });

      // Sort descending (newest first)
      groups.sort((a, b) => b.lastEventDate - a.lastEventDate);

      // Render Groups Section (Exact copy of event cards, but image on RIGHT)
      const renderGroups = () => {
        const $groupsContainer = $("#groups-container");
        if (!$groupsContainer.length) return;

        groups.forEach((group, index) => {
          const groupUrl = `https://www.meetup.com/${group.urlname}/`;
          const groupHtml = `
            <div id="group-${index}" class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row-reverse border border-gray-100" style="margin-bottom: 1.618rem;">
              
              <!-- Image Section (Right) -->
              <div class="md:w-2/5 shrink-0 flex items-stretch">
                <img src="/assets/images/${group.icon}.png" alt="${group.name}" class="w-full h-full object-cover block" loading="lazy">
              </div>
              
              <!-- Content Section (Left) -->
              <div class="flex-1 flex flex-col justify-center" style="padding: 1.618rem;">
                
                <!-- Title -->
                <a href="${groupUrl}" target="_blank" class="font-bold text-gray-900 hover:underline leading-tight" style="font-size: 1.618rem; line-height: 1.618; margin-bottom: 0.382rem; display: block;">
                  ${group.name}
                </a>
                
                <!-- Actions (Bottom) -->
                <div class="flex items-center justify-start" style="margin-top: 1.618rem; padding-top: 0;">
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
