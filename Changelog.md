# Changelog

## [0.0.3] - 2026-04-21
### Added
- **Firebase Connection Fix:** Added `experimentalForceLongPolling` and stream disabling to maintain robust connections in preview mode.
- **Tasks Widget (`TasksWidget.tsx`):**
  - Fetches tasks dynamically from Firestore.
  - Auto-generates starter daily tasks based on categories.
  - Features a real-time progress bar and success styling.
- **XP System Base:**
  - Users now earn `25 XP` per completed task.
  - New XP status element replaced the mock component in the Dashboard.

## [0.0.2] - 2026-04-21
### Added
- Created `README.md` file featuring project vision and quick links.
- Added foundational visual artwork assets (4 new inspiration/brand images).
- Version bumped from 0.0.1 to 0.0.2.
- Prepared Todo.md to start phase 0.0.2 ("Digital Identity").

## [0.0.1] - 2026-04-21
### Added
- Setup of IndeGrow OS project.
- Hebrew support (Direction: RTL).
- User interface foundation (Header, Navigation, Dashboard).
- Version tag display with Markdown-rendered Changelog Modal.
- Todo List viewer Modal.
- About section (Leon Yaakubov / AnLoMinus).
- Firebase Authentication (Google Login).
- Gemini API token usage estimation logic.
- Initial Firestore security rules integration.
