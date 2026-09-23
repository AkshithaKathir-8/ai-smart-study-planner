import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

function getSavedUser() {
  try {
    // Prefer a remembered login, but require both user and token.
    const rememberedUser = localStorage.getItem("user");
    const rememberedToken = localStorage.getItem("token");

    if (rememberedUser && rememberedToken) {
      return JSON.parse(rememberedUser);
    }

    // Otherwise, check the current browser session.
    const sessionUser = sessionStorage.getItem("user");
    const sessionToken = sessionStorage.getItem("token");

    if (sessionUser && sessionToken) {
      return JSON.parse(sessionUser);
    }
  } catch (error) {
    console.error("Could not restore saved login:", error);
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = (userData, token, rememberMe = false) => {
    if (!userData || !token) {
      console.error("Login failed: user data or token is missing.");
      return;
    }

    // Remove any previous login from both storage locations.
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("token", token);

    setUser(userData);
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);