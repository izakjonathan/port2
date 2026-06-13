# Smooth Float Animation Audit

## What was causing the janky sharp movement

The previous optimized build still had a hidden transform conflict:

```css
[data-reveal] {
  opacity: 0;
  transform: translate3d(0,14px,0);
}

.motion-ready [data-reveal].is-visible {
  animation: optimizedReveal ...
}

@keyframes optimizedReveal {
  to { transform: translate3d(0,0,0); }
}
```

The hero/project/service cards also had `data-reveal`.

That meant the reveal animation was temporarily overriding the cards' real positioning transform. The card would move in one direction during reveal, then snap back to the real transform. That is the sharp one-way/other-way movement.

## What changed

- Removed reveal transform from card elements.
- Cards now reveal with opacity only.
- Text/sections can still reveal with a small transform because they do not have the card positioning transform.
- Added smooth CSS float using typed custom properties:
  - `--float-x`
  - `--float-y`
- The float variables are built into the actual card transforms instead of replacing them.
- No permanent JavaScript animation loop.
- Drag still only updates the touched card.
- Tap 1 brings front; tap 2 opens.

## Expected feel

- Cards should gently pulse/float at different speeds.
- No sharp jump from reveal.
- No side-to-side snap.
- Touch drag should feel independent from idle float.
