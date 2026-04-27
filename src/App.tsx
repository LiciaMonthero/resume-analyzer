import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, ChevronRight, Sparkles, Target, AlertTriangle, Lightbulb, MessageSquare } from 'lucide-react';
import './index.css';

// --- Types ---
interface AnalysisResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  improvements: string[];
  interviewQuestions: string[];
}

// --- Mock AI Backend ---
const mockAnalyze = (_jd: string, _fileName: string): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dummy logic based on length or random to feel "real"
      const score = Math.floor(Math.random() * 40) + 50; // 50 - 90
      resolve({
        score,
        matchedSkills: ['React', 'TypeScript', 'Responsive Design', 'Git', 'Agile'],
        missingSkills: ['GraphQL', 'Docker', 'AWS', 'Next.js'],
        improvements: [
          'Quantify your achievements in the "Experience" section (e.g., "Improved load time by 30%").',
          'Add a dedicated "Projects" section highlighting open-source contributions.',
          'Your summary statement is a bit generic. Tailor it to the specific role emphasizing frontend architecture.',
          'Include links to live demos of your projects, not just GitHub repositories.'
        ],
        interviewQuestions: [
          'Can you describe a time you had to optimize a React application for performance?',
          'How do you manage state in a complex frontend application?',
          'We use GraphQL heavily. How would you approach learning it quickly?',
          'Tell me about a challenging bug you fixed recently and your debugging process.'
        ]
      });
    }, 4000);
  });
};

function App() {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  
  // Analyzing state
  const [loadingText, setLoadingText] = useState('Parsing resume...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file || !jd.trim()) return;
    setStep('analyzing');
    
    // Loading sequence
    const texts = ['Parsing resume...', 'Extracting key skills...', 'Matching with Job Description...', 'Generating AI insights...', 'Finalizing report...'];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < texts.length) setLoadingText(texts[i]);
    }, 800);

    const data = await mockAnalyze(jd, file.name);
    clearInterval(interval);
    setResults(data);
    setStep('results');
  };

  return (
    <div className="container">
      <header className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="glass-card" style={{ padding: '12px' }}>
            <Sparkles className="text-gradient" size={32} color="#8b5cf6" />
          </div>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2rem' }}>AI Resume Analyzer</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Optimize your resume for any job description</p>
          </div>
        </div>
        {step === 'results' && (
          <button className="btn btn-outline" onClick={() => { setStep('upload'); setFile(null); setJd(''); setResults(null); }}>
            Start New Analysis
          </button>
        )}
      </header>

      <main>
        {step === 'upload' && (
          <div className="grid gap-6 animate-fade-in" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="glass-card flex flex-col">
              <h2 className="mb-4 flex items-center gap-2">
                <FileText size={20} color="var(--primary)" />
                Upload Resume
              </h2>
              <div 
                className={`upload-zone flex-1 flex flex-col items-center justify-center ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <UploadCloud className="upload-icon" size={48} />
                {file ? (
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{file.name}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 500 }}>Drag & drop your resume here</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Supports PDF, DOCX, TXT</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card flex flex-col">
              <h2 className="mb-4 flex items-center gap-2">
                <Target size={20} color="var(--secondary)" />
                Job Description
              </h2>
              <textarea 
                className="flex-1"
                placeholder="Paste the job description here to analyze your resume against it..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                style={{ resize: 'none', minHeight: '250px' }}
              />
            </div>

            <div className="text-center" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={startAnalysis}
                disabled={!file || !jd.trim()}
                style={{ fontSize: '1.125rem', padding: '16px 48px' }}
              >
                <Sparkles size={20} />
                Analyze My Resume
              </button>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="glass-card animate-fade-in text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
              <div className="score-circle" style={{ width: '100px', height: '100px', animation: 'spin 2s linear infinite', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', background: 'transparent' }}></div>
              <Sparkles size={32} color="var(--primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 1.5s infinite' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{loadingText}</h2>
            <div className="progress-bg" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div className="progress-fill" style={{ width: '100%', animation: 'loading 4s ease-in-out forwards' }}></div>
            </div>
            <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
              @keyframes pulse { 0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); } }
              @keyframes loading { 0% { width: 0%; } 20% { width: 30%; } 50% { width: 60%; } 80% { width: 90%; } 100% { width: 100%; } }
            `}</style>
          </div>
        )}

        {step === 'results' && results && (
          <div className="grid gap-6 animate-fade-in">
            {/* Top Stats */}
            <div className="glass-card flex items-center justify-between delay-1">
              <div className="flex items-center gap-8">
                <div className="score-circle" style={{ '--score': `${results.score}%` } as React.CSSProperties}>
                  <div className="score-value">{results.score}<span style={{ fontSize: '1rem' }}>%</span></div>
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Match Score</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                    {results.score >= 80 ? 'Excellent match! Your resume strongly aligns with the job description.' : 
                     results.score >= 60 ? 'Good match. Consider adding some missing skills to improve your chances.' : 
                     'Low match. We recommend significant tailoring of your resume for this role.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
              {/* Left Column: Skills */}
              <div className="grid gap-6 delay-2" style={{ gridTemplateRows: 'auto auto' }}>
                <div className="glass-card">
                  <h3 className="mb-4 flex items-center gap-2">
                    <CheckCircle size={18} color="var(--success)" />
                    Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.matchedSkills.map((skill, i) => (
                      <span key={i} className="badge success">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="glass-card">
                  <h3 className="mb-4 flex items-center gap-2">
                    <XCircle size={18} color="var(--danger)" />
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.missingSkills.map((skill, i) => (
                      <span key={i} className="badge danger">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Insights */}
              <div className="grid gap-6 delay-3">
                <div className="glass-card">
                  <h3 className="mb-4 flex items-center gap-2 text-gradient">
                    <Lightbulb size={20} color="var(--primary)" />
                    Suggested Improvements
                  </h3>
                  <ul className="grid gap-4">
                    {results.improvements.map((imp, i) => (
                      <li key={i} className="flex gap-3 items-start p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                        <AlertTriangle size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: 'var(--text-primary)' }}>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card">
                  <h3 className="mb-4 flex items-center gap-2">
                    <MessageSquare size={20} color="var(--secondary)" />
                    Predicted Interview Questions
                  </h3>
                  <div className="grid gap-3">
                    {results.interviewQuestions.map((q, i) => (
                      <div key={i} className="flex gap-3 items-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                        <ChevronRight size={18} color="var(--text-secondary)" />
                        <span style={{ color: 'var(--text-primary)' }}>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
