import { useLocation } from "react-router-dom";

export const isHome = () => {
  const { pathname } = useLocation();
  if (pathname == "/") {
    return true;
  }
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
