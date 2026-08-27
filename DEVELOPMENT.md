# Development Setup

This guide is for developers working on RATEIT.

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase CLI (optional, for database management)
- Git

### Initial Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/azamat174/RATEIT.git
   cd RATEIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Add Supabase credentials** to `.env.local`

5. **Run development server**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000

### Database Setup

#### Option 1: Manual (via SQL Editor)

1. Open Supabase dashboard
2. Go to SQL Editor
3. Run `supabase/migrations/001_init.sql`
4. Run `supabase/migrations/002_functions_triggers.sql`

#### Option 2: Using Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Pull latest schema
supabase db pull
```

### Create Storage Bucket

1. Supabase Dashboard > Storage
2. Create bucket named `posts`
3. Set permissions to public
4. Add RLS policies for authenticated users

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Type check with TypeScript
```

## Project Structure

```
src/
├── app/              # Next.js 14 App Router
├── components/       # React components
│   ├── auth/        # Auth-related components
│   ├── layout/      # Layout components
│   ├── posts/       # Post components
│   ├── upload/      # Upload components
│   └── ui/          # Basic UI components
├── lib/             # Utilities & config
│   ├── auth/        # Auth context & hooks
│   ├── supabase/    # Supabase client & types
│   └── utils.ts     # Helper functions
public/             # Static assets
supabase/           # Database migrations
```

## Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **UI Library**: Radix UI, Shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: Zustand

## Coding Standards

- Use TypeScript for all files
- Follow Next.js best practices
- Use functional components
- Keep components small and focused
- Use Tailwind CSS for styling
- Add comments for complex logic
- Use meaningful variable names

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature"

# Push to remote
git push origin feature/feature-name

# Open Pull Request on GitHub
```

## Debugging

### Browser DevTools

- Open DevTools (F12)
- Use Console tab for logs
- Use Network tab to inspect API calls
- Use Application tab for localStorage/cookies

### Supabase Realtime

Monitor database changes in real-time:

```bash
supabase functions serve
```

### Environment Issues

If you have issues with environment variables:

```bash
# Restart dev server
Ctrl+C
npm run dev

# Clear .next cache
rm -rf .next
npm run dev
```

## Testing

### Manual Testing Checklist

Before committing:

- [ ] Feature works as intended
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Loading states working
- [ ] Error handling in place
- [ ] Database operations correct
- [ ] RLS policies respected

### Common Issues

**"Cannot find module"**
- Run `npm install`
- Check import paths
- Clear `.next` folder

**"Supabase connection error"**
- Verify `.env.local` credentials
- Check Supabase project is active
- Try switching networks

**"RLS policy denies access"**
- Check auth token is valid
- Verify user ID matches
- Review RLS policies in Supabase

## Deployment

### To Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

```bash
git add .
git commit -m "Ready for deploy"
git push
```

Vercel auto-deploys from main branch.

## Database Backup

```bash
# Export database
supabase db dump > backup.sql

# Restore database
supabase db push < backup.sql
```

## Performance Tips

1. Use Next.js Image optimization
2. Implement pagination for lists
3. Use React.memo for expensive components
4. Lazy load components with next/dynamic
5. Optimize database queries with indexes
6. Use Supabase caching

## Security Checklist

- [ ] All user inputs validated
- [ ] RLS policies enabled
- [ ] Sensitive data in .env.local
- [ ] No secrets in git history
- [ ] CORS configured correctly
- [ ] File uploads validated
- [ ] XSS protection enabled
- [ ] CSRF tokens in forms

## Documentation

Keep README updated with:
- New features
- Breaking changes
- Installation instructions
- API documentation

---

For questions, open an issue or contact the maintainers.
