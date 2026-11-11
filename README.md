# ⚡ Rayadh Abrar — Personal Portfolio
> EEE Student Portfolio · Built with HTML, CSS & Vanilla JS

How I made it:
---

## 🚀 Live in 5 Minutes (GitHub Pages — Free)

### Step 1 — Create your GitHub repository
1. Sign up / log in at **github.com**
2. Click **"New repository"**
3. Name it exactly: `yourusername.github.io`
   *(replace `yourusername` with your actual GitHub username)*
4. Set it to **Public** → click **Create repository**

### Step 2 — Upload your files
**Option A — Drag & Drop (easiest):**
1. Open your repo on GitHub
2. Click **"uploading an existing file"**
3. Drag the entire `portfolio/` folder contents
4. Click **Commit changes**

**Option B — GitHub Desktop app:**
1. Download GitHub Desktop from desktop.github.com
2. Clone your repo → copy files in → push

**Option C — Git CLI:**
```bash
cd portfolio/
git init
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git add .
git commit -m "🚀 Launch portfolio"
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** tab
2. Sidebar: **Pages**
3. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
4. Click **Save**
5. Wait ~2 minutes → your site is live at:
   **`https://yourusername.github.io`** 🎉

---

## 🌐 Alternative Free Hosts

| Host | How to deploy | Custom domain | Speed |
|------|--------------|---------------|-------|
| **Netlify** | Drag & drop folder at netlify.com | ✅ Free | ⚡⚡⚡ |
| **Vercel** | Connect GitHub repo at vercel.com | ✅ Free | ⚡⚡⚡ |
| **Cloudflare Pages** | Connect GitHub repo | ✅ Free | ⚡⚡⚡ |
| **GitHub Pages** | As above | ✅ Free | ⚡⚡ |

**Recommendation:** Use **Netlify** for the absolute easiest experience — literally drag and drop your folder, get a live link in 10 seconds.

---

## ✏️ Customization Checklist

Search for these placeholders in `index.html` and replace them:

### Personal Info
- [ ] `YOUR NAME` → your actual full name (appears ~8 times)
- [ ] `YOUR UNIVERSITY` → e.g. "BUET", "RUET", "KUET"
- [ ] `youremail@email.com` → your email address
- [ ] `yourusername` → your GitHub / LinkedIn / Facebook handles

### Add Your Photo
1. Save your photo as `assets/photo.jpg` (400×500px recommended)
2. In `index.html`, find the `photo-placeholder` div
3. Delete that div and uncomment the `<img>` tag above it

### Add Your Resume
1. Save your resume as `assets/resume.pdf`
2. The "Resume ↗" button in the hero is already linked to it

### Update Stats (index.html)
Find the `.stat-num` spans and update `data-target` values:
```html
<span class="stat-num" data-target="12">   ← your project count
<span class="stat-num" data-target="50">   ← students tutored
<span class="stat-num" data-target="3">    ← years of study
```

### Update Typing Phrases (main.js, line ~75)
```js
const typedPhrases = [
  'circuit design',        // ← edit these
  'embedded systems',
  'signal processing',
  // add more...
];
```

### Projects
Edit the 4 `.proj-card` articles in `index.html` with your real projects.
To add more, copy any `<article class="proj-card ...">` block and paste it.

### Blog Posts
1. Create a `blog/` folder
2. Add individual post HTML files (e.g. `blog/first-pcb.html`)
3. Update the `href` links on blog cards

---

## 📬 Contact Form Setup (Formspree — Free)

1. Go to **formspree.io** → Sign up (free tier = 50 submissions/month)
2. Click **"+ New Form"** → give it a name
3. Copy your **Form ID** (looks like: `xpzgkwqr`)
4. Open `main.js` and replace:
   ```js
   const FORMSPREE_ID = 'YOUR_FORM_ID';
   // becomes:
   const FORMSPREE_ID = 'xpzgkwqr';
   ```
5. Done — messages go straight to your email inbox!

**Alternatives:**
- **Web3Forms** (web3forms.com) — 250 free/month, no account needed
- **EmailJS** (emailjs.com) — works client-side, 200 free/month

---

## 🔧 Room for Growth

### Blog System
For a proper blog with categories, tags and RSS:
- **Jekyll** (free, GitHub Pages native): add `_posts/` folder with Markdown files
- **11ty** (Eleventy): simple static site generator, deploy to Netlify

### Analytics (free)
Add before `</body>` in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
```
Or use **Plausible** / **Umami** for privacy-friendly analytics.

### Dark/Light Toggle
CSS variables are already set up — just add a class toggle on `<body>` 
and override the `:root` variables under a `.light` class.

### Custom Domain (optional, ~$10/year)
1. Buy a domain at **Namecheap** or **Porkbun** (e.g. `yourname.dev`)
2. In your hosting dashboard, add a custom domain
3. Update DNS records as instructed — done in ~10 minutes

### CMS for Blog (when you need it)
- **Contentful** or **Sanity** — write posts in a nice editor, 
  fetch via API, render in your HTML. Both have generous free tiers.

---

## 📁 File Structure

```
portfolio/
├── index.html          ← Main single-page site
├── style.css           ← All styles + responsive breakpoints
├── main.js             ← Interactions, animations, form
├── README.md           ← This file
├── assets/
│   ├── photo.jpg       ← YOUR PHOTO (you add this)
│   ├── resume.pdf      ← YOUR RESUME (you add this)
│   └── og-image.jpg    ← Social share preview image (optional)
└── blog/               ← Individual blog post pages (you create these)
    ├── index.html      ← Blog listing page
    ├── first-pcb.html
    └── eee-resources.html
```

---

## ⚡ Quick SEO Checklist (before going live)

- [ ] Update `<title>` tag with your real name
- [ ] Update `<meta name="description">` with a real description
- [ ] Update `og:url` with your actual live URL
- [ ] Add `og:image` (a 1200×630px cover image) for social sharing
- [ ] Submit your URL to **Google Search Console** (free, instant indexing)

---

*Built with ⚡ — pure HTML, CSS & Vanilla JS. No frameworks, no build tools.*
*Deploy anywhere. Loads fast. Works everywhere.*
