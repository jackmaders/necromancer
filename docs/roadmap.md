# 🗺️ Project Roadmap

## v0.X

Any releases before v1.0 will focus on getting the bot set up and running with essential functionality.

## v1.0: Availability Query

This release establishes the bot's core ability to ask for and display player availability for multiple teams.

### Commands & Features

- `/team create`: Starts a guided setup to create a new team, including its roles and channels.
- `/help`: Lists all commands.
- `/availability post`: Manually creates the availability poll for the team associated with the current channel.
- `/config view`: Shows the current team's settings.
- `/config preferences`: Sets the team's preferences, like the duration for availability polls.
- `/config schedule type:poll`: Sets the team's automated schedule for posting the poll.

### User Experience

- The bot posts an embed for the upcoming week (e.g., **Monday, 23 June 2025 - Sunday, 29 June 2025**) in a team's dedicated channel. Players use buttons to mark themselves available, and a live summary shows the results.

## v1.1: Edit Availability

This release allows players to change their submitted availability.

### Features

- An "Edit Availability" button is added to the poll message.

### User Experience

- Clicking the button re-opens the selection UI (e.g., a modal) for that player to modify their choices.

## v1.2: Availability Reminders

This release adds reminders to ensure polls are completed on time.

### Commands & Features

- `/team config reminders type:availability enabled:<boolean>`: Enables or disables availability reminders for the team.
- **Update:** `/team create` now includes a prompt to enable this feature by default.

### User Experience

- If enabled, the bot sends a polite DM to any player who hasn't responded 24 hours before the poll closes.

## v1.3: Roster Generation

This release introduces the core scheduling intelligence.

### Commands & Features

- `/roster generate`: Generates a draft roster for the current team.
- `/team config link_roles`: Links team-specific concepts (e.g., "Tank") to Discord roles (e.g., `@MyTeam-Tank`).
- `/roles assign [user] [role]`: Assigns a team-specific role to a player.
- `/roles sync`: Audits and fixes Discord roles against the team's configuration.
- **Update:** `/team config preferences` now sets the team's roster logic (min/max days, preferred days) and role self-assign permissions.
- **Update:** `/team config schedule type:roster`: Sets the team's schedule for automated roster generation.
- **Update:** `/team create` is now a comprehensive wizard for all of a team's core configuration.

### User Experience

- The scheduler generates a draft roster, prioritising the team's `preferred_days` from their configuration. Players can be managed with `/roles assign`, and the `/team create` wizard makes initial configuration seamless.

## v1.4: Schedule Confirmation

This release adds an administrative approval workflow.

### Commands & Features

- `/team config channel <type> <channel>`: Sets a team's dedicated channels for `availability`, `draft_rosters`, and `confirmed_rosters`.
- **Update:** Bot posts now go to their configured channels.

### User Experience

- The roster draft appears in the private `#drafts` channel with `✅ Accept` and `📝 Edit` buttons. `Accept` posts it publicly to `#confirmed_rosters`. `Edit` provides the manager with the markdown source to manually adjust and post.

## v1.5: Preferred Roles

This release adds flexibility by allowing players to have preferred and fallback roles.

### Commands & Features

- **Update:** `/roles assign` (for a team) now accepts an optional `fallback_role` argument.
- **Update:** `/roster generate` logic is enhanced.

### User Experience

- The scheduler's priority is now: **1. Main roles on preferred days**, **2. Main roles on any day**, **3. Fallback roles on preferred days**, **4. Fallback roles on any day**. This hierarchy ensures the most optimal roster is found first. The draft roster will clearly mark when a fallback role is used.

## v1.6: Ringers

This release integrates substitute players into the workflow.

### Commands & Features

- **Update:** `/team config link_roles` now accepts a `ringer` type for a specific team.
- **Update:** `/availability post [include_ringers:<boolean>]` can now include ringers from the team's configured ringer role.
- **Update:** The availability poll message gains a button for managers: "Open to Ringers".
- **Update:** `/roster generate [with_ringers:<boolean>]` can now include ringers in calculations.
- **Update:** `/team create` now includes an option to set the team's ringer role.

### User Experience

- If a roster draft fails, the bot suggests including ringers. The manager can click the "Open to Ringers" button on the original poll, which will ping the `@Ringer` role and set a new deadline. Alternatively, they can post a new poll with ringers included from the start. Once ringers respond, `/roster generate with_ringers:True` will create the roster.

## v1.7: Event Reminders

This release adds automated reminders for confirmed events.

### Commands & Features

- **Update:** `/team config reminders <type>` now accepts an `event` type.

### User Experience

- When a manager `✅ Accepts` a draft roster, the bot logs the confirmed events. If enabled, it will post a reminder 30 minutes before the event, pinging only the players rostered for that specific event.

## v1.8: Preferential Availability

This final enhancement adds a new layer of nuance to player availability.

### Features

- **Update:** The availability poll UI is redesigned. Instead of simple Available/Unavailable buttons, there are now three states.
- **Update:** The scheduler logic is updated to use this new data.

### User Experience

- Players now have three choices for each day: `✅ Available`, `🟡 Prefer Not`, or `❌ Unavailable`.
- The scheduler's final priority stack is now fully defined: It will always find the best option by prioritising **1st: Player Roles** (main over fallback), then **2nd: Availability Status** (`Available` over `Prefer Not`), then **3rd: Day Preference** (configured `preferred_days` over other days). This creates the highest quality schedule possible based on team-wide and individual preferences.
