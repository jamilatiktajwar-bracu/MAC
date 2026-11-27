# MAC OS Visual Design System (Prototype)

## Identity
MAC is an original desktop experience with familiar desktop conventions, not an Apple/macOS clone. Keep the command-mark motif and MAC wordmark; avoid Apple logos, copied proprietary icons, or system assets.

## Core palette
- Night: `#091426` / `#101C39` — desktop base
- Slate: `#1A1C24` — shell surfaces
- Cloud: `#F4F6FC` — light application surfaces
- Blue: `#6686F6` — primary action and selected state
- Sky: `#53B8FF` — accent glow
- Violet: `#A77BFF` — secondary glow
- Rose: `#DF76AD` — alternate accent
- Mint: `#56BF9C` — positive/active accent

## Typography
- Inter is the prototype UI font; system fallbacks remain for offline builds.
- Use strong hierarchy, short labels, and high legibility.
- Avoid small low-contrast text for important actions.

## Surface and spacing
- Floating surfaces use translucent dark/light backgrounds and soft borders.
- Desktop panel and dock use restrained blur; avoid blur on content-heavy views.
- Rounded corners: 10–14 px for controls, 18–24 px for shell surfaces.
- Spacing rhythm: 4 / 8 / 12 / 16 / 24 / 32 px.
- Animation should be short, calm, and disabled/reduced when accessibility preferences request it.

## Desktop behavior
- Top panel contains the MAC entry point, app/menu context, status controls, and clock.
- Dock favorites are fixed for this prototype; active apps receive a small dot.
- Launcher search is keyboard accessible: arrow keys, Enter, Escape.
- Window actions must remain discoverable and focus states visible.
- Default native session is dark with an original blue/violet wallpaper.

## Accessibility and privacy
- Keep keyboard focus visible and controls labeled.
- Never collect credentials or user files in the prototype.
- Demo browser and terminal must clearly remain simulated until real integrations are built.
- Keep the system shell reversible and retain GNOME's underlying accessibility/window management while developing.

## Implementation status
This document describes a direction, not a completed product-wide theme. Validate contrast, scaling, RTL, reduced motion, and screen-reader behavior before release.