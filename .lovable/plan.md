# Kinetic Cinematic Portfolio

## Goal
Turn the homepage into a scroll-driven motion-graphics experience and reorganize the portfolio into four clear categories without changing the existing upload, publishing, contact, pricing, or admin behavior.

## Build
- Replace the single “Recent Cuts” grid with four full-width portfolio chapters: Motion Graphics, Talking Head Videos, Random Edit, and Business Edit.
- Keep every published CMS item in the portfolio, grouping older “General Editing” items under Random Edit so existing work does not disappear.
- Add the four categories to the admin upload and edit form, including Business Edit.
- Give each chapter a distinct cinematic layout, oversized moving type, opposing text rails, animated frames, layered depth, and its own color atmosphere.
- Add motion-graphics interludes and scroll-triggered typography across the full homepage so each major scroll reveals a new moving composition rather than relying only on glitch effects.
- Keep videos readable and interactive, and provide restrained fallbacks for smaller screens and visitors who prefer reduced motion.

## Validation
- Verify all four categories appear and existing published work is placed correctly.
- Check YouTube/TikTok embeds, uploaded videos, navigation, and contact access on desktop and mobile.
- Confirm motion does not overlap text or controls and the latest preview has no errors.

## Technical details
- Use the selected Kinetic Cinematic Flux direction with CSS view-timeline animations, marquees, layered typography, and semantic accent tokens.
- Extend the existing React/CSS structure without adding a new animation dependency.
- Normalize legacy category names in the display layer while saving all new CMS entries with the new category names.
