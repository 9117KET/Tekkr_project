/**
 * Project plan parser (Phase 3).
 *
 * Responsibility:
 * - Detect a `<project_plan>...</project_plan>` block in a message.
 * - Parse the JSON safely and return an inline rendering model:
 *   text-before, projectPlan, text-after.
 *
 * Why this exists:
 * - Keeps parsing logic out of UI components (SOLID: Single Responsibility).
 * - Makes it easier to iterate on the plan format without touching the rendering code.
 */

import {ProjectPlan, Workstream, Deliverable} from "../types/project-plan";

const OPEN = "<project_plan>";
const CLOSE = "</project_plan>";

export interface ParsedProjectPlanMessage {
  beforeText: string;
  afterText: string;
  projectPlan: ProjectPlan | null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isDeliverable(v: unknown): v is Deliverable {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  return isNonEmptyString(d.title) && isNonEmptyString(d.description);
}

function isWorkstream(v: unknown): v is Workstream {
  if (!v || typeof v !== "object") return false;
  const w = v as Record<string, unknown>;
  const deliverables = w.deliverables;
  return (
    isNonEmptyString(w.title) &&
    isNonEmptyString(w.description) &&
    Array.isArray(deliverables) &&
    deliverables.every(isDeliverable)
  );
}

export function isProjectPlan(v: unknown): v is ProjectPlan {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  const workstreams = p.workstreams;
  return Array.isArray(workstreams) && workstreams.every(isWorkstream);
}

function splitByProjectPlanTag(content: string): {beforeText: string; jsonText: string; afterText: string} | null {
  const start = content.indexOf(OPEN);
  const end = content.indexOf(CLOSE);
  if (start === -1 || end === -1 || end <= start) return null;
  const beforeText = content.slice(0, start);
  const jsonText = content.slice(start + OPEN.length, end).trim();
  const afterText = content.slice(end + CLOSE.length);
  return {beforeText, jsonText, afterText};
}

export function parseProjectPlanMessage(params: {content: string; projectPlan?: unknown}): ParsedProjectPlanMessage {
  const {content, projectPlan} = params;

  const tagged = splitByProjectPlanTag(content);
  if (tagged) {
    try {
      const parsed = JSON.parse(tagged.jsonText) as unknown;
      return {
        beforeText: tagged.beforeText,
        afterText: tagged.afterText,
        projectPlan: isProjectPlan(parsed) ? parsed : null,
      };
    } catch {
      return {beforeText: content, afterText: "", projectPlan: null};
    }
  }

  // Fallback: if server attached a projectPlan object but tags are missing, render it at the end.
  if (projectPlan && isProjectPlan(projectPlan)) {
    return {beforeText: content, afterText: "", projectPlan};
  }

  return {beforeText: content, afterText: "", projectPlan: null};
}

