const events = [];

function formatDate(date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const am_pm = date.getHours() >= 12 ? "PM" : "AM";
  const time = hours + ":" + minutes + " " + am_pm;
  const dayofWeek = date.getDay();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return time + ", " + weekNames[dayofWeek] + ", " + day + ", " + monthNames[monthIndex];
}

$(document).ready(() => {
  $.ajax({
    url: "https://kanpurfoss-meetup-api-proxy.onrender.com/upcoming-meetups",
    dataType: "json",
    contentType: "application/json",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "X-Requested-With",
      "X-Requested-With": "XMLHttpRequest",
    },
    success: (data) => {
      events.push(...data.upcomingMeetups);
      const html = events
        .map((event) => {
          if (event.group.urlname === "WordPress-Kanpur") {
            group = "wordpress";
          } else if (event.group.urlname === "Docker-Kanpur") {
            group = "docker";
          } else if (event.group.urlname === "hackerspace-kanpur") {
            group = "hackerspace";
          } else if (event.group.urlname === "PyDataKanpur") {
            group = "pydata";
          } else if (event.group.urlname === "KanpurPython") {
            group = "python";
          } else if (event.group.urlname === "makerspacekanpur") {
            group = "arduino";
          } else if (event.group.urlname === "kanpur-js") {
            group = "javascript";
          }
          return `<div class="card-media">
							<div class="card-media-object-container">
								<div class="card-media-object" style="background-image: url('/assets/images/${group}.png');"></div>
								${
                  new Date().getDate() === new Date(event.dateTime).getDate()
                    ? '<span class="card-media-object-tag subtle">Today</span>'
                    : ""
                }
							</div>
							<div class="card-media-body">
								<div class="card-media-body-top">
									<span class="subtle">${formatDate(new Date(event.dateTime))}</span>
									<div class="card-media-body-top-icons u-float-right">
										<a href="https://www.facebook.com/sharer/sharer.php?u=${
                      event.eventUrl
                    }" target="_blank" title="Share on Facebook">
											<svg class="svg-icon"><use xlink:href="/assets/minima-social-icons.svg#facebook"></use></svg>
										</a>
										<a href="https://twitter.com/intent/tweet?text=${
                      event.title + ": " + event.eventUrl
                    }&via=KanpurFOSS" target="_blank" title="Share on Twitter">
											<svg class="svg-icon"><use xlink:href="/assets/minima-social-icons.svg#twitter"></use></svg>
										</a>
									</div>
								</div>
								<a href="${event.eventUrl}" target="_blank" class="card-media-body-heading">${event.title}</a>
								<div class="card-media-body-supporting-bottom">
									<span class="card-media-body-supporting-bottom-text subtle">${event.group.name}</span>
									<span class="card-media-body-supporting-bottom-text subtle u-float-right">${
                    event.going + " " + event.group.customMemberLabel
                  } going</span>
								</div>
								<div class="card-media-body-supporting-bottom card-media-body-supporting-bottom-reveal">
									<span class="card-media-body-supporting-bottom-text subtle">${
                    event.venue
                      ? event.venue.name + ", " + event.venue.address + ", " + event.venue.city
                      : "Needs a location"
                  }</span>
									<a href="${
                    event.eventUrl
                  }" target="_blank" class="card-media-body-supporting-bottom-text card-media-link u-float-right">RSVP</a>
								</div>
							</div>
						</div>`;
        })
        .join("");
      const container = document.querySelector(".container");
      container.innerHTML = html;
    },
  });
});
