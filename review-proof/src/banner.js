// Renders the dashboard greeting banner.
export function renderBanner(container) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "there";
  container.innerHTML = `<h2>Welcome back, ${name}</h2>`;
}
