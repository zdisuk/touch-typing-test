export function getQuote(): Promise<Response> {
  const baseURL = import.meta.env.VITE_BASE_QUOTE_API;

  return fetch(`${baseURL}/random-quote?format=json`);
}
