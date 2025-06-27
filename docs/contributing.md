# Contributing

## Development Setup

### Prerequisites

1. [Bun](https://bun.sh/) (v1.2.2 or later recommended)
2. A Discord Server and Account with administrative permissions.
3. A Discord Bot Application created via the [Discord Developer Portal](https://discord.com/developers/applications).

### Setup

```bash
# Install dependencies
bun install
```

```bash
# Setup environment variables
# Ensure to set the relevant variables in the new .env file
cp .env.example .env
```

```bash
# Setup database
bunx prisma migrate dev
```

```bash
# Run the bot
bun run start
```

### Database changes

If you make any changes to `prisma/schema.prisma` you will need to re-run the database migration command.

```bash
bunx prisma migrate dev
```

During development, the database migration command will likely automatically generate a typed Prisma Client based on your schema. However, you may need to generate one manually with the below script.

```bash
bunx prisma generate
```

## Coding Standards

### Discord.js Ephemeral Replies

- Avoid the Deprecated `ephemeral: true` option when sending replies or follow-ups that should only be visible to the user.
- Instead, you should import `MessageFlags` from `discord.js` and use the `flags` property on the reply or follow-up.

```typescript
import { MessageFlags } from "discord.js";

// Correct
await interaction.reply({
  content,
  flags: [MessageFlags.Ephemeral],
});

// Incorrect
// await interaction.reply({
//     content,
//     ephemeral: true // <-- Do not use
// });
```

### Discord.js Reply With Response

- Avoid the Deprecated `fetchReply: true` option when sending replies via the discord.js SDK.
- Instead, you should use the new `withResponse: true` property.

```typescript
import { MessageFlags } from "discord.js";

// Correct
await interaction.reply({
  content,
  withResponse: true,
});

// Incorrect
// await interaction.reply({
//     content,
//     fetchReply: true // <-- Do not use
// });
```

### Zod Import

Zod V4 is considered stable and should be using "/v4" import path starting at version 3.25.0 (https://zod.dev/v4). Once 4.0.0 is released, we can remove the "/v4" import path and use "zod" directly.

```typescript
// Correct
import { z } from "zod/v4";

// Incorrect
// import { z } from "zod";
```
