# Animation Optimization Audit

## Problems found in the previous Phase 2 build

1. Continuous requestAnimationFrame loop
- The previous build ran a permanent animation loop across every card.
- It wrote CSS variables every frame even when the user was not touching or scrolling.
- This is expensive on mobile and makes motion feel unstable.

2. Expensive animated properties
- The previous build animated blur/filter/letter-spacing and a large fixed blurred background.
- Those are much more likely to cause jank on iPhone Safari than transform/opacity.

3. Too many systems fighting the same transform
- Hero, project and service cards were all getting transform changes from layout, stack, float, drag and reveal at the same time.
- The result was difficult to tune and easy to break.

4. Project stack updated too often
- Project card stack variables were being updated in the permanent frame loop.
- They only need to update during scroll.

5. Drag updates were not isolated enough
- Drag movement should only update the touched card.
- The previous system kept updating every animated card.

## What this optimized build changes

- Removed the permanent rAF loop.
- Scroll motion is throttled to one requestAnimationFrame and only runs while scrolling.
- Drag motion updates only the touched card.
- Reveal animations use only opacity + transform.
- Removed animated blur/filter/letter-spacing.
- Kept the mobile-first centered layout.
- Kept tap 1 to bring forward and tap 2 to open.
- Kept sticky-feeling project stack, but optimized it.
