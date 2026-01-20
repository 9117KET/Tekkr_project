/**
 * Project plan types (Phase 3).
 *
 * Responsibility:
 * - Define the minimal, UI-facing shape for project plans so rendering is type-safe.
 *
 * Note:
 * - This is intentionally small (YAGNI). We only model what we need to render the preview.
 */

export interface ProjectPlan {
  workstreams: Workstream[];
}

export interface Workstream {
  title: string;
  description: string;
  deliverables: Deliverable[];
}

export interface Deliverable {
  title: string;
  description: string;
}

