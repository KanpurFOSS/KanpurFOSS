/**
 * Fetch Meetup Events Script
 * 
 * This script runs via GitHub Actions to fetch events from Meetup RSS feeds
 * and updates the static JSON file. No CORS issues since it runs server-side.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const groups = [
  { urlname: "WordPress-Kanpur", icon: "wordpress", name: "Kanpur WordPress Meetup" },
  { urlname: "Docker-Kanpur", icon: "docker", name: "Docker Kanpur" },
  { urlname: "hackerspace-kanpur", icon: "hackerspace", name: "HS4: Hackerspace" },
  { urlname: "PyDataKanpur", icon: "pydata", name: "PyData Kanpur" },
  { urlname: "KanpurPython", icon: "python", name: "Kanpur Python" },
  { urlname: "makerspacekanpur", icon: "arduino", name: "Makers and Coders of Kanpur" },
  { urlname: "kanpur-js", icon: "javascript", name: "kanpur.js" },
];

// Simple HTTP GET request
function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'KanpurFOSS-Bot/1.0' } }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchURL(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Fetch og:image, og:title, and parse date from event page
async function fetchEventMeta(eventUrl) {
  try {
    const html = await fetchURL(eventUrl);
    
    // Extract og:image
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    
    // Extract og:title (contains date info like "Event Name, Sun, Jan 4, 2026, 3:00 PM | Meetup")
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    
    let title = null;
    let eventDate = null;
    
    if (ogTitleMatch) {
      const fullTitle = ogTitleMatch[1];
      
      // Try to parse date from title: "Event Name, Sun, Jan 4, 2026, 3:00 PM | Meetup"
      const dateMatch = fullTitle.match(/,\s*(\w{3}),\s*(\w{3}\s+\d{1,2},\s*\d{4}),\s*(\d{1,2}:\d{2}\s*(AM|PM))/i);
      
      if (dateMatch) {
        // Parse the date
        const dateStr = `${dateMatch[2]} ${dateMatch[3]}`;
        eventDate = new Date(dateStr);
        
        // Clean title - remove date and "| Meetup" suffix
        title = fullTitle.split(',')[0].trim();
      } else {
        // Just remove "| Meetup" suffix
        title = fullTitle.replace(/\s*\|\s*Meetup\s*$/i, '').trim();
      }
    }
    
    // Try to get date and location from JSON-LD if not found in title
    if (!eventDate || isNaN(eventDate.getTime())) {
      const jsonLdMatch = html.match(/"startDate"\s*:\s*"([^"]+)"/);
      if (jsonLdMatch) {
        eventDate = new Date(jsonLdMatch[1]);
      }
    }
    
    // Extract location from JSON-LD
    let location = null;
    const locationNameMatch = html.match(/"location"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/);
    const locationAddressMatch = html.match(/"location"\s*:\s*\{[^}]*"address"\s*:\s*\{[^}]*"addressLocality"\s*:\s*"([^"]+)"/);
    
    if (locationNameMatch) {
      location = locationNameMatch[1];
    } else if (locationAddressMatch) {
      location = locationAddressMatch[1];
    }
    
    // Check if it's online event
    const isOnline = html.includes('"eventAttendanceMode":"https://schema.org/OnlineEventAttendanceMode"') ||
                     html.toLowerCase().includes('online event');
    if (isOnline && !location) {
      location = 'Online Event';
    }
    
    return {
      image: ogImageMatch ? ogImageMatch[1] : null,
      title: title,
      date: eventDate && !isNaN(eventDate.getTime()) ? eventDate : null,
      location: location
    };
  } catch (e) {
    return { image: null, title: null, date: null, location: null };
  }
}

// Parse RSS XML to extract events
function parseRSS(xmlString, group) {
  const events = [];
  
  // Simple regex-based parsing (no dependencies needed)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
  const descRegex = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/;
  
  let match;
  while ((match = itemRegex.exec(xmlString)) !== null) {
    const item = match[1];
    
    const titleMatch = item.match(titleRegex);
    const linkMatch = item.match(linkRegex);
    const pubDateMatch = item.match(pubDateRegex);
    const descMatch = item.match(descRegex);
    
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Upcoming Event';
    const eventUrl = linkMatch ? linkMatch[1] : '';
    const pubDate = pubDateMatch ? pubDateMatch[1] : '';
    const description = descMatch ? (descMatch[1] || descMatch[2]) : '';
    
    // Extract image from description if available
    const imgMatch = description.match(/src="(https:\/\/secure\.meetupstatic\.com[^"]+)"/);
    const image = imgMatch ? imgMatch[1] : null;
    
    // Parse event date from description
    // Meetup RSS has date in format: "Saturday, January 4, 2025 at 3:00 PM"
    let dateTime = null;
    
    // Try multiple date patterns
    const datePatterns = [
      /(\w+day,\s+\w+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(AM|PM))/i,
      /(\w+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(AM|PM))/i,
      /(\d{4}-\d{2}-\d{2})/
    ];
    
    for (const pattern of datePatterns) {
      const match = description.match(pattern);
      if (match) {
        try {
          if (match[2]) {
            dateTime = new Date(`${match[1]} ${match[2]}`);
          } else {
            dateTime = new Date(match[1]);
          }
          if (!isNaN(dateTime.getTime())) break;
        } catch (e) {}
      }
    }
    
    // Fallback: use pubDate + 7 days as estimate (RSS pubDate is usually ~1 week before event)
    if (!dateTime || isNaN(dateTime.getTime())) {
      dateTime = new Date(pubDate);
      dateTime.setDate(dateTime.getDate() + 7);
    }
    
    // Only add if we have valid data
    if (eventUrl && title) {
      events.push({
        title: title.trim(),
        eventUrl: eventUrl.trim(),
        dateTime: dateTime.toISOString(),
        group: {
          urlname: group.urlname,
          icon: group.icon,
          name: group.name
        },
        venue: { name: "See event page" },
        image: image
      });
      console.log(`    - ${title.trim()} (${dateTime.toLocaleDateString()})`);
    }
  }
  
  return events;
}

async function fetchGroupEvents(group) {
  const rssUrl = `https://www.meetup.com/${group.urlname}/events/rss/`;
  
  try {
    console.log(`Fetching: ${group.name}...`);
    const rssData = await fetchURL(rssUrl);
    const events = parseRSS(rssData, group);
    
    // Fetch og:image, og:title, and date for each event
    for (const event of events) {
      if (event.eventUrl) {
        console.log(`    Fetching meta for: ${event.title}`);
        const meta = await fetchEventMeta(event.eventUrl);
        if (meta.image) {
          event.image = meta.image;
          console.log(`    ✓ Got image`);
        }
        if (meta.title) {
          event.title = meta.title;
          console.log(`    ✓ Got title: ${meta.title}`);
        }
        if (meta.date) {
          event.dateTime = meta.date.toISOString();
          console.log(`    ✓ Got date: ${meta.date.toLocaleString()}`);
        }
        if (meta.location) {
          event.venue = { name: meta.location };
          console.log(`    ✓ Got location: ${meta.location}`);
        }
      }
    }
    
    console.log(`  Found ${events.length} events`);
    return events;
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('Starting Meetup events fetch...\n');
  
  const allEvents = [];
  
  // Fetch events from all groups
  for (const group of groups) {
    const events = await fetchGroupEvents(group);
    allEvents.push(...events);
    
    // Small delay between requests to be nice to Meetup servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Filter for upcoming events only
  const now = new Date();
  const upcoming = allEvents.filter(e => new Date(e.dateTime) >= now);
  
  // Sort by date
  upcoming.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  
  // Remove duplicates by eventUrl
  const seen = new Set();
  const unique = upcoming.filter(e => {
    if (seen.has(e.eventUrl)) return false;
    seen.add(e.eventUrl);
    return true;
  });
  
  console.log(`\nTotal upcoming events: ${unique.length}`);
  
  // Write to JSON file
  const outputPath = path.join(__dirname, '..', 'assets', 'data', 'meetup-events.json');
  const output = {
    lastUpdated: new Date().toISOString(),
    events: unique
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nWritten to: ${outputPath}`);
}

main().catch(console.error);
