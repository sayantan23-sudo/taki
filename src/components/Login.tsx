import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Calendar, MapPin, Briefcase, GraduationCap, ArrowRight, ShieldAlert, CheckCircle2, Smartphone, Sparkles, Download, X, Info, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration fields
  const [name, setName] = useState('');
  const [batchYear, setBatchYear] = useState('2015');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [location, setLocation] = useState('Kolkata');
  const [rollNumber, setRollNumber] = useState('');

  // Interactive Feathers states
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [showAppStoreModal, setShowAppStoreModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('sayantanroy58581@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState('Sayantan Roy');
  const [simulatedInstallProgress, setSimulatedInstallProgress] = useState<'idle' | 'installing' | 'installed'>('idle');

  const handleGoogleSignInSubmit = async (selectedEmail: string, selectedName: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setShowGooglePopup(false);
    
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedEmail,
          name: selectedName,
          avatarUrl: selectedEmail === 'sayantanroy58581@gmail.com' 
            ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
            : undefined
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setEmail(demoEmail);
    setPassword('password123');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        // Register flow
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            batchYear,
            phone,
            occupation,
            location,
            rollNumber
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        setSuccess('Registration successful! You can now log in.');
        setIsRegister(false);
        setPassword('');
      } else {
        // Login flow
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] text-[#1A1A1A] font-serif flex flex-col justify-between relative" id="login-container">
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10">
        
        {/* Left Side: School Branding & Pride (Forest Green & White Theme) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-center lg:text-left space-y-6"
          id="school-info-section"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#0D5230] bg-white text-[10px] font-sans font-bold uppercase tracking-wider text-[#0D5230]">
            <span>ESTABLISHED 1932 • KOLKATA</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase text-[#0D5230]">
            Taki House Boys<br />
            <span className="italic font-normal font-serif lowercase text-[#1A1A1A]">Alumni Association</span>
          </h1>
          
          <p className="font-serif text-base text-slate-800 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Welcome to the digital portal for the ex-students of Taki House Govt. Sponsored High School for Boys, Kolkata. Connect with batchmates, participate in community chats, and keep your membership active in school colors of green and white.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 pt-4 font-sans text-xs">
            <div className="p-4 border-2 border-[#0D5230] bg-white text-left shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
              <span className="font-serif italic text-2xl font-bold block leading-none mb-1 text-[#0D5230]">90+ Yrs</span>
              <span className="uppercase tracking-wider font-bold opacity-60 text-[9px] text-[#1A1A1A]">Educational Legacy</span>
            </div>
            <div className="p-4 border-2 border-[#0D5230] bg-white text-left shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
              <span className="font-serif italic text-2xl font-bold block leading-none mb-1 text-[#0D5230]">5000+</span>
              <span className="uppercase tracking-wider font-bold opacity-60 text-[9px] text-[#1A1A1A]">Global Alumni Network</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Interactive Forms & Demo Accounts (Forest Green & White Theme) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md flex flex-col gap-6 font-sans"
          id="auth-form-section"
        >
          {/* Card Frame - Forest Green Border, White BG */}
          <div className="bg-white border-2 border-[#0D5230] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(13,82,48,0.2)]">
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#0D5230]">
                {isRegister ? "Join the Association" : "Alumni Access"}
              </h2>
              <p className="font-serif italic text-sm text-slate-600 mt-1">
                {isRegister ? "Register your details to create an alumnus profile" : "Enter credentials to securely sign into the archives"}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 border border-red-600 bg-red-50 text-red-700 text-xs flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 mb-4 border border-green-600 bg-green-50 text-green-700 text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {isRegister && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sayantan Roy"
                        className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Passout Batch</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                        <input 
                          type="number" 
                          required
                          min="1940"
                          max="2026"
                          value={batchYear}
                          onChange={(e) => setBatchYear(e.target.value)}
                          placeholder="e.g. 2012"
                          className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Roll No</label>
                      <input 
                        type="text" 
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="Batch15-089"
                        className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 px-3 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Occupation</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                        <input 
                          type="text" 
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          placeholder="Developer / Doctor"
                          className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Kolkata / Delhi"
                          className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 px-3 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amit.sen@taki.alumni"
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-3 px-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-px"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isRegister ? "Register Ex-Student" : "Secure Log In"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {!isRegister && (
                <>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-[#0D5230]/20"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or Connect directly</span>
                    <div className="flex-grow border-t border-[#0D5230]/20"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setShowGooglePopup(true)}
                    className="w-full bg-white hover:bg-[#F4F9F6] text-[#1A1A1A] font-bold py-2.5 px-4 text-xs uppercase tracking-wider border-2 border-[#0D5230] flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-px"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Direct Google Access</span>
                  </button>
                </>
              )}
            </form>

            <div className="mt-5 text-center text-xs">
              {isRegister ? (
                <button onClick={() => setIsRegister(false)} className="text-[#0D5230] hover:underline font-bold uppercase tracking-wider text-[10px]">
                  Already registered? Sign in here
                </button>
              ) : (
                <button onClick={() => setIsRegister(true)} className="text-[#0D5230] hover:underline font-bold uppercase tracking-wider text-[10px]">
                  New here? Register Alumni Profile
                </button>
              )}
            </div>

            {/* Quick Access Demo Alumni Profiles */}
            <div className="mt-6 pt-5 border-t-2 border-dashed border-[#0D5230]/20 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230]">Quick-Access Demo Accounts</span>
                <span className="text-[8px] bg-[#0D5230]/10 text-[#0D5230] px-1.5 py-0.5 uppercase tracking-wider font-bold">1-Click Login</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-3 font-serif italic">
                Click any profile below to instantly log in as that ex-student without typing a password:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { email: 'sayantanroy58581@gmail.com', name: 'Sayantan Roy', role: 'Annual (Exp.)' },
                  { email: 'amit.sen@taki.alumni', name: 'Amit Sen', role: 'Annual (Exp.)' },
                  { email: 'sourav.das@taki.alumni', name: 'Sourav Das', role: 'Life Member' },
                  { email: 'pradip.banerjee@taki.alumni', name: 'Pradip Banerjee', role: 'Patron' }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() => handleDemoLogin(p.email)}
                    className="p-2 border border-[#0D5230]/20 bg-[#F4F9F6] hover:bg-[#0D5230]/5 hover:border-[#0D5230] text-left transition-all flex flex-col justify-between cursor-pointer group active:scale-[0.98]"
                  >
                    <span className="font-serif font-bold text-xs text-[#0D5230] truncate group-hover:underline">{p.name}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold mt-0.5">{p.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* App Store / Google Play Companion Card */}
          <div className="bg-white border-2 border-[#0D5230] p-5 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="h-4 w-4 text-[#0D5230]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D5230]">Taki Alumni Mobile Companion</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-serif">
              Access digital identity cards, fast-entry QR codes, and push notifications for winter reunions.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                type="button"
                onClick={() => setShowAppStoreModal(true)}
                className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] py-1.5 px-3 border border-slate-700 flex items-center gap-2 transition-all rounded shadow-sm cursor-pointer active:translate-y-px"
              >
                <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.2.12.3.12.87 0 1.96-.54 2.52-1.45z" />
                </svg>
                <div className="text-left leading-none font-sans">
                  <span className="text-[7px] text-slate-300 block">Download on the</span>
                  <span className="font-bold text-[10px]">App Store</span>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setShowAppStoreModal(true)}
                className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] py-1.5 px-3 border border-slate-700 flex items-center gap-2 transition-all rounded shadow-sm cursor-pointer active:translate-y-px"
              >
                <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M3 5.27v13.46c0 .59.35 1.13.88 1.34l7.15-7.15L3.88 3.93C3.35 4.14 3 4.68 3 5.27zm14.77 4.9L13.1 7.42l-3.32 3.32 3.32 3.32 4.67-2.75c1.1-.65 1.1-1.71 0-2.34zM10.95 11.9l-7.07 7.07c.2.08.41.12.63.12.48 0 .93-.24 1.19-.65l5.25-3.09-3-3.45zm0-1.06L7.95 7.4 2.7 4.31c-.26-.41-.71-.65-1.19-.65-.22 0-.43.04-.63.12l7.07 7.06z" />
                </svg>
                <div className="text-left leading-none font-sans">
                  <span className="text-[7px] text-slate-300 block">GET IT ON</span>
                  <span className="font-bold text-[10px]">Google Play</span>
                </div>
              </button>
            </div>
          </div>


        </motion.div>
      </main>

      {/* Google Sign-In Simulated Portal Popup */}
      <AnimatePresence>
        {showGooglePopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border-2 border-[#0D5230] shadow-[6px_6px_0px_0px_rgba(13,82,48,0.25)] max-w-sm w-full overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sign in with Google</span>
                </div>
                <button 
                  onClick={() => setShowGooglePopup(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="font-serif font-black text-md text-[#1A1A1A] uppercase tracking-tight">Choose Google Account</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">to securely authenticate and link with Taki House Ex-Student Digital Registry.</p>
                </div>

                <div className="space-y-2">
                  {/* Account choice 1: Sayantan Roy */}
                  <button 
                    type="button"
                    onClick={() => handleGoogleSignInSubmit('sayantanroy58581@gmail.com', 'Sayantan Roy')}
                    className="w-full p-3 border border-slate-200 hover:border-[#0D5230] hover:bg-[#F4F9F6] text-left transition-all flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" alt="Sayantan Roy" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-[#1A1A1A] group-hover:text-[#0D5230] transition-colors">Sayantan Roy</span>
                      <span className="block text-[10px] text-slate-500 truncate">sayantanroy58581@gmail.com</span>
                    </div>
                    <span className="text-[8px] bg-green-100 text-green-800 px-1.5 py-0.5 font-bold uppercase shrink-0">Default</span>
                  </button>

                  {/* Account choice 2: Amit Sen */}
                  <button 
                    type="button"
                    onClick={() => handleGoogleSignInSubmit('amit.sen@taki.alumni', 'Amit Sen')}
                    className="w-full p-3 border border-slate-200 hover:border-[#0D5230] hover:bg-[#F4F9F6] text-left transition-all flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Amit Sen" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-[#1A1A1A] group-hover:text-[#0D5230] transition-colors">Amit Sen</span>
                      <span className="block text-[10px] text-slate-500 truncate font-mono">amit.sen@taki.alumni</span>
                    </div>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Or enter any custom Google email</span>
                  <div className="flex gap-2">
                    <input 
                      type="email"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="e.g. custom.student@gmail.com"
                      className="flex-1 bg-[#F4F9F6] border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:border-[#0D5230] font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => handleGoogleSignInSubmit(googleEmailInput, googleNameInput || "Google Alumnus")}
                      className="bg-[#0D5230] text-white px-3 text-[10px] uppercase font-bold tracking-wider hover:bg-[#0A4025] transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="Display Name (optional)"
                      className="flex-1 bg-[#F4F9F6] border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:border-[#0D5230]"
                    />
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-normal text-center">
                  To continue, Google will share your name, email address, language preference, and profile picture with the Taki Boys Alumni network database.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App Store Download Portal Popup */}
      <AnimatePresence>
        {showAppStoreModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border-2 border-[#0D5230] shadow-[6px_6px_0px_0px_rgba(13,82,48,0.25)] max-w-lg w-full overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="h-5 w-5 text-[#0D5230]" />
                  <span className="text-xs font-bold text-[#0D5230] uppercase tracking-wider">Taki Boys Alumni Store Beta</span>
                </div>
                <button 
                  onClick={() => setShowAppStoreModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Left: Mock Smartphone Screen */}
                  <div className="w-full sm:w-48 shrink-0 bg-slate-900 border-4 border-slate-800 p-2.5 rounded-[20px] shadow-lg flex flex-col justify-between h-72 text-white text-center font-sans">
                    {/* Phone Top Notch */}
                    <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />
                    
                    {/* Alumnus Digital ID Screen */}
                    <div className="flex-1 bg-gradient-to-br from-[#0D5230] to-[#0A4025] p-3 flex flex-col justify-between items-center text-left relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
                      
                      <div className="w-full">
                        <span className="text-[6px] tracking-wider font-bold uppercase opacity-80 block text-center border-b border-white/20 pb-1">Taki House Govt. Sponsored High School</span>
                        <span className="text-[5px] uppercase tracking-widest text-center block mt-0.5">Alumnus Digital ID</span>
                      </div>

                      {/* Profile Mock */}
                      <div className="flex items-center gap-2 w-full mt-2 bg-white/10 p-1.5">
                        <div className="h-7 w-7 rounded-full bg-slate-200 border border-white/20 shrink-0 overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" alt="Sayantan" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] font-bold leading-tight truncate">Sayantan Roy</span>
                          <span className="block text-[6px] opacity-75">Batch of 2015</span>
                        </div>
                      </div>

                      {/* QR Code Placeholder */}
                      <div className="bg-white p-1 rounded-sm flex flex-col items-center">
                        {/* Interactive QR representation */}
                        <div className="grid grid-cols-4 gap-0.5 bg-slate-950 p-1">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} className={`h-2.5 w-2.5 ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`} />
                          ))}
                        </div>
                        <span className="text-[4px] text-slate-800 font-bold uppercase tracking-wider mt-0.5">Active Member Pass</span>
                      </div>

                      <div className="text-center w-full">
                        <span className="text-[5px] text-green-300 uppercase tracking-widest block">Authorized Campus Pass</span>
                        <span className="text-[4px] opacity-60 font-mono">ID: TA-2015-8122</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Info and Sim Install */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-serif font-black text-lg text-[#0D5230] uppercase tracking-tight">Taki Boys Alumni Hub App</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Stay connected with your roots on iOS & Android. The companion app offers high-fidelity ex-student utilities.
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs font-sans">
                      <div className="flex items-start gap-2 text-slate-700">
                        <div className="p-1 bg-green-50 text-[#0D5230] border border-[#0D5230]/20 rounded shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-tight"><strong>Digital Alumni ID Card:</strong> Instant pass with dynamic QR codes for campus visits.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <div className="p-1 bg-green-50 text-[#0D5230] border border-[#0D5230]/20 rounded shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-tight"><strong>Offline Heritage Timelines:</strong> Access milestone histories without data connections.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <div className="p-1 bg-green-50 text-[#0D5230] border border-[#0D5230]/20 rounded shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-tight"><strong>Push Notifications:</strong> Immediate alerts for winter dinners, reunions, and emergencies.</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                      {simulatedInstallProgress === 'idle' && (
                        <button 
                          type="button"
                          onClick={() => {
                            setSimulatedInstallProgress('installing');
                            setTimeout(() => {
                              setSimulatedInstallProgress('installed');
                            }, 1800);
                          }}
                          className="w-full sm:w-auto bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-2.5 px-5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Simulate App Install</span>
                        </button>
                      )}

                      {simulatedInstallProgress === 'installing' && (
                        <div className="w-full flex items-center gap-2.5">
                          <div className="h-4 w-4 border-2 border-[#0D5230] border-t-transparent rounded-full animate-spin shrink-0" />
                          <span className="text-xs font-bold text-slate-600 font-sans">Connecting to TestFlight / Play Console...</span>
                        </div>
                      )}

                      {simulatedInstallProgress === 'installed' && (
                        <div className="w-full flex items-center gap-2 bg-green-50 border border-[#0D5230]/30 p-2.5 text-xs text-[#0D5230] font-sans">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0D5230]" />
                          <span><strong>Beta App Profile Active!</strong> Simulated installation complete. Real-time notifications and offline ID sync enabled.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2 font-serif">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-700" />
                  <span>
                    Note: Direct App Store & Play Store publishing is pending the 94th reunion administrative verification. You can simulate beta onboarding using the tool above.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="h-12 bg-[#0A4025] text-white flex items-center justify-center px-6">
        <span className="font-sans text-[8px] uppercase tracking-[0.4em] opacity-80">
          © {new Date().getFullYear()} Taki Boys' Alumni Association Kolkata
        </span>
      </footer>
    </div>
  );
}
