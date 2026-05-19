# Mayur Terminal Portfolio

A Linux desktop inspired terminal portfolio built with Next.js App Router, React, Tailwind CSS, Resend, and Supabase.

The UI includes a Matrix-style animated canvas background, a glassmorphism desktop terminal window, Kali/Ubuntu/Parrot theme switching, and a simulated `/` root filesystem.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

- `RESEND_API_KEY`: Resend API key for sending contact messages.
- `MAYUR_EMAIL`: Destination email address.
- `MAIL_FROM`: Verified sender. Resend's onboarding sender works for testing.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key used by browser Realtime subscriptions.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only service role key used by API routes.
- `GITHUB_USERNAME`: GitHub username used by the `git log` command.
- `NEXT_PUBLIC_SITE_URL`: Public deployment URL used for canonical Open Graph metadata.

## Vercel Analytics

Installed with:

```bash
npm install @vercel/analytics
```

The root App Router layout imports `Analytics` from `@vercel/analytics/next` and renders it after `{children}`, so it does not interfere with the Matrix background or theme providers.

## Supabase

Run these SQL files in the Supabase SQL editor:

```text
supabase/visitor_logs.sql
supabase/guestbook.sql
```

For deployment steps, see `DEPLOYMENT.md`.

## Folder Structure

```text
.
├── app/
│   ├── api/
│   │   ├── log/route.js
│   │   └── mail/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── DesktopWindow.jsx
│   ├── EmulatorModal.jsx
│   ├── MatrixBackground.jsx
│   ├── PortfolioShell.jsx
│   ├── Terminal.jsx
│   ├── ThemeProvider.jsx
│   └── ThemeSwitcher.jsx
├── lib/
│   ├── resumeData.js
│   └── terminalFs.js
├── supabase/
│   └── visitor_logs.sql
├── .env.example
├── .eslintrc.json
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

## Commands

- `help`
- `whoami`
- `ls`
- `cd <dir>`
- `cd /`
- `cat <filename>`
- `github`
- `git log`
- `emulator`
- `mail "Hi Mayur, let's connect"`
- `wall <message>`
- `flash-ota`
- `clear`
