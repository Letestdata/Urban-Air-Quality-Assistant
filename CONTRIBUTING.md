# Contributing to Urban Air AI

Thank you for your interest in improving Urban Air AI. We welcome contributions that align with our mission of providing accessible, reliable, and science-grounded environmental health intelligence.

---

## Code Quality Standards

1. **Deterministic Safety First:**
   - Environmental rules and medical guardrails are strictly deterministic. The AI layer must never override the hardcoded safety constraints in `backend/app/rules/safety_engine.py`.
2. **Type Safety:**
   - Python code must pass static typing checks and `ruff check backend/`.
   - Frontend TypeScript code must compile with zero errors (`npm run typecheck`).
3. **Accessibility (WCAG 2.2 AA):**
   - Air quality status must never rely on color alone. All status badges must display a numerical value, text label, and an accessible icon.
   - All interactive controls must support visible keyboard focus rings (`:focus-visible`).
4. **Testing Requirements:**
   - Every new feature, endpoint, or calculation rule must include corresponding unit tests.
   - Run the complete test suite before submitting:
     ```bash
     npm test
     cd backend && pytest tests/ -v
     ```

---

## Development Workflow

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`).
2. Implement your changes following existing architectural patterns.
3. Verify that all automated tests pass.
4. Open a pull request describing the changes and referencing the relevant PRD section.
