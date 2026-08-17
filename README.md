# MD. Shoriful Islam (Sakib) — Dynamic React Portfolio

A production-oriented, colorful React portfolio with animation, WebGL/3D hero artwork, a protected admin CMS, image/CV uploads, contact inbox, Supabase database/auth/storage, and Render deployment configuration.

## Features

- Responsive premium portfolio UI
- Framer Motion scroll/reveal animation
- React Three Fiber 3D hero object
- Dynamic profile, projects, skills, experience, education, services and certifications
- `/admin` protected dashboard
- Project image upload, profile photo upload and CV/PDF upload
- Contact form -> admin inbox
- Supabase Auth + Postgres + Storage
- Row Level Security policies
- Demo mode when Supabase environment variables are not set
- `render.yaml` for Render Blueprint deployment
- SPA rewrite for `/admin` and direct routes

## 1. Upload to GitHub

Create a new empty GitHub repository, then upload **all files from this folder to the repository root**. Do not upload the outer ZIP file.

Recommended repository name:

`md-shoriful-islam-sakib-portfolio`

If using Git locally:

```bash
git init
git add .
git commit -m "Initial professional portfolio"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 2. Create the Supabase backend

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Copy everything from `supabase/schema.sql` and run it.
4. Open **Authentication -> Users** and create your admin user manually.
5. Disable public signups in Authentication settings before production use.
6. Copy the Project URL and public/anon key.

For local development copy `.env.example` to `.env`:

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Never put the Supabase `service_role` key in this frontend project.

## 3. Run locally

```bash
npm install
npm run dev
```

Open the shown localhost URL. Admin is available at:

`/admin`

## 4. Deploy GitHub -> Render

### Easiest: Blueprint

1. Push this project to GitHub.
2. In Render choose **New -> Blueprint**.
3. Connect the GitHub repository.
4. Render reads `render.yaml`.
5. When prompted, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy.

The included config uses:

- Build command: `npm install && npm run build`
- Publish path: `./dist`
- SPA rewrite: `/* -> /index.html`

### Manual Static Site alternative

Create a Render Static Site from the repository, use `npm install && npm run build`, publish `dist`, add the two environment variables, then configure a rewrite from `/*` to `/index.html`.

## 5. What to update first in Admin

1. Profile / headline / about text
2. Real email, phone and social URLs
3. Profile photo
4. CV PDF
5. Real projects + screenshots + GitHub/live URLs
6. Real skills
7. Experience
8. Education
9. Services
10. Certifications

## Security notes

The SQL assumes that only trusted admin accounts exist in Supabase Auth, so **disable public signup**. Public visitors can read portfolio content and submit contact messages, but they cannot read the inbox or edit portfolio content. Storage uploads require an authenticated account.

## Main stack

React · Vite · Supabase · Framer Motion · React Three Fiber · Drei · Three.js · Lucide React
