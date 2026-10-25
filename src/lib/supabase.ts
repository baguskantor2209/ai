import { createClient } from '@supabase/supabase-js';

export interface UserProfile {
  email: string;
  name: string;
  username: string;
  picture?: string;
  token?: number;
  created_at?: string;
}

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://yidywttxgawhhsvmqlys.supabase.co';
export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_Sb_Qe6oUSnaTufbxFzysTQ_-onms8YH';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const USER_STORAGE_KEY = 'mkenzo_auth_user_v1';
export const FREE_CHATS_COUNT_KEY = 'mkenzo_free_general_chats_count';

/**
 * Get currently authenticated user from localStorage
 */
export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading stored user:', err);
  }
  return null;
}

/**
 * Save user profile to localStorage
 */
export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving stored user:', err);
  }
}

/**
 * Remove stored user on logout
 */
export function removeStoredUser(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.error('Error removing stored user:', err);
  }
}

/**
 * Track count of general chats performed by guest user
 */
export function getGuestChatCount(): number {
  try {
    const raw = localStorage.getItem(FREE_CHATS_COUNT_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementGuestChatCount(): number {
  try {
    const next = getGuestChatCount() + 1;
    localStorage.setItem(FREE_CHATS_COUNT_KEY, next.toString());
    return next;
  } catch {
    return 1;
  }
}

export function resetGuestChatCount(): void {
  try {
    localStorage.removeItem(FREE_CHATS_COUNT_KEY);
  } catch (err) {
    console.error('Error resetting guest chat count:', err);
  }
}

/**
 * Save user to Supabase table 'User'
 * Columns detected: 'Email' (text) and 'token' (numeric)
 */
export async function saveUserToSupabase(user: UserProfile): Promise<{
  success: boolean;
  savedTo?: string;
  error?: string;
  message?: string;
  needsRlsPolicy?: boolean;
}> {
  const cleanEmail = user.email.trim().toLowerCase();
  const tokenVal = typeof user.token === 'number' ? user.token : 0;

  // 1. Try server proxy (/api/save-user)
  try {
    const res = await fetch('/api/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, token: tokenVal }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (proxyErr) {
    console.warn('Backend proxy save-user error:', proxyErr);
  }

  // 2. Direct client SDK call fallback
  try {
    const { data, error } = await supabase
      .from('User')
      .upsert({ Email: cleanEmail, token: tokenVal }, { onConflict: 'Email' })
      .select();

    if (!error) {
      return {
        success: true,
        savedTo: 'supabase',
        message: 'Email berhasil disimpan ke database Supabase (tabel User).',
      };
    }

    const isRlsError = error.code === '42501' || error.message.includes('row-level security');
    return {
      success: false,
      needsRlsPolicy: isRlsError,
      error: isRlsError
        ? 'Tabel "User" di Supabase memiliki Row-Level Security (RLS) aktif. Tambahkan Policy INSERT untuk public/anon di Supabase Dashboard.'
        : error.message,
    };
  } catch (directErr: any) {
    return {
      success: false,
      error: directErr?.message || 'Gagal terhubung ke Supabase.',
    };
  }
}

import type { ConversationSession } from '../types';

export interface SupabaseChatMessage {
  id?: number;
  user_email: string;
  message: string;
  role: 'user' | 'ai';
  created_at?: string;
  conversation_id?: string;
}

export interface SaveChatResult {
  success: boolean;
  conversation_id?: string;
  limitReached?: boolean;
  error?: string;
}

/**
 * Save chat message to Supabase chat_history table via server backend proxy
 * Automatically links message to conversation_id and checks 3-conversation quota
 */
export async function saveChatMessageToSupabase(
  userEmail: string,
  conversationId: string,
  title: string,
  message: string,
  role: 'user' | 'ai',
  actionForm?: number | null,
  mode?: 'cv' | 'letter' | 'general',
  meta?: any
): Promise<SaveChatResult> {
  if (!userEmail || !message) return { success: false, error: 'Email and message required' };
  try {
    const res = await fetch('/api/chat-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: userEmail,
        conversation_id: conversationId,
        title,
        message,
        role,
        actionForm: actionForm || null,
        mode: mode || 'general',
        meta: meta || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        limitReached: Boolean(data?.limitReached),
        error: data?.error || 'Gagal menyimpan pesan',
      };
    }

    return {
      success: Boolean(data.success),
      conversation_id: data.conversation_id,
    };
  } catch (err: any) {
    console.warn('Failed saving message to chat_history:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetch conversations for user from Supabase grouped by conversation_id
 */
export async function fetchUserConversations(
  userEmail: string
): Promise<{ conversations: ConversationSession[]; count: number }> {
  if (!userEmail) return { conversations: [], count: 0 };
  try {
    const res = await fetch(`/api/chat-history/${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.conversations)) {
        return {
          conversations: data.conversations,
          count: data.count || data.conversations.length,
        };
      }
    }
  } catch (err) {
    console.warn('Failed fetching conversations from Supabase:', err);
  }
  return { conversations: [], count: 0 };
}

/**
 * Fetch legacy/flat chat history for user from Supabase
 */
export async function fetchUserChatHistory(
  userEmail: string
): Promise<SupabaseChatMessage[]> {
  if (!userEmail) return [];
  try {
    const res = await fetch(`/api/chat-history/${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.history)) {
        return data.history;
      }
    }
  } catch (err) {
    console.warn('Failed fetching chat history from Supabase:', err);
  }
  return [];
}

/**
 * Delete a single conversation and all its messages permanently from Supabase
 */
export async function deleteConversationFromSupabase(
  userEmail: string,
  conversationId: string
): Promise<boolean> {
  if (!userEmail || !conversationId) return false;
  try {
    const res = await fetch(
      `/api/chat-history/${encodeURIComponent(userEmail)}/${encodeURIComponent(conversationId)}`,
      {
        method: 'DELETE',
      }
    );
    return res.ok;
  } catch (err) {
    console.warn('Failed deleting conversation in Supabase:', err);
    return false;
  }
}

/**
 * Clear all chat history for user in Supabase
 */
export async function clearUserChatHistory(userEmail: string): Promise<boolean> {
  if (!userEmail) return false;
  try {
    const res = await fetch(`/api/chat-history/${encodeURIComponent(userEmail)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed clearing chat history in Supabase:', err);
    return false;
  }
}
