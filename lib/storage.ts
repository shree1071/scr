// Company-specific data storage utilities using Supabase
// This ensures data isolation between companies

import { supabase } from './supabase';
import { Post } from '../types';

// Database table names
const COMPANY_POSTS_TABLE = 'company_posts';
const BMSIT_SURVEYS_TABLE = 'bmsit_surveys';

// Helper function to format timestamp for display
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// Convert database row to Post type
const dbRowToPost = (row: any): Post => {
  return {
    id: row.id,
    content: row.content,
    timestamp: formatTimestamp(new Date(row.created_at)),
    likes: row.likes || 0,
    comments: row.comments || 0,
    tags: row.tags || [],
    hasImage: row.has_image || false,
    imageUrl: row.image_url,
    isPoll: row.is_poll || false,
    pollData: row.poll_data ? JSON.parse(JSON.stringify(row.poll_data)) : undefined,
    userId: row.user_id,
    userName: row.user_name,
    userInitials: row.user_initials,
  };
};

// Convert Post type to database row
const postToDbRow = (post: Post, companyId: string) => {
  return {
    company_id: companyId,
    content: post.content,
    tags: post.tags || [],
    likes: post.likes || 0,
    comments: post.comments || 0,
    has_image: post.hasImage || false,
    image_url: post.imageUrl || null,
    is_poll: post.isPoll || false,
    poll_data: post.pollData || null,
    user_id: post.userId || null,
    user_name: post.userName || null,
    user_initials: post.userInitials || null,
  };
};

/**
 * Get company-specific posts from Supabase
 */
export const getCompanyPosts = async (companyId: string): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from(COMPANY_POSTS_TABLE)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data ? data.map(dbRowToPost) : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Add a post to company-specific storage in Supabase
 */
export const addCompanyPost = async (companyId: string, post: Post): Promise<Post | null> => {
  try {
    const dbRow = postToDbRow(post, companyId);
    
    const { data, error } = await supabase
      .from(COMPANY_POSTS_TABLE)
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error('Error adding post:', error);
      return null;
    }

    return data ? dbRowToPost(data) : null;
  } catch (error) {
    console.error('Error adding post:', error);
    return null;
  }
};

/**
 * Update a post (e.g., increment likes)
 */
export const updateCompanyPost = async (postId: string, updates: Partial<Post>): Promise<boolean> => {
  try {
    const dbUpdates: any = {};
    if (updates.likes !== undefined) dbUpdates.likes = updates.likes;
    if (updates.comments !== undefined) dbUpdates.comments = updates.comments;
    if (updates.pollData !== undefined) dbUpdates.poll_data = updates.pollData;

    const { error } = await supabase
      .from(COMPANY_POSTS_TABLE)
      .update(dbUpdates)
      .eq('id', postId);

    if (error) {
      console.error('Error updating post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
};

/**
 * Save BMSIT survey response to Supabase
 */
export const saveBMSITSurvey = async (answers: Record<number, number | string>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(BMSIT_SURVEYS_TABLE)
      .insert({
        answers: answers,
      });

    if (error) {
      console.error('Error saving BMSIT survey:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving BMSIT survey:', error);
    return false;
  }
};

/**
 * Get all BMSIT survey responses from Supabase
 */
export const getBMSITSurveys = async (): Promise<Array<{ timestamp: string; answers: Record<number, number | string> }>> => {
  try {
    const { data, error } = await supabase
      .from(BMSIT_SURVEYS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching BMSIT surveys:', error);
      return [];
    }

    return data ? data.map((row: any) => ({
      timestamp: row.created_at,
      answers: row.answers,
    })) : [];
  } catch (error) {
    console.error('Error fetching BMSIT surveys:', error);
    return [];
  }
};

// Legacy functions for backward compatibility (now async wrappers)
// These can be removed if not needed

/**
 * Store company-specific posts (legacy - now uses Supabase)
 * @deprecated Use addCompanyPost instead
 */
export const saveCompanyPosts = async (companyId: string, posts: Post[]): Promise<void> => {
  // This function is kept for backward compatibility
  // In practice, posts should be added individually via addCompanyPost
  console.warn('saveCompanyPosts is deprecated. Use addCompanyPost instead.');
};

/**
 * Get company-specific messages (legacy - for future use)
 */
export const getCompanyMessages = async (companyId: string): Promise<any[]> => {
  // Placeholder for future implementation
  return [];
};

/**
 * Save company-specific messages (legacy - for future use)
 */
export const saveCompanyMessages = async (companyId: string, messages: any[]): Promise<void> => {
  // Placeholder for future implementation
};

/**
 * Get company-specific analytics (legacy - for future use)
 */
export const getCompanyAnalytics = async (companyId: string): Promise<any> => {
  // Placeholder for future implementation
  return null;
};

/**
 * Save company-specific analytics (legacy - for future use)
 */
export const saveCompanyAnalytics = async (companyId: string, analytics: any): Promise<void> => {
  // Placeholder for future implementation
};
