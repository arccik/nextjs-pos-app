import { useEffect, useState } from "react";


function useMediaQuery(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const listener = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    // Initial check
    setIsDesktop(mediaQuery.matches);

    // Add listener for changes
    mediaQuery.addEventListener("change", listener);

    // Clean up listener
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  return isDesktop;
}

export default useMediaQuery;
