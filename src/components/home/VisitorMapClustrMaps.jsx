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
    s.src = "//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=a&t=tt&d=uf-j7wo6aXXZgccQAiYJfeOetHKxAO62aa3n2ehO2nU&co=2d78ad&cmo=ff0050&cmn=00ff00&ct=ffffff";

    s.onload = () => console.log("[clustrmaps] loaded");
    s.onerror = () => console.error("[clustrmaps] failed to load:", s.src);

    el.appendChild(s);

    return () => {
      el.innerHTML = "";
    };
  }, []);

  return (
      <div 
        ref={ref} 
        /* 关键点：添加 pointer-events-none 禁止点击 */
        className="w-[320px] max-w-full min-h-[180px] pointer-events-none select-none" 
        /* 如果你没用 Tailwind，可以用下面这一行 style */
        // style={{ pointerEvents: 'none', userSelect: 'none' }}
      />
    );
}


