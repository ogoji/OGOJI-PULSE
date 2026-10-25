import React, { useState, useEffect } from 'react';
import {
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle,
  Loader2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { auth, signInWithGoogle, logOut } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { usePulseStore } from '../store/usePulseStore';
import { USER_DEFAULT_AVATAR } from '../data/mockData';

export const AuthWidget: React.FC = () => {
  const { currentUser, updateUserProfile, setCurrentTab } = usePulseStore();
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      setIsLoading(false);
      if (user) {
        updateUserProfile({
          id: user.uid,
          name: user.displayName || 'Builder',
          handle: user.email ? `@${user.email.split('@')[0]}` : '@builder',
          avatar: user.photoURL || USER_DEFAULT_AVATAR,
          email: user.email || undefined,
        });
      }
    });

    return () => unsubscribe();
  }, [updateUserProfile]);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Firebase Auth sign in error:', error);
      setErrorMessage(error.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsOpenDropdown(false);
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!fbUser) {
    return (
      <div className="relative">
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition-all shadow-sm shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
          title="Sign in with Google (Firebase Auth)"
        >
          {isSigningIn ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
          )}
          <span>Sign In</span>
        </button>

        {errorMessage && (
          <div className="absolute right-0 mt-2 w-64 p-2.5 rounded-xl bg-rose-950/90 border border-rose-800 text-[11px] text-rose-200 shadow-xl z-50">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
      >
        <img
          src={fbUser.photoURL || USER_DEFAULT_AVATAR}
          alt={fbUser.displayName || 'User'}
          className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-500/40"
        />
        <span className="hidden sm:inline max-w-[100px] truncate">
          {fbUser.displayName?.split(' ')[0] || 'Builder'}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpenDropdown && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <img
              src={fbUser.photoURL || USER_DEFAULT_AVATAR}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-cyan-400"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{fbUser.displayName}</p>
              <p className="text-[11px] text-slate-400 truncate">{fbUser.email}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono">Firebase Verified</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <button
              onClick={() => {
                setCurrentTab('profile');
                setIsOpenDropdown(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Profile & Saved</span>
            </button>
            <button
              onClick={() => {
                setCurrentTab('services');
                setIsOpenDropdown(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Book Optimization Package</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
