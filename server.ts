import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { MembershipStatus, MembershipTier, UserProfile, ChatMessage, RenewalSubmission, AlumniEvent, GalleryPhoto } from "./src/types.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory databases
  const users: UserProfile[] = [
    {
      id: "u1",
      email: "amit.sen@taki.alumni",
      name: "Amit Sen",
      batchYear: 1988,
      phone: "+91 98300 12345",
      occupation: "Senior Consultant at TCS",
      location: "Salt Lake, Kolkata",
      membershipStatus: MembershipStatus.EXPIRED,
      membershipTier: MembershipTier.ANNUAL,
      membershipExpiry: "2026-03-15",
      rollNumber: "Batch88-042",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: "u2",
      email: "sourav.das@taki.alumni",
      name: "Sourav Das",
      batchYear: 2005,
      phone: "+91 94330 98765",
      occupation: "Assistant Professor, Calcutta University",
      location: "Garia, Kolkata",
      membershipStatus: MembershipStatus.ACTIVE,
      membershipTier: MembershipTier.LIFE,
      membershipExpiry: "Lifetime",
      rollNumber: "Batch05-117",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    },
    {
      id: "u3",
      email: "sayantanroy58581@gmail.com", // Matches the actual user's email for a custom greeting
      name: "Sayantan Roy",
      batchYear: 2015,
      phone: "+91 98765 43210",
      occupation: "Software Engineer",
      location: "Kolkata, West Bengal",
      membershipStatus: MembershipStatus.EXPIRED,
      membershipTier: MembershipTier.ANNUAL,
      membershipExpiry: "2026-01-10",
      rollNumber: "Batch15-089",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
    },
    {
      id: "u4",
      email: "pradip.banerjee@taki.alumni",
      name: "Pradip Kumar Banerjee",
      batchYear: 1976,
      phone: "+91 98311 55667",
      occupation: "Retired Banker (SBI)",
      location: "Lake Gardens, Kolkata",
      membershipStatus: MembershipStatus.ACTIVE,
      membershipTier: MembershipTier.PATRON,
      membershipExpiry: "Lifetime",
      rollNumber: "Batch76-003",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    }
  ];

  // User passwords mapping (in production, use bcrypt)
  const passwords: Record<string, string> = {
    "amit.sen@taki.alumni": "password123",
    "sourav.das@taki.alumni": "password123",
    "sayantanroy58581@gmail.com": "password123",
    "pradip.banerjee@taki.alumni": "password123"
  };

  const chatMessages: ChatMessage[] = [
    {
      id: "m1",
      senderName: "Pradip Kumar Banerjee",
      senderEmail: "pradip.banerjee@taki.alumni",
      senderBatch: 1976,
      text: "Wonderful to see this portal come alive! It brings back memories of our school building near Sealdah and the excellent teachers we had in the 70s.",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      id: "m2",
      senderName: "Amit Sen",
      senderEmail: "amit.sen@taki.alumni",
      senderBatch: 1988,
      text: "Indeed, Pradip da! Remember the winter reunions and the school playground matches? I hope we can arrange a small get-together next month.",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: "m3",
      senderName: "Sourav Das",
      senderEmail: "sourav.das@taki.alumni",
      senderBatch: 2005,
      text: "Count me in! Pranab da's tea and singara outside the school gate are things I still miss today. Let's make the community grow!",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
  ];

  const renewals: RenewalSubmission[] = [];

  const events: AlumniEvent[] = [
    {
      id: "e1",
      title: "94th Annual Winter Reunion & Gala Dinner",
      description: "Our signature annual winter reunion. Includes school heritage walk, classical music performance, felicitation of retired teachers, and buffet dinner.",
      date: "2026-12-20",
      time: "4:00 PM - 9:00 PM",
      location: "School Main Playground, Sealdah, Kolkata",
      type: "Reunion",
      rsvps: ["sourav.das@taki.alumni"]
    },
    {
      id: "e2",
      title: "Executive Committee Planning Session",
      description: "Planning meeting for the Centenary celebration and upcoming charity book distribution drives. All active members are welcome.",
      date: "2026-08-15",
      time: "11:30 AM - 1:30 PM",
      location: "Alumni Room, Taki House School Building",
      type: "Meeting",
      rsvps: ["amit.sen@taki.alumni", "pradip.banerjee@taki.alumni"]
    },
    {
      id: "e3",
      title: "Career Guidance & Mentorship Seminar",
      description: "Interactive session where prominent ex-students from medicine, tech, and administration fields guide the current Batch of Class 10 & 12 boys.",
      date: "2026-09-05",
      time: "2:00 PM - 5:00 PM",
      location: "School Main Assembly Hall",
      type: "Seminar",
      rsvps: []
    }
  ];

  const galleryPhotos: GalleryPhoto[] = [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=800",
      title: "Annual Sports Meet - Ex-Students 100m Dash",
      description: "Alumni members competing in the athletic sprint event during the winter annual sports meet. Exceptional fitness shown by the Class of 2012!",
      tag: "Sports & Athletics",
      uploadedBy: {
        name: "Amit Sen",
        email: "amit.sen@taki.alumni",
        batchYear: 1988
      },
      uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      likes: ["sourav.das@taki.alumni", "pradip.banerjee@taki.alumni"],
      comments: [
        {
          id: "gc1",
          authorName: "Sourav Das",
          authorEmail: "sourav.das@taki.alumni",
          authorBatch: 2005,
          text: "Look at that speed! Next year I will definitely participate in the veteran sprint event too.",
          timestamp: new Date(Date.now() - 3600000 * 36).toISOString()
        },
        {
          id: "gc2",
          authorName: "Pradip Kumar Banerjee",
          authorEmail: "pradip.banerjee@taki.alumni",
          authorBatch: 1976,
          text: "Excellent spirit, boys! Keep the athletic traditions of Taki House flying high.",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ]
    },
    {
      id: "g2",
      url: "https://images.unsplash.com/photo-1561089489-f1b9590d4a28?w=800",
      title: "Saraswati Puja - Traditional School lobby",
      description: "Saraswati Puja (Basant Panchami) being celebrated in our school lobby with beautiful flower decorations, alpana drawings, and prayers with students and alumni.",
      tag: "Cultural Events",
      uploadedBy: {
        name: "Sourav Das",
        email: "sourav.das@taki.alumni",
        batchYear: 2005
      },
      uploadedAt: new Date(Date.now() - 3600000 * 120).toISOString(),
      likes: ["amit.sen@taki.alumni", "sayantanroy58581@gmail.com"],
      comments: [
        {
          id: "gc3",
          authorName: "Amit Sen",
          authorEmail: "amit.sen@taki.alumni",
          authorBatch: 1988,
          text: "Basanti kurtas and anjali in the school lobby... sweetest memories ever. Miss those beautiful school-days bhog distribution!",
          timestamp: new Date(Date.now() - 3600000 * 96).toISOString()
        }
      ]
    },
    {
      id: "g3",
      url: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800",
      title: "Annual Social Stage Play - 'Alaler Gharer Dulal'",
      description: "The Taki Boys Alumni Drama Club performing the timeless classic Bengali social satire on the main school auditorium stage for the winter reunion festival.",
      tag: "Cultural Events",
      uploadedBy: {
        name: "Pradip Kumar Banerjee",
        email: "pradip.banerjee@taki.alumni",
        batchYear: 1976
      },
      uploadedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      likes: ["sourav.das@taki.alumni"],
      comments: [
        {
          id: "gc4",
          authorName: "Amit Sen",
          authorEmail: "amit.sen@taki.alumni",
          authorBatch: 1988,
          text: "What a powerful performance! The acting standards of our alumni theatre group are top-notch.",
          timestamp: new Date(Date.now() - 3600000 * 50).toISOString()
        }
      ]
    },
    {
      id: "g4",
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
      title: "Inter-School Football Championship Finals",
      description: "Our school senior team winning the Sealdah Division Inter-School Football championship shield after a nail-biting penalty shootout.",
      tag: "Sports & Athletics",
      uploadedBy: {
        name: "Amit Sen",
        email: "amit.sen@taki.alumni",
        batchYear: 1988
      },
      uploadedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
      likes: ["pradip.banerjee@taki.alumni", "sourav.das@taki.alumni"],
      comments: [
        {
          id: "gc5",
          authorName: "Sourav Das",
          authorEmail: "sourav.das@taki.alumni",
          authorBatch: 2005,
          text: "Our football legacy remains unmatched in North Kolkata! Kudos to the team.",
          timestamp: new Date(Date.now() - 3600000 * 10).toISOString()
        }
      ]
    },
    {
      id: "g5",
      url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800",
      title: "Rabindra Jayanti Music Recital - Alumni Hall",
      description: "Vocalists and acoustic musicians from various batches collaborating on Rabindrasangeet chorus recitals during Rabindra Jayanti Celebrations.",
      tag: "Cultural Events",
      uploadedBy: {
        name: "Sourav Das",
        email: "sourav.das@taki.alumni",
        batchYear: 2005
      },
      uploadedAt: new Date(Date.now() - 3600000 * 180).toISOString(),
      likes: ["amit.sen@taki.alumni"],
      comments: []
    },
    {
      id: "g6",
      url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      title: "Sports Tug-Of-War: Batch of 1988 vs 2005",
      description: "A highly intense and cheerful Tug of War game between the senior alumni and junior ex-students. Legends of 1988 took the glory!",
      tag: "Sports & Athletics",
      uploadedBy: {
        name: "Pradip Kumar Banerjee",
        email: "pradip.banerjee@taki.alumni",
        batchYear: 1976
      },
      uploadedAt: new Date(Date.now() - 3600000 * 300).toISOString(),
      likes: ["amit.sen@taki.alumni", "sourav.das@taki.alumni"],
      comments: [
        {
          id: "gc6",
          authorName: "Amit Sen",
          authorEmail: "amit.sen@taki.alumni",
          authorBatch: 1988,
          text: "Haha! We might have gray hair, but our grip was rock solid. Better luck next year Sourav and team!",
          timestamp: new Date(Date.now() - 3600000 * 290).toISOString()
        }
      ]
    },
    {
      id: "g7",
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
      title: "Historic School Main Building (1950s Archive)",
      description: "A vintage picture from our ex-student archives showcasing the old gothic-brick building structure of Taki House high school, looking pristine as ever.",
      tag: "School Heritage",
      uploadedBy: {
        name: "Pradip Kumar Banerjee",
        email: "pradip.banerjee@taki.alumni",
        batchYear: 1976
      },
      uploadedAt: new Date(Date.now() - 3600000 * 500).toISOString(),
      likes: ["amit.sen@taki.alumni", "sourav.das@taki.alumni", "sayantanroy58581@gmail.com"],
      comments: [
        {
          id: "gc7",
          authorName: "Amit Sen",
          authorEmail: "amit.sen@taki.alumni",
          authorBatch: 1988,
          text: "What a spectacular historical asset. This building stands as a temple of knowledge for generations of Sealdah/Kolkata boys.",
          timestamp: new Date(Date.now() - 3600000 * 480).toISOString()
        }
      ]
    }
  ];

  // API Endpoints
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === lowerEmail);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password. Feel free to register if you don't have an account!" });
      return;
    }

    const storedPassword = passwords[lowerEmail];
    if (storedPassword && storedPassword !== password) {
      res.status(401).json({ error: "Invalid password. (Try 'password123' for demo users!)" });
      return;
    }

    res.json({ user });
  });

  // Google Single Sign-On
  app.post("/api/auth/google", (req, res) => {
    const { email, name, avatarUrl } = req.body;
    
    if (!email) {
      res.status(400).json({ error: "Google Email is required" });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    let user = users.find(u => u.email.toLowerCase() === lowerEmail);

    if (!user) {
      // Auto-register on the fly if profile doesn't exist yet!
      const id = "u" + (users.length + 1);
      const parts = lowerEmail.split('@');
      const displayName = name || parts[0].split('.').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      
      user = {
        id,
        email: lowerEmail,
        name: displayName,
        batchYear: 2015, // Default batch year for Google sign-in
        phone: "+91 98765 43210",
        occupation: "Alumnus (Signed in with Google)",
        location: "Kolkata, West Bengal",
        membershipStatus: MembershipStatus.NOT_MEMBER,
        membershipTier: MembershipTier.ANNUAL,
        rollNumber: `Batch15-${Math.floor(Math.random() * 150 + 1).toString().padStart(3, '0')}`,
        avatarUrl: avatarUrl || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1535713875002-d1d0cf377fde' : '1570295999919-56ceb5ecca61'}?w=150`
      };
      
      users.push(user);
      passwords[lowerEmail] = "password_google_oauth";
    }

    res.json({ user });
  });

  // Register
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, batchYear, phone, occupation, location, rollNumber } = req.body;

    if (!email || !password || !name || !batchYear) {
      res.status(400).json({ error: "Email, password, name, and batch year are required" });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    const existingUser = users.find(u => u.email.toLowerCase() === lowerEmail);

    if (existingUser) {
      res.status(400).json({ error: "An alumnus with this email is already registered." });
      return;
    }

    const id = "u" + (users.length + 1);
    const newUser: UserProfile = {
      id,
      email: lowerEmail,
      name,
      batchYear: parseInt(batchYear),
      phone: phone || "",
      occupation: occupation || "Alumnus",
      location: location || "Kolkata",
      membershipStatus: MembershipStatus.NOT_MEMBER,
      membershipTier: MembershipTier.ANNUAL,
      rollNumber: rollNumber || `Batch${batchYear.slice(-2)}-${Math.floor(Math.random() * 150 + 1).toString().padStart(3, '0')}`,
      avatarUrl: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1535713875002-d1d0cf377fde' : '1570295999919-56ceb5ecca61'}?w=150`
    };

    users.push(newUser);
    passwords[lowerEmail] = password;

    res.status(201).json({ user: newUser });
  });

  // Get Chat Messages
  app.get("/api/chat/messages", (req, res) => {
    res.json({ messages: chatMessages });
  });

  // Post Chat Message
  app.post("/api/chat/messages", (req, res) => {
    const { senderEmail, text } = req.body;

    if (!senderEmail || !text) {
      res.status(400).json({ error: "senderEmail and text are required" });
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === senderEmail.toLowerCase());
    if (!user) {
      res.status(404).json({ error: "Sender alumnus profile not found" });
      return;
    }

    const newMessage: ChatMessage = {
      id: "m" + (chatMessages.length + 1),
      senderName: user.name,
      senderEmail: user.email,
      senderBatch: user.batchYear,
      text,
      timestamp: new Date().toISOString(),
      avatarUrl: user.avatarUrl
    };

    chatMessages.push(newMessage);
    res.status(201).json({ message: newMessage });
  });

  // Membership Renewal Submission
  app.post("/api/membership/renew", (req, res) => {
    const { email, tier, paymentMethod, billingAddress, amount } = req.body;

    if (!email || !tier || !paymentMethod) {
      res.status(400).json({ error: "Email, tier, and payment method are required" });
      return;
    }

    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      res.status(404).json({ error: "Alumnus profile not found" });
      return;
    }

    const txId = "TXN" + Math.floor(1000000000 + Math.random() * 9000000000);
    const dateStr = new Date().toISOString();

    const submission: RenewalSubmission = {
      id: "r" + (renewals.length + 1),
      email: email.toLowerCase(),
      tier: tier as MembershipTier,
      amount: parseFloat(amount) || 500,
      paymentMethod,
      transactionId: txId,
      status: "approved", // auto approve in this elegant demo for immediate feedback!
      submittedAt: dateStr,
      billingAddress: billingAddress || "Kolkata, WB"
    };

    renewals.push(submission);

    // Update user profile status
    const updatedUser = users[userIndex];
    updatedUser.membershipStatus = MembershipStatus.ACTIVE;
    updatedUser.membershipTier = tier as MembershipTier;
    
    if (tier === MembershipTier.LIFE || tier === MembershipTier.PATRON) {
      updatedUser.membershipExpiry = "Lifetime";
    } else {
      const expDate = new Date();
      expDate.setFullYear(expDate.getFullYear() + 1);
      updatedUser.membershipExpiry = expDate.toISOString().split('T')[0];
    }

    res.status(200).json({ 
      success: true, 
      submission, 
      user: updatedUser 
    });
  });

  // Directory listing
  app.get("/api/alumni/directory", (req, res) => {
    const directory = users.map(u => ({
      id: u.id,
      name: u.name,
      batchYear: u.batchYear,
      occupation: u.occupation || "Alumnus",
      location: u.location || "Kolkata",
      membershipTier: u.membershipTier,
      avatarUrl: u.avatarUrl
    }));
    res.json({ directory });
  });

  // Get all events
  app.get("/api/events", (req, res) => {
    res.json({ events });
  });

  // Toggle Event RSVP
  app.post("/api/events/:id/rsvp", (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required to RSVP" });
      return;
    }

    const event = events.find(e => e.id === id);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const index = event.rsvps.findIndex(r => r.toLowerCase() === emailLower);

    if (index === -1) {
      event.rsvps.push(emailLower);
    } else {
      event.rsvps.splice(index, 1);
    }

    res.json({ success: true, event });
  });

  // Get all gallery photos
  app.get("/api/gallery", (req, res) => {
    res.json({ photos: galleryPhotos });
  });

  // Add new photo to the gallery
  app.post("/api/gallery", (req, res) => {
    const { title, url, description, tag, uploaderEmail } = req.body;

    if (!title || !url || !tag || !uploaderEmail) {
      res.status(400).json({ error: "Title, image URL, category tag, and uploader email are required." });
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === uploaderEmail.toLowerCase());
    if (!user) {
      res.status(404).json({ error: "Uploader profile not found." });
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: "g" + (galleryPhotos.length + 1),
      url,
      title,
      description: description || "",
      tag: tag as any,
      uploadedBy: {
        name: user.name,
        email: user.email,
        batchYear: user.batchYear
      },
      uploadedAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    galleryPhotos.unshift(newPhoto); // Add to the beginning of the list
    res.status(201).json({ success: true, photo: newPhoto });
  });

  // Toggle Like on a Photo
  app.post("/api/gallery/:id/like", (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "User email is required to like/unlike photos." });
      return;
    }

    const photo = galleryPhotos.find(p => p.id === id);
    if (!photo) {
      res.status(404).json({ error: "Photo not found." });
      return;
    }

    const userEmailLower = email.toLowerCase().trim();
    const index = photo.likes.indexOf(userEmailLower);

    if (index === -1) {
      photo.likes.push(userEmailLower);
    } else {
      photo.likes.splice(index, 1);
    }

    res.json({ success: true, photo });
  });

  // Add a Comment to a Photo
  app.post("/api/gallery/:id/comment", (req, res) => {
    const { id } = req.params;
    const { email, text } = req.body;

    if (!email || !text || !text.trim()) {
      res.status(400).json({ error: "User email and comment text are required." });
      return;
    }

    const photo = galleryPhotos.find(p => p.id === id);
    if (!photo) {
      res.status(404).json({ error: "Photo not found." });
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      res.status(404).json({ error: "User profile not found." });
      return;
    }

    const newComment = {
      id: "gc" + Math.floor(100000 + Math.random() * 900000),
      authorName: user.name,
      authorEmail: user.email,
      authorBatch: user.batchYear,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    photo.comments.push(newComment);
    res.status(201).json({ success: true, comment: newComment, photo });
  });

  // Vite development / production static asset integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
