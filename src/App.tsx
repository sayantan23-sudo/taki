import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Home, 
  MessageSquare, 
  CreditCard, 
  Users, 
  Compass, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  MapPin,
  Clock,
  Camera,
  Shield,
  Phone,
  Info
} from 'lucide-react';

import { UserProfile, MembershipStatus } from './types';
import Login from './components/Login';
import DashboardHome from './components/DashboardHome';
import CommunityChat from './components/CommunityChat';
import AlumniRenewal from './components/AlumniRenewal';
import AlumniDirectory from './components/AlumniDirectory';
import SchoolHeritage from './components/SchoolHeritage';
import MediaGallery from './components/MediaGallery';
import Committee from './components/Committee';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAlumni: 4,
    activeChats: 3,
    upcomingEvents: 3
  });

  // Load user from session state on startup
  useEffect(() => {
    const savedUser = sessionStorage.getItem('taki_alumni_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse user session', err);
      }
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    sessionStorage.setItem('taki_alumni_user', JSON.stringify(user));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('taki_alumni_user');
    setActiveTab('dashboard');
  };

  const handleRenewalSuccess = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    sessionStorage.setItem('taki_alumni_user', JSON.stringify(updatedUser));
    // Increment total registered alumni in stats if they just registered and paid, or update stats
    setStats(prev => ({
      ...prev,
      totalAlumni: Math.max(prev.totalAlumni, 5)
    }));
  };

  // Dynamically update total chat counts and directory sizes in stats
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchStats = async () => {
      try {
        const chatsRes = await fetch('/api/chat/messages');
        const directoryRes = await fetch('/api/alumni/directory');
        if (chatsRes.ok && directoryRes.ok) {
          const chatsData = await chatsRes.json();
          const directoryData = await directoryRes.json();
          setStats({
            totalAlumni: directoryData.directory.length,
            activeChats: chatsData.messages.length,
            upcomingEvents: 3
          });
        }
      } catch (err) {
        // Handle transient network errors during server startup gracefully
        console.warn('Global stats sync paused or server starting up.');
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // If user is not logged in, render the login page
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Navigation tabs config
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'about', label: 'About TBAAK', icon: Info },
    { id: 'chat', label: 'Community Chat', icon: MessageSquare, badge: stats.activeChats > 0 ? stats.activeChats : undefined },
    { id: 'gallery', label: 'Media Gallery', icon: Camera },
    { id: 'committee', label: 'Executive Board', icon: Shield },
    { id: 'renewal', label: 'Alumni Renewal', icon: CreditCard, alert: currentUser.membershipStatus === MembershipStatus.EXPIRED },
    { id: 'directory', label: 'Alumni Directory', icon: Users },
    { id: 'heritage', label: 'School Heritage', icon: Compass },
    { id: 'contact', label: 'Contact Us', icon: Phone },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome user={currentUser} onNavigate={setActiveTab} stats={stats} />;
      case 'about':
        return <AboutUs />;
      case 'chat':
        return <CommunityChat currentUser={currentUser} />;
      case 'gallery':
        return <MediaGallery currentUser={currentUser} />;
      case 'committee':
        return <Committee />;
      case 'renewal':
        return <AlumniRenewal user={currentUser} onRenewalSuccess={handleRenewalSuccess} />;
      case 'directory':
        return <AlumniDirectory />;
      case 'heritage':
        return <SchoolHeritage />;
      case 'contact':
        return <ContactUs currentUser={currentUser} />;
      default:
        return <DashboardHome user={currentUser} onNavigate={setActiveTab} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] text-[#1A1A1A] font-serif flex flex-col justify-between" id="portal-app">
      
      {/* Top Main Navigation Header - Forest Green & White Theme */}
      <header className="sticky top-0 z-50 bg-[#0D5230] border-b border-[#0A4025] px-6 py-4 shadow-[0_4px_12px_rgba(13,82,48,0.1)]" id="portal-header">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* School Crest Logo Title */}
          <div className="flex flex-col items-center lg:items-start cursor-pointer text-center lg:text-left" onClick={() => setActiveTab('dashboard')}>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter leading-none uppercase text-white">Taki Boys' Alumni</h1>
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-green-200 block mt-1">Association Kolkata | Established 1932</span>
          </div>

          {/* Desktop Navigation - Clean White over Forest Green */}
          <nav className="hidden lg:flex items-center gap-6 font-sans text-[11px] font-bold uppercase tracking-widest">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-1 cursor-pointer transition-all ${
                    isActive 
                      ? 'border-b-2 border-white text-white' 
                      : 'text-green-100/75 hover:text-white hover:underline'
                  }`}
                >
                  <span>{tab.label}</span>
                  
                  {tab.badge && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white text-[#0D5230] text-[9px] font-mono font-bold shrink-0">
                      {tab.badge}
                    </span>
                  )}
                  {tab.alert && (
                    <span className="ml-1 inline-block h-2 w-2 rounded-full bg-red-400 animate-pulse shrink-0"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Profile Status & Sign-out */}
          <div className="hidden sm:flex items-center gap-4 lg:border-l lg:border-green-800 lg:pl-4">
            <div className="text-right">
              <span className="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className={`text-[10px] font-semibold font-sans uppercase tracking-wider block mt-0.5 ${
                currentUser.membershipStatus === MembershipStatus.ACTIVE ? 'text-green-200' : 'text-red-300'
              }`}>
                {currentUser.membershipStatus}
              </span>
            </div>

            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-white text-[#0D5230] hover:bg-green-50 hover:underline font-sans text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors"
              title="Sign Out of Portal"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser.membershipStatus === MembershipStatus.EXPIRED && (
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" title="Membership Renewal Required"></span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-3 py-1 bg-white text-[#0D5230] font-sans text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors"
            >
              {mobileMenuOpen ? "Close Menu" : "Menu"}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu - Forest Green & White Theme */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-[#0A4025] bg-[#0D5230] overflow-hidden relative z-40"
            id="mobile-navigation"
          >
            <div className="px-6 py-6 space-y-3 font-sans text-[11px] font-bold uppercase tracking-widest text-white">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 text-left transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'border-b border-white text-white' 
                        : 'text-green-100/70 hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>

                    <div className="flex items-center gap-1.5">
                      {tab.badge && (
                        <span className="px-1.5 py-0.5 bg-white text-[#0D5230] text-[9px] font-mono font-bold">
                          {tab.badge}
                        </span>
                      )}
                      {tab.alert && (
                        <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                      )}
                    </div>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-green-800 flex items-center justify-between">
                <div className="text-left font-serif">
                  <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                  <span className="text-[10px] text-green-200 italic block mt-0.5">Batch Year: {currentUser.batchYear}</span>
                </div>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 bg-white text-[#0D5230] hover:underline text-[10px] font-bold tracking-wider cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="tab-content-wrapper"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer bar - Forest Green & White Theme */}
      <footer className="h-12 bg-[#0A4025] text-white flex items-center px-6 justify-between mt-12" id="app-footer">
        <span className="font-sans text-[8px] uppercase tracking-[0.4em] opacity-80">
          © {new Date().getFullYear()} Taki Boys' Alumni Association Kolkata
        </span>
        <div className="hidden sm:flex gap-6 font-sans text-[8px] uppercase tracking-[0.2em] opacity-80">
          <span>Private Network</span>
          <span>Secure Portal v3.2.0</span>
        </div>
      </footer>

    </div>
  );
}
