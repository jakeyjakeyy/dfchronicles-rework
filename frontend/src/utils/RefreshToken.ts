import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

async function RefreshToken() {
  const serverURL = import.meta.env.VITE_BACKEND_URL;
  const refresh = cookies.get("refresh_token");
  try {
    const response = await fetch(`http://${serverURL}:8000/api/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    const data = await response.json();

    if (data.detail === "Token is invalid or expired") {
      cookies.remove("refresh_token");
      cookies.remove("access_token");
      return { message: "Expired token" };
    }

    if (data.access) {
      cookies.set("access_token", data.access);
      return { message: "Token refreshed" };
    } else {
      return { message: "Please log in again" };
    }
  } catch (err) {
    console.log(err);
  }
}

export default RefreshToken;
