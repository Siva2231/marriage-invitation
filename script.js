const WEDDING_START = new Date("2026-08-23T10:00:00+05:30");
const INVITATION_EXPIRES = new Date("2026-08-24T00:00:00+05:30");

const invitation = document.querySelector("#invitation");
const expiryScreen = document.querySelector("#expiry-screen");

function enforceExpiry() {
  const hasExpired = Date.now() >= INVITATION_EXPIRES.getTime();

  invitation.hidden = hasExpired;
  expiryScreen.hidden = !hasExpired;
  document.body.classList.toggle("expired", hasExpired);

  return hasExpired;
}

function updateCountdown() {
  if (enforceExpiry()) return;

  const distance = Math.max(0, WEDDING_START.getTime() - Date.now());
  const units = {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };

  Object.entries(units).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = String(value).padStart(2, "0");
  });
}

function downloadCalendarEvent() {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Siva and Geetha Wedding//EN",
    "BEGIN:VEVENT",
    "UID:siva-geetha-wedding-20260823",
    "DTSTAMP:20260823T043000Z",
    "DTSTART:20260823T043000Z",
    "DTEND:20260823T053000Z",
    "SUMMARY:Wedding of Siva Prasad and Geetha Priya",
    "LOCATION:Dr. Pa. Sivanthi Adithanar Thirumana Mandapam\\, Aralvaimozhi\\, Tamil Nadu",
    "DESCRIPTION:Join us to celebrate the wedding ceremony of Siva Prasad and Geetha Priya.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  link.download = "siva-geetha-wedding.ics";
  link.click();
  URL.revokeObjectURL(link.href);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#calendar-button").addEventListener("click", downloadCalendarEvent);

updateCountdown();
setInterval(updateCountdown, 1000);
