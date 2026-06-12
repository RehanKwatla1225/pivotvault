import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import FailureExplorer from './pages/FailureExplorer';
import PostmortemPage from './pages/PostmortemPage';
import RiskScanner from './pages/RiskScanner';
import KnowledgeGraph from './pages/KnowledgeGraph';
import ConfessionWall from './pages/ConfessionWall';
import InsightsDashboard from './pages/InsightsDashboard';
import AiAssistant from './pages/AiAssistant';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<FailureExplorer />} />
            <Route path="/startup/:slug" element={<PostmortemPage />} />
            <Route path="/scan" element={<RiskScanner />} />
            <Route path="/graph" element={<KnowledgeGraph />} />
            <Route path="/confessions" element={<ConfessionWall />} />
            <Route path="/insights" element={<InsightsDashboard />} />
            <Route path="/assistant" element={<AiAssistant />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;