import { useEffect, useRef } from "react";

export default function VisitorMapClustrMaps() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";

    const s = document.createElement("script");
    s.type = "text/javascript";
    s.id = "clustrmaps";
    s.async = true;

    // 关键：把这里换成你拿到的“完整 src”
    // 建议用 https 开头（GitHub Pages 是 https）
    s.src = "//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=300&t=tt&d=uf-j7wo6aXXZgccQAiYJfeOetHKxAO62aa3n2ehO2nU";

    s.onload = () => console.log("[clustrmaps] loaded");
    s.onerror = () => console.error("[clustrmaps] failed to load:", s.src);

    el.appendChild(s);

    return () => {
      el.innerHTML = "";
    };
  }, []);

  return <div ref={ref} className="w-[320px] max-w-full min-h-[180px]" />;
}
