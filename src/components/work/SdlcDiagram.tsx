"use client";

import { useReveal } from "@/lib/hooks";

/** Clean architecture diagram for the agentic SDLC: skills (left) orchestrated
 *  by Claude Code (centre) over MCP servers (right). The four stages I owned
 *  are highlighted in the section accent. Genericized — no internal screens/data. */

const SKILLS: { label: string; owned: boolean }[] = [
  { label: "RPE", owned: true },
  { label: "Spike", owned: true },
  { label: "Epic", owned: true },
  { label: "Ticket", owned: true },
  { label: "Dev work", owned: false },
  { label: "PR review", owned: false },
  { label: "Address PR comments", owned: false },
];

const MCP = ["Confluence", "Jira", "Bitbucket", "Context mgmt"];

const SK_X = 40;
const SK_W = 250;
const SK_H = 54;
const SK_Y0 = 80;
const SK_STEP = 70;
const skCy = (i: number) => SK_Y0 + i * SK_STEP + SK_H / 2;

const HUB = { x: 420, y: 268, w: 200, h: 124 };
const hubMid = HUB.y + HUB.h / 2;

const MC_X = 720;
const MC_W = 250;
const MC_H = 54;
const MC_Y0 = 150;
const MC_STEP = 78;
const mcCy = (i: number) => MC_Y0 + i * MC_H + i * (MC_STEP - MC_H) + MC_H / 2;

export function SdlcDiagram({ label }: { label: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="transition-[opacity,transform] duration-[var(--duration-reveal)] ease-[var(--ease-develop)]"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(12px)",
      }}
    >
      <svg
        viewBox="0 0 1010 590"
        className="h-auto w-full"
        role="img"
        aria-label={`${label}. Skills — RPE, spike, epic and ticket creation (which I owned), then dev work, PR review and addressing PR comments — orchestrated by Claude Code over MCP servers for Confluence, Jira, Bitbucket and context management.`}
      >
        {/* lane labels */}
        <text x={SK_X} y={50} className="font-mono" fontSize="15" fill="#8a8077">
          skills
        </text>
        <text x={MC_X} y={50} className="font-mono" fontSize="15" fill="#8a8077">
          mcp servers
        </text>

        {/* connectors: skills -> hub */}
        {SKILLS.map((_, i) => (
          <line
            key={`sl${i}`}
            x1={SK_X + SK_W}
            y1={skCy(i)}
            x2={HUB.x}
            y2={hubMid}
            stroke="#2a221b"
            strokeWidth="1.5"
          />
        ))}
        {/* connectors: hub -> mcp */}
        {MCP.map((_, i) => (
          <line
            key={`ml${i}`}
            x1={HUB.x + HUB.w}
            y1={hubMid}
            x2={MC_X}
            y2={mcCy(i)}
            stroke="#2a221b"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          />
        ))}

        {/* skill boxes */}
        {SKILLS.map((s, i) => {
          const y = SK_Y0 + i * SK_STEP;
          return (
            <g key={s.label}>
              <rect
                x={SK_X}
                y={y}
                width={SK_W}
                height={SK_H}
                rx="3"
                fill={s.owned ? "var(--color-accent)" : "#1c1611"}
                fillOpacity={s.owned ? 0.12 : 1}
                stroke={s.owned ? "var(--color-accent)" : "#2a221b"}
                strokeWidth="1.5"
              />
              <text
                x={SK_X + 18}
                y={y + SK_H / 2 + 5}
                className="font-mono"
                fontSize="15"
                fill={s.owned ? "var(--color-accent)" : "#c9c0b4"}
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {/* hub */}
        <rect
          x={HUB.x}
          y={HUB.y}
          width={HUB.w}
          height={HUB.h}
          rx="4"
          fill="#1c1611"
          stroke="#c9c0b4"
          strokeWidth="1.5"
        />
        <text
          x={HUB.x + HUB.w / 2}
          y={hubMid - 6}
          textAnchor="middle"
          className="font-display"
          fontSize="22"
          fill="#ece3d5"
        >
          Claude Code
        </text>
        <text
          x={HUB.x + HUB.w / 2}
          y={hubMid + 20}
          textAnchor="middle"
          className="font-mono"
          fontSize="12"
          fill="#8a8077"
        >
          orchestrator
        </text>

        {/* mcp boxes */}
        {MCP.map((m, i) => {
          const y = mcCy(i) - MC_H / 2;
          return (
            <g key={m}>
              <rect
                x={MC_X}
                y={y}
                width={MC_W}
                height={MC_H}
                rx="3"
                fill="#1c1611"
                stroke="#2a221b"
                strokeWidth="1.5"
              />
              <text
                x={MC_X + 18}
                y={y + MC_H / 2 + 5}
                className="font-mono"
                fontSize="15"
                fill="#c9c0b4"
              >
                {m}
              </text>
            </g>
          );
        })}

        {/* legend */}
        <rect x={SK_X} y={560} width="14" height="14" rx="2" fill="var(--color-accent)" fillOpacity="0.5" stroke="var(--color-accent)" />
        <text x={SK_X + 24} y={571} className="font-mono" fontSize="13" fill="#8a8077">
          stages I owned
        </text>
      </svg>
    </div>
  );
}
