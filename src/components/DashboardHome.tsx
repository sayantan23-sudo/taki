import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { UserProfile, MembershipStatus, AlumniNotice } from '../types';
import { 
  Award, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Heart,
  Phone,
  Sparkles,
  ChevronLeft,
  Star,
  CreditCard,
  Megaphone,
  Pin
} from 'lucide-react';
import Events from './Events';
import MembershipCard from './MembershipCard';

interface DashboardHomeProps {
  user: UserProfile;
  onNavigate: (tab: string) => void;
  stats: {
    totalAlumni: number;
    activeChats: number;
    upcomingEvents: number;
  };
}

const spotlightAlumni = [
  {
    monthName: "January",
    monthIndex: 0,
    name: "Dr. Biswapati Mukherjee",
    batchYear: 1979,
    role: "Senior Professor & Natural Products Chemist",
    company: "S.N. Bose National Centre for Basic Sciences",
    bio: "A pioneering researcher in phytochemistry, Dr. Mukherjee has spent over four decades studying medicinal plants of West Bengal. He frequently mentors Taki Boys students in chemistry exhibitions.",
    achievements: [
      "Recipient of the National Bio-organic Chemistry Award",
      "Donated a state-of-the-art chemistry lab catalog with 400+ books to Taki House",
      "Regular guest speaker at the Taki Science Seminar Series"
    ],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  },
  {
    monthName: "February",
    monthIndex: 1,
    name: "Mr. Seemanta Roy",
    batchYear: 2008,
    role: "Principal Infrastructure Architect",
    company: "TechVanguard Solutions",
    bio: "Seemanta has been at the forefront of scalable cloud infrastructure designs. He single-handedly digitized the initial student register records of Taki House from 1950 to 1980.",
    achievements: [
      "Engineered cloud database architectures handling 10M+ daily events",
      "Volunteered 100+ hours to train senior school students in computer networks",
      "Sponsored the Annual Taki Boys Tech-Fest awards since 2021"
    ],
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    location: "Bengaluru, India"
  },
  {
    monthName: "March",
    monthIndex: 2,
    name: "Dr. Sudipta Bandopadhyay",
    batchYear: 1986,
    role: "Professor of Electronics & Imaging Informatics",
    company: "Indian Institute of Technology",
    bio: "Dr. Sudipta is a distinguished scholar in medical image processing and diagnostic algorithms. He serves as a chief mentor to our alumni trust's educational scholarship wings.",
    achievements: [
      "Senior Member, IEEE & published over 80+ international journals",
      "Formulated the Taki Boys Merit-cum-Means Scholarship Fund in 2018",
      "Preserves ancient handwritten school ledgers from the late 1930s"
    ],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    location: "Kharagpur, India"
  },
  {
    monthName: "April",
    monthIndex: 3,
    name: "Mr. Partha Sarathi Saha",
    batchYear: 1995,
    role: "Founder & Social Entrepreneur",
    company: "Sahayata Rural Dev Trust",
    bio: "Partha turned his business success towards rural empowerment in southern Bengal. As General Secretary, he leads the fundraising campaigns for modernizing our high school.",
    achievements: [
      "Provided solar-powered study lamps to 1,200+ rural students",
      "Overlooks the Taki Boys Alumni free weekly homeopathic clinic",
      "Spearheaded the reconstruction of the school's heritage outer playground boundary wall"
    ],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  },
  {
    monthName: "May",
    monthIndex: 4,
    name: "Dr. Rajarshi Saha",
    batchYear: 1996,
    role: "Consultant Pediatrician",
    company: "NRS Medical College & Hospital",
    bio: "Dr. Rajarshi is dedicated to providing high-quality healthcare to underprivileged children. He oversees the medical checkups for students of Taki Boys primary classes.",
    achievements: [
      "Awarded State Medal for excellence in Pediatric Public Health",
      "Conducted 50+ free health camps in underprivileged parts of Rajabazar and Sealdah",
      "Sponsors annual health insurance cards for deserving school athletes"
    ],
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  },
  {
    monthName: "June",
    monthIndex: 5,
    name: "Mr. Sayanu Chandra",
    batchYear: 2005,
    role: "Cultural Historian & Classical Vocalist",
    company: "Sangeet Kala Kendra",
    bio: "Sayanu has researched native folk musical instruments and classical ragas of Bengal. He designs the yearly cultural reunion itinerary and guides the school choir group.",
    achievements: [
      "Curated 15+ exhibitions documenting traditional folk music across Birbhum",
      "Set up the Taki Boys Music Circle for training in Rabindra Sangeet",
      "Directed the platinum jubilee nostalgic school theatre performance"
    ],
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    location: "Shantiniketan, India"
  },
  {
    monthName: "July",
    monthIndex: 6,
    name: "Mr. Sayantan Roy",
    batchYear: 2012,
    role: "Senior AI Systems Architect",
    company: "Antigravity Intelligent Systems",
    bio: "Sayantan is an expert in real-time deep learning systems and multi-agent systems. He designed the modern web portal for Taki Boys Alumni, enabling seamless connectivity across borders.",
    achievements: [
      "Pioneered secure real-time backend syncing layers for non-profit communities",
      "Donated and set up 15 high-speed computers in the school computer lab",
      "Acts as Technical Advisor for the online digital directory development team"
    ],
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  },
  {
    monthName: "August",
    monthIndex: 7,
    name: "Mr. Somsekhar Bose",
    batchYear: 1995,
    role: "Vice President of Academic Operations",
    company: "Apex Global Academy",
    bio: "Somsekhar is a dedicated educationalist working on curriculum modernization. He acts as the Assistant General Secretary, ensuring strict administrative alignment of the alumni funds.",
    achievements: [
      "Advised the state board on secondary school computer education curricula",
      "Maintains the alumni's digital registry database containing 3,000+ entries",
      "Organized 12 back-to-back winter reunion logistics with military precision"
    ],
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  },
  {
    monthName: "September",
    monthIndex: 8,
    name: "Mr. Gourab Paul",
    batchYear: 2017,
    role: "Senior Structural Engineer",
    company: "Kolkata Municipal Development Authority",
    bio: "Gourab is a young civil engineering specialist who handles urban restoration project work. He manages the maintenance wing of Taki House to keep our ancient structures safe.",
    achievements: [
      "Overlooks structural integrity surveys of 80+ century-old buildings in Kolkata",
      "Designed and managed the recent renovation of the Taki House School Common Room",
      "Sponsors sports equipment and kits for our annual football tournament"
    ],
    photoUrl: "https://images.unsplash.com/photo-1542343633-ce7a2565200a?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  },
  {
    monthName: "October",
    monthIndex: 9,
    name: "Mr. Arup Bhowal",
    batchYear: 1995,
    role: "Chief Financial Officer & Chartered Accountant",
    company: "Bhowal & Associates Consultancy",
    bio: "Arup is a seasoned professional in industrial corporate finance and audits. He advises the Taki Boys Alumni Trust on maintaining compliant tax exemptions and transparent records.",
    achievements: [
      "Secured 80G tax-exempt status for Taki Boys Alumni Welfare Trust",
      "Performs annual external auditing of trust accounts completely pro-bono",
      "Created the emergency student medical assistance endowment fund"
    ],
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  },
  {
    monthName: "November",
    monthIndex: 10,
    name: "Mr. Nabhonil Dey",
    batchYear: 2020,
    role: "Research Fellow & Aspiring Civil Servant",
    company: "President's Scholar Foundation",
    bio: "Nabhonil is a brilliant recent graduate who represents the young energy of Taki Boys. He serves as Office Secretary, managing student memberships and handling digital queries.",
    achievements: [
      "Ranked Top 10 in state university graduate research listings",
      "Drafted and dispatched over 500 digital membership verification batches",
      "Coordinates youth forums bridging gap between new graduates and corporate legacy alumni"
    ],
    photoUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80",
    location: "Delhi, India"
  },
  {
    monthName: "December",
    monthIndex: 11,
    name: "Mr. Himadri Bhattacharya",
    batchYear: 1987,
    role: "Senior Counsel",
    company: "Calcutta High Court",
    bio: "Advocate Himadri has been a cornerstone of legal counsel in Kolkata for over three decades. He drafts constitution parameters and serves as Legal Advisor to the Taki Boys trust board.",
    achievements: [
      "Represented prominent educational boards in high-profile policy cases",
      "Authored the official code of conduct of the Taki Boys Alumni Association",
      "Donates legal aid books and guides school debating champions"
    ],
    photoUrl: "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=300&q=80",
    location: "Kolkata, India"
  }
];

export default function DashboardHome({ user, onNavigate, stats }: DashboardHomeProps) {
  const isExpired = user.membershipStatus === MembershipStatus.EXPIRED || user.membershipStatus === MembershipStatus.NOT_MEMBER;
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(new Date().getMonth());
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [notices, setNotices] = useState<AlumniNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notices');
        if (response.ok) {
          const data = await response.json();
          setNotices(data.notices || []);
        }
      } catch (err) {
        console.error('Error loading notices on home:', err);
      } finally {
        setNoticesLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Key historic updates or announcements for Taki House High School Alumni
  const announcements = [
    {
      id: 1,
      tag: "Reunion 2026",
      title: "94th Annual Winter Reunion & General Body Meeting",
      desc: "Join us on December 20, 2026, at the school main grounds. Special cultural performance by current students followed by Alumnus Gala.",
      date: "Dec 20, 2026",
      isHighlight: true
    },
    {
      id: 2,
      tag: "Social Work",
      title: "Sundarban Relief & School Book Distribution Drive",
      desc: "Taki Boys Alumni Association is collecting donations and educational kits for primary students in coastal Bengal. Join hands!",
      date: "Ongoing",
      isHighlight: false
    },
    {
      id: 3,
      tag: "Legacy",
      title: "Inauguration of New Physics Lab Wing",
      desc: "Thanks to the generous donation from the Batch of 1982, our school's state-of-the-art physics laboratory is now fully operational.",
      date: "Published Yesterday",
      isHighlight: false
    }
  ];

  const QuickFact = ({ icon: Icon, title, desc, value }: { icon: any, title: string, desc: string, value: string }) => (
    <div className="bg-white border-2 border-[#0D5230] p-5 hover:scale-[1.01] transition-transform flex items-start gap-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
      <div className="p-3 bg-green-50 border border-green-800/20 text-green-800">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <span className="text-[10px] text-slate-500 font-sans block uppercase tracking-wider font-bold">{title}</span>
        <span className="text-xl font-serif italic font-bold text-[#0D5230] block mt-0.5">{value}</span>
        <span className="text-xs text-slate-600 block mt-1 font-sans">{desc}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8" id="dashboard-home">
      
      {/* 1. Welcoming Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white border-2 border-[#0D5230] p-6 sm:p-8 overflow-hidden shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]"
        id="dashboard-welcome-banner"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(13,82,48,0.06),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded bg-green-100 text-green-950 border border-[#0D5230]/20">BENGAL PROUD</span>
              <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded bg-[#F0F7F4] text-[#0D5230] border border-[#0D5230]/30">Roll: {user.rollNumber || "N/A"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D5230] uppercase tracking-tight">
              Welcome back, {user.name}!
            </h2>
            <p className="text-slate-700 max-w-xl text-sm sm:text-base font-sans leading-relaxed">
              You are recognized as part of the esteemed <strong className="text-[#0D5230] font-bold">Class of {user.batchYear}</strong>. This digital portal helps you keep in touch with the historical times and values of Taki House.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isExpired ? (
              <div className="p-4 bg-red-50 border-2 border-red-800/80 flex items-center gap-3.5 max-w-xs text-[#1A1A1A]">
                <AlertTriangle className="h-6 w-6 text-red-800 shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-red-800 block uppercase tracking-wider">Membership Status</span>
                  <span className="text-sm font-bold text-slate-800">Expired ({user.membershipTier})</span>
                  <button 
                    onClick={() => onNavigate('renewal')}
                    className="text-xs text-green-800 hover:underline font-bold mt-1 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Renew Standing Membership</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border-2 border-[#0D5230] flex items-center gap-3.5 max-w-xs text-[#1A1A1A]">
                <CheckCircle className="h-6 w-6 text-[#0D5230] shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-[#0D5230] block uppercase tracking-wider">Membership Status</span>
                  <span className="text-sm font-bold text-slate-800">Active ({user.membershipTier})</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Expiry: {user.membershipExpiry}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Directory / Portal Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-statistics">
        <QuickFact 
          icon={Users}
          title="Alumni Directory"
          value={`${stats.totalAlumni} Connected`}
          desc="Ex-students of Taki House registered online"
        />
        <QuickFact 
          icon={MessageSquare}
          title="Community Activity"
          value={`${stats.activeChats} Messages`}
          desc="Recent forum & community exchange"
        />
        <QuickFact 
          icon={Calendar}
          title="Events & Meets"
          value={`${stats.upcomingEvents} Scheduled`}
          desc="Upcoming alumni events in Kolkata"
        />
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News & Announcements & Events (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-10" id="announcements-section">
          
          {/* ⭐️ MEMBER SPOTLIGHT SECTION ⭐️ */}
          {(() => {
            const currentSpotlight = spotlightAlumni[selectedMonthIdx];
            return (
              <div className="bg-gradient-to-br from-[#F4F9F6] to-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.2)] relative overflow-hidden text-left" id="member-spotlight">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0D5230]/5 rounded-full blur-xl pointer-events-none" />
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0D5230]/20 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 border border-emerald-800/20 text-emerald-800 rounded">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-black text-emerald-800 tracking-widest uppercase block">TAKI HOUSE PRIDE</span>
                      <h3 className="text-md sm:text-lg font-serif font-black text-[#0D5230] uppercase tracking-tight">
                        Alumnus Member Spotlight
                      </h3>
                    </div>
                  </div>

                  {/* Dropdown Selector */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs text-slate-500 font-sans font-medium">Select Month:</span>
                    <select
                      value={selectedMonthIdx}
                      onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
                      className="text-xs bg-white border-2 border-[#0D5230] px-2 py-1 font-bold text-[#0D5230] rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0D5230] shadow-[2px_2px_0px_0px_rgba(13,82,48,0.1)] transition-all"
                    >
                      {spotlightAlumni.map((alumnus) => (
                        <option key={alumnus.monthIndex} value={alumnus.monthIndex}>
                          🗓️ {alumnus.monthName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Profile Block */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Left: Picture and Badges */}
                  <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
                    <div className="relative group">
                      <img
                        src={currentSpotlight.photoUrl}
                        alt={currentSpotlight.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 md:w-32 md:h-32 object-cover border-2 border-[#0D5230] bg-slate-100 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)] group-hover:scale-[1.02] transition-transform"
                      />
                      <div className="absolute -bottom-2 bg-[#0D5230] text-white text-[10px] font-sans font-black uppercase px-2 py-0.5 tracking-wider border border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                        Class of {currentSpotlight.batchYear}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-1.5 text-center">
                      <span className="text-[10px] font-sans font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200/60 inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-600 shrink-0" />
                        {currentSpotlight.location}
                      </span>
                    </div>
                  </div>

                  {/* Right: Bio & Highlights */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-lg font-serif font-black text-slate-900 leading-tight">
                        {currentSpotlight.name}
                      </h4>
                      <p className="text-xs font-sans font-bold text-slate-500 mt-1">
                        {currentSpotlight.role} <span className="text-[#0D5230] font-normal">at {currentSpotlight.company}</span>
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed italic bg-emerald-50/40 p-3 border-l-2 border-[#0D5230]">
                      "{currentSpotlight.bio}"
                    </p>

                    <div>
                      <span className="text-[10px] font-sans font-black text-[#0D5230] uppercase tracking-wider block border-b border-[#0D5230]/20 pb-1 mb-2">
                        ⭐ Key Legacy & School Contributions
                      </span>
                      <ul className="space-y-2 text-[11px] sm:text-xs text-slate-600 font-sans">
                        {currentSpotlight.achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Micro Footer Indicator */}
                <div className="mt-5 pt-3 border-t border-dashed border-[#0D5230]/15 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                  <span>Celebrating our heritage and legacy makers.</span>
                  <span className="font-bold text-[#0D5230] bg-[#0D5230]/5 px-2 py-0.5 rounded">
                    Featured Alumnus — {currentSpotlight.monthName} Spotlight
                  </span>
                </div>

              </div>
            );
          })()}

          {/* Real-time Notice Board Circulars */}
          <div className="space-y-6" id="realtime-noticeboard-widget">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0D5230]/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 border border-amber-500/20 text-amber-800 rounded">
                  <Megaphone className="h-4.5 w-4.5 text-[#0D5230] animate-bounce" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-[#0D5230] font-serif uppercase tracking-tight">
                    Live Notice Board & Community Circulars
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Real-time requests and official boards updated by the alumni.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('notices')}
                className="self-start sm:self-auto text-xs font-bold text-[#0D5230] hover:text-[#0A4025] hover:underline flex items-center gap-1 font-sans cursor-pointer bg-green-50 border border-[#0D5230]/20 px-3 py-1.5"
              >
                <span>View Full Board</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {noticesLoading ? (
              <div className="py-8 text-center bg-white border border-slate-200">
                <span className="text-xs text-slate-400 font-mono">Updating community circulars...</span>
              </div>
            ) : notices.length === 0 ? (
              <div className="p-6 bg-white border-2 border-[#0D5230]/10 text-center font-sans">
                <p className="text-xs text-slate-400 italic">No notices posted yet. Be the first to publish a circular!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.slice(0, 2).map((notice) => {
                  const isUrgent = notice.category === 'Urgent';
                  return (
                    <div 
                      key={notice.id}
                      onClick={() => onNavigate('notices')}
                      className={`p-4 border-2 text-left cursor-pointer transition-all hover:scale-[1.01] ${
                        notice.isPinned
                          ? 'bg-amber-50/50 border-amber-400 shadow-[2px_2px_0px_0px_rgba(245,158,11,0.15)]'
                          : isUrgent
                          ? 'bg-red-50/40 border-red-400 shadow-[2px_2px_0px_0px_rgba(220,38,38,0.1)]'
                          : 'bg-white border-slate-200 hover:border-[#0D5230]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 text-[8px] font-sans font-black uppercase tracking-wider border ${
                          notice.isPinned
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : isUrgent
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {notice.isPinned && <Pin className="h-2 w-2 inline mr-0.5 fill-amber-800" />}
                          {notice.category}
                        </span>
                        
                        <span className="text-[9px] font-mono text-slate-400">
                          {new Date(notice.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold font-serif text-slate-900 leading-tight line-clamp-1">
                        {notice.title}
                      </h4>
                      
                      <p className="text-[11px] text-slate-500 font-sans leading-relaxed mt-1 line-clamp-2">
                        {notice.content}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[9px] text-slate-400 font-sans">
                        <span className="font-bold text-slate-600 truncate max-w-[100px]">{notice.postedBy.name}</span>
                        <span>•</span>
                        <span>Class of {notice.postedBy.batchYear}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Announcements sub-section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
                <BookOpen className="h-5 w-5 text-[#0D5230]" />
                <span>Announcements & School Updates</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">Updated today</span>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div 
                  key={ann.id}
                  className={`p-5 border-2 transition-all ${
                    ann.isHighlight 
                      ? "bg-green-50/50 border-[#0D5230] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]" 
                      : "bg-white border-slate-300 hover:border-[#0D5230] hover:bg-green-50/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${
                      ann.isHighlight 
                        ? "bg-[#0D5230] text-white" 
                        : "bg-[#F0F7F4] text-[#0D5230] border border-[#0D5230]/20"
                    }`}>
                      {ann.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {ann.date}
                    </span>
                  </div>
                  <h4 className="text-md font-bold text-[#1A1A1A] hover:text-[#0D5230] transition-colors cursor-pointer font-serif">
                    {ann.title}
                  </h4>
                  <p className="text-slate-600 text-sm mt-1.5 leading-relaxed font-sans">
                    {ann.desc}
                  </p>
                  {ann.isHighlight && (
                    <div className="mt-4 pt-3 border-t border-dashed border-[#0D5230]/20 flex justify-end">
                      <button 
                        onClick={() => onNavigate('chat')}
                        className="text-xs font-bold text-[#0D5230] hover:text-[#0A4025] hover:underline flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <span>Discuss with batchmates in chat</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Events List */}
          <Events user={user} />
        </div>

        {/* Sidebar: Heritage & Quick Profile (Right 1 column) */}
        <div className="space-y-6" id="dashboard-sidebar">
          
          {/* Quick Profile Overview */}
          <div className="bg-white border-2 border-[#0D5230] p-5 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider mb-4 border-b border-[#0D5230]/30 pb-2 font-sans">
              My Alumnus Profile
            </h4>
            
            <div className="flex items-center gap-3.5 mb-4">
              <img 
                src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                alt={user.name} 
                className="h-12 w-12 rounded-full border-2 border-[#0D5230] object-cover bg-slate-100"
              />
              <div>
                <span className="font-serif font-black text-md text-[#1A1A1A] block leading-tight">{user.name}</span>
                <span className="text-xs text-slate-500 font-sans block mt-0.5">Class of {user.batchYear} • {user.occupation || "Alumnus"}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex justify-between py-1.5 border-b border-dashed border-slate-300">
                <span className="text-slate-500">Official Email:</span>
                <span className="text-slate-800 font-mono font-bold">{user.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed border-slate-300">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="text-slate-800 font-bold">{user.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed border-slate-300">
                <span className="text-slate-500">Current Base:</span>
                <span className="text-slate-800 font-bold flex items-center gap-0.5">
                  <MapPin className="h-3 w-3 text-red-600" />
                  {user.location || "Kolkata"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tier Status:</span>
                <span className="text-[#0D5230] font-bold uppercase tracking-wider">{user.membershipTier}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsCardOpen(true)}
              className="w-full mt-4 bg-[#0D5230] hover:bg-[#0A4025] text-white text-xs py-2.5 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CreditCard className="h-4 w-4 text-amber-300" />
              <span>Digital Membership Card</span>
            </button>
          </div>

          {/* Executive Committee Board Spotlight */}
          <div className="bg-white border-2 border-[#0D5230] p-5 space-y-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#0D5230]" />
              <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider font-sans">
                Executive Committee
              </h4>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Meet the active elected members of the Taki Boys Alumni Executive Committee & Advisory Committee presiding over the current session.
            </p>

            <button 
              onClick={() => onNavigate('committee')}
              className="w-full border-2 border-[#0D5230] hover:bg-[#0D5230]/5 text-[#0D5230] text-xs py-2 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Executive Board</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* School Heritage Spotlight */}
          <div className="bg-white border-2 border-[#0D5230] p-5 space-y-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#0D5230]" />
              <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider font-sans">
                Our School Heritage
              </h4>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Taki House Govt. Sponsored High School for Boys was established in 1932 to provide high-quality modern education in Kolkata. Over almost a century, the school has nurtured scientists, teachers, civil servants, artists, and national-level athletes.
            </p>

            <div className="bg-[#F0F7F4] p-3 border border-[#0D5230]/20 text-xs">
              <span className="text-[#0D5230] font-bold block mb-1 font-serif italic">💡 School Anthem Motto</span>
              <span className="italic text-slate-700 font-serif">"Knowledge, Service, Integrity" — leading from darkness to light.</span>
            </div>

            <button 
              onClick={() => onNavigate('heritage')}
              className="w-full bg-[#0D5230] hover:bg-[#0A4025] text-xs text-white py-2.5 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 text-red-600 animate-pulse" />
              <span>Explore School Heritage</span>
            </button>
          </div>

          {/* Contact us hotline spotlight */}
          <div className="bg-white border-2 border-[#0D5230] p-5 space-y-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#0D5230]" />
              <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider font-sans">
                Contact Secretariat
              </h4>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Have queries about lifetime memberships, certificates, or donation receipts? Get in touch with our board or locate us in Kolkata.
            </p>

            <div className="text-[11px] font-sans text-slate-500 space-y-1 bg-slate-50 p-2.5 border border-dashed border-[#0D5230]/20">
              <p>📍 <span className="font-bold">Address:</span> 299/B, A.P.C. Road</p>
              <p>📧 <span className="font-bold">Email:</span> takiboys.alumni@gmail.com</p>
              <p>📞 <span className="font-bold">Gen Sec:</span> +91 89816 09498</p>
            </div>

            <button 
              onClick={() => onNavigate('contact')}
              className="w-full border-2 border-[#0D5230] hover:bg-[#0D5230]/5 text-[#0D5230] text-xs py-2 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Get in Touch</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      <MembershipCard user={user} isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />
    </div>
  );
}
