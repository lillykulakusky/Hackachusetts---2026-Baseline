# Baseline — Steering

These rules apply to all work on Baseline.

## Safety (non-negotiable)
- Never use diagnostic language. State changes, not causes. Say "resting heart
  rate is elevated, worth asking about," never "possible infection."
- Every numeric claim in a brief MUST come from a value computed by the code.
  The AI/templating layer may only phrase findings; it must never produce numbers.
- Use synthetic data only. No real patient data, ever.

## Product
- The user is the clinician, not the wearer.
- Brand-agnostic: WHOOP, Oura, Apple, Fitbit all map to one standard model.
- Compare every metric against the patient's OWN baseline, not population norms.
- Keep the brief to ~30 seconds of reading. Flag only what changed.

## Engineering
- Keep the core logic (parse, normalize, analyze, brief) framework-free so it can
  move from this static app to Next.js later untouched.
- Deterministic math in analyze.js; prose generation isolated in brief.js.
- No secrets in the repo. Any LLM key comes from the environment at runtime.
