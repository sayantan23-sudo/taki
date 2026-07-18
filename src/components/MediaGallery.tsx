import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Image as ImageIcon, 
  Heart, 
  MessageSquare, 
  Plus, 
  X, 
  Upload, 
  User, 
  Sparkles, 
  Clock, 
  Info,
  ChevronRight,
  Send,
  Check
} from 'lucide-react';
import { UserProfile, GalleryPhoto } from '../types';

interface MediaGalleryProps {
  currentUser: UserProfile;
}

export default function MediaGallery({ currentUser }: MediaGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('All');
  
  // Contribution Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTag, setNewTag] = useState<'Cultural Events' | 'Sports & Athletics' | 'School Heritage' | 'Alumni Gathering'>('Cultural Events');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selected Photo for Lightbox Modal
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Suggested preset photos for easy adding
  const presets = [
    {
      title: "Annual Sports Running Event",
      tag: "Sports & Athletics",
      url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
      desc: "Athletes waiting at the starting blocks for the sprint showdown."
    },
    {
      title: "Inter-School Cricket Victory Celebration",
      tag: "Sports & Athletics",
      url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
      desc: "Team celebrating on the field after a grand final victory in South Kolkata."
    },
    {
      title: "Drama Club Stage Setup",
      tag: "Cultural Events",
      url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
      desc: "Backstage setup and lighting rehearsals for the grand alumni drama play."
    },
    {
      title: "School Library Archival Records",
      tag: "School Heritage",
      url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800",
      desc: "Old text journals and study notes dating back to the late 1940s."
    },
    {
      title: "Pre-Puja Reunion Lunch",
      tag: "Alumni Gathering",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      desc: "Alumni coming together for a festive feast ahead of Durga Puja celebrations."
    }
  ];

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
      } else {
        setError('Failed to fetch gallery images.');
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Connection error while loading gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleLike = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(`/api/gallery/${photoId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update both photos state and active selectedPhoto in lightbox if open
        setPhotos(prev => prev.map(p => p.id === photoId ? data.photo : p));
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto(data.photo);
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto || !newCommentText.trim()) return;

    setCommentSubmitting(true);
    try {
      const response = await fetch(`/api/gallery/${selectedPhoto.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          text: newCommentText
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update list and modal
        setPhotos(prev => prev.map(p => p.id === selectedPhoto.id ? data.photo : p));
        setSelectedPhoto(data.photo);
        setNewCommentText('');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert("Please provide at least a Title and Image URL.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          url: newUrl.trim(),
          description: newDescription.trim(),
          tag: newTag,
          uploaderEmail: currentUser.email
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(prev => [data.photo, ...prev]);
        setFormSuccess(true);
        setNewTitle('');
        setNewUrl('');
        setNewDescription('');
        setTimeout(() => {
          setFormSuccess(false);
          setShowAddForm(false);
        }, 2000);
      } else {
        alert("Could not contribute photo. Please check credentials.");
      }
    } catch (err) {
      console.error('Error contributing photo:', err);
      alert("Connection failure.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPhotos = photos.filter(photo => {
    if (filter === 'All') return true;
    return photo.tag === filter;
  });

  const categories = ['All', 'Cultural Events', 'Sports & Athletics', 'School Heritage', 'Alumni Gathering'];

  return (
    <div className="space-y-8" id="media-gallery-component">
      
      {/* 1. Header Segment with Action Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0D5230]/30 pb-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-serif font-black text-[#0D5230] uppercase tracking-tight flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <span>Nostalgic Media Gallery</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Explore and cherish real-life snapshots of Taki House sports, cultural events, campus life, and reunions.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D5230] text-white hover:bg-[#0A4025] font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-[2px_2px_0px_0px_rgba(13,82,48,0.25)] cursor-pointer self-start md:self-auto active:scale-[0.98]"
        >
          {showAddForm ? (
            <>
              <X className="h-4 w-4" />
              <span>Cancel Submission</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Contribute a Photo</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Photo Contribution Drawer Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.2)] space-y-6">
              <div className="flex items-center gap-2 border-b border-dashed border-[#0D5230]/20 pb-3">
                <Sparkles className="h-5 w-5 text-[#0D5230]" />
                <h3 className="font-serif font-bold text-base text-[#0D5230]">Share Your Memorabilia</h3>
              </div>

              {formSuccess ? (
                <div className="p-8 text-center bg-green-50 border border-[#0D5230] flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-[#0D5230] rounded-full text-white mb-2">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[#0D5230]">Thank you, Alumnus!</h4>
                  <p className="text-xs text-slate-600 font-sans">Your photo was added to the public school gallery successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleAddPhotoSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Input Fields */}
                  <div className="lg:col-span-2 space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-[#0D5230] uppercase">Photo Title *</label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. 1998 Saraswati Puja Group Photo"
                          className="w-full p-2.5 border-2 border-slate-200 focus:border-[#0D5230] focus:outline-none font-serif text-sm bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-[#0D5230] uppercase">Category Album *</label>
                        <select
                          value={newTag}
                          onChange={(e: any) => setNewTag(e.target.value)}
                          className="w-full p-2.5 border-2 border-slate-200 focus:border-[#0D5230] focus:outline-none font-sans font-bold bg-slate-50 cursor-pointer"
                        >
                          <option value="Cultural Events">🎭 Cultural Events</option>
                          <option value="Sports & Athletics">⚽ Sports & Athletics</option>
                          <option value="School Heritage">🏛️ School Heritage</option>
                          <option value="Alumni Gathering">🤝 Alumni Gathering</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-[#0D5230] uppercase">Image URL *</label>
                      <input
                        type="url"
                        required
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="Paste image web URL (https://...)"
                        className="w-full p-2.5 border-2 border-slate-200 focus:border-[#0D5230] focus:outline-none font-mono text-[11px] bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-[#0D5230] uppercase">Short Nostalgic Story / Description</label>
                      <textarea
                        rows={3}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Share a story about who is in this picture, what year it was, or the feelings behind this memory..."
                        className="w-full p-2.5 border-2 border-slate-200 focus:border-[#0D5230] focus:outline-none font-serif text-sm bg-slate-50"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-[#0D5230] text-white hover:bg-[#0A4025] font-bold uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{submitting ? 'Publishing...' : 'Publish to Portal'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Template Preset Clickers */}
                  <div className="bg-[#F0F7F4] p-4 border border-[#0D5230]/20 space-y-3">
                    <span className="text-[10px] font-sans font-bold text-[#0D5230] uppercase tracking-wider block border-b border-[#0D5230]/10 pb-1.5 flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      <span>Quick Presets for Demo</span>
                    </span>
                    <p className="text-[11px] text-slate-600 font-serif leading-relaxed">
                      Don't have an image URL handy? Click any preset template below to instantly prefill our school gallery form:
                    </p>

                    <div className="space-y-2">
                      {presets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewTitle(preset.title);
                            setNewUrl(preset.url);
                            setNewDescription(preset.desc);
                            setNewTag(preset.tag as any);
                          }}
                          className="w-full text-left p-2 bg-white hover:bg-[#0D5230]/10 hover:border-[#0D5230] border border-slate-200 transition-all text-[11px] flex items-center justify-between group"
                        >
                          <div className="truncate pr-2">
                            <span className="font-serif font-bold text-[#1A1A1A] block truncate">{preset.title}</span>
                            <span className="text-[9px] text-slate-500 block uppercase font-sans mt-0.5">{preset.tag}</span>
                          </div>
                          <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-[#0D5230] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Category Select Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 font-sans" id="gallery-filters">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filter === cat
                ? 'bg-[#0D5230] text-white shadow-[2px_2px_0px_0px_rgba(13,82,48,0.2)]'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0D5230] hover:text-[#0D5230]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
          {error}
        </div>
      )}

      {/* 4. Beautiful Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 min-h-[250px]">
          <div className="h-7 w-7 border-2 border-[#0D5230] border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">Unrolling School Film...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-[#0D5230]/20 font-sans">
          <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-serif italic text-slate-600">No photos published in the "{filter}" album yet.</p>
          <button 
            onClick={() => { setShowAddForm(true); }}
            className="text-xs text-[#0D5230] font-bold hover:underline mt-2 cursor-pointer"
          >
            Be the first ex-student to share a photo!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-photos-grid">
          {filteredPhotos.map((photo, index) => {
            const hasLiked = photo.likes.includes(currentUser.email.toLowerCase().trim());
            
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-white border-2 border-slate-200 hover:border-[#0D5230] cursor-pointer transition-all flex flex-col group shadow-sm hover:shadow-[4px_4px_12px_rgba(13,82,48,0.08)]"
              >
                {/* Photo Image Wrapper */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback image in case Unsplash or custom link is broken
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600";
                    }}
                  />
                  <span className="absolute bottom-3 left-3 bg-[#0D5230] text-[9px] text-white font-sans font-bold px-2 py-0.5 uppercase tracking-wider">
                    {photo.tag}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-serif font-black text-sm text-[#1A1A1A] group-hover:text-[#0D5230] transition-colors leading-tight">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans line-clamp-2 leading-relaxed">
                      {photo.description || "Nostalgic snapshot of school activities."}
                    </p>
                  </div>

                  {/* Card Interactions and Info */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-sans text-slate-500">
                    <div className="flex items-center gap-1 font-bold">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate max-w-[100px]">{photo.uploadedBy.name}</span>
                      <span className="text-slate-400">('{photo.uploadedBy.batchYear.toString().slice(-2)})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLike(photo.id, e)}
                        className={`flex items-center gap-1 cursor-pointer transition-colors hover:text-red-500 font-bold ${
                          hasLiked ? 'text-red-500' : 'text-slate-400'
                        }`}
                        title={hasLiked ? "Unlike photo" : "Like photo"}
                      >
                        <Heart className={`h-3.5 w-3.5 ${hasLiked ? 'fill-red-500' : ''}`} />
                        <span>{photo.likes.length}</span>
                      </button>

                      <div className="flex items-center gap-1 font-bold text-slate-400">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{photo.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* 5. Immersive Lightbox Modal with Likes and Comments */}
      <AnimatePresence>
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] rounded-none border-2 border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row font-serif"
            >
              
              {/* Left Side: Massive Image View */}
              <div className="md:w-3/5 bg-slate-950 flex flex-col justify-between relative min-h-[300px] md:min-h-0">
                
                {/* Photo Tag Badge */}
                <span className="absolute top-4 left-4 bg-[#0D5230] text-[9px] text-white font-sans font-bold px-2 py-0.5 uppercase tracking-wider z-10">
                  {selectedPhoto.tag}
                </span>

                <div className="flex-1 flex items-center justify-center overflow-hidden bg-black/30">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="max-h-[50vh] md:max-h-[80vh] w-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600";
                    }}
                  />
                </div>

                {/* Image overlay description block */}
                <div className="bg-black/75 p-4 border-t border-white/10 text-white space-y-1 text-left">
                  <h3 className="font-bold text-base tracking-tight">{selectedPhoto.title}</h3>
                  {selectedPhoto.description && (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedPhoto.description}</p>
                  )}
                </div>
              </div>

              {/* Right Side: Comments and Interactions Ledger */}
              <div className="md:w-2/5 flex flex-col justify-between bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 max-h-[50vh] md:max-h-full">
                
                {/* Header segment */}
                <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="text-left font-sans text-xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Shared By Ex-Student</span>
                    <span className="font-serif font-black text-slate-950 text-sm block leading-tight">{selectedPhoto.uploadedBy.name}</span>
                    <span className="text-slate-600 block text-[10px] mt-0.5">Batch of {selectedPhoto.uploadedBy.batchYear} • {new Date(selectedPhoto.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-none text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
                    title="Close Overlay"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Comment Scroll View */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[250px] md:max-h-none text-left">
                  
                  {/* Photo details inside sidebar */}
                  <div className="pb-3 border-b border-dashed border-slate-200 flex items-center justify-between text-xs font-sans">
                    <span className="font-bold text-slate-600">Alumni Activity Ledger</span>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(selectedPhoto.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] border font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          selectedPhoto.likes.includes(currentUser.email.toLowerCase().trim())
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${selectedPhoto.likes.includes(currentUser.email.toLowerCase().trim()) ? 'fill-red-600' : ''}`} />
                        <span>{selectedPhoto.likes.length} Likes</span>
                      </button>
                    </div>
                  </div>

                  {selectedPhoto.comments.length === 0 ? (
                    <div className="text-center py-10 font-sans">
                      <MessageSquare className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs italic text-slate-500">No memories written here yet.</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Be the first to leave a comment below!</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {selectedPhoto.comments.map(c => (
                        <div key={c.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between font-sans text-[10px] text-slate-500 mb-1">
                            <span className="font-bold text-[#0D5230]">{c.authorName} <span className="font-normal text-slate-400">('{c.authorBatch.toString().slice(-2)})</span></span>
                            <span className="font-mono">{new Date(c.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          <p className="text-slate-800 font-sans leading-relaxed">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* Comment Submission Form */}
                <form 
                  onSubmit={handleCommentSubmit}
                  className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0 font-sans"
                >
                  <input
                    type="text"
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment / old memory..."
                    className="flex-1 px-3 py-2 border-2 border-slate-200 focus:border-[#0D5230] focus:outline-none text-xs"
                  />
                  <button
                    type="submit"
                    disabled={commentSubmitting || !newCommentText.trim()}
                    className="px-3.5 py-2 bg-[#0D5230] text-white hover:bg-[#0A4025] flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                    title="Send Comment"
                  >
                    {commentSubmitting ? (
                      <div className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </form>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
