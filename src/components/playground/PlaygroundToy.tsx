"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArtifactFrame } from "../ArtifactFrame";
import { useReducedMotion, useReveal } from "@/lib/hooks";
import { shouldUseWebGL } from "@/lib/webgl";
import { hexA } from "@/lib/textures";

const PlaygroundToyGL = dynamic(() => import("./PlaygroundToyGL"), {
  ssr: false,
});

export function PlaygroundToy() {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const { ref, mounted, revealed } = useReveal<HTMLDivElement>();
  const [progress, setProgress] = useState(0.5);
  const [scale, setScale] = useState(2.4);

  useEffect(() => setWebgl(shouldUseWebGL()), []);

  const animate = webgl && !reduced && revealed;

  return (
    <div>
      <ArtifactFrame label="denoise toy — drag to develop">
        <div ref={ref} className="absolute inset-0">
          {webgl && mounted ? (
            <PlaygroundToyGL progress={progress} scale={scale} animate={animate} />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(80% 80% at 50% 40%, ${hexA(
                  "#8a8077",
                  0.12,
                )}, transparent 70%), #1C1611`,
              }}
            />
          )}
        </div>
      </ArtifactFrame>

      {webgl ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Slider
            id="toy-develop"
            label="develop"
            min={0}
            max={1}
            step={0.01}
            value={progress}
            onChange={setProgress}
            display={`${Math.round(progress * 100)}%`}
          />
          <Slider
            id="toy-grain"
            label="grain scale"
            min={1}
            max={6}
            step={0.1}
            value={scale}
            onChange={setScale}
            display={scale.toFixed(1)}
          />
        </div>
      ) : (
        <p className="mt-6 font-mono text-label text-ash-500">
          interactive shader needs webgl — showing a still frame
        </p>
      )}
    </div>
  );
}

function Slider({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="flex items-baseline justify-between font-mono text-label text-ash-500">
        <span>{label}</span>
        <span className="text-paper-dim">{display}</span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-valuetext={display}
        className="toy-range mt-3 w-full"
      />
    </label>
  );
}
