import React from "react";
import { motion } from "framer-motion";
import { useIsScrolled } from "@/hooks/useIsScrolled";
import { scrollToTop } from "@/utils/helpers";
const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  const isHome = () => {
    const { pathname } = location;
    if (pathname == "/") {
      return true;
    }
  };

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className={`${isHome() || useIsScrolled() ? "text-white" : "font-semibold text-black"} cursor-pointer font-secondary font-light hover:opacity-[0.9]`}
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && React.Children.count(children) > 0 && (
            <div className="absolute left-1/2 top-[calc(100%_+_1.2rem)] -translate-x-1/2 transform pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="overflow-hidden rounded-2xl border border-black/[0.2] bg-white shadow-xl backdrop-blur-sm dark:border-white/[0.2] dark:bg-black"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="h-full w-max p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={`relative m-auto flex items-center justify-between space-x-6 rounded-full border border-transparent px-8 py-2 shadow-input transition-all duration-500 ease-in-out ${useIsScrolled() ? "fixed -top-7 z-50 m-auto w-[85%] bg-black dark:bg-gray-800" : "w-full bg-transparent"} `}
    >
      {children}
    </nav>
  );
};
