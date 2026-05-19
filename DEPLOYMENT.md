# Deployment Guide

This project is a Next.js App Router app with serverless API routes, Supabase, Resend, and Vercel Analytics. Vercel is the best deployment target because it detects Next.js automatically and supports the API routes without extra server setup.

## 1. Local Preflight

```bash
npm install
npm run lint
npm run build
```

The production build should include these routes:

```text
/api/github
/api/log
/api/mail
/api/wall
```

## 2. Supabase Setup

In the Supabase SQL Editor, run these files:

```text
supabase/visitor_logs.sql
supabase/guestbook.sql
```

After running `guestbook.sql`, confirm Realtime is enabled for `public.guestbook`.

You can verify from the Supabase dashboard:

```text
Database -> Publications -> supabase_realtime -> guestbook enabled
```

## 3. Environment Variables

Set these in Vercel under:

```text
Project -> Settings -> Environment Variables
```

Required:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GITHUB_USERNAME=Strong10mede
NEXT_PUBLIC_SITE_URL=https://your-production-domain.vercel.app
```

Recommended for contact form:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
MAYUR_EMAIL=kmayur809@gmail.com
MAIL_FROM="Mayur Portfolio <your-verified-sender@yourdomain.com>"
NEXT_PUBLIC_CONTACT_EMAIL=kmayur809@gmail.com
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-profile
```

Important:

```text
Never expose SUPABASE_SERVICE_ROLE_KEY in client code.
Only NEXT_PUBLIC_* variables are safe for the browser.
```

## 4. Deploy On Vercel

Recommended path:

```text
1. Push the project to GitHub.
2. Open Vercel and import the GitHub repo.
3. Framework preset: Next.js.
4. Build command: npm run build.
5. Output directory: leave default.
6. Add the environment variables above.
7. Deploy.
```

CLI path:

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## 5. Post-Deploy Smoke Tests

Open the deployed site and test these terminal commands:

```text
help
neofetch
git log
wall hello from production
mail "Testing production contact route"
flash-ota
```

Open the site in two browser windows before testing `wall`. A message sent in one window should appear in the other as:

```text
Broadcast message from guest@visitor: hello from production
```

## 6. Custom Domain

After the first successful production deploy:

```text
Vercel Project -> Settings -> Domains -> Add Domain
```

Then update:

```env
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

Redeploy once after changing the site URL so metadata and Open Graph URLs use the final domain.
