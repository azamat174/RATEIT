# RATEIT - Getting Started

**RATEIT** is a modern social platform where users upload content (images, audio, ideas) and others rate it from 1 to 100.

## 🎯 What You Need

### Accounts
- **Supabase** (free) - https://supabase.com
- **GitHub** (for deployment)
- **Vercel** (optional, for hosting)

### Installed Software
- **Node.js 18+** - https://nodejs.org
- **npm** or **yarn** (comes with Node)
- **Git** - https://git-scm.com

## ⚡ Quick Setup (5 minutes)

### 1️⃣ Clone Project

```bash
git clone https://github.com/azamat174/RATEIT.git
cd RATEIT
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose region, set password
4. Wait for project to be created

### 4��⃣ Get Your Credentials

1. In Supabase, click "Settings" (gear icon)
2. Click "API" in sidebar
3. Copy:
   - `Project URL` → Copy this
   - `anon public` → Copy the key
   - `service_role` → Copy the key

### 5️⃣ Setup Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6️⃣ Create Database Tables

**In Supabase Dashboard:**

1. Click "SQL Editor" in sidebar
2. Click "New Query"
3. Open file `supabase/migrations/001_init.sql`
4. Copy all the SQL code
5. Paste into Supabase query editor
6. Click "Run" (▶️ button)
7. Wait for success message
8. **Repeat steps 2-7** with file `supabase/migrations/002_functions_triggers.sql`

### 7️⃣ Create Storage Bucket

1. Click "Storage" in Supabase sidebar
2. Click "Create a new bucket"
3. Name it: `posts`
4. Uncheck "Private bucket" (make it public)
5. Click "Create bucket"

### 8️⃣ Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## ✅ Test It Works

1. **Register** - Click "Sign Up", enter email & password
2. **Upload** - Click "Upload", pick a category, add a title, upload an image
3. **Rate** - Go to home/feed, click a post, rate it 1-100
4. **Comment** - Scroll down, add a comment
5. **React** - React to a comment with emoji

## 🚀 Deploy to Production

### Deploy to Vercel (Free & Easy)

1. Push to GitHub
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. Go to https://vercel.com

3. Click "New Project"

4. Select your GitHub repository

5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

6. Click "Deploy"

7. Done! Get your live URL

## 📂 Files You'll Edit

- `.env.local` - Your Supabase credentials (NEVER commit this)
- `src/app/` - Pages
- `src/components/` - Reusable components
- `tailwind.config.ts` - Design/colors

## 🎨 Customize Design

Edit `tailwind.config.ts` to change:
- Colors (primary, secondary)
- Fonts
- Sizes
- Animations

## 🐛 Common Issues

### "Cannot find module"
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### "Supabase connection error"
- Check `.env.local` has correct URLs/keys
- Copy the EXACT values from Supabase
- No spaces at beginning/end

### "Table does not exist"
- Run migrations again in Supabase SQL Editor
- Make sure they completed successfully

### "Cannot upload files"
- Check `posts` bucket exists
- Make sure it's NOT private
- Verify you're logged in

## 📖 Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup
- Read [DEVELOPMENT.md](DEVELOPMENT.md) for developers
- Read [API.md](API.md) for Supabase APIs

## 💡 Pro Tips

1. **Test with multiple users** - Open in incognito window
2. **Check Supabase logs** - Click "Logs" in Supabase for errors
3. **Use browser DevTools** - F12 to see errors
4. **Read error messages** - They tell you what's wrong!

## 🆘 Need Help?

1. Check error message in browser console (F12)
2. Look in [SETUP.md](SETUP.md) troubleshooting
3. Open GitHub issue with details
4. Check Supabase documentation

## 🎓 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Ready to launch? Let's go! 🚀**
