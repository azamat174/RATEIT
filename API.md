# RATEIT API Documentation

## Overview

RATEIT uses Supabase for the backend. All API calls are made through the Supabase client.

## Authentication

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

### Get Session

```typescript
const { data: { session }, error } = await supabase.auth.getSession()
```

## Posts

### Create Post

```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: userId,
    title: 'My Post',
    description: 'Description',
    category: 'photos',
    file_url: 'https://...',
    file_type: 'image',
  })
  .select()
  .single()
```

### Get Posts

```typescript
// Get all posts
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false })

// Get single post
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('id', postId)
  .single()

// Filter by category
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('category', 'photos')
```

### Update Post

```typescript
const { data, error } = await supabase
  .from('posts')
  .update({
    title: 'New Title',
    description: 'New Description',
  })
  .eq('id', postId)
  .eq('user_id', userId)
```

### Delete Post

```typescript
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
  .eq('user_id', userId)
```

## Ratings

### Create/Update Rating

```typescript
// Create rating
const { error } = await supabase
  .from('ratings')
  .insert({
    post_id: postId,
    user_id: userId,
    rating: 85,
  })

// Update rating
const { error } = await supabase
  .from('ratings')
  .update({ rating: 90 })
  .eq('post_id', postId)
  .eq('user_id', userId)
```

### Get User Rating

```typescript
const { data, error } = await supabase
  .from('ratings')
  .select('rating')
  .eq('post_id', postId)
  .eq('user_id', userId)
  .single()
```

### Get Post Ratings

```typescript
const { data, error } = await supabase
  .from('ratings')
  .select('*')
  .eq('post_id', postId)
```

## Comments

### Create Comment

```typescript
const { data, error } = await supabase
  .from('comments')
  .insert({
    post_id: postId,
    user_id: userId,
    content: 'Great post!',
    parent_id: null, // for root comment
  })
  .select()
  .single()
```

### Get Comments

```typescript
const { data, error } = await supabase
  .from('comments')
  .select('*')
  .eq('post_id', postId)
  .order('created_at', { ascending: false })
```

### Get Replies

```typescript
const { data, error } = await supabase
  .from('comments')
  .select('*')
  .eq('parent_id', commentId)
```

### Update Comment

```typescript
const { error } = await supabase
  .from('comments')
  .update({ content: 'Updated comment' })
  .eq('id', commentId)
  .eq('user_id', userId)
```

### Delete Comment

```typescript
const { error } = await supabase
  .from('comments')
  .delete()
  .eq('id', commentId)
  .eq('user_id', userId)
```

## Reactions

### Add Reaction

```typescript
const { error } = await supabase
  .from('comment_reactions')
  .insert({
    comment_id: commentId,
    user_id: userId,
    reaction_type: 'heart', // heart, fire, laugh, thumbs_up, thumbs_down
  })
```

### Remove Reaction

```typescript
const { error } = await supabase
  .from('comment_reactions')
  .delete()
  .eq('comment_id', commentId)
  .eq('user_id', userId)
  .eq('reaction_type', 'heart')
```

### Get Reactions

```typescript
const { data, error } = await supabase
  .from('comment_reactions')
  .select('reaction_type, count(*)')
  .eq('comment_id', commentId)
  .group_by('reaction_type')
```

## Notifications

### Get Notifications

```typescript
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Mark as Read

```typescript
const { error } = await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('id', notificationId)
```

### Get Unread Count

```typescript
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .eq('is_read', false)
```

## Users

### Get User Profile

```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('username', username)
  .single()
```

### Update Profile

```typescript
const { error } = await supabase
  .from('users')
  .update({
    bio: 'My bio',
    avatar_url: 'https://...',
  })
  .eq('id', userId)
```

## File Storage

### Upload File

```typescript
const { data, error } = await supabase.storage
  .from('posts')
  .upload(`${category}/${userId}/${filename}`, file)
```

### Get Public URL

```typescript
const { data } = supabase.storage
  .from('posts')
  .getPublicUrl(`${category}/${userId}/${filename}`)

const url = data.publicUrl
```

### Delete File

```typescript
const { error } = await supabase.storage
  .from('posts')
  .remove([`${category}/${userId}/${filename}`])
```

## Realtime Subscriptions

### Subscribe to Posts

```typescript
const subscription = supabase
  .channel('posts')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'posts',
  }, (payload) => {
    console.log('Post changed:', payload)
  })
  .subscribe()

// Unsubscribe
await subscription.unsubscribe()
```

### Subscribe to Comments

```typescript
const subscription = supabase
  .channel(`post:${postId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'comments',
    filter: `post_id=eq.${postId}`,
  }, (payload) => {
    console.log('New comment:', payload.new)
  })
  .subscribe()
```

## Reports

### Create Report

```typescript
const { error } = await supabase
  .from('reports')
  .insert({
    user_id: userId,
    post_id: postId,
    reason: 'spam', // spam, offensive, forbidden, fraud, other
    description: 'Additional details',
  })
```

## Error Handling

All Supabase calls return `{ data, error }`:

```typescript
const { data, error } = await supabase
  .from('posts')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error
} else {
  // Use data
}
```

## Rate Limiting

Supabase has built-in rate limiting. If you hit limits:
- Wait before retrying
- Optimize queries
- Use pagination
- Implement caching

## Best Practices

1. **Always check for errors**
   ```typescript
   if (error) throw error
   ```

2. **Use `.single()` for single records**
   ```typescript
   .select().single()
   ```

3. **Use `.limit()` for large queries**
   ```typescript
   .select().limit(50)
   ```

4. **Use proper indexes**
   Database indexes are created in migrations

5. **Use RLS policies**
   All tables have RLS enabled for security

6. **Validate input**
   Always validate user input before database operations

---

For more info, see [Supabase Documentation](https://supabase.com/docs)
