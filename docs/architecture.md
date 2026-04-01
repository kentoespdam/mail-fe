# Architecture Decisions (ADRs)

## ADR-001: Modular Context
**Status:** Accepted

* **Problem:** Root `CLAUDE.md` bloat causing token waste and loss of relevance.
* **Decision:** Implement per-module `CLAUDE.md` in `src/`. Root file acts strictly as an **index**.
* **Impact:** Higher AI precision, reduced token usage, and localized documentation for better maintainability.

## ADR-002: Workflow-First (Skills)
**Status:** Accepted

* **Problem:** Commands are limited to single-shot scripts; lack complex multi-step logic.
* **Decision:** Prioritize **Skills** (bundled prompts + tools) for repetitive/complex workflows. Use **Commands** only for ad-hoc or 1-step tasks.
* **Impact:** Better alignment with developer mental models and superior automation for complex interactions.

## ADR-003: Quality Guardrails (Hooks)
**Status:** Accepted

* **Problem:** High risk of AI/Human errors (imports, API misuse, linting).
* **Decision:**
    * **Pre-commit:** Mandatory linting and testing.
    * **Post-edit:** Auto-format on save.
    * **Policy:** Strictly **no** `--no-verify`.
* **Impact:** Guaranteed code quality and automated enforcement of project standards.
