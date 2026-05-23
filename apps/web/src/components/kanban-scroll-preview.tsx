"use client";

import Image from "next/image";
import { ContainerScroll } from "./container-scroll";

export function KanbanScrollPreview() {
  return (
    <ContainerScroll
      titleComponent={
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your workflow, visualized
        </h2>
      }
    >
      {/* Browser chrome */}
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-white/10 bg-zinc-800/80 px-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="mx-auto rounded border border-white/10 bg-zinc-900/60 px-8 py-0.5 text-[10px] text-white/30">
          app.shipyard.dev
        </span>
      </div>

      {/* Kanban preview — CSS theme toggle, no useTheme needed */}
      <div className="relative h-[calc(100%-2rem)] w-full overflow-hidden">
        <Image
          src="/kanban-preview-light.png"
          alt="Shipyard kanban board"
          fill
          className="object-cover object-top block dark:hidden"
          draggable={false}
          priority
        />
        <Image
          src="/kanban-preview-dark.png"
          alt="Shipyard kanban board"
          fill
          className="object-cover object-top hidden dark:block"
          draggable={false}
          priority
        />
      </div>
    </ContainerScroll>
  );
}
