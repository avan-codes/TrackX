import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      // 👇 slow but smooth (0.08 = slower, 0.2 = fast)
      pos.current.x += (mouse.current.x - pos.current.x) * 0.08;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.08;

      if (cursorRef.current && glowRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 10}px, ${pos.current.y - 10}px)`;
        glowRef.current.style.transform = `translate(${pos.current.x - 40}px, ${pos.current.y - 40}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const hoverEls = document.querySelectorAll("button, a");

    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorRef.current.style.transform += " scale(1.3)";
        glowRef.current.style.transform += " scale(1.5)";
      });

      el.addEventListener("mouseleave", () => {
        cursorRef.current.style.transform = cursorRef.current.style.transform.replace(" scale(1.3)", "");
        glowRef.current.style.transform = glowRef.current.style.transform.replace(" scale(1.5)", "");
      });
    });
  }, []);

  return (
    <>
      {/* Glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-50 w-20 h-20 rounded-full blur-2xl opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(20,184,166,0.5), transparent)",
          mixBlendMode: "screen",
        }}
      />

      {/* Main Cursor (Ring + Dot) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
      >
        <div className="w-5 h-5 border border-teal-400 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
        </div>
      </div>
    </>
  );
}