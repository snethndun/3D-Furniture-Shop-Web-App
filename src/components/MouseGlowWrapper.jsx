import React, { useEffect, useRef } from "react";

const MouseGlowWrapper = ({ children }) => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !glowRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glowRef.current.style.setProperty("--x", `${x}px`);
      glowRef.current.style.setProperty("--y", `${y}px`);
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px z-0"
        style={{
          background:
            "radial-gradient(circle at var(--x) var(--y), rgba(0, 172, 255, 0.25), transparent 40%)",
          transition: "background 0.2s ease",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default MouseGlowWrapper;
