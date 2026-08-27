# RATEIT - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Git

### Step 1: Clone the repository

```bash
git clone https://github.com/azamat174/RATEIT.git
cd RATEIT
```

### Step 2: Install dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Setup Supabase

1. Go to https://supabase.com and create a new project
2. Once created, go to **Settings > API**
3. Copy your credentials:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Create environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Setup Database

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the contents of `supabase/migrations/001_init.sql`
3. Run the query
4. Repeat with `supabase/migrations/002_functions_triggers.sql`

Alternatively, you can use Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your_project_ref

# Push migrations
supabase db push
```

### Step 6: Create Storage Buckets

In Supabase dashboard, go to **Storage**:

1. Create a new bucket called `posts`
2. Make it public (set all operations to public)
3. Add RLS policy:
   - Allow SELECT for all users
   - Allow INSERT/UPDATE/DELETE for authenticated users on their own files

### Step 7: Run development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Testing Checklist

After setup, test these features:

### Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] Logout
- [ ] Session persists after page reload

### Posts
- [ ] Create post in each category (tracks, works, outfits, appearance, photos, ideas)
- [ ] Upload image for image categories
- [ ] Upload audio for tracks category
- [ ] Edit post (title, description, category)
- [ ] Delete own post
- [ ] Cannot delete other's post
- [ ] View post details

### Rating System
- [ ] Rate post from 1-100
- [ ] See emoji indicator (👎 30, 😐 60, 👌 80, 🔥 100)
- [ ] Update rating
- [ ] See average rating and count
- [ ] Only one rating per user per post

### Comments & Replies
- [ ] Add comment to post
- [ ] Reply to comment (parent_id)
- [ ] Maximum 2 levels of nesting
- [ ] Delete own comment
- [ ] Cannot delete other's comment
- [ ] Comment appears without page reload

### Reactions
- [ ] Add reaction (❤️ 🔥 😂 👍 👎)
- [ ] Change reaction
- [ ] Remove reaction
- [ ] See reaction count
- [ ] Only one reaction type per user per comment

### Notifications
- [ ] Receive notification when someone rates your post
- [ ] Receive notification when someone comments on your post
- [ ] Receive notification when someone replies to your comment
- [ ] Receive notification when someone reacts to your comment
- [ ] Don't receive notification for own actions
- [ ] Click notification to navigate to post/comment
- [ ] Mark as read

### Search
- [ ] Search by post title
- [ ] Search by username
- [ ] Filter results
- [ ] Works on mobile

### Top Posts
- [ ] Filter by time period (today, week, month)
- [ ] Filter by category
- [ ] Minimum 3 ratings to appear in top
- [ ] Sorted by average rating

### Profile
- [ ] View own profile
- [ ] View other profiles
- [ ] Edit bio (own profile only)
- [ ] See post count and average rating
- [ ] See all user's posts

### Security
- [ ] Cannot access protected endpoints without auth
- [ ] RLS prevents access to other user's data
- [ ] File deletion cascades properly

## 🏗️ Project Structure

```
RATEIT/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx         # Home page
│   │   ├── feed/            # Feed page
│   │   ├── posts/           # Post detail page
│   │   ├── upload/          # Upload page
│   │   ├── profile/         # Profile page
│   │   ├── notifications/   # Notifications page
│   │   ├── search/          # Search page
│   │   ├── top/             # Top posts page
│   │   ├── auth/            # Auth pages
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── auth/            # Auth components
│   │   ├── layout/          # Layout components
│   │   ├── posts/           # Post components
│   │   ├── upload/          # Upload components
│   │   └── ui/              # UI components
│   └── lib/
│       ├── auth/            # Auth utilities
│       ├── supabase/        # Supabase config
│       └── utils.ts         # Utility functions
├── supabase/
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── .env.local.example       # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 📱 Mobile Optimization

The app is fully responsive with:
- Mobile-first design
- Touch-friendly buttons
- Optimized input forms
- Adaptive layouts
- Fast performance on slow networks

## 🔒 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ User authentication via Supabase Auth
- ✅ Server-side validation
- ✅ Secure file uploads
- ✅ Users can only modify their own data
- ✅ Cascading deletes for data integrity

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Go to https://vercel.com
3. Import the repository
4. Add environment variables in settings
5. Deploy

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Deploy to Other Platforms

The app is a standard Next.js application, so it can be deployed to:
- Netlify
- Heroku
- Railway
- Any Node.js hosting

## 📊 Database Schema

### users
- id (uuid, PK)
- email (string, unique)
- username (string, unique)
- avatar_url (string)
- bio (text)
- created_at (timestamp)
- updated_at (timestamp)

### posts
- id (uuid, PK)
- user_id (uuid, FK → users)
- title (string)
- description (text)
- category (enum)
- file_url (string)
- file_type (enum: image, audio)
- average_rating (numeric)
- rating_count (integer)
- comment_count (integer)
- created_at (timestamp)
- updated_at (timestamp)

### ratings
- id (uuid, PK)
- post_id (uuid, FK → posts)
- user_id (uuid, FK → users)
- rating (integer, 1-100)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(post_id, user_id)

### comments
- id (uuid, PK)
- post_id (uuid, FK → posts)
- user_id (uuid, FK → users)
- content (text)
- parent_id (uuid, FK → comments, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### comment_reactions
- id (uuid, PK)
- comment_id (uuid, FK → comments)
- user_id (uuid, FK → users)
- reaction_type (enum)
- created_at (timestamp)
- UNIQUE(comment_id, user_id, reaction_type)

### notifications
- id (uuid, PK)
- user_id (uuid, FK → users)
- actor_id (uuid, FK → users)
- type (enum: rating, comment, reply, reaction)
- post_id (uuid, FK → posts, nullable)
- comment_id (uuid, FK → comments, nullable)
- is_read (boolean)
- created_at (timestamp)

### reports
- id (uuid, PK)
- user_id (uuid, FK → users)
- post_id (uuid, FK → posts, nullable)
- comment_id (uuid, FK → comments, nullable)
- reason (enum)
- description (text)
- status (enum)
- created_at (timestamp)

## 🔧 Troubleshooting

### Connection issues

If you get connection errors:

1. Check Supabase URL and keys in `.env.local`
2. Verify your Supabase project is active
3. Check if RLS policies are enabled
4. Verify Storage bucket exists and is public

### Database errors

1. Run migrations again in SQL Editor
2. Check that all tables are created
3. Verify indexes exist
4. Check trigger functions

### Authentication errors

1. Verify Auth is enabled in Supabase
2. Check email verification settings
3. Clear browser cookies/storage
4. Try in incognito/private mode

## 📝 Environment Variables

```env
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues first
- Provide detailed description and steps to reproduce

## 🎯 Roadmap

- [ ] Direct messaging
- [ ] Follow/Unfollow system
- [ ] User badges
- [ ] Advanced search filters
- [ ] Push notifications
- [ ] Dark/Light theme toggle
- [ ] Trending posts
- [ ] User recommendations
- [ ] Analytics dashboard

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
