"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={`whatsapp-pulse fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all duration-500 hover:scale-110 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
        <path
          fill="#07090C"
          d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.4.6 4.6 1.8 6.6L3 29l6.9-2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3Zm0 23.1c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.1 1.2 1.2-4-.2-.4a10.3 10.3 0 0 1-1.6-5.6C5.6 9.9 10.2 5.3 16 5.3S26.4 9.9 26.4 15.7 21.8 26.1 16 26.1Zm5.8-7.7c-.3-.2-1.9-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.2 3.3 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3Z"
        />
      </svg>
    </a>
  );
}
