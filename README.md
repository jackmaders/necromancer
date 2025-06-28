- [![Lint CI](https://github.com/jackmaders/necromancer/actions/workflows/lint.yml/badge.svg)](https://github.com/jackmaders/necromancer/actions/workflows/lint.yml) [![Unit Tests](https://github.com/jackmaders/necromancer/actions/workflows/test.yml/badge.svg)](https://github.com/jackmaders/necromancer/actions/workflows/test.yml) [![Built with Biome](https://img.shields.io/badge/built%20with-Biome-60A5FA?logo=biome&style=flat)](https://biomejs.dev/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Necromancer is a powerful, intelligent Discord bot designed to streamline the complex process of scheduling for gaming teams. It automates availability polls, generates optimal rosters based on player preferences, and manages event reminders, letting you focus on the game, not the logistics.

## ✨ Key Features

- **Multi-Team Management**: Configure and manage independent schedules, roles, and rosters for any number of teams in your server.
- **Automated Availability Polls**: Posts clear, interactive polls for players to mark their availability for the upcoming week.
- **Intelligent Roster Generation**: Suggest draft rosters that prioritize the team's preferred days and players' preferred roles.
- **Advanced Role Management**: Configure team roles and integrate substitute players (`@Ringer`) seamlessly.
- **Nuanced Preferences**: Supports `Available`, `Prefer Not`, and `Unavailable` states for more flexible scheduling.

## 🛠️ Tech Stack & Architecture

This project is built with a modern, performance-focused toolchain and a highly scalable architecture.

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-%236E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white)
![Biome](https://img.shields.io/badge/biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)

## ✨ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.x or later)
- A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/jackmaders/necromancer.git](https://github.com/jackmaders/necromancer.git)
    cd necromancer
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Copy the example environment file and fill in your development secrets.

    ```bash
    cp .env.example .env
    ```

4.  **Set up the database:**
    This command will apply the database schema.

    ```bash
    bunx prisma migrate dev
    ```

5.  **Run the bot in development mode:**
    The bot will start and automatically reload on file changes.

    ```bash
    bun run start
    ```

6.  **Deploy slash commands:**
    To use slash commands, you need to register them with Discord. You only need to run this script one time, and then when you add a new command.
    ```bash
    bun run commands:deploy
    ```

## 🗺️ Project Roadmap

Curious about where the project is headed? We have a detailed plan outlining all upcoming features and versions in our [**Project Roadmap**](./docs/ROADMAP.md).

## 🚀 Deployment

This project is configured for CI/CD to [Fly.io](https://fly.io/) via GitHub Actions.

- **Build & Test**: On every pull request into 'main', the code is linted, tested, and a Docker image is built to ensure it's valid.
- **Deploy**: On every push to 'main', the application is automatically deployed to Fly.io.

### Configuration

For the Fly.io deployment to work correctly, you must set the following secrets in your Fly.io app dashboard:

- `DISCORD_TOKEN`: Your Discord bot token.
- `DISCORD_CLIENT_ID`: Your Discord client id.
- `PRISMA_DATABASE_URL`:The connection string for the SQLite database. This should point to a file inside the Fly.io persistent volume, e.g., `file:/data/prod.db`.

## 🤝 Contributing

We welcome contributions! Please see our [**Contributing Guide**](./docs/contributing.md) for development setup, coding standards, and architectural guidelines.

## Commit Messages & Versioning

This project adheres to the [Conventional Commits](https://www.conventionalcommits.org/) specification. This practice helps maintain a clear and descriptive commit history, and it also powers our automated versioning system.

When you open a pull request or push new commits to it, a bot will analyze your commit messages. If a version change is detected, it will push a new commit to your branch with the updated package.json version. Please remember to git pull these changes to your local branch before pushing any subsequent updates to avoid merge conflicts.

```
feat!: Triggers a major version bump (e.g., 0.1.0 → 2.0.0).
feat: Triggers a minor version bump (e.g., 0.1.0 → 0.2.0).
fix: Triggers a patch version bump (e.g., 0.1.0 → 0.1.1).
```

**Note**: While the project version is under `1.0.0`, breaking changes will result in a minor version bump, and new features will result in a patch bump, per semantic versioning guidelines.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
