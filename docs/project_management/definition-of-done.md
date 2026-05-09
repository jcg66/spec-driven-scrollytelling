# Definition of Done Template

Use this template when closing a future spec or sprint.

## Metadata

- Spec:
- Sprint:
- Date:
- Commit(s):

## Implementation Checklist

- [ ] The requested behavior is implemented in the codebase.
- [ ] The implementation stays within the stated spec or sprint scope.
- [ ] Existing behavior outside the scope remains intact.
- [ ] Any related documentation is updated.

## Verification Checklist

- [ ] `npm test`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run verify:export`
- [ ] Manual review on desktop width
- [ ] Manual review on mobile width
- [ ] Manual review with reduced motion
- [ ] Browser checks under the repository base path

## Quality Gates

- [ ] No regression in narrative continuity.
- [ ] No regression in static export behavior.
- [ ] No regression in accessibility basics.
- [ ] No regression in content integrity.
- [ ] Evidence of verification is recorded in the status file.

## Notes

- What changed:
- What was verified:
- What remains open:
