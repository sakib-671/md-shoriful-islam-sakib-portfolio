# GitHub -> Supabase -> Render Checklist

## GitHub
- [ ] Extract this ZIP.
- [ ] Create an empty GitHub repository: `md-shoriful-islam-sakib-portfolio`
- [ ] Upload every extracted file/folder to the repository root.
- [ ] Confirm `package.json`, `render.yaml`, `src/`, `public/`, and `supabase/` are visible at the root.

## Supabase
- [ ] Create a Supabase project.
- [ ] Run `supabase/schema.sql` in SQL Editor.
- [ ] Create your admin account in Authentication -> Users.
- [ ] Disable public signups for production.
- [ ] Copy Project URL and public/anon key.

## Render
- [ ] New -> Blueprint.
- [ ] Connect the GitHub repository.
- [ ] Enter `VITE_SUPABASE_URL` when Render asks.
- [ ] Enter `VITE_SUPABASE_ANON_KEY` when Render asks.
- [ ] Deploy.
- [ ] Open `/admin` on the deployed site and sign in.

## First admin updates
- [ ] Real headline and biography
- [ ] Email, phone, GitHub, LinkedIn
- [ ] Profile photo
- [ ] CV PDF
- [ ] Projects and screenshots
- [ ] Skills
- [ ] Experience and education
- [ ] Services and certifications
