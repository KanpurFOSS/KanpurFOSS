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
  const $container = $(".container");
  
  // Show loader
  $container.html(`
    <div class="loader">
      <span class="bracket">{</span>
      <span>Loading</span>
      <span class="bracket">}</span>
    </div>
  `);

  // Render a single event card
  const renderEvent = (event, cardId) => {
    const { title, eventUrl, group, image, dateTime } = event;
    const imageUrl = image || `/assets/images/${group.icon}.png`;
    
    // Format the date nicely
    const eventDate = new Date(dateTime);
    const dateStr = eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `
      <div class="card-media" id="${cardId}">
        <div class="card-media-object-container">
          <img src="${imageUrl}" alt="${title}" class="card-media-object" />
        </div>
        <div class="card-media-body">
          <div class="card-title-section">
            <a href="${eventUrl}" target="_blank" class="card-media-body-heading">${title}</a>
            <div class="subtle" style="font-size: 14px; margin-top: 4px;">by ${group.name}</div>
          </div>
          <div class="event-datetime" style="font-size: 14px; color: #555; margin-top: 8px; display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${dateStr} • ${timeStr}
          </div>
          ${event.venue && event.venue.name ? `
          <div class="event-location" style="font-size: 14px; color: #555; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${event.venue.name}
          </div>
          ` : ''}
          <div class="card-media-body-actions">
            <a href="${eventUrl}" target="_blank" class="btn-rsvp">RSVP</a>
            <div class="social-icons">
              <a href="https://www.facebook.com/sharer/sharer.php?u=${eventUrl}" target="_blank" title="Share on Facebook">
                <svg class="svg-icon-circle"><use xlink:href="/assets/minima-social-icons.svg#facebook"></use></svg>
              </a>
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}%20${eventUrl}&via=KanpurFOSS" target="_blank" title="Share on Twitter">
                <svg class="svg-icon-circle"><use xlink:href="/assets/minima-social-icons.svg#twitter"></use></svg>
              </a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}" target="_blank" title="Share on LinkedIn">
                <svg class="svg-icon-circle"><use xlink:href="/assets/minima-social-icons.svg#linkedin"></use></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Load and display events from static JSON (with cache busting)
  fetch('/assets/data/meetup-events.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      console.log('Loaded events:', data);
      const events = data.events || [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      console.log('Current date:', now);
      console.log('All events:', events);
      
      // Filter for upcoming events only
      const upcoming = events.filter(e => {
        const eventDate = new Date(e.dateTime);
        console.log('Event:', e.title, 'Date:', eventDate, 'Is future:', eventDate >= now);
        return eventDate >= now;
      });
      
      // Sort by date (soonest first)
      upcoming.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      
      // Clear loader and render events
      $container.empty();
      
      if (upcoming.length > 0) {
        upcoming.forEach((event, index) => {
          const cardId = `event-${index}`;
          $container.append(renderEvent(event, cardId));
        });
      } else {
        $container.html(`
          <div style="text-align: center; padding: 60px 20px; color: #666;">
            <h3 style="margin-bottom: 10px; font-weight: 500;">No upcoming meetups scheduled</h3>
            <p>Check back soon or visit our Meetup groups directly!</p>
            <div style="margin-top: 20px;">
              ${groups.map(g => `<a href="https://www.meetup.com/${g.urlname}/" target="_blank" style="display: inline-block; margin: 5px; padding: 8px 16px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; font-size: 13px;">${g.name}</a>`).join('')}
            </div>
          </div>
        `);
      }
    })
    .catch(() => {
      // If JSON fails to load, show groups list
      $container.html(`
        <div style="text-align: center; padding: 60px 20px; color: #666;">
          <h3 style="margin-bottom: 10px; font-weight: 500;">Visit our Meetup groups</h3>
          <div style="margin-top: 20px;">
            ${groups.map(g => `<a href="https://www.meetup.com/${g.urlname}/" target="_blank" style="display: inline-block; margin: 5px; padding: 8px 16px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; font-size: 13px;">${g.name}</a>`).join('')}
          </div>
        </div>
      `);
    });
});
