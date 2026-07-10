## Recent Changes

- Improved the style of #id_player by adding spacing on the sides and top for a cleaner look.
- Added responsive design: on mobile devices, side spacing is removed for better compatibility.
- Added a class to the footer for easier CSS customization and future style adjustments.
- Added a `July_theme` button below the player that switches the page to a red, white, and blue background.

## Series Feature Update (2026-07-10)

### Implementation Details

#### src/index.js
- Global variable: `let videoData = {}` stores all series/videos data loaded once
- New async function: `load_video_json()` fetches videos.json via fetch API at startup

#### src/init_ui.js
- `create_series_buttons()` - Generate series selector buttons from videoData.series
- `update_series(key)` - Show selected series title and create video buttons
- `create_series_video_buttons(key)` - Create video buttons for the selected series

#### src/action.js
- `toggle_buttons_action()` - Toggle 365 buttons; close Series if opening 365 (mutually exclusive)
- `toggle_series_action()` - Toggle Series buttons; close 365 if opening Series (mutually exclusive)
- `set_365_visible(visible)` - Helper to show/hide 365 panel
- `set_series_visible(visible)` - Helper to show/hide Series panel
- `sync_shared_panel_visibility()` - Sync shared element visibility to avoid empty gaps

#### src/index.html
- New button: `id_button_toggle_series` for independent Series toggle
- New containers: `id_series_button_container`, `id_series_detail`, `id_series_video_button_container` (all hidden by default)

### Key Features

- 365 functionality unchanged: created from dateFacts, starts hidden, preserves original playback
- Series data loaded once: no repetition via global videoData
- Mutually exclusive display: only one panel (365 or Series) shows at a time
- Clean UI: Series shows title + video buttons (no thumbnail)
- State synchronization: shared elements adapt to prevent visual gaps

## Future Directions

- Further optimize the mobile experience for more devices.
- Add theme switching (e.g., dark mode).
- Enhance player features and interactivity.
- Continuously refine UI details and performance.
