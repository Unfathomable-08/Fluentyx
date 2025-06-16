import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "GET",
          credentials: "include", // Include cookies
        });
        const data = await res.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(data.user); // { id, email, name } from JWT
        } else {
          setIsAuthenticated(false);
          setUser(null);
          router.push("/auth");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, user, isLoading };
};

export default useAuth;