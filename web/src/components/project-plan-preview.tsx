/**
 * ProjectPlanPreview (Phase 3).
 *
 * Responsibility:
 * - Render a project plan inline inside a chat message.
 * - Workstreams are expandable/collapsible; deliverables are shown as a list.
 *
 * Why this exists:
 * - Keeps message rendering simple by encapsulating the plan UI (SOLID: SRP).
 *
 * Note:
 * - This component uses minimal styling and existing project utilities; we avoid adding new UI deps (YAGNI).
 */

import {ProjectPlan} from "../types/project-plan";
import {cn} from "../lib/utils";

export function ProjectPlanPreview({plan, className}: {plan: ProjectPlan; className?: string}) {
  return (
    <div className={cn("w-full rounded-lg border bg-background", className)}>
      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold">Project plan</div>
        <div className="text-xs text-muted-foreground">
          {plan.workstreams.length} workstream{plan.workstreams.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {plan.workstreams.map((ws, idx) => (
          <details key={idx} className="rounded-md border bg-accent/40">
            <summary className="cursor-pointer select-none px-3 py-2 text-sm font-semibold">
              {ws.title}
            </summary>
            <div className="px-3 pb-3 pt-1 text-sm">
              <div className="whitespace-pre-wrap text-muted-foreground">{ws.description}</div>

              <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Deliverables
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {ws.deliverables.map((d, dIdx) => (
                  <div key={dIdx} className="rounded-md bg-background px-3 py-2">
                    <div className="text-sm font-semibold">{d.title}</div>
                    <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {d.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

