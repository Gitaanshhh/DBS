export async function getVenues() {
  const response = await fetch('/api/venues/');
  const data = await response.json();
  return data.Venues || [];
}
