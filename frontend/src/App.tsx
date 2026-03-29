import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PasswordScanner from './pages/PasswordScanner';
import LeakRadar from './pages/LeakRadar';
import AppSandbox from './pages/AppSandbox';
import DataRights from './pages/DataRights';
import ImageCleaner from './pages/ImageCleaner';
import PrivacyScanner from './pages/PrivacyScanner';
import KnowledgeGraph from './pages/KnowledgeGraph';
import DifferentialPrivacy from './pages/DifferentialPrivacy';
import TrafficSniffer from './pages/TrafficSniffer';
import PhishingDetector from './pages/PhishingDetector';
import SafeWatermark from './pages/SafeWatermark';
import DataMarketplace from './pages/DataMarketplace';
import CyberEarth from './pages/CyberEarth';
import PrivacyCopilot from './components/PrivacyCopilot';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background-dark">
        <Navbar />
        <main className="flex-1 p-6 relative overflow-hidden">
          {/* 极客风网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 mt-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/password" element={<PasswordScanner />} />
              <Route path="/leak" element={<LeakRadar />} />
              <Route path="/sandbox" element={<AppSandbox />} />
              <Route path="/rights" element={<DataRights />} />
              <Route path="/exif" element={<ImageCleaner />} />
              <Route path="/nlp" element={<PrivacyScanner />} />
              <Route path="/graph" element={<KnowledgeGraph />} />
              <Route path="/dp" element={<DifferentialPrivacy />} />
              <Route path="/sniffer" element={<TrafficSniffer />} />
              <Route path="/phishing" element={<PhishingDetector />} />
              <Route path="/watermark" element={<SafeWatermark />} />
              <Route path="/marketplace" element={<DataMarketplace />} />
              <Route path="/earth" element={<CyberEarth />} />
            </Routes>
          </div>
          <PrivacyCopilot />
        </main>
      </div>
    </BrowserRouter>
  )
}
export default App;
