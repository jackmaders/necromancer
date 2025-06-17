# 💀 necromancer

[![Lint CI](https://github.com/YOUR_GITHUB_USERNAME/necromancer/actions/workflows/lint.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/necromancer/actions/workflows/lint.yml) [![Unit Tests](https://github.com/YOUR_GITHUB_USERNAME/necromancer/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/necromancer/actions/workflows/test.yml) [![Built with Biome](https://img.shields.io/badge/built%20with-Biome-60A5FA?logo=biome&style=flat)](https://biomejs.dev/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Necromancer is a powerful, intelligent Discord bot designed to streamline the complex process of scheduling for gaming teams. It automates availability polls, generates optimal rosters based on player preferences, and manages event reminders, letting you focus on the game, not the logistics.

## ✨ Key Features

-   **Automated Availability Polls**: Posts clear, interactive polls for players to mark their availability for the upcoming week.
-   **Intelligent Roster Generation**: Suggest draft rosters that prioritize the team's preferred days and players' preferred roles.
-   **Advanced Role Management**: Configure team roles and integrate substitute players (`@Ringer`) seamlessly.
-   **Nuanced Preferences**: Supports `Available`, `Prefer Not`, and `Unavailable` states for more flexible scheduling.

## 🛠️ Tech Stack & Architecture

This project is built with a modern, performance-focused toolchain and a highly scalable architecture.

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-%236E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white)
![Biome](https://img.shields.io/badge/biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)

## 🚀 Getting Started

### Prerequisites

-   [Bun](https://bun.sh/) (v1.2.x or later)
-   A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_GITHUB_USERNAME/necromancer.git](https://github.com/YOUR_GITHUB_USERNAME/necromancer.git)
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

## 🗺️ Project Roadmap

Curious about where the project is headed? We have a detailed plan outlining all upcoming features and versions in our [**Project Roadmap**](./docs/ROADMAP.md).

## 🤝 Contributing

We welcome contributions! Please see our [**Contributing Guide**](./docs/CONTRIBUTING.md) for development setup, coding standards, and architectural guidelines.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.