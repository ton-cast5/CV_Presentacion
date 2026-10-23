"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const A4_WIDTH_MM = 210;
const MM_TO_PX = 96 / 25.4;
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;

type Props = {
  children: ReactNode;
};

/** Scales A4 sheet to fit container width — keeps layout, no browser zoom needed */
export function ResponsiveCvFrame({ children }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(A4_WIDTH_PX * (297 / 210));

  useEffect(() => {
    const frame = frameRef.current;
    const sheet = sheetRef.current;
    if (!frame || !sheet) return;

    const update = () => {
      const w = frame.clientWidth;
      const nextScale = Math.min(1, w / A4_WIDTH_PX);
      setScale(nextScale);
      setHeight(sheet.scrollHeight * nextScale);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    ro.observe(sheet);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="w-full">
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          width: A4_WIDTH_PX * scale,
          height,
        }}
      >
        <div
          ref={sheetRef}
          className="absolute left-0 top-0 origin-top-left fc-paper"
          style={{
            width: A4_WIDTH_PX,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
