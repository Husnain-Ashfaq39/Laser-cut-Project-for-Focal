import { cn } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import img1 from "@/assets/drawer-images/1.png";
import img2 from "@/assets/drawer-images/2.png";
import img3 from "@/assets/drawer-images/3.png";
import img4 from "@/assets/drawer-images/4.png";
import img5 from "@/assets/drawer-images/5.png";
import img6 from "@/assets/drawer-images/6.png";
import img7 from "@/assets/drawer-images/7.png";
import img8 from "@/assets/drawer-images/8.png";

export const ProjectsMovingCards = ({
  direction = "left",
  speed = "slow",
  pauseOnHover = false,
  className,
}: {
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      setDirection();
      setSpeed();
      setStart(true);
    }
  }

  const setDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };

  const setSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "100s");
      }
    }
  };
  const images = [img1, img2, img3, img4, img5, img6, img7, img8];

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller absolute z-20 m-auto max-w-full overflow-hidden",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {images.map((imgSrc, idx) => (
          <li
            key={idx}
            className="relative h-[400px] w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-b-0 border-slate-200 px-1 py-1 md:w-[350px]"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-100), var(--slate-100))",
            }}
          >
            <img
              src={imgSrc}
              className="mb-4 h-full w-full rounded-xl object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
