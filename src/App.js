import { useState, useRef } from "react";

// ── Inject styles ────────────────────────────────────────────
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0f;
    min-height: 100vh;
  }

  /* Animated background */
  .bg-anim {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .bg-anim::before {
    content: '';
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, #6c63ff18 0%, transparent 70%);
    top: -200px; left: -200px;
    animation: drift1 18s ease-in-out infinite alternate;
  }
  .bg-anim::after {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, #4ecdc418 0%, transparent 70%);
    bottom: -150px; right: -150px;
    animation: drift2 14s ease-in-out infinite alternate;
  }
  .bg-dot {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, #e9647918 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    animation: drift3 20s ease-in-out infinite alternate;
  }

  @keyframes drift1 {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(120px,80px) scale(1.2); }
  }
  @keyframes drift2 {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(-80px,-60px) scale(1.15); }
  }
  @keyframes drift3 {
    0%   { transform: translate(-50%,-50%) scale(1); }
    100% { transform: translate(-40%,-60%) scale(1.3); }
  }

  /* Grid dots overlay */
  .bg-grid {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      radial-gradient(circle, #ffffff08 1px, transparent 1px);
    background-size: 40px 40px;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .fade-in { animation: fadeIn 0.5s ease forwards; }

  /* Nav */
  .nav {
    position: relative; z-index: 10;
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    border-bottom: 1px solid #1e1e2e;
    background: #0a0a0f99;
    backdrop-filter: blur(12px);
    position: sticky; top: 0;
  }
  .nav-logo { font-size:1.5rem; font-weight:700; color:#fff; letter-spacing:-1px; }
  .nav-logo span { color:#6c63ff; }
  .nav-links { display:flex; gap:8px; }
  .nav-btn {
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Segoe UI', sans-serif;
  }
  .nav-btn.active {
    background: #6c63ff;
    color: #fff;
  }
  .nav-btn.inactive {
    background: transparent;
    color: #888;
    border: 1px solid #2a2a2a;
  }
  .nav-btn.inactive:hover { color:#fff; border-color:#6c63ff; }

  /* Cards */
  .card {
    background: #12121a;
    border: 1px solid #1e1e2e;
    border-radius: 16px;
    padding: 28px;
    width: 100%;
    max-width: 700px;
    margin-bottom: 20px;
    position: relative; z-index: 1;
  }

  .section-title {
    font-size: 0.72rem;
    font-weight: 700;
    color: #6c63ff;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
  }

  /* Tabs */
  .tab-row { display:flex; gap:8px; margin-bottom:20px; }
  .tab {
    flex:1; padding:10px; border-radius:10px;
    font-size:0.875rem; font-weight:500;
    cursor:pointer; transition:all 0.2s;
    font-family:'Segoe UI',sans-serif;
  }
  .tab.active {
    border: 1.5px solid #6c63ff;
    background: #1a1730;
    color: #a09cf7;
  }
  .tab.inactive {
    border: 1px solid #1e1e2e;
    background: transparent;
    color: #555;
  }

  /* Upload box */
  .upload-box {
    border: 2px dashed #2a2a3a;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .upload-box:hover, .upload-box.drag { border-color:#6c63ff; background:#1a1730; }
  .upload-icon { font-size:2.5rem; margin-bottom:10px; }
  .upload-text { color:#666; font-size:0.875rem; line-height:1.7; }

  /* Textarea */
  textarea {
    width:100%; min-height:140px;
    background:#0d0d14; border:1px solid #1e1e2e;
    border-radius:10px; color:#f0f0f0;
    font-size:0.9rem; padding:14px;
    resize:vertical; outline:none;
    font-family:'Segoe UI',sans-serif;
    line-height:1.6; transition: border-color 0.2s;
  }
  textarea:focus { border-color:#6c63ff33; }

  /* Select */
  select {
    background:#0d0d14; border:1px solid #1e1e2e;
    border-radius:8px; color:#f0f0f0;
    padding:9px 12px; font-size:0.875rem;
    outline:none; cursor:pointer; width:100%;
    font-family:'Segoe UI',sans-serif;
  }

  /* Buttons */
  .btn-generate {
    width:100%; padding:14px; border-radius:12px;
    border:none; font-size:1rem; font-weight:600;
    cursor:pointer; transition:all 0.25s;
    font-family:'Segoe UI',sans-serif; margin-top:8px;
  }
  .btn-generate.ready {
    background: linear-gradient(135deg,#6c63ff,#a09cf7);
    color:#fff;
  }
  .btn-generate.ready:hover { opacity:0.9; transform:translateY(-1px); }
  .btn-generate.disabled {
    background:#1a1a2a; color:#333; cursor:not-allowed;
  }

  .btn-reset {
    background:transparent; border:1px solid #1e1e2e;
    color:#555; border-radius:10px; padding:9px 20px;
    font-size:0.85rem; cursor:pointer; width:100%;
    max-width:700px; margin-top:8px; display:block;
    font-family:'Segoe UI',sans-serif;
    position:relative; z-index:1;
  }
  .btn-reset:hover { border-color:#6c63ff; color:#a09cf7; }

  /* Preview img */
  .preview-img {
    width:100%; border-radius:10px; margin-top:16px;
    border:1px solid #1e1e2e; max-height:260px;
    object-fit:cover;
  }

  /* Progress */
  .progress-bar-bg {
    background:#0d0d14; border-radius:999px;
    height:6px; width:100%; margin-bottom:24px;
    overflow:hidden;
  }
  .progress-bar-fill {
    height:100%; border-radius:999px;
    background:linear-gradient(90deg,#6c63ff,#a09cf7);
    transition:width 0.6s ease;
  }

  /* Step list */
  .step-item {
    display:flex; align-items:flex-start;
    gap:12px; padding:10px 0;
    border-bottom:1px solid #1a1a2a;
    font-size:0.875rem; transition:color 0.4s;
    color:#f0f0f0;
    font-family:'Segoe UI',sans-serif;
  }
  .step-dot {
    width:8px; height:8px; border-radius:50%;
    margin-top:4px; flex-shrink:0;
    transition:background 0.4s;
  }

  /* Status cards */
  .status-success {
    background:#0a1a12; border:1px solid #1a3a22;
    border-radius:12px; padding:20px 24px;
    width:100%; max-width:700px; margin-bottom:20px;
    font-size:0.875rem; color:#6ee7a0; line-height:1.7;
    position:relative; z-index:1;
    font-family:'Segoe UI',sans-serif;
  }
  .status-error {
    background:#1a0a0a; border:1px solid #3a1a1a;
    border-radius:12px; padding:20px 24px;
    width:100%; max-width:700px; margin-bottom:20px;
    font-size:0.875rem; color:#f87171; line-height:1.7;
    position:relative; z-index:1;
    font-family:'Segoe UI',sans-serif;
  }

  /* Video */
  .video-wrap {
    width:100%; max-width:700px;
    background:#12121a; border:1px solid #1e1e2e;
    border-radius:16px; padding:24px;
    margin-bottom:20px; position:relative; z-index:1;
  }
  video { width:100%; border-radius:10px; background:#000; outline:none; }
  .btn-download {
    display:block; width:100%; margin-top:14px;
    padding:11px; border-radius:10px;
    border:1px solid #6c63ff; background:transparent;
    color:#a09cf7; font-size:0.9rem; font-weight:500;
    cursor:pointer; text-align:center;
    text-decoration:none; transition:background 0.2s;
    font-family:'Segoe UI',sans-serif;
  }
  .btn-download:hover { background:#1a1730; }

  /* About page */
  .about-wrap {
    position:relative; z-index:1;
    width:100%; max-width:900px;
    margin:0 auto; padding:40px 20px;
    font-family:'Segoe UI',sans-serif;
    color:#f0f0f0;
  }
  .about-hero {
    text-align:center; margin-bottom:60px;
  }
  .about-hero h1 {
    font-size:2.4rem; font-weight:700;
    color:#fff; margin-bottom:12px;
  }
  .about-hero p {
    color:#666; font-size:1rem; max-width:560px;
    margin:0 auto; line-height:1.7;
  }
  .features-grid {
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(260px,1fr));
    gap:16px; margin-bottom:48px;
  }
  .feature-card {
    background:#12121a; border:1px solid #1e1e2e;
    border-radius:14px; padding:22px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .feature-card:hover {
    border-color:#6c63ff44;
    transform:translateY(-2px);
  }
  .feature-icon { font-size:1.8rem; margin-bottom:10px; }
  .feature-title {
    font-size:0.95rem; font-weight:600;
    color:#fff; margin-bottom:6px;
  }
  .feature-desc { font-size:0.82rem; color:#555; line-height:1.6; }
  .feature-tag {
    display:inline-block; margin-top:10px;
    padding:3px 10px; border-radius:999px;
    font-size:0.7rem; font-weight:600;
    letter-spacing:0.5px;
  }
  .tag-current { background:#6c63ff22; color:#a09cf7; }
  .tag-soon    { background:#4ecdc422; color:#4ecdc4; }
  .tag-future  { background:#e9647922; color:#e96479; }

  .about-section-title {
    font-size:0.72rem; font-weight:700;
    color:#6c63ff; text-transform:uppercase;
    letter-spacing:2px; margin-bottom:20px;
  }
  .roadmap-item {
    display:flex; gap:16px; margin-bottom:16px;
    align-items:flex-start;
  }
  .roadmap-dot {
    width:10px; height:10px; border-radius:50%;
    flex-shrink:0; margin-top:4px;
  }
  .roadmap-text { font-size:0.875rem; color:#888; line-height:1.6; }
  .roadmap-text strong { color:#ccc; }
  @media (max-width: 600px) {
    .nav { padding: 14px 20px; }
    .nav-logo { font-size: 1.2rem; }
    .nav-btn { padding: 7px 12px; font-size: 0.8rem; }
    .card { padding: 20px 16px; }
    .tab { padding: 8px; font-size: 0.8rem; }
    .about-hero h1 { font-size: 1.8rem; }
    .features-grid { grid-template-columns: 1fr; }
    .btn-generate { font-size: 0.9rem; padding: 12px; }
    .video-wrap { padding: 16px; }
    select { font-size: 0.8rem; }
    textarea { font-size: 0.875rem; }
  }

  @media (max-width: 900px) {
    .features-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

document.head.appendChild(styleTag);

// ── Constants ────────────────────────────────────────────────
const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","History","Programming","Other"];
const LEVELS   = ["Primary school","High school","Undergraduate","Professional"];

// ── About page data ──────────────────────────────────────────
const FEATURES = [
  {
    icon:"✅", title:"Text Input",
    desc:"Paste any question, problem or topic and get a full explanation video.",
    tag:"current", label:"Live now",
  },
  {
    icon:"✅", title:"Image Upload",
    desc:"Upload a photo of a textbook, handwritten notes or whiteboard for OCR extraction.",
    tag:"current", label:"Live now",
  },
  {
    icon:"✅", title:"Math Solver",
    desc:"Quadratic, linear, arithmetic and percentage problems solved symbolically step by step.",
    tag:"current", label:"Live now",
  },
  {
    icon:"✅", title:"AI Voiceover",
    desc:"Microsoft Edge Neural TTS reads each step aloud in natural human voice.",
    tag:"current", label:"Live now",
  },
  {
    icon:"🔜", title:"PDF & DOCX Upload",
    desc:"Upload lecture notes, textbooks or assignments as PDF or Word files for automatic explanation.",
    tag:"soon", label:"Coming soon",
  },
  {
    icon:"🔜", title:"YouTube Script Export",
    desc:"Export your explanation as a ready-to-use YouTube script with timestamps and chapter markers.",
    tag:"soon", label:"Coming soon",
  },
  {
    icon:"🔜", title:"Instagram Reel Format",
    desc:"Auto-generate 60-second vertical explanation videos optimised for Instagram and TikTok.",
    tag:"soon", label:"Coming soon",
  },
  {
    icon:"🔜", title:"Note Creation & Download",
    desc:"Auto-generate a clean PDF study note from any explanation with headings, steps and diagrams.",
    tag:"soon", label:"Coming soon",
  },
  {
    icon:"🔜", title:"Multi-language Voiceover",
    desc:"Generate explanations in Hindi, Arabic, Spanish, French and 40+ other languages.",
    tag:"soon", label:"Coming soon",
  },
  {
    icon:"🚀", title:"Anime Teacher Character",
    desc:"An animated anime-style teacher character acts out the explanation, pointing to slides and gesturing naturally — like a real classroom.",
    tag:"future", label:"Future",
  },
  {
    icon:"🚀", title:"Real Face Avatar",
    desc:"Upload your own face photo and a digital avatar that looks like you delivers the explanation — perfect for personal branding.",
    tag:"future", label:"Future",
  },
  {
    icon:"🚀", title:"Digital Marketing Pack",
    desc:"One click generates a carousel post, short video, email newsletter and ad copy from any topic — ready for all platforms.",
    tag:"future", label:"Future",
  },
  {
    icon:"🚀", title:"Story Mode",
    desc:"Converts any topic into an animated story with characters, narration and plot — ideal for history, biology and social science.",
    tag:"future", label:"Future",
  },
  {
    icon:"🚀", title:"Live Whiteboard Mode",
    desc:"AI draws diagrams, equations and mind maps on a virtual whiteboard in real time as the voiceover explains each step.",
    tag:"future", label:"Future",
  },
  {
    icon:"🚀", title:"Student Quiz Generator",
    desc:"After every explanation, auto-generate 5 MCQ questions to test understanding and track progress over time.",
    tag:"future", label:"Future",
  },
  {
    icon:"🚀", title:"Course Builder",
    desc:"Chain multiple topics together into a full structured course with chapters, progress tracking and certificates.",
    tag:"future", label:"Future",
  },
];

const ROADMAP = [
  { color:"#6c63ff", title:"Phase 1–4 (Complete)", desc:"Core pipeline — OCR, AI script, TTS voiceover, visual frames, video assembly. Math solver. Single file architecture." },
  { color:"#4ecdc4", title:"Phase 5 — Content Formats", desc:"PDF upload, DOCX support, note download, YouTube script export, Instagram reel generator." },
  { color:"#4ecdc4", title:"Phase 6 — Multi-language", desc:"40+ language voiceovers, RTL script support, regional math notation." },
  { color:"#e96479", title:"Phase 7 — Avatar Engine", desc:"Anime teacher character with lip sync, real face avatar from photo, gesture animation system." },
  { color:"#e96479", title:"Phase 8 — Creator Studio", desc:"Digital marketing pack, brand kit, scheduled posting to YouTube/Instagram, analytics dashboard." },
  { color:"#e96479", title:"Phase 9 — AI Classroom", desc:"Quiz generation, course builder, student progress tracking, certificate generation, LMS integration." },
];

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage]             = useState("home");
  const [tab, setTab]               = useState("image");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setPreview]  = useState(null);
  const [textInput, setTextInput]   = useState("");
  const [subject, setSubject]       = useState(SUBJECTS[0]);
  const [level, setLevel]           = useState(LEVELS[1]);
  const [dragging, setDragging]     = useState(false);
  const [status, setStatus]         = useState("idle");
  const [steps, setSteps]           = useState([]);
  const [videoUrl, setVideoUrl]     = useState(null);
  const [errorMsg, setErrorMsg]     = useState("");
  const [qType, setQType]           = useState("");
  const fileRef = useRef();

  const isReady = status !== "loading" &&
    (tab === "image" ? imageFile !== null : textInput.trim().length > 3);

  function handleImagePick(e) {
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please upload an image."); return; }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setDragging(false);
  }

  function handleReset() {
    setTab("image"); setImageFile(null); setPreview(null);
    setTextInput(""); setStatus("idle"); setSteps([]);
    setVideoUrl(null); setErrorMsg(""); setQType("");
  }

  async function handleGenerate() {
    if (!isReady) return;
    setStatus("loading"); setSteps([]); setVideoUrl(null); setErrorMsg("");

    try {
      let response;

      if (tab === "image") {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("subject", subject);
        formData.append("level", level);
        setSteps(["Uploading image to server..."]);
        response = await fetch("https://picto-pro-backend.onrender.com/api/generate/image", {
          method: "POST", body: formData,
        });
      } else {
        setSteps(["Sending text to server..."]);
        response = await fetch("https://picto-pro-backend.onrender.com/api/generate/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput, subject, level }),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server error");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setQType(data.qType || "");
      setSteps([]);
      for (let i = 0; i < (data.steps || []).length; i++) {
        await new Promise((r) => setTimeout(r, 350));
        setSteps((prev) => [...prev, data.steps[i]]);
      }
      if (data.videoUrl) setVideoUrl(data.videoUrl);
      setStatus("done");

    } catch (err) {
      let msg = err.message || "Something went wrong.";
      if (msg.includes("fetch") || msg.includes("Failed to fetch"))
        msg = "Cannot reach backend. Make sure 'node server.js' is running on port 4000.";
      if (msg.includes("ffmpeg") || msg.includes("concat"))
        msg = "Video creation failed. Make sure FFmpeg is installed and in your Windows PATH.";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  const stageLabel = [
    "Connecting to server...",
    tab === "image" ? "Running OCR on image..." : "Reading your input...",
    "AI generating script...",
    "Creating voiceover audio...",
    "Drawing visual frames...",
    "Assembling final video...",
  ][Math.min(steps.length, 5)];

  const qBadgeColor = qType === "math" ? "#e96479" : qType === "theory" ? "#4ecdc4" : "#f5a623";
  const qBadgeLabel = qType === "math" ? "MATH" : qType === "theory" ? "THEORY" : qType === "problem" ? "PROBLEM" : "";

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <>
      {/* Animated background */}
      <div className="bg-anim"><div className="bg-dot"/></div>
      <div className="bg-grid"/>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">Picto<span>PRO</span></div>
        <div className="nav-links">
          <button
            className={`nav-btn ${page==="home"?"active":"inactive"}`}
            onClick={() => { setPage("home"); handleReset(); }}
          >Home</button>
          <button
            className={`nav-btn ${page==="about"?"active":"inactive"}`}
            onClick={() => setPage("about")}
          >About & Roadmap</button>
        </div>
      </nav>

      {/* ── HOME PAGE ── */}
      {page === "home" && (
        <div style={{
          display:"flex", flexDirection:"column",
          alignItems:"center", padding:"40px 20px",
          fontFamily:"'Segoe UI',sans-serif", color:"#f0f0f0",
          position:"relative", zIndex:1,
        }}>
          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <div style={{ fontSize:"2.4rem", fontWeight:700, color:"#fff", letterSpacing:"-1px" }}>
              Picto<span style={{ color:"#6c63ff" }}>PRO</span>
            </div>
            <div style={{ fontSize:"0.95rem", color:"#555", marginTop:"8px" }}>
              Turn any problem into a step-by-step AI explanation video
            </div>
          </div>

          {/* Input card */}
          {status === "idle" && (
            <div className="card fade-in">
              <div className="section-title">Step 1 — Choose input</div>
              <div className="tab-row">
                <button className={`tab ${tab==="image"?"active":"inactive"}`} onClick={()=>setTab("image")}>
                  📷 Upload image
                </button>
                <button className={`tab ${tab==="text"?"active":"inactive"}`} onClick={()=>setTab("text")}>
                  ✏️ Paste text
                </button>
              </div>

              {tab==="image" && (
                <>
                  <div
                    className={`upload-box ${dragging?"drag":""}`}
                    onClick={()=>fileRef.current.click()}
                    onDragOver={(e)=>{e.preventDefault();setDragging(true);}}
                    onDragLeave={()=>setDragging(false)}
                    onDrop={(e)=>{e.preventDefault();handleImagePick(e);}}
                  >
                    <div className="upload-icon">🖼️</div>
                    <div className="upload-text">
                      {imageFile ? `✅  ${imageFile.name}` : "Drag & drop or click to browse\nJPG · PNG · WEBP · max 10MB"}
                    </div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*"
                    style={{display:"none"}} onChange={handleImagePick}/>
                  {imagePreview &&
                    <img src={imagePreview} alt="preview" className="preview-img"/>}
                </>
              )}

              {tab==="text" && (
                <>
                  <textarea
                    placeholder={"Paste your question, math problem, or topic here...\n\nExamples:\n• Solve: 2x² + 5x - 3 = 0\n• Explain photosynthesis\n• What is Newton's second law?"}
                    value={textInput}
                    onChange={(e)=>setTextInput(e.target.value)}
                  />
                  <div style={{textAlign:"right",fontSize:"0.75rem",color:"#333",marginTop:"6px"}}>
                    {textInput.length} chars
                  </div>
                </>
              )}

              <div style={{marginTop:"20px"}}>
                <div className="section-title">Step 2 — Set context</div>
                <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:"140px"}}>
                    <div style={{fontSize:"0.75rem",color:"#444",marginBottom:"6px"}}>Subject</div>
                    <select value={subject} onChange={(e)=>setSubject(e.target.value)}>
                      {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{flex:1,minWidth:"140px"}}>
                    <div style={{fontSize:"0.75rem",color:"#444",marginBottom:"6px"}}>Level</div>
                    <select value={level} onChange={(e)=>setLevel(e.target.value)}>
                      {LEVELS.map(l=><option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button
                className={`btn-generate ${isReady?"ready":"disabled"}`}
                onClick={handleGenerate}
                disabled={!isReady}
              >
                {isReady ? "✨ Generate explanation video" : "Add input to continue →"}
              </button>
            </div>
          )}

          {/* Loading */}
          {status==="loading" && (
            <div className="card fade-in">
              <div className="section-title" style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{
                  display:"inline-block",width:"8px",height:"8px",
                  borderRadius:"50%",background:"#6c63ff",
                  animation:"pulse 1.2s infinite",
                }}/>
                Generating your explanation video...
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{
                  width: steps.length===0?"5%":`${Math.min(92,steps.length*15)}%`,
                }}/>
              </div>
              <ul style={{listStyle:"none",padding:0,margin:0}}>
                {steps.map((s,i)=>(
                  <li key={i} className="step-item" style={{
                    color: i===steps.length-1?"#f0f0f0":"#444",
                  }}>
                    <span className="step-dot" style={{
                      background: i===steps.length-1?"#6c63ff":"#1e1e2e",
                    }}/>
                    {s}
                  </li>
                ))}
              </ul>
              <div style={{marginTop:"16px",fontSize:"0.78rem",color:"#333",textAlign:"center"}}>
                {stageLabel}
              </div>
            </div>
          )}

          {/* Done */}
          {status==="done" && (
            <>
              <div className="status-success fade-in">
                ✅ Video generated successfully
                {qBadgeLabel && (
                  <span style={{
                    marginLeft:"12px", padding:"2px 10px",
                    borderRadius:"999px", fontSize:"0.7rem",
                    fontWeight:700, background:`${qBadgeColor}22`,
                    color:qBadgeColor,
                  }}>{qBadgeLabel}</span>
                )}
                <br/>
                <span style={{color:"#3a5a44",fontSize:"0.8rem"}}>
                  Subject: {subject} · Level: {level}
                </span>
              </div>

              {videoUrl ? (
                <div className="video-wrap fade-in">
                  <div className="section-title">▶ Your explanation video</div>
                  <video controls src={videoUrl}/>
                  <a href={videoUrl} download="picto-pro.mp4" className="btn-download">
                    ⬇ Download video
                  </a>
                </div>
              ) : (
                <div className="card fade-in" style={{color:"#333",fontSize:"0.875rem"}}>
                  Video URL not returned. Check backend terminal for errors.
                </div>
              )}

              {/* Script steps */}
              <div className="card fade-in">
                <div className="section-title">Script generated</div>
                <ul style={{listStyle:"none",padding:0,margin:0}}>
                  {steps.map((s,i)=>(
                    <li key={i} className="step-item">
                      <span className="step-dot" style={{background:"#6c63ff"}}/>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="btn-reset" onClick={handleReset}>↩ Start over</button>
            </>
          )}

          {/* Error */}
          {status==="error" && (
            <>
              <div className="status-error fade-in">⚠ {errorMsg}</div>
              <button className="btn-reset" onClick={handleReset}>↩ Try again</button>
            </>
          )}
        </div>
      )}

      {/* ── ABOUT PAGE ── */}
      {page === "about" && (
        <div className="about-wrap fade-in">
         <div className="about-hero">
           <h1>Picto<span style={{color:"#6c63ff"}}>PRO</span></h1>
              <p>
                An AI-powered educational video platform that turns any question,
                problem or topic into a fully explained, voiced, and visualised video —
                running 100% locally with no API keys and no limits.
             </p>


  {/* Current system limits */}
  <div style={{
    marginTop:"32px", background:"#12121a",
    border:"1px solid #2a1a1a", borderRadius:"12px",
    padding:"20px 24px", textAlign:"left", maxWidth:"600px",
    margin:"32px auto 0",
  }}>
    <div style={{fontSize:"0.72rem",color:"#e96479",letterSpacing:"2px",
      textTransform:"uppercase",marginBottom:"14px",fontWeight:700}}>
      Current System — Honest Limitations
    </div>
    {[
      ["🧮","Math","Solves linear, quadratic, percentage, geometry, speed-distance-time, simple interest. Complex calculus, matrices, integration not yet supported."],
      ["🧠","AI Model","Uses LaMini-Flan-T5 (248MB) — works well for theory. For complex multi-step derivations the fallback script activates."],
      ["📄","Input types","Image (JPG/PNG/WEBP) and text paste only. PDF, DOCX, and handwriting recognition coming in Phase 5."],
      ["🌐","Languages","English only currently. 40+ language voiceover support planned for Phase 6."],
      ["👤","Avatar","No animated character yet. Anime teacher and real-face avatar planned for Phase 7."],
      ["⏱","Video length","Best results for problems with 6–15 steps. Very long derivations may be split into parts."],
    ].map(([icon,title,desc],i)=>(
      <div key={i} style={{display:"flex",gap:"12px",marginBottom:"12px",
        paddingBottom:"12px",borderBottom:i<5?"1px solid #1a1a1a":"none"}}>
        <span style={{fontSize:"1.2rem",flexShrink:0}}>{icon}</span>
        <div>
          <div style={{fontSize:"0.85rem",fontWeight:600,color:"#ccc",marginBottom:"3px"}}>{title}</div>
          <div style={{fontSize:"0.8rem",color:"#555",lineHeight:"1.6"}}>{desc}</div>
        </div>
      </div>
    ))}
  </div>
</div>
          {/* Current + future features */}
          <div className="about-section-title">Features — Current & Planned</div>
          <div className="features-grid">
            {FEATURES.map((f,i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
                <span className={`feature-tag tag-${f.tag}`}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Roadmap */}
          <div className="about-section-title" style={{marginTop:"40px"}}>
            Development Roadmap
          </div>
          <div className="card" style={{maxWidth:"900px"}}>
            {ROADMAP.map((r,i) => (
              <div key={i} className="roadmap-item">
                <div className="roadmap-dot" style={{background:r.color}}/>
                <div className="roadmap-text">
                  <strong>{r.title} — </strong>{r.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div className="about-section-title" style={{marginTop:"40px"}}>
            Current Tech Stack — 100% Free & Local
          </div>
          <div className="features-grid">
            {[
              {icon:"🔍",title:"Tesseract.js",desc:"OCR — reads text from any uploaded image locally."},
              {icon:"🧠",title:"Transformers.js",desc:"LaMini-Flan-T5 248M — AI script generation, runs in Node.js with no GPU."},
              {icon:"🗣️",title:"Edge-TTS",desc:"Microsoft Neural voices — free, unlimited, 40+ languages."},
              {icon:"🎨",title:"Python Pillow",desc:"Draws 1280×720 explanation slides with progress bar and badges."},
              {icon:"🎬",title:"FFmpeg",desc:"Combines frames and audio into a final MP4 video locally."},
              {icon:"⚛️",title:"React + Node.js",desc:"Single-file frontend and backend — simple, fast, no database needed."},
            ].map((s,i)=>(
              <div key={i} className="feature-card">
                <div className="feature-icon">{s.icon}</div>
                <div className="feature-title">{s.title}</div>
                <div className="feature-desc">{s.desc}</div>
                <span className="feature-tag tag-current">Active</span>
              </div>
            ))}
            
          </div>

        <div style={{textAlign:"center",marginTop:"48px",paddingBottom:"20px"}}>
          <div style={{fontSize:"0.8rem",color:"#2a2a3a",marginBottom:"8px"}}>
            PictoPRO — Built phase by phase · Groq AI · No Paid APIs · Free Forever
          </div>
          <div style={{fontSize:"0.78rem",color:"#6c63ff44"}}>
            Developed by Mohammed Irfan A
          </div>
        </div>
          
        </div>
        
      )}
        {/* ── FOOTER ── */}
        <footer style={{
          position: "relative", zIndex: 1,
          borderTop: "1px solid #1a1a2a",
          marginTop: "60px", padding: "40px 20px",
          textAlign: "center",
          fontFamily: "'Segoe UI',sans-serif",
          background: "#0a0a0f",
        }}>
          <div style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "28px 48px",
            background: "#12121a",
            border: "1px solid #1e1e2e",
            borderRadius: "20px",
            maxWidth: "420px",
            width: "100%",
          }}>
            {/* Logo */}
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
              Picto<span style={{ color: "#6c63ff" }}>PRO</span>
            </div>

            {/* Divider */}
            <div style={{ width: "40px", height: "2px", background: "#6c63ff", borderRadius: "2px" }}/>

            {/* Developer */}
            <div>
              <div style={{
                fontSize: "0.68rem", color: "#6c63ff",
                letterSpacing: "2.5px", textTransform: "uppercase",
                fontWeight: 700, marginBottom: "6px",
              }}>
                Developed by
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>
                Mohammed Irfan A
              </div>
              <div style={{ fontSize: "0.8rem", color: "#555", marginTop: "3px" }}>
                Full Stack AI Developer
              </div>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <a 
                href="https://github.com/mhdirfan-dev"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "0.75rem", color: "#6c63ff",
                  textDecoration: "none", padding: "4px 12px",
                  border: "1px solid #6c63ff33", borderRadius: "999px",
                  transition: "background 0.2s",
                }}
              >GitHub</a>
              
              <a 
                href="https://github.com/mhdirfan-dev/picto-pro"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "0.75rem", color: "#6c63ff",
                  textDecoration: "none", padding: "4px 12px",
                  border: "1px solid #6c63ff33", borderRadius: "999px",
                }}
              >Frontend Repo</a>
              
              <a 
                href="https://github.com/mhdirfan-dev/picto-pro-backend"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "0.75rem", color: "#6c63ff",
                  textDecoration: "none", padding: "4px 12px",
                  border: "1px solid #6c63ff33", borderRadius: "999px",
                }}
              >Backend Repo</a>
            </div>

            {/* Bottom line */}
            <div style={{
              paddingTop: "14px",
              borderTop: "1px solid #1a1a2a",
              width: "100%",
              fontSize: "0.72rem", color: "#2a2a3a",
              textAlign: "center",
            }}>
              PictoPRO · Groq AI · No Paid APIs · Free Forever
            </div>
          </div>
        </footer>
    </>
  );
}