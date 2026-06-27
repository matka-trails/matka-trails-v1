"use client";

export default function TickerSection() {
  const items = [
    "Kedarnath Trek",
    "Manali Expedition",
    "Rishikesh Rafting",
    "Spiti Cold Desert",
    "Hampta Pass Climbs",
    "Kasol Riverside Camping",
    "Spiti Valley Expedition",
    "Triund Weekend Ridge",
  ];

  // Double items for seamless marquee loop
  const rowItems = [...items, ...items, ...items];

  return (
    <section className="w-full bg-primary py-2.5 overflow-hidden flex flex-col gap-1.5 select-none relative z-10 shadow-orange">
      {/* Row 1: Left scrolling */}
      <div className="w-full overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-12 animate-tick-left">
          {rowItems.map((item, idx) => (
            <div
              key={`left-${idx}`}
              className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white"
            >
              <span>{item}</span>
              <span className="text-white/40">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right scrolling */}
      <div className="w-full overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-12 animate-tick-right">
          {rowItems.map((item, idx) => (
            <div
              key={`right-${idx}`}
              className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white"
            >
              <span>{item}</span>
              <span className="text-white/40">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
