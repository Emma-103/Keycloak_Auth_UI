const BFF_BASE_URL = import.meta.env.VITE_BFF_BASE_URL || "https://localhost:7296/api/bff";

async function readErrorDetails(response) {
  const contentType = response.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const body = await response.json();
      return JSON.stringify(body);
    }
    return (await response.text()).trim();
  } catch {
    return "";
  }
}

export function buildLoginUrl(returnUrl) {
  const encoded = encodeURIComponent(returnUrl || window.location.origin);
  return `${BFF_BASE_URL}/login?returnUrl=${encoded}`;
}

export async function fetchCurrentUser() {
  const response = await fetch(`${BFF_BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const details = await readErrorDetails(response);
    throw new Error(
      details
        ? `Session request failed (${response.status}): ${details}`
        : `Session request failed (${response.status})`
    );
  }

  return response.json();
}

export async function requestLogout() {
  const response = await fetch(`${BFF_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const details = await readErrorDetails(response);
    throw new Error(
      details
        ? `Logout request failed (${response.status}): ${details}`
        : `Logout request failed (${response.status})`
    );
  }

  return response.json();
}
