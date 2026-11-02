/* ==========================================================================
   COLLEGE MAJOR PROJECT CATALOGUE - DATA REPOSITORY (2026 EDITION)
   Software-Only Practical Final-Year Projects for CSE, IT, AI/ML & Data Science
   ========================================================================== */

export const CATEGORIES = [
  { id: 'all', label: 'All Projects', icon: '⚡', count: 75 },
  { id: 'ai-genai', label: 'AI & Generative AI', icon: '🧠', count: 10, color: '#00d2ff' },
  { id: 'ai-vision', label: 'AI & Computer Vision', icon: '👁️', count: 9, color: '#8b5cf6' },
  { id: 'datascience', label: 'Data Science & Analytics', icon: '📊', count: 9, color: '#10b981' },
  { id: 'cybersecurity', label: 'Cybersecurity & Privacy', icon: '🛡️', count: 9, color: '#f43f5e' },
  { id: 'web-fullstack', label: 'Web & Full-Stack', icon: '🌐', count: 15, color: '#0077ff' },
  { id: 'cloud-tools', label: 'Mobile, Cloud & Tools', icon: '☁️', count: 9, color: '#38bdf8' },
  { id: 'civic-ai', label: 'Responsible AI & Civic', icon: '⚖️', count: 14, color: '#ec4899' }
];


