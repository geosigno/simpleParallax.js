import { useEffect, useState } from "react";

const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return windowHeight;
};

export default useWindowHeight;
