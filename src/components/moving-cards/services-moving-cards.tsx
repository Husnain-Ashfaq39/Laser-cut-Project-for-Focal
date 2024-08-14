import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import services from "@/data/services";

export const ServicesMovingCards = ({
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
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

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller z-20 m-auto max-w-full overflow-hidden",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "mt-12 flex w-max min-w-full shrink-0 flex-nowrap gap-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {services.map((service) => (
          <li
            key={service.id}
            className="relative mb-10 flex w-[300px] max-w-full flex-shrink-0 flex-col rounded-2xl border px-1 py-1 md:w-[350px]"
          >
            <div className="mb-4 h-[400px] w-full overflow-hidden rounded-xl border-4">
              <img src={service.imgURL} className="h-full w-full object-cover" />
            </div>
            <div className="flex h-1/5 flex-col items-start justify-between p-2">
              <p className="font-cinzel mb-2 text-2xl font-bold">
                {service.title}
              </p>
              <p className="mb-2 text-xs">{service.preview}</p>
              <Link
                to={`/services/${service.id}`}
                className="font-cinzel mb-2 text-lg underline"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
