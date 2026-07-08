---
name: code-cleanup
description: Run after completing code changes in this repo. Removes unused imports/variables/dead code, strips debug logs and stale comments, fixes import order/formatting, and runs the linter and tests for affected files.
---

# Code Cleanup Checklist

After completing any code change, perform these steps in order:

1. **Remove unused** imports, variables, parameters, and dead code.
2. **Remove debug output** (`console.log`, `debugger`) and stale commented-out code.
3. **Verify imports**:
   - Group order: third-party → internal modules → types/assets.
4. **Confirm formatting** (2-space indent; rely on Prettier).
5. **Run linter** and fix issues related to your change.
6. **Run tests** for affected files (Vitest).
7. **Confirm file size**: target under 200 lines; split if exceeded.

Report any remaining warnings or untouched issues to the user rather than silently leaving them.
