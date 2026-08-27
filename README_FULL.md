# 🎯 RATEIT - Social Rating Platform

> A modern, minimalist social platform where users upload content and others rate it from 1 to 100, leave comments, reply to each other, and add reactions.

[![GitHub](https://img.shields.io/badge/GitHub-azamat174/RATEIT-181717?style=flat-square&logo=github)](https://github.com/azamat174/RATEIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure registration and login via Supabase Auth
- 📸 **6 Content Categories** - Tracks, Works, Outfits, Appearance, Photos, Ideas
- ⭐ **Rating System** - Rate content 1-100 with emoji indicators
- 💬 **Comments & Replies** - Nested comment system (2 levels max)
- 😊 **Reactions** - 5 reaction types on comments
- 👤 **User Profiles** - Customize bio, track posts and ratings
- 🔔 **Real-time Notifications** - Get notified of interactions
- 🔍 **Search** - Find posts and users
🏆 **Top Posts** - Trending content by time period and category
- 📱 **Mobile Optimized** - Fully responsive design
- 🛡️ **Security** - Row Level Security (RLS) on all data

### Content Categories

| Category | Description |
|----------|-------------|
| 🎵 **Tracks** | Upload and rate audio tracks |
| 🎨 **Works** | Share creative works for feedback |
| 👕 **Outfits** | Get opinions on your style |
| 😎 **Appearance** | Get rated on your looks |
| 📸 **Photos** | Share photography skills |
| 💡 **Ideas** | Validate your concepts |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free)

### Installation

```bash
# Clone repository
git clone https://github.com/azamat174/RATEIT.git
cd RATEIT

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
```

### Configure Supabase

1. Create project at https://supabase.com
2. Get credentials from Settings > API
3. Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_role_key
```

### Setup Database

1. Supabase > SQL Editor
2. Run migrations from `supabase/migrations/`:
   - `001_init.sql` - Create tables and RLS
   - `002_functions_triggers.sql` - Setup automation

3. Create `posts` storage bucket
4. Make it public with proper RLS policies

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Testing Checklist

- [ ] **Auth**: Register, login, logout, session persists
- [ ] **Posts**: Create/edit/delete in all categories
- [ ] **Ratings**: Rate, update, see average
- [ ] **Comments**: Add, reply, delete comments
- [ ] **Reactions**: Add/change/remove reactions
- [ ] **Notifications**: Receive and navigate to content
- [ ] **Search**: Find posts and users
- [ ] **Top**: Filter by time and category
- [ ] **Profiles**: View/edit profile, see stats
- [ ] **Mobile**: All features work on phone
- [ ] **Security**: Cannot modify others' content

## 🏗️ Architecture

### Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Shadcn/ui + Radix UI

**Backend**
- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Storage
- Supabase Realtime

**Form & Validation**
- React Hook Form
- Zod

**State Management**
- Zustand
- React Context

### Database Schema

```sql
-- Users
users(
  id, email, username, avatar_url, bio,
  created_at, updated_at
)

-- Posts
posts(
  id, user_id, title, description, category,
  file_url, file_type, average_rating, rating_count,
  comment_count, created_at, updated_at
)

-- Ratings
ratings(
  id, post_id, user_id, rating,
  created_at, updated_at
  UNIQUE(post_id, user_id)
)

-- Comments
comments(
  id, post_id, user_id, content, parent_id,
  created_at, updated_at
)

-- Comment Reactions
comment_reactions(
  id, comment_id, user_id, reaction_type,
  created_at
  UNIQUE(comment_id, user_id, reaction_type)
)

-- Notifications
notifications(
  id, user_id, actor_id, type, post_id,
  comment_id, is_read, created_at
)

-- Reports
reports(
  id, user_id, post_id, comment_id, reason,
  description, status, created_at
)
```

### Security

✅ **Row Level Security (RLS)** - All tables protected
✅ **Authentication Required** - For sensitive operations
✅ **User Validation** - Server-side checks via auth
✅ **File Upload Validation** - Type and size verification
✅ **Cascading Deletes** - Data integrity maintained
✅ **Input Sanitization** - XSS protection

## 📁 Project Structure

```
RATEIT/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                 # Home
│   │   ├── feed/page.tsx            # Feed
│   │   ├── posts/[id]/page.tsx      # Post detail
│   │   ├── upload/page.tsx          # Upload
│   │   ├── profile/[username]/      # Profile
│   │   ├── notifications/page.tsx   # Notifications
│   │   ├── search/page.tsx          # Search
│   │   ├── top/page.tsx             # Top posts
│   │   ├── auth/login/page.tsx      # Login
│   │   ├── auth/signup/page.tsx     # Signup
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── auth/auth-form.tsx
│   │   ├── layout/header.tsx
│   │   ├── posts/
│   │   │   ├── post-card.tsx
│   │   │   └── comment-section.tsx
│   │   ├── upload/upload-form.tsx
│   │   └── ui/                      # UI components
│   ├─��� lib/
│   │   ├── auth/context.tsx
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   └── utils.ts
├── supabase/
│   └── migrations/
│       ├── 001_init.sql
│       └── 002_functions_triggers.sql
├── public/
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── SETUP.md
├── DEVELOPMENT.md
├── API.md
└── README.md
```

## 🎮 Usage

### Create Account

1. Click "Sign Up" button
2. Enter email and password
3. Verify email (if enabled)
4. Done! You're logged in

### Upload Content

1. Click "Upload" button
2. Select category
3. Choose file (image/audio)
4. Add title and description
5. Submit

### Rate Post

1. Open post
2. Use slider to rate 1-100
3. Submit rating
4. See average rating update instantly

### Comment & Reply

1. Scroll to comments section
2. Write comment
3. Click "Post"
4. Reply appears without reload
5. Click "Reply" on comment to add reply

### Add Reactions

1. Hover over comment
2. Select reaction (❤️ 🔥 😂 👍 👎)
3. Count updates instantly
4. Change/remove reaction anytime

### Get Notifications

1. Click 🔔 bell icon
2. Click notification to navigate
3. Marked as read automatically

### Search & Discover

1. Use search box in header
2. Find posts by title
3. Find users by username
4. Visit Top page for trending content

## 📱 Mobile

- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Optimized forms
- ✅ Fast performance
- ✅ Offline-ready UI

## 🔒 Security Best Practices

- Never share `.env.local` file
- Use strong passwords
- Enable 2FA in Supabase
- Keep dependencies updated
- Report security issues privately

## 🚢 Deployment

### Vercel (Recommended)

```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Add environment variables
4. Deploy

### Other Platforms

- Netlify
- Railway
- Heroku
- AWS Amplify
- Any Node.js hosting

## 📊 Performance

- ⚡ ~1s first load (Vercel CDN)
- ⚡ Optimized database queries
- ⚡ Image optimization
- ⚡ Code splitting
- ⚡ Real-time updates via Websockets

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check `.env.local` credentials
- Verify Supabase project is active
- Try in incognito mode

### "RLS policy denies access"
- Check user authentication
- Review RLS policies in Supabase
- Check user_id matches

### "File upload fails"
- Verify `posts` bucket exists
- Check bucket is public
- Verify RLS policies
- Check file size/type

### "Database migration error"
- Run migrations again
- Check SQL syntax
- Verify tables created
- Check indexes

## 📚 Documentation

- [Setup Guide](SETUP.md) - Complete installation
- [Development Guide](DEVELOPMENT.md) - For developers
- [API Documentation](API.md) - Supabase integration

## 🎯 Roadmap

- [ ] Direct messaging between users
- [ ] Follow/unfollow system
- [ ] User badges and achievements
- [ ] Advanced search filters
- [ ] Push notifications
- [ ] Dark/Light theme toggle
- [ ] Trending algorithm
- [ ] User recommendations
- [ ] Analytics dashboard
- [ ] Mobile app

## 🤝 Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## ���� Support

- 📧 Email: support@rateit.app
- 🐛 Issues: [GitHub Issues](https://github.com/azamat174/RATEIT/issues)
- 💭 Discussions: [GitHub Discussions](https://github.com/azamat174/RATEIT/discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com/)
- UI by [Shadcn/ui](https://ui.shadcn.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 👨‍💻 Author

**Azamat** - [GitHub](https://github.com/azamat174)

---

<div align="center">

**[⬆ back to top](#rateit---social-rating-platform)**

Built with ❤️ for creators

</div>
