'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { UserStats, Profile } from '@/lib/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userStats: UserStats | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithNickname: (nickname: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // 获取用户数据
  const fetchUserData = async (userId: string) => {
    try {
      // 获取 profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // 获取 user_stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (statsData) {
        setUserStats(statsData);
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
    }
  };

  // 刷新用户数据
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    // 获取初始 session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
      
      setIsLoading(false);
    };

    getInitialSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setUserStats(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 登录
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // 注册
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  // 使用昵称注册（生成随机邮箱+密码，保存昵称到 profiles）
  const signUpWithNickname = async (nickname: string) => {
    try {
      // 生成随机邮箱和密码
      const randomId = Math.random().toString(36).substring(2, 15);
      const randomEmail = `user_${randomId}@wordshunter.online`;
      const randomPassword = Math.random().toString(36).substring(2, 15) + 'Aa1!';
      
      // 创建账号
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: randomEmail,
        password: randomPassword,
        options: {
          data: {
            username: nickname,
          },
        },
      });
      
      if (signUpError) {
        return { error: signUpError };
      }
      
      // 如果注册成功，更新 profiles 表的 username
      if (data.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username: nickname,
          });
        
        // 创建 user_stats 记录
        await supabase
          .from('user_stats')
          .upsert({
            user_id: data.user.id,
            diamonds: 0,
            total_collected: 0,
            total_mastered: 0,
          });
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // 登出
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserStats(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        userStats,
        isLoading,
        signIn,
        signUp,
        signUpWithNickname,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
