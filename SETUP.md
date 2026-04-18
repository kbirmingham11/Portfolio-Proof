# Portfolio Proof — Setup Guide
# Kameron Birmingham | kameronbirmingham.dev

## PHASE 1 — Local Setup (5 minutes)

### 1. Install dependencies
```bash
cd portfolio-proof
npm install
npm run dev
# → Open http://localhost:3000 to preview
```

---

## PHASE 2 — GitHub Repo (2 minutes)

```bash
git init
git add .
git commit -m "feat: initial portfolio proof scaffold"
gh repo create portfolio-proof --public --push
# Or manually: github.com/new → push existing repo
```

---

## PHASE 3 — Vercel Deploy (5 minutes)

1. Go to vercel.com → New Project
2. Import your `portfolio-proof` GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Build command: `npm run build`
5. Root directory: `./`
6. Click **Deploy**

Note your Vercel deployment URL (e.g., `portfolio-proof.vercel.app`)

---

## PHASE 4 — Domain via Cloudflare

### 4a. Buy domain
1. cloudflare.com → Registrar → search `kameronbirmingham.dev`
2. Purchase (~$10/yr for .dev)

### 4b. Add DNS records
In Cloudflare DNS → Add records:

| Type  | Name | Content                  | Proxy |
|-------|------|--------------------------|-------|
| CNAME | @    | cname.vercel-dns.com     | OFF   |
| CNAME | www  | cname.vercel-dns.com     | OFF   |
| CNAME | *    | cname.vercel-dns.com     | OFF   |

> ⚠️ Proxy (orange cloud) must be OFF for Vercel custom domains to work

### 4c. Add domain to Vercel
1. Vercel project → Settings → Domains
2. Add: `kameronbirmingham.dev`
3. Add: `*.kameronbirmingham.dev` (for subdomains)
4. Vercel handles SSL automatically

---

## PHASE 5 — Subdomain for Each Application

For every new role you apply to, add a subdomain:

**In Cloudflare:**
Already covered by the wildcard `*` CNAME record. Nothing to add.

**In Vercel:**
1. Project → Settings → Domains
2. Add: `company-role.kameronbirmingham.dev`
3. Points to: `/applications/company-role` (via vercel.json rewrite)

---

## PHASE 6 — Add New Showcases

### Step 1: Add to the SHOWCASES array in `app/page.jsx`
```js
{
  slug: 'company-role',          // used in URL
  company: 'Company Name',
  role: 'Job Title Here',
  appliedDate: '2025-07-20',
  status: 'active',
  tags: ['Skill 1', 'Skill 2', 'Skill 3'],
  color: '#HEX',                 // company brand color (approx)
}
```

### Step 2: Create the page
```
app/applications/company-role/page.jsx
```

Use the ApplicationTemplate component. See the AA example for reference.

### Step 3: Push and deploy
```bash
git add .
git commit -m "feat: add [company] showcase"
git push
# Vercel auto-deploys on push
```

---

## PHASE 7 — Notification System (LinkedIn + Email)

See: `lib/notifications.js` — This sets up:
- LinkedIn job alert monitoring via RSS
- Keyword/standards filter
- Email/webhook notification when a match is found

Setup requires a free account at:
- Mailgun or Resend (email sending)
- Vercel Cron Jobs (scheduled polling)

Full instructions are inside `lib/notifications.js`.

---

## File Structure

```
portfolio-proof/
├── app/
│   ├── layout.jsx              ← Root layout + theme toggle
│   ├── page.jsx                ← Landing page (edit SHOWCASES array here)
│   ├── globals.css             ← Design tokens, fonts, animations
│   └── applications/
│       ├── [slug]/
│       │   └── page.jsx        ← Dynamic fallback route
│       └── aa-performance-analyst/
│           └── page.jsx        ← American Airlines showcase (Phase 3)
├── components/
│   └── ApplicationTemplate.jsx ← Reusable page template
├── lib/
│   └── notifications.js        ← LinkedIn opportunity notification system
├── public/
├── package.json
├── vercel.json                 ← Wildcard subdomain routing
├── next.config.js
├── tailwind.config.js
└── SETUP.md                    ← This file
```

---

## Updating Your Email in the Site

Search for `your@email.com` in the codebase and replace with your actual email.
It appears in: `app/page.jsx` and `components/ApplicationTemplate.jsx`