export const PROJECTS = [
  // --- Category 1: AI & Generative AI (10 Projects) ---
  {
    id: 1,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'College Information Chatbot',
    difficulty: 'Intermediate',
    description: 'Answers student questions using college notices, syllabi, rules and FAQs, with links to the source documents.',
    tools: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Streamlit'],
    focus: 'Natural language retrieval on institutional PDFs, circulars and syllabus handbooks.'
  },
  {
    id: 2,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Project Viva Preparation System',
    difficulty: 'Intermediate',
    description: 'Creates viva questions from a project report and gives feedback on typed or spoken answers.',
    tools: ['Python', 'speech-to-text', 'LLM API', 'Streamlit'],
    focus: 'Automated question generation from uploaded PDFs with simulated viva examiner scoring.'
  },
  {
    id: 3,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Scholarship Finder',
    difficulty: 'Intermediate',
    description: "Suggests scholarships based on a student's profile and explains eligibility from official scheme documents.",
    tools: ['Python', 'React', 'RAG', 'PostgreSQL'],
    focus: 'Profile-matching engine with explainable criteria extracted from government scholarship portals.'
  },
  {
    id: 4,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Local Complaint Management System',
    difficulty: 'Advanced',
    description: 'Accepts complaints in text or voice, sorts them by category and tracks their status.',
    tools: ['Python', 'speech recognition', 'FastAPI', 'React'],
    focus: 'Multimodal grievance intake, automated department triage and ticket status lifecycle.'
  },
  {
    id: 5,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'AI Code Explainer',
    difficulty: 'Advanced',
    description: 'Explains source code, describes functions and answers questions about a software project.',
    tools: ['Python', 'embeddings', 'LLM', 'Streamlit'],
    focus: 'Repository semantic code indexing, line-by-line function walkthroughs and bug insights.'
  },
  {
    id: 6,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Document and Policy Comparison Tool',
    difficulty: 'Intermediate',
    description: 'Compares two documents and highlights changed sections in simple language.',
    tools: ['Python', 'OCR', 'NLP', 'Streamlit'],
    focus: 'Semantic diffing and plain-English translation of legal, university or municipal policy changes.'
  },
  {
    id: 7,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Lecture Notes Generator',
    difficulty: 'Intermediate',
    description: 'Converts lecture recordings into notes, summaries, key points and quiz questions.',
    tools: ['Python', 'speech-to-text', 'NLP', 'React'],
    focus: 'Audio chunking, speech transcription, bulleted study summaries and auto-generated flash quizzes.'
  },
  {
    id: 8,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Smart Form Assistant',
    difficulty: 'Advanced',
    description: 'Explains difficult form fields and guides users through filling out online forms.',
    tools: ['Python', 'OCR', 'NLP', 'FastAPI'],
    focus: 'Context-aware interactive assistance for civic, taxation, college admission or government forms.'
  },
  {
    id: 9,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Fake News and Claim Checker',
    difficulty: 'Advanced',
    description: 'Highlights claims that need verification and shows related evidence passages.',
    tools: ['Python', 'NLP', 'retrieval', 'Streamlit'],
    focus: 'Entity-claim extraction and cross-referencing against verified news corpus passages.'
  },
  {
    id: 10,
    categoryId: 'ai-genai',
    categoryName: 'AI & Generative AI',
    title: 'Lecture Caption and Summary Tool',
    difficulty: 'Advanced',
    description: 'Creates captions and short summaries from recorded classroom lectures.',
    tools: ['Python', 'speech recognition', 'React'],
    focus: 'Timestamped WebVTT subtitle creation and synchronized executive recap generation.'
  },

  // --- Category 2: AI & Computer Vision (9 Projects) ---
  {
    id: 11,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Plant Disease Detection',
    difficulty: 'Advanced',
    description: 'Identifies selected plant diseases from uploaded leaf photographs and displays relevant guidance.',
    tools: ['Python', 'TensorFlow/PyTorch', 'OpenCV', 'Flask'],
    focus: 'Deep CNN leaf pathology classification with remedy advisory for farmers and gardeners.'
  },
  {
    id: 12,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Road Damage Detection',
    difficulty: 'Advanced',
    description: 'Detects potholes and road cracks in uploaded road images and creates a report.',
    tools: ['Python', 'YOLO', 'OpenCV', 'Flask'],
    focus: 'Real-time bounding box segmentation for road surface degradation inspection.'
  },
  {
    id: 13,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Product Counting from Images',
    difficulty: 'Advanced',
    description: 'Counts products in uploaded shop-shelf photographs and flags empty spaces.',
    tools: ['Python', 'YOLO', 'OpenCV', 'Streamlit'],
    focus: 'Retail stock monitoring, inventory auditing and shelf empty-slot alerts.'
  },
  {
    id: 14,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Sign Language Recognition',
    difficulty: 'Advanced',
    description: 'Recognises a limited set of hand gestures from a webcam and converts them into text.',
    tools: ['Python', 'MediaPipe', 'TensorFlow'],
    focus: '21-point hand landmark tracking mapped to real-time sign language alphabet translation.'
  },
  {
    id: 15,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Waste Image Classifier',
    difficulty: 'Intermediate',
    description: 'Classifies common waste images into categories such as plastic, paper, metal and organic.',
    tools: ['Python', 'TensorFlow', 'Streamlit'],
    focus: 'Recycling classification model with environmental disposal recommendations.'
  },
  {
    id: 16,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Safety Equipment Detection',
    difficulty: 'Advanced',
    description: 'Detects selected safety equipment, such as helmets and safety vests, in uploaded images or video.',
    tools: ['Python', 'YOLO', 'OpenCV', 'Flask'],
    focus: 'Industrial site PPE compliance verification with violation logging.'
  },
  {
    id: 17,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Fruit and Vegetable Counting',
    difficulty: 'Advanced',
    description: 'Counts selected fruits or vegetables from images to help estimate stock or harvest quantity.',
    tools: ['Python', 'YOLO', 'OpenCV'],
    focus: 'Agricultural yield estimation and post-harvest produce inventory tallying.'
  },
  {
    id: 18,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Flood Image Assessment',
    difficulty: 'Advanced',
    description: 'Analyses submitted street images to identify visible flood-affected areas.',
    tools: ['Python', 'image segmentation', 'OpenCV'],
    focus: 'Water inundation masking on urban roads for civic emergency response prioritization.'
  },
  {
    id: 19,
    categoryId: 'ai-vision',
    categoryName: 'AI & Computer Vision',
    title: 'Text and Sign Reader',
    difficulty: 'Intermediate',
    description: 'Reads text from signboards and documents aloud for users who need audio assistance.',
    tools: ['Python', 'OCR', 'text-to-speech'],
    focus: 'Accessibility vision tool with Tesseract optical extraction and synthesized speech output.'
  },

  // --- Category 3: Data Science & Analytics (9 Projects) ---
  {
    id: 20,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Personal Expense Tracker and Analyzer',
    difficulty: 'Intermediate',
    description: 'Categorises expenses from uploaded CSV files, finds unusual spending and estimates month-end expenses.',
    tools: ['Python', 'pandas', 'scikit-learn', 'Streamlit'],
    focus: 'Automated bank transaction labeling, anomaly spending flags and budget forecasting.'
  },
  {
    id: 21,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Sales Forecasting System',
    difficulty: 'Advanced',
    description: 'Uses past sales data to estimate future demand and suggest stock quantities.',
    tools: ['Python', 'pandas', 'time-series ML', 'Plotly'],
    focus: 'ARIMA/Prophet forecasting with interactive inventory replenishment safety stocks.'
  },
  {
    id: 22,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Electricity Usage Analyzer',
    difficulty: 'Intermediate',
    description: 'Analyses electricity usage records and identifies unusual consumption patterns.',
    tools: ['Python', 'pandas', 'anomaly detection', 'Plotly'],
    focus: 'Time-of-day kilowatt pattern visualization, seasonal baselines and leak detection.'
  },
  {
    id: 23,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Job Market and Skills Analyzer',
    difficulty: 'Intermediate',
    description: 'Studies job descriptions, identifies in-demand skills and shows learning gaps for selected careers.',
    tools: ['Python', 'NLP', 'pandas', 'Streamlit'],
    focus: 'Skill term co-occurrence graphs, market hiring trends and personalized gap analysis.'
  },
  {
    id: 24,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Public Transport Delay Analysis',
    difficulty: 'Advanced',
    description: 'Studies available transport data to identify routes and times with frequent delays.',
    tools: ['Python', 'pandas', 'GeoPandas', 'dashboard'],
    focus: 'Geospatial corridor bottleneck tracking and delay frequency heatmaps.'
  },
  {
    id: 25,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Air Quality Prediction',
    difficulty: 'Advanced',
    description: 'Predicts air-quality indicators using available historical weather and pollution data.',
    tools: ['Python', 'time-series ML', 'SHAP', 'Streamlit'],
    focus: 'AQI index forecasting with explainable feature importance for environmental factors.'
  },
  {
    id: 26,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'College Feedback Analyzer',
    difficulty: 'Intermediate',
    description: 'Analyses student feedback, finds common complaints and tracks satisfaction trends.',
    tools: ['Python', 'NLP', 'pandas', 'Power BI/Plotly'],
    focus: 'Sentiment classification, topic modeling across semesters and actionable faculty insights.'
  },
  {
    id: 27,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Hiring Data Fairness Analyzer',
    difficulty: 'Advanced',
    description: 'Checks a sample recruitment model for differences in outcomes across selected groups.',
    tools: ['Python', 'scikit-learn', 'Fairlearn', 'SHAP'],
    focus: 'Disparate impact ratio, demographic parity checks and bias mitigation experiments.'
  },
  {
    id: 28,
    categoryId: 'datascience',
    categoryName: 'Data Science & Analytics',
    title: 'Small Business Credit Risk Demo',
    difficulty: 'Advanced',
    description: 'Builds an explainable prototype that estimates credit risk using synthetic or approved sample data.',
    tools: ['Python', 'XGBoost', 'SHAP', 'FastAPI'],
    focus: 'Credit underwriting risk scoring with transparent factor breakdown for borrowers.'
  },

  // --- Category 4: Cybersecurity & Privacy (9 Projects) ---
  {
    id: 29,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Phishing Website Detector',
    difficulty: 'Intermediate',
    description: 'Checks a URL and explains the features that may indicate a phishing website.',
    tools: ['Python', 'scikit-learn', 'FastAPI'],
    focus: 'Lexical URL analysis, domain age inspection, SSL verification and heuristic safety score.'
  },
  {
    id: 30,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Email Spam and Fraud Detector',
    difficulty: 'Intermediate',
    description: 'Analyses sample email text and headers to flag suspicious messages.',
    tools: ['Python', 'NLP', 'Streamlit'],
    focus: 'Header spoofing checks, urgency phrasing detection and financial fraud heuristics.'
  },
  {
    id: 31,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Cloud Security Checker',
    difficulty: 'Advanced',
    description: 'Checks a test cloud environment for common access and storage configuration mistakes.',
    tools: ['Python', 'cloud SDK', 'Docker'],
    focus: 'Automated auditing for public storage buckets, open security groups and IAM policy leaks.'
  },
  {
    id: 32,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Passwordless Login Demo',
    difficulty: 'Intermediate',
    description: 'Demonstrates secure passwordless login, account recovery and authentication flows.',
    tools: ['JavaScript/TypeScript', 'WebAuthn', 'Node.js'],
    focus: 'FIDO2 WebAuthn biometrics, passkeys, cryptographic signatures and recovery fallback.'
  },
  {
    id: 33,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Security Log Analyzer',
    difficulty: 'Advanced',
    description: 'Analyses sample system logs, groups suspicious events and displays an incident timeline.',
    tools: ['Python', 'OpenSearch', 'Docker'],
    focus: 'SIEM-style log parsing, brute-force event grouping and chronological attack replay.'
  },
  {
    id: 34,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Secure File Sharing Website',
    difficulty: 'Advanced',
    description: 'Allows users to share files using expiring links, access codes and activity logs.',
    tools: ['Node.js', 'encryption', 'PostgreSQL'],
    focus: 'Client-side AES-GCM encryption, burn-after-download tokens and tamper-evident audit logs.'
  },
  {
    id: 35,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Website Security Testing Tool',
    difficulty: 'Advanced',
    description: 'Tests a locally hosted demo website for common input-validation and authentication weaknesses.',
    tools: ['Python', 'OWASP ZAP', 'FastAPI'],
    focus: 'Vulnerability assessment for SQL injection, XSS reflection and insecure headers.'
  },
  {
    id: 36,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Deepfake Detection Demo',
    difficulty: 'Advanced',
    description: 'Analyses sample audio or video files and flags signs of possible manipulation for human review.',
    tools: ['Python', 'PyTorch', 'librosa', 'OpenCV'],
    focus: 'Facial artifact detection and audio spectrum anomaly identification.'
  },
  {
    id: 37,
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Privacy',
    title: 'Website Privacy Checker',
    difficulty: 'Advanced',
    description: 'Reviews website forms and scripts to list the types of personal data they may collect.',
    tools: ['Python', 'Playwright', 'static analysis'],
    focus: 'Third-party cookie discovery, tracker script mapping and privacy risk score.'
  },

  // --- Category 5: Web & Full-Stack Applications (15 Projects) ---
  {
    id: 38,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'College Buy and Sell Portal',
    difficulty: 'Intermediate',
    description: 'Lets students list, buy, sell, borrow or exchange books and study materials.',
    tools: ['MERN', 'PostgreSQL'],
    focus: 'Peer-to-peer campus marketplace, textbook condition tags and verified student chatting.'
  },
  {
    id: 39,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Clinic Appointment System',
    difficulty: 'Intermediate',
    description: 'Manages doctor appointments, patient tokens and estimated waiting times.',
    tools: ['React', 'Django/Node.js', 'PostgreSQL'],
    focus: 'Real-time queue tracking, token dispatching and doctor schedule management.'
  },
  {
    id: 40,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Student Skill Exchange Platform',
    difficulty: 'Intermediate',
    description: 'Connects students who want to teach and learn skills from one another.',
    tools: ['MERN', 'matching logic', 'Socket.IO'],
    focus: 'Reciprocal credit system, skill exchange matching and real-time messaging.'
  },
  {
    id: 41,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Local Complaint Portal',
    difficulty: 'Intermediate',
    description: 'Lets citizens submit local issues, attach evidence and track complaint progress.',
    tools: ['React', 'Node.js', 'Supabase'],
    focus: 'Public civic issue reporting, upvoting, photographic evidence and resolution tracking.'
  },
  {
    id: 42,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'College Lab Management System',
    difficulty: 'Intermediate',
    description: 'Tracks laboratory equipment, issue/return records, maintenance and history.',
    tools: ['Java/Spring Boot', 'React', 'PostgreSQL'],
    focus: 'Department equipment ledger, barcode/QR check-in/out and maintenance scheduling.'
  },
  {
    id: 43,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'College Event and Certificate System',
    difficulty: 'Intermediate',
    description: 'Manages event registration, attendance, certificate generation and participation records.',
    tools: ['React', 'Node.js', 'PostgreSQL', 'QR codes'],
    focus: 'Event ticketing, instant QR attendance scanning and automated verifiable PDF certificate generator.'
  },
  {
    id: 44,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Course and Learning Resource Finder',
    difficulty: 'Intermediate',
    description: 'Organises free learning resources according to subjects and college syllabus topics.',
    tools: ['Django', 'React', 'search'],
    focus: 'Syllabus-aligned indexing of textbooks, lecture notes, video playlists and papers.'
  },
  {
    id: 45,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Student Room Rental Portal',
    difficulty: 'Intermediate',
    description: 'Lists shared rooms and helps students compare rent, facilities and location.',
    tools: ['Next.js', 'PostgreSQL', 'maps'],
    focus: 'Hostel and PG listings, roommate preference matching and interactive neighborhood distance.'
  },
  {
    id: 46,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Food Donation and Sharing Platform',
    difficulty: 'Intermediate',
    description: 'Connects canteens, shops and community groups to share surplus food for collection.',
    tools: ['React/Flutter', 'Firebase'],
    focus: 'Surplus food expiry notifications, NGO claim workflow and pickup logistics.'
  },
  {
    id: 47,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Internship Application Tracker',
    difficulty: 'Beginner–Intermediate',
    description: 'Tracks applications, deadlines, interview rounds and preparation notes.',
    tools: ['React', 'FastAPI', 'PostgreSQL'],
    focus: 'Kanban board for job hunting, interview round checklists and resume version logs.'
  },
  {
    id: 48,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Online Notes and Task Manager',
    difficulty: 'Intermediate',
    description: 'Provides notes and task management with offline access and data synchronisation.',
    tools: ['Flutter', 'SQLite', 'Firebase'],
    focus: 'Conflict-free offline sync, rich text markdown notes and priority task deadlines.'
  },
  {
    id: 49,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Farmer-to-Buyer Marketplace',
    difficulty: 'Intermediate',
    description: 'Lets farmers list produce and lets buyers compare availability and indicative prices.',
    tools: ['React/Flutter', 'Supabase'],
    focus: 'Produce catalog, mandi benchmark pricing and direct wholesale buyer orders.'
  },
  {
    id: 50,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Student Study Planner',
    difficulty: 'Intermediate',
    description: 'Creates study plans using exam dates, topic progress and revision schedules.',
    tools: ['React Native', 'SQLite'],
    focus: 'Spaced repetition schedule, exam countdowns and topic completion metrics.'
  },
  {
    id: 51,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Campus Ride Sharing App',
    difficulty: 'Intermediate',
    description: 'Matches verified students travelling on similar routes for shared rides.',
    tools: ['Flutter', 'Firebase', 'maps'],
    focus: 'College domain email verification, recurring commute matching and cost-sharing calculator.'
  },
  {
    id: 52,
    categoryId: 'web-fullstack',
    categoryName: 'Web & Full-Stack Applications',
    title: 'Voice-Based Form Filling App',
    difficulty: 'Intermediate',
    description: 'Guides users through selected forms using voice prompts and speech input.',
    tools: ['Android', 'speech APIs', 'local database'],
    focus: 'Conversational form completion designed for non-technical or rural users.'
  },

  // --- Category 6: Mobile, Cloud & Software Tools (9 Projects) ---
  {
    id: 53,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Offline Notes App',
    difficulty: 'Intermediate',
    description: 'Stores notes locally and synchronises changes when the internet connection returns.',
    tools: ['Flutter', 'SQLite', 'Firebase'],
    focus: 'Local-first architecture, background delta syncing and encrypted local storage.'
  },
  {
    id: 54,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Medication Reminder App',
    difficulty: 'Intermediate',
    description: 'Schedules medicine reminders and keeps a simple record of completed reminders; it does not provide medical advice.',
    tools: ['Flutter', 'local notifications', 'encrypted storage'],
    focus: 'Reliable device alarms, pill regimen schedules and caregiver adherence reports.'
  },
  {
    id: 55,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Voice Assistant for Forms',
    difficulty: 'Intermediate',
    description: 'Helps users complete selected structured forms through spoken instructions and confirmation.',
    tools: ['Android', 'speech APIs'],
    focus: 'Interactive voice validation, field-by-field readout and confirmation prompts.'
  },
  {
    id: 56,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Data Cleaning and Quality Tool',
    difficulty: 'Advanced',
    description: 'Imports datasets, checks missing values and duplicates, and generates a data-quality report.',
    tools: ['Python', 'pandas', 'Streamlit'],
    focus: 'Automated data hygiene profiling, outlier detection and exportable clean CSVs.'
  },
  {
    id: 57,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Live Data Dashboard',
    difficulty: 'Advanced',
    description: 'Processes simulated live events and displays updated counts, trends and alerts.',
    tools: ['Python', 'Kafka/Redpanda', 'FastAPI', 'Grafana'],
    focus: 'Event streaming throughput, sliding window aggregation and real-time spike alerts.'
  },
  {
    id: 58,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Automated Backup and Restore Tester',
    difficulty: 'Advanced',
    description: 'Runs backup and restore tests on sample project data and reports whether recovery worked.',
    tools: ['Python', 'Docker', 'GitHub Actions'],
    focus: 'Scheduled dump automation, sandbox restoration testing and integrity verification.'
  },
  {
    id: 59,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Project Deployment Monitor',
    difficulty: 'Intermediate',
    description: 'Displays build status, deployment health, response time and deployment history.',
    tools: ['GitHub Actions', 'Prometheus', 'Grafana'],
    focus: 'CI/CD pipeline metrics, endpoint latency heartbeat and outage notifications.'
  },
  {
    id: 60,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Cloud Cost Analyzer',
    difficulty: 'Intermediate',
    description: 'Analyses sample cloud billing files and recommends possible cost savings.',
    tools: ['Python', 'pandas', 'Streamlit'],
    focus: 'Cost breakdown across compute, egress and storage with idle resource optimization tips.'
  },
  {
    id: 61,
    categoryId: 'cloud-tools',
    categoryName: 'Mobile, Cloud & Software Tools',
    title: 'Dataset Validation System',
    difficulty: 'Advanced',
    description: 'Checks uploaded datasets against defined rules before they are used for analysis.',
    tools: ['Python', 'Pandera', 'Great Expectations'],
    focus: 'Data contract enforcement, type and range verification and schema drift reports.'
  },

  // --- Category 7: Responsible AI, Documents & Civic Applications (14 Projects) ---
  {
    id: 62,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'AI Model Report Generator',
    difficulty: 'Intermediate',
    description: 'Creates a model report containing dataset details, evaluation metrics, limitations and intended use.',
    tools: ['Python', 'Streamlit', 'MLflow'],
    focus: 'Automated generation of standardized Model Cards for responsible AI governance.'
  },
  {
    id: 63,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'AI Bias Checker',
    difficulty: 'Advanced',
    description: 'Compares model performance across selected groups using approved or synthetic datasets.',
    tools: ['Python', 'Fairlearn', 'scikit-learn'],
    focus: 'Comparative fairness metrics across demographic sub-populations and parity dashboards.'
  },
  {
    id: 64,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Explainable Prediction Dashboard',
    difficulty: 'Advanced',
    description: 'Shows why a machine-learning model made a prediction and displays confidence and error analysis.',
    tools: ['Python', 'SHAP', 'Streamlit'],
    focus: 'Local and global feature attribution using TreeSHAP and waterfall explanation plots.'
  },
  {
    id: 65,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Machine Learning Model Monitor',
    difficulty: 'Advanced',
    description: 'Tracks changes in input data and model predictions and alerts users when performance may need review.',
    tools: ['Python', 'Evidently', 'MLflow', 'FastAPI'],
    focus: 'Data drift detection, covariate shift warnings and concept drift tracking in production.'
  },
  {
    id: 66,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Hindi-English Text Classifier',
    difficulty: 'Advanced',
    description: 'Classifies mixed Hindi-English service messages into categories such as complaint, enquiry or request.',
    tools: ['Python', 'Indic NLP', 'FastAPI'],
    focus: 'Hinglish code-mixed tokenization, intent recognition and customer support routing.'
  },
  {
    id: 67,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Document Difference Checker',
    difficulty: 'Advanced',
    description: 'Compares two scanned documents and highlights text and table changes.',
    tools: ['Python', 'OCR', 'OpenCV', 'Streamlit'],
    focus: 'Visual alignment and pixel-level + text-level change detection on scanned forms.'
  },
  {
    id: 68,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Research Paper Explorer',
    difficulty: 'Advanced',
    description: 'Organises research papers by topic, method and citation links for easier exploration.',
    tools: ['Python', 'OpenAlex data', 'Neo4j'],
    focus: 'Graph visualization of citation networks, co-authorship clusters and methodology tags.'
  },
  {
    id: 69,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Disaster Help Map',
    difficulty: 'Advanced',
    description: 'Maps sample relief requests and available resources for a simulated emergency exercise.',
    tools: ['PostGIS', 'QGIS', 'React', 'MapLibre'],
    focus: 'Real-time crisis mapping, shelter capacity pins and supply allocation routing.'
  },
  {
    id: 70,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Neighbourhood Heat Map',
    difficulty: 'Advanced',
    description: 'Uses open geographic data to show areas with higher heat exposure.',
    tools: ['Python', 'GeoPandas', 'dashboard'],
    focus: 'Urban heat island analysis, tree canopy correlation and municipal cooling recommendations.'
  },
  {
    id: 71,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Product Repair Guide and Directory',
    difficulty: 'Intermediate',
    description: 'Scores product repairability using a checklist and lists nearby repair services entered by users.',
    tools: ['Django', 'PostgreSQL'],
    focus: 'Right-to-repair index calculator and crowd-sourced local technician directory.'
  },
  {
    id: 72,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'E-Waste Collection Portal',
    difficulty: 'Intermediate',
    description: 'Tracks electronic items submitted for reuse, repair or recycling.',
    tools: ['React', 'Supabase', 'QR codes'],
    focus: 'Certified recycling chain-of-custody, disposal points and green credit rewards.'
  },
  {
    id: 73,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Website Accessibility Checker',
    difficulty: 'Intermediate',
    description: 'Checks selected accessibility rules and generates a report with suggested fixes.',
    tools: ['Playwright', 'axe-core', 'Node.js'],
    focus: 'WCAG 2.1 AA automated auditing, color contrast validation and ARIA remediation tips.'
  },
  {
    id: 74,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Personal Document Locker',
    difficulty: 'Advanced',
    description: 'Stores selected personal documents with encryption, export options and access history.',
    tools: ['Tauri', 'SQLite', 'WebCrypto'],
    focus: 'Zero-knowledge client-side encrypted vault for educational certificates and identity cards.'
  },
  {
    id: 75,
    categoryId: 'civic-ai',
    categoryName: 'Responsible AI, Documents & Civic Applications',
    title: 'Open Data Analysis Portal',
    difficulty: 'Intermediate',
    description: 'Turns public datasets into charts and reports with source links and reproducible analysis steps.',
    tools: ['Python', 'pandas', 'Jupyter', 'Streamlit'],
    focus: 'Civic transparency dashboards, interactive data plots and reproducible data transformation pipelines.'
  }
];
