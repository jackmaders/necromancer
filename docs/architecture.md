# Project Architecture

This project follows the principles of **Feature-Sliced Design (FSD)**. The goal is to create a scalable and maintainable codebase by organizing code according to business domains rather than technical types.

The structure is divided into **Layers**, and within some layers, code is grouped by business **Entities**.

```
src
├── app/
├── features/
├── entities/
└── shared/
```

## Layers

Layers are the main horizontal division of the project. They have a strict hierarchy: higher layers can import from lower layers, but **never** the other way around.

**The rule:** `app` -> `features` -> `entities` -> `shared`

1.  `app/` - **The highest layer.** This is the entry point of the application. It initializes the Discord client, connects to the database, registers commands, and sets up global middleware and error handlers. It composes the final application from the lower-level layers.

2.  `features/` - **User interactions and use cases.** Each subdirectory in `features/` represents a specific user action, most often a single slash command. A feature's job is to orchestrate a response to a user action by calling logic from the `entities` layer. For example, `features/post-availability/` handles the logic for the `/availability post` command.

3.  `entities/` - **Business domains.** This is the core of the application. Each subdirectory here represents a core business entity (e.g., `user`, `schedule`, `availability`). An entity contains all the self-contained logic, data types, and UI components related to that domain. It should not know about what commands are implemented (`features`) or how the bot in setup (`app`).

4.  `shared/` - **The lowest layer.** Contains reusable code that is not tied to any specific business domain. This includes things like a generic logger, global configuration, common UI elements, and utility functions. It cannot import from any other layer.

## Entities

The `entities` layer is the heart of our business logic. Each entity (e.g., `entities/user/`) is a self-contained module. To keep them organized, each entity is broken down into standard **segments**:

- `/ui`: Contains functions that build UI components for Discord, like Embeds, Action Rows, and Buttons.
- `/model`: Contains the core business logic, data types, and state management for the entity. This is where the main "work" is done.
- `/api`: Contains functions that handle communication with external services, primarily the database.
- `/lib`: Contains miscellaneous helpers, constants, or utility functions that are specific _only_ to this entity.
- `/config`: Contains configuration & feature flags for this specific entity.
