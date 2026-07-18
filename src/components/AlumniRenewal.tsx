import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Download, 
  Phone, 
  User, 
  MapPin, 
  TrendingUp, 
  Check, 
  Building 
} from 'lucide-react';
import { UserProfile, MembershipTier, MembershipStatus } from '../types';
import MembershipCard from './MembershipCard';

interface AlumniRenewalProps {
  user: UserProfile;
  onRenewalSuccess: (updatedUser: UserProfile) => void;
}

export default function AlumniRenewal({ user, onRenewalSuccess }: AlumniRenewalProps) {
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(MembershipTier.ANNUAL);
  const [phone, setPhone] = useState(user.phone || '');
  const [billingAddress, setBillingAddress] = useState(user.location || 'Kolkata, West Bengal, India');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  
  // Payment gateway simulation states
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [txDetails, setTxDetails] = useState<any>(null);
  const [simulatedLog, setSimulatedLog] = useState('');
  const [isCardOpen, setIsCardOpen] = useState(false);

  // Cost mapping for tiers
  const tierPricing: Record<MembershipTier, number> = {
    [MembershipTier.STUDENT]: 200,
    [MembershipTier.ANNUAL]: 500,
    [MembershipTier.LIFE]: 5000,
    [MembershipTier.PATRON]: 10000,
  };

  const tiers = [
    {
      id: MembershipTier.STUDENT,
      name: "Student Alumnus",
      price: 200,
      period: "per year",
      desc: "Specially discounted for young boys who passed out within the last 3 years.",
      features: [
        "Digital Alumni Card",
        "Community Chat access",
        "Access to digital archive",
        "Quarterly digital newsletter"
      ]
    },
    {
      id: MembershipTier.ANNUAL,
      name: "Annual Member",
      price: 500,
      period: "per year",
      desc: "Standard membership for all ex-students to support the daily running of the association.",
      features: [
        "All Student features included",
        "Voting rights at the General Body meeting",
        "Invitation to Kolkata local addas",
        "Annual reunion invitation card"
      ],
      popular: true
    },
    {
      id: MembershipTier.LIFE,
      name: "Life Member",
      price: 5000,
      period: "one-time payment",
      desc: "Become a permanent pillar of the association with zero renewal hassles forever.",
      features: [
        "All Annual features included",
        "Lifetime Member badge on profile",
        "Permanent metallic Membership Card",
        "Priority seating at school reunions",
        "Framed Life Member Certificate"
      ]
    },
    {
      id: MembershipTier.PATRON,
      name: "Patron Alumnus",
      price: 10000,
      period: "one-time payment",
      desc: "Reserved for distinguished alumni wishing to make an impactful contribution to school developments.",
      features: [
        "All Life Member features included",
        "Official Patron Crest",
        "Name engraved on the School Donor Wall",
        "Guest of Honor status at Annual Sports",
        "Personalized reports on school labs progress"
      ]
    }
  ];

  const handleStartPayment = (e: FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    setSimulatedLog('Contacting Association Gateway...');

    // Simulate payment processing logs for visual craft
    setTimeout(() => {
      setSimulatedLog('Authenticating with Sealdah SBI Ingress Router...');
    }, 800);

    setTimeout(() => {
      setSimulatedLog('Securing digital certificate & validating token...');
    }, 1600);

    setTimeout(() => {
      setSimulatedLog('Finalizing alumni ledger entry...');
    }, 2400);

    setTimeout(async () => {
      try {
        const response = await fetch('/api/membership/renew', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            tier: selectedTier,
            paymentMethod,
            billingAddress,
            amount: tierPricing[selectedTier]
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTxDetails(data.submission);
          onRenewalSuccess(data.user);
          setPaymentStep('success');
        } else {
          setPaymentStep('form');
          alert('Simulated transaction failed. Please try again.');
        }
      } catch (err) {
        console.error(err);
        setPaymentStep('form');
      }
    }, 3200);
  };

  return (
    <div className="space-y-8" id="alumni-renewal-page">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
          <TrendingUp className="h-6 w-6 text-[#0D5230]" />
          <span>Membership Renewal Portal</span>
        </h2>
        <p className="text-slate-700 text-sm mt-1">
          Support your alma mater, obtain voting rights, and maintain your active alumnus standing in our digital registry in our school colors.
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 1: Membership Tier Form */}
        {paymentStep === 'form' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            key="step-form"
          >
            {/* Left: Tiers Selection */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D5230]">1. Select Membership Plan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tiers.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <div 
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`p-5 border-2 text-left cursor-pointer transition-all relative flex flex-col justify-between rounded-none ${
                        isSelected 
                          ? 'bg-white border-[#0D5230] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]' 
                          : 'bg-white border-slate-200 hover:border-[#0D5230] hover:bg-green-50/10'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute top-3 right-3 bg-[#0D5230] text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded-none uppercase tracking-wider">
                          Recommended
                        </span>
                      )}

                      <div className="space-y-2">
                        <span className={`text-xs font-sans font-bold tracking-wider uppercase ${isSelected ? 'text-[#0D5230]' : 'text-slate-500'}`}>
                          {tier.name}
                        </span>
                        
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif font-black text-[#0D5230]">₹{tier.price}</span>
                          <span className="text-xs text-slate-500 font-mono">/ {tier.period}</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-normal font-sans">{tier.desc}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#0D5230]/10 space-y-2 text-xs font-sans">
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-700">
                            <Check className="h-3.5 w-3.5 text-[#0D5230] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Checkout Details */}
            <div className="bg-white border-2 border-[#0D5230] p-6 h-fit space-y-6 rounded-none shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
              <h3 className="text-md font-bold text-[#0D5230] border-b border-[#0D5230]/20 pb-3 flex items-center gap-2 font-serif uppercase tracking-tight">
                <CreditCard className="h-4 w-4 text-[#0D5230]" />
                <span>2. Billing & Settlement</span>
              </h3>

              <form onSubmit={handleStartPayment} className="space-y-4">
                
                {/* Current Profile Summary */}
                <div className="p-3 bg-[#F0F7F4] border border-[#0D5230]/20 text-xs space-y-1.5 font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ex-Student:</span>
                    <span className="font-bold text-[#1A1A1A]">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Year:</span>
                    <span className="text-[#1A1A1A] font-mono font-bold">{user.batchYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Primary Email:</span>
                    <span className="text-[#1A1A1A] font-mono font-bold">{user.email}</span>
                  </div>
                </div>

                {/* Input fields */}
                <div className="font-sans">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#0D5230]/50" />
                    <input 
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 12345"
                      className="w-full bg-white border border-[#0D5230]/30 py-2 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none font-mono"
                    />
                  </div>
                </div>

                <div className="font-sans">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Billing Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#0D5230]/50" />
                    <input 
                      type="text"
                      required
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="e.g. Salt Lake, Kolkata"
                      className="w-full bg-white border border-[#0D5230]/30 py-2 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="font-sans">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Payment Gateway</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-none border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'UPI' 
                          ? 'bg-[#0D5230] text-white border-[#0D5230]' 
                          : 'bg-[#F0F7F4] text-[#0D5230] border-[#0D5230]/30 hover:border-[#0D5230]'
                      }`}
                    >
                      UPI / GPay / BHIM
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-2.5 rounded-none border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'Card' 
                          ? 'bg-[#0D5230] text-white border-[#0D5230]' 
                          : 'bg-[#F0F7F4] text-[#0D5230] border-[#0D5230]/30 hover:border-[#0D5230]'
                      }`}
                    >
                      Credit / Debit Card
                    </button>
                  </div>
                </div>

                {/* Simulated payment detail inputs */}
                {paymentMethod === 'UPI' ? (
                  <div className="font-sans">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">UPI Address (VPA)</label>
                    <input 
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. sayantan@oksbi"
                      className="w-full bg-white border border-[#0D5230]/30 py-2 px-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-[#0D5230] transition-colors rounded-none font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Card Number</label>
                      <input 
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 9800 1234 5678"
                        className="w-full bg-white border border-[#0D5230]/30 py-2 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Expiry (MM/YY)</label>
                        <input 
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/29"
                          className="w-full bg-white border border-[#0D5230]/30 py-2 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">CVV Code</label>
                        <input 
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-white border border-[#0D5230]/30 py-2 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Cost Display */}
                <div className="pt-3 border-t border-[#0D5230]/15 flex items-center justify-between font-sans">
                  <span className="text-sm font-semibold text-slate-700">Total Contribution:</span>
                  <span className="text-xl font-serif font-black text-[#0D5230]">₹{tierPricing[selectedTier]}</span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-3 px-4 rounded-none text-xs flex items-center justify-center gap-2 uppercase tracking-widest transition-all cursor-pointer border border-[#0D5230] mt-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Process Renewal Payment</span>
                </button>
              </form>

              <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 font-sans">
                <Building className="h-3 w-3 text-green-800" />
                <span>Verified by Taki Boys Executive Committee</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment Gateway Loader (Visual Craft) */}
        {paymentStep === 'processing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto bg-white border-2 border-[#0D5230] p-8 text-center space-y-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)] rounded-none relative overflow-hidden"
            key="step-processing"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[#0D5230] animate-pulse" />
            
            <div className="inline-block relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-[#0D5230] animate-spin"></div>
              <CreditCard className="h-6 w-6 text-slate-800 absolute inset-0 m-auto animate-bounce" />
            </div>

            <div className="space-y-2 font-sans">
              <h3 className="text-lg font-black uppercase text-[#0D5230]">Authorizing Settlement</h3>
              <p className="text-xs text-slate-600">Handshaking with SBI Ingress digital gateway. Please wait... do not exit.</p>
            </div>

            {/* Dynamic Console Log Log */}
            <div className="p-3 bg-[#F0F7F4] border border-[#0D5230]/30 text-left font-mono text-[10px] text-[#0D5230] min-h-[50px] flex items-center">
              <span>{`> ${simulatedLog}`}</span>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success & Printable Receipt Screen */}
        {paymentStep === 'success' && txDetails && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto space-y-6"
            key="step-success"
          >
            {/* Visual Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-green-100 rounded-full border border-green-800/30 text-green-800 animate-bounce">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-serif italic text-green-900 font-bold">Membership Successfully Settled!</h3>
              <p className="text-sm text-slate-600 font-sans">
                Congratulations! Your Taki Boys standing has been renewed to <strong className="text-green-800 font-bold uppercase tracking-wider">{txDetails.tier}</strong> standing.
              </p>
            </div>

            {/* Printable Invoice Design */}
            <div className="bg-white text-slate-950 rounded-none p-6 sm:p-8 border-2 border-[#0D5230] relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]" id="printable-receipt">
              
              {/* Receipt Background Watermark Seal */}
              <div className="absolute right-6 bottom-6 opacity-[0.03] select-none pointer-events-none">
                <Sparkles className="h-44 w-44 text-[#0D5230]" />
              </div>

              {/* School Seal / Receipt Header */}
              <div className="border-b border-[#0D5230]/30 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 font-sans">
                <div>
                  <h4 className="text-md font-black tracking-tight text-[#0D5230] uppercase">Taki Boys Alumni Association</h4>
                  <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-0.5 font-mono">ESTD. 1932 • SEALDAH, KOLKATA</p>
                </div>
                <div className="px-3 py-1 bg-[#0D5230] text-white text-[10px] font-bold tracking-wider rounded-none">
                  OFFICIAL RECEIPT
                </div>
              </div>

              {/* Receipt Body Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs text-slate-700 font-sans">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Alumnus Name</span>
                  <span className="font-bold text-[#1A1A1A] text-sm">{user.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">School Batch Year</span>
                  <span className="font-bold text-[#1A1A1A] text-sm">{user.batchYear}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Transaction Reference</span>
                  <span className="font-mono text-[#1A1A1A] font-bold">{txDetails.transactionId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Settlement Date</span>
                  <span className="font-bold text-[#1A1A1A]">{new Date(txDetails.submittedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Membership Standing</span>
                  <span className="font-bold text-[#0D5230] uppercase tracking-wider">{txDetails.tier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Location</span>
                  <span className="font-bold text-[#1A1A1A]">{txDetails.billingAddress}</span>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="mt-6 pt-5 border-t border-[#0D5230]/20 font-sans">
                <div className="flex justify-between items-center bg-[#F0F7F4] p-4 border border-[#0D5230]/20">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Amount Settled (INR)</span>
                    <span className="text-[10px] text-slate-400">Includes all certified digital maintenance fees</span>
                  </div>
                  <span className="text-2xl font-serif font-black text-[#0D5230]">₹{txDetails.amount}</span>
                </div>
              </div>

              {/* Validation Footer Stamp */}
              <div className="mt-6 pt-4 border-t border-dashed border-[#0D5230]/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left font-sans">
                <div className="text-[9px] text-slate-500 leading-normal max-w-xs">
                  This document is digital-certified and represents active, validated enrollment in the Taki House Govt. Sponsored High School ex-students registry.
                </div>
                <div className="flex flex-col items-center border border-[#0D5230] bg-[#F0F7F4] text-[#0D5230] rounded px-3 py-1.5 font-bold tracking-tight rotate-[-2deg]">
                  <span className="text-[8px] uppercase tracking-widest leading-none">Status</span>
                  <span className="text-[11px] uppercase tracking-wide leading-none font-extrabold mt-0.5">GOOD STANDING</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 font-sans">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-white border-2 border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-bold py-3 rounded-none text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Save Receipt (PDF)</span>
              </button>
              
              <button 
                onClick={() => setIsCardOpen(true)}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-none text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <CreditCard className="h-4 w-4 text-amber-300" />
                <span>Download Digital ID (PDF)</span>
              </button>

              <button 
                onClick={() => setPaymentStep('form')}
                className="bg-white border border-slate-300 text-slate-500 hover:text-slate-800 font-bold py-3 px-4 rounded-none text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>Back to Plans</span>
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      <MembershipCard user={user} isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />
    </div>
  );
}
