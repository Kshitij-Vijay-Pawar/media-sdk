# media-sdk

A modular Media SDK monorepo for searching and viewing curated photos and videos from Pexels, with pure TypeScript core logic, React / React Native wrappers, and headless UI components.

## Prerequisites

- [Bun](https://bun.sh) (v1.3+)

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure environment variables:**
   Obtain a free Pexels API key at [pexels.com/api](https://www.pexels.com/api/).
   Copy `.env.example` to `.env` and set your key:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   PEXELS_API_KEY=your_actual_pexels_api_key
   ```

## Monorepo Commands

- **Build all packages & apps:**
  ```bash
  bunx turbo build
  ```
- **Run all unit tests:**
  ```bash
  bunx turbo test
  ```
- **Run linters & boundary enforcement:**
  ```bash
  bunx turbo lint
  ```
- **Start development server:**
  ```bash
  bunx turbo dev
  ```
