export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: 'tracks' | 'works' | 'outfits' | 'appearance' | 'photos' | 'ideas'
          file_url: string | null
          file_type: 'image' | 'audio' | null
          average_rating: number
          rating_count: number
          comment_count: number
          created_at: string
          updated_at: string
        }
      }
      ratings: {
        Row: {
          id: string
          post_id: string
          user_id: string
          rating: number
          created_at: string
          updated_at: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
      }
      comment_reactions: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          reaction_type: 'heart' | 'fire' | 'laugh' | 'thumbs_up' | 'thumbs_down'
          created_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          actor_id: string
          type: 'rating' | 'comment' | 'reply' | 'reaction'
          post_id: string | null
          comment_id: string | null
          is_read: boolean
          created_at: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          reason: 'spam' | 'offensive' | 'forbidden' | 'fraud' | 'other'
          description: string | null
          status: 'pending' | 'reviewed' | 'resolved'
          created_at: string
        }
      }
    }
  }
}
