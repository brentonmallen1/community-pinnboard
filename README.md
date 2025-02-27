
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a5b63f80-93e3-47d9-a2f2-fd8f807bb440

## Quick Start with Docker Compose

The easiest way to get started is using Docker Compose. This will set up both the application and the database with all necessary configurations.

### Prerequisites

1. [Docker](https://docs.docker.com/get-docker/)
2. [Docker Compose](https://docs.docker.com/compose/install/)

### Setup Steps

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Set up environment variables**
   ```sh
   cp .env.example .env
   ```
   Edit the `.env` file and fill in your Supabase credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

   The database credentials are pre-configured with default values, but you can modify them if needed:
   - `POSTGRES_USER=postgres`
   - `POSTGRES_PASSWORD=postgres`
   - `POSTGRES_DB=app`

3. **Start the application**
   ```sh
   docker compose up --build
   ```

   The application will be available at http://localhost:8080

4. **First-time setup**
   - The first user to sign up will automatically become an admin
   - All subsequent users will be regular members

### Development

If you want to work on the application locally without Docker:

1. **Install dependencies**
   ```sh
   npm i
   ```

2. **Start the development server**
   ```sh
   npm run dev
   ```

## Project Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- PostgreSQL
- Docker

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a5b63f80-93e3-47d9-a2f2-fd8f807bb440) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use GitHub Codespaces**

1. Navigate to the main page of your repository
2. Click on the "Code" button (green button) near the top right
3. Select the "Codespaces" tab
4. Click on "New codespace" to launch a new Codespace environment
5. Edit files directly within the Codespace and commit and push your changes

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

## Deployment

Simply open [Lovable](https://lovable.dev/projects/a5b63f80-93e3-47d9-a2f2-fd8f807bb440) and click on Share -> Publish.

## Custom Domains

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
