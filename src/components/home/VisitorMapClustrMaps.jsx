import { useEffect, useRef } from "react";

export default function VisitorMapClustrMaps() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";

    const s = document.createElement("script");
    s.type = "text/javascript";
    s.id = "mapmyvisitors";
    s.async = true;

    // 关键：把这里换成你拿到的“完整 src”
    // 建议用 https 开头（GitHub Pages 是 https）
    s.src = "https://mapmyvisitors.com/map.js?cl=ffffff&w=300&t=tt&d=o0PzVxa4-2wBm3x-Oo59AOvJDjnWGQxdsZVOiehj52w";

    s.onload = () => console.log("[mapmyvisitors] loaded");
    s.onerror = () => console.error("[mapmyvisitors] failed to load:", s.src);

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


// export default function VisitorMapClustrMaps() {
//   return (
//     <div className="mt-8 flex justify-center opacity-80">
//       <a
//         href="https://info.flagcounter.com/n01R"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <img
//           src="https://s01.flagcounter.com/count2/n01R/bg_FFFFFF/txt_000000/border_CCCCCC/columns_3/maxflags_12/viewers_0/labels_0/pageviews_1/flags_0/percent_1/"
//           alt="Flag Counter"
//           loading="lazy"
//           referrerPolicy="no-referrer"
//         />
//       </a>
//     </div>
//   );
// }