import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import LearningCenter from './components/LearningCenter';
import AuthCallback from './components/AuthCallback';
import ResetPassword from './components/ResetPassword';
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, xp, loading: profileLoading, updateXP } = useUserProfile(user);
  const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'learning'>('chat');

  // Handle routing based on URL
  const currentPath = window.location.pathname;
  
  if (currentPath === '/auth/callback') {
    return <AuthCallback />;
  }
  
  if (currentPath === '/auth/reset-password' || currentPath === '/reset-password') {
    return <ResetPassword />;
  }

  const handleXPUpdate = async (points: number) => {
    await updateXP(points);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-50 via-warmyellow-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If no user, show login
  if (!user?.id) {
    return <LoginForm />;
  }

  // Check if user email is verified
  if (!user.email_confirmed_at) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-50 via-warmyellow-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gold-200 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📧
            </motion.div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal-800 mb-2">Verify Your Email</h2>
          <p className="text-charcoal-600 mb-4">
            Please check your email and click the verification link to activate your account.
          </p>
          <p className="text-sm text-charcoal-500 mb-6">
            Email sent to: <strong>{user.email}</strong>
          </p>
          <button
            onClick={signOut}
            className="text-brand-teal hover:text-teal-700 transition-colors"
          >
            Sign out and try again
          </button>
        </motion.div>
      </div>
    );
  }

  const level = Math.floor((xp?.points || 0) / 100) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-warmyellow-50 to-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-gold-100 via-warmyellow-100 to-gold-50 backdrop-blur-md border-b border-gold-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-brand-teal to-brand-rosegold rounded-full flex items-center justify-center p-1 shadow-md">
                  <img 
                    src="/assets/finapp.png" 
                    alt="DoughJo Mascot" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-serif font-bold text-charcoal-800">
                  DoughJo
                </h1>
              </motion.div>
              <div className="flex items-center space-x-2 bg-brand-teal/10 backdrop-blur-sm text-brand-teal px-3 py-1 rounded-full text-sm shadow-sm border border-brand-teal/20">
                <span>Level {level}</span>
                <span className="text-brand-rosegold">•</span>
                <span>{xp?.points || 0} XP</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setActiveView('chat')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    activeView === 'chat'
                      ? 'bg-brand-teal/10 backdrop-blur-sm text-brand-teal shadow-sm border border-brand-teal/20'
                      : 'text-charcoal-600 hover:bg-white/50 hover:text-brand-teal'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    activeView === 'dashboard'
                      ? 'bg-brand-teal/10 backdrop-blur-sm text-brand-teal shadow-sm border border-brand-teal/20'
                      : 'text-charcoal-600 hover:bg-white/50 hover:text-brand-teal'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('learning')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    activeView === 'learning'
                      ? 'bg-brand-teal/10 backdrop-blur-sm text-brand-teal shadow-sm border border-brand-teal/20'
                      : 'text-charcoal-600 hover:bg-white/50 hover:text-brand-teal'
                  }`}
                >
                  Learning
                </button>
              </nav>
              
              <button
                onClick={signOut}
                className="text-charcoal-600 hover:text-brand-teal transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeView === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatInterface user={user} xp={xp} onXPUpdate={handleXPUpdate} />
            </motion.div>
          ) : activeView === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard user={user} xp={xp} />
            </motion.div>
          ) : (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LearningCenter user={user} userLevel={level} xp={xp} onXPUpdate={handleXPUpdate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;