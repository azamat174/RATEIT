# RATEIT - Social Rating Platform

A modern, minimalist social platform where users upload content and others rate it from 1 to 100, leave comments, reply to each other, and add reactions.

## 🚀 Features

### Core Functionality
- **User Authentication**: Registration, login, and session management via Supabase Auth
- **6 Categories**: Tracks, Works, Outfits, Appearance, Photos, Ideas
- **Content Upload**: Image and audio file uploads via Supabase Storage
- **Rating System**: 1-100 scale with emoji indicators (👎, 😐, 👌, 🔥)
- **Comments & Replies**: Nested comment system with up to 2 levels of depth
- **Reactions**: ❤️ 🔥 😂 👍 👎 on comments and replies
- **User Profiles**: Avatar, username, bio, and post history
- **Notifications**: Real-time alerts for ratings, comments, replies, and reactions
- **Search**: Find users, posts, and categories
- **Top Posts**: Ranked by category and time period
- **Reports**: Flag inappropriate content

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **UI Components**: Shadcn/ui, Radix UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/azamat174/RATEIT.git
   cd RATEIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Setup Supabase Database**
   
   Run the migration files in `supabase/migrations/` in your Supabase project:
   - Create tables for users, posts, ratings, comments, reactions, notifications, reports
   - Setup RLS policies
   - Configure storage buckets

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Database Schema

### Tables

**users**
- id (uuid, PK)
- email (string)
- username (string, unique)
- avatar_url (string)
- bio (text)
- created_at (timestamp)
- updated_at (timestamp)

**posts**
- id (uuid, PK)
- user_id (uuid, FK)
- title (string)
- description (text)
- category (enum: tracks, works, outfits, appearance, photos, ideas)
- file_url (string)
- file_type (enum: image, audio)
- average_rating (numeric)
- rating_count (integer)
- comment_count (integer)
- created_at (timestamp)
- updated_at (timestamp)

**ratings**
- id (uuid, PK)
- post_id (uuid, FK)
- user_id (uuid, FK)
- rating (integer, 1-100)
- created_at (timestamp)
- updated_at (timestamp)
- Unique constraint: (post_id, user_id)

**comments**
- id (uuid, PK)
- post_id (uuid, FK)
- user_id (uuid, FK)
- content (text)
- parent_id (uuid, FK, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**comment_reactions**
- id (uuid, PK)
- comment_id (uuid, FK)
- user_id (uuid, FK)
- reaction_type (enum: heart, fire, laugh, thumbs_up, thumbs_down)
- created_at (timestamp)
- Unique constraint: (comment_id, user_id, reaction_type)

**notifications**
- id (uuid, PK)
- user_id (uuid, FK)
- actor_id (uuid, FK)
- type (enum: rating, comment, reply, reaction)
- post_id (uuid, FK, nullable)
- comment_id (uuid, FK, nullable)
- is_read (boolean)
- created_at (timestamp)

**reports**
- id (uuid, PK)
- user_id (uuid, FK)
- post_id (uuid, FK, nullable)
- comment_id (uuid, FK, nullable)
- reason (enum: spam, offensive, forbidden, fraud, other)
- description (text)
- status (enum: pending, reviewed, resolved)
- created_at (timestamp)

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only edit/delete their own content
- File upload validation (type and size)
- Authentication required for write operations
- Secure API endpoints with server-side validation

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly buttons and interactions
- Optimized for slow connections
- Mobile-first approach

## 🚧 Future Features

- DMs and direct messaging
- Follow/Unfollow system
- User badges and achievements
- Advanced search filters
- Push notifications
- Dark/Light theme toggle
- Mobile app
- Paid features

## 📝 License

MIT
