import React, { useState } from 'react';
import { Download, Edit2, Check, X } from 'lucide-react';

const BusinessModelCanvas = () => {
  const [editingSection, setEditingSection] = useState(null);
  const [canvasData, setCanvasData] = useState({
    keyPartners: [
      "OpenAI / Anthropic (LLM providers)",
      "Firecrawl (web scraping)",
      "Instantly.ai (email infrastructure)",
      "Cal.com (calendar booking)",
      "Supabase (database & auth)"
    ],
    keyActivities: [
      "AI agent development & optimization",
      "Prompt engineering",
      "Customer onboarding & training",
      "Email deliverability management",
      "Data enrichment & research quality",
      "Customer success & support"
    ],
    keyResources: [
      "Proprietary AI orchestration logic",
      "Multi-agent pipeline (Research, Message, Reply)",
      "Email deliverability infrastructure",
      "Customer database & research cache",
      "Technical team (developers, AI specialists)",
      "Industry-specific templates & playbooks"
    ],
    valuePropositions: [
      "10x cheaper than human SDRs ($188/mo vs $5000/mo)",
      "Hyper-personalized outreach at scale (AI research per lead)",
      "24/7 automated lead engagement",
      "3-5x higher reply rates vs generic cold emails",
      "Plug-and-play setup (launch in 48 hours)",
      "Full transparency (see AI reasoning for every decision)",
      "Compliance-first (auto-unsubscribe, GDPR ready)"
    ],
    customerRelationships: [
      "Self-service platform (dashboard)",
      "Onboarding concierge (first campaign setup)",
      "Community (best practices, templates)",
      "Email/chat support",
      "Quarterly business reviews (enterprise)",
      "Success metrics tracking & reporting"
    ],
    channels: [
      "Product-led growth (free trial → conversion)",
      "Content marketing (SEO, blog, case studies)",
      "LinkedIn outreach (meta: using our own tool)",
      "Partnerships (sales agencies, consultants)",
      "Referral program (20% commission)",
      "YouTube tutorials & demos"
    ],
    customerSegments: [
      "B2B SaaS startups (Series A-B, need pipeline)",
      "Sales agencies (white-label opportunity)",
      "SMB service companies (consulting, legal, finance)",
      "Recruiting firms (candidate outreach)",
      "Real estate brokers (investor outreach)",
      "E-commerce (B2B wholesale outreach)"
    ],
    costStructure: [
      "AI API costs (OpenAI/Anthropic): ~$30-50/1000 leads",
      "Firecrawl scraping: ~$50-100/month",
      "Instantly.ai reseller costs: ~$80/account",
      "Infrastructure (Railway, Supabase): ~$50-200/month",
      "Customer acquisition (CAC target: <$500)",
      "Team salaries (developers, support)",
      "Domain & email infrastructure maintenance"
    ],
    revenueStreams: [
      "Subscription SaaS (3 tiers):",
      "  - Starter: $197/mo (1,000 leads/mo)",
      "  - Growth: $497/mo (5,000 leads/mo)",
      "  - Scale: $997/mo (15,000 leads/mo)",
      "Setup fee: $500 (one-time, includes onboarding)",
      "Add-ons: Voice AI ($200/mo), LinkedIn ($100/mo)",
      "White-label licensing: $2,000/mo (agencies)",
      "Professional services: Custom integrations ($150/hr)"
    ]
  });

  const sections = [
    { id: 'keyPartners', title: 'Key Partners', color: 'bg-purple-50 border-purple-200' },
    { id: 'keyActivities', title: 'Key Activities', color: 'bg-blue-50 border-blue-200' },
    { id: 'keyResources', title: 'Key Resources', color: 'bg-blue-50 border-blue-200' },
    { id: 'valuePropositions', title: 'Value Propositions', color: 'bg-green-50 border-green-200' },
    { id: 'customerRelationships', title: 'Customer Relationships', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'channels', title: 'Channels', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'customerSegments', title: 'Customer Segments', color: 'bg-red-50 border-red-200' },
    { id: 'costStructure', title: 'Cost Structure', color: 'bg-orange-50 border-orange-200' },
    { id: 'revenueStreams', title: 'Revenue Streams', color: 'bg-teal-50 border-teal-200' }
  ];

  const handleEdit = (sectionId) => {
    setEditingSection(sectionId);
  };

  const handleSave = () => {
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const handleItemChange = (sectionId, index, value) => {
    const newData = { ...canvasData };
    newData[sectionId][index] = value;
    setCanvasData(newData);
  };

  const handleAddItem = (sectionId) => {
    const newData = { ...canvasData };
    newData[sectionId].push('');
    setCanvasData(newData);
  };

  const handleRemoveItem = (sectionId, index) => {
    const newData = { ...canvasData };
    newData[sectionId].splice(index, 1);
    setCanvasData(newData);
  };

  const exportToPDF = () => {
    window.print();
  };

  const renderSection = (section) => {
    const isEditing = editingSection === section.id;
    const items = canvasData[section.id];

    return (
      <div key={section.id} className={`border-2 rounded-lg p-4 ${section.color} h-full`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm uppercase tracking-wide">{section.title}</h3>
          {!isEditing ? (
            <button
              onClick={() => handleEdit(section.id)}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <Edit2 size={14} />
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="p-1 hover:bg-green-200 rounded transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-red-200 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(section.id, index, e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border rounded bg-white"
                    placeholder="Enter item..."
                  />
                  <button
                    onClick={() => handleRemoveItem(section.id, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <p className="text-xs leading-relaxed">• {item}</p>
              )}
            </div>
          ))}
          
          {isEditing && (
            <button
              onClick={() => handleAddItem(section.id)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add item
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start print:mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI SDR Business Model Canvas</h1>
            <p className="text-gray-600">Automated B2B Sales Development Platform</p>
          </div>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {/* Key Metrics Banner */}
        <div className="grid grid-cols-4 gap-4 mb-6 print:mb-4">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">$197-997</div>
            <div className="text-xs text-gray-600 mt-1">Monthly pricing</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">$0.19</div>
            <div className="text-xs text-gray-600 mt-1">Cost per lead</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">48hrs</div>
            <div className="text-xs text-gray-600 mt-1">Setup time</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">3-5x</div>
            <div className="text-xs text-gray-600 mt-1">Reply rate vs generic</div>
          </div>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-5 grid-rows-6 gap-4">
          {/* Row 1-2: Key Partners */}
          <div className="row-span-2">
            {renderSection(sections.find(s => s.id === 'keyPartners'))}
          </div>

          {/* Row 1: Key Activities */}
          <div className="row-span-1">
            {renderSection(sections.find(s => s.id === 'keyActivities'))}
          </div>

          {/* Row 1: Value Propositions */}
          <div className="row-span-2">
            {renderSection(sections.find(s => s.id === 'valuePropositions'))}
          </div>

          {/* Row 1: Customer Relationships */}
          <div className="row-span-1">
            {renderSection(sections.find(s => s.id === 'customerRelationships'))}
          </div>

          {/* Row 1-2: Customer Segments */}
          <div className="row-span-2">
            {renderSection(sections.find(s => s.id === 'customerSegments'))}
          </div>

          {/* Row 2: Key Resources */}
          <div className="row-span-1">
            {renderSection(sections.find(s => s.id === 'keyResources'))}
          </div>

          {/* Row 2: Channels */}
          <div className="row-span-1">
            {renderSection(sections.find(s => s.id === 'channels'))}
          </div>

          {/* Row 3: Cost Structure (spans 2.5 columns) */}
          <div className="col-span-2 row-span-1">
            {renderSection(sections.find(s => s.id === 'costStructure'))}
          </div>

          {/* Row 3: Revenue Streams (spans 2.5 columns) */}
          <div className="col-span-3 row-span-1">
            {renderSection(sections.find(s => s.id === 'revenueStreams'))}
          </div>
        </div>

        {/* Financial Projections */}
        <div className="mt-8 grid grid-cols-3 gap-6 print:mt-4">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-4 text-gray-900">Year 1 Projections</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customers (Month 12):</span>
                <span className="font-semibold">50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. MRR per customer:</span>
                <span className="font-semibold">$397</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Monthly Revenue:</span>
                <span className="font-bold text-green-600">$19,850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Revenue:</span>
                <span className="font-bold text-green-600">$238,200</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-4 text-gray-900">Unit Economics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">CAC (target):</span>
                <span className="font-semibold">$500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">LTV (24 months):</span>
                <span className="font-semibold">$9,528</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">LTV:CAC Ratio:</span>
                <span className="font-bold text-green-600">19:1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payback Period:</span>
                <span className="font-semibold">1.3 months</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-4 text-gray-900">Competitive Advantage</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">96% cheaper than human SDRs</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Proprietary multi-agent pipeline</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Full reasoning transparency</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">48-hour launch vs 6-week ramp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Go-to-Market Strategy */}
        <div className="mt-8 bg-white border-2 border-gray-200 rounded-lg p-6 print:mt-4">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Go-to-Market Strategy (First 90 Days)</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-blue-600 mb-2">Month 1: Foundation</h4>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Launch with 5 beta customers (free)</li>
                <li>• Collect 10+ case studies</li>
                <li>• Build content library (blog, videos)</li>
                <li>• Set up attribution tracking</li>
                <li>• Optimize onboarding flow</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-green-600 mb-2">Month 2: Traction</h4>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Open paid plans ($197-997/mo)</li>
                <li>• Launch referral program</li>
                <li>• Start LinkedIn outreach (meta)</li>
                <li>• Publish 2 case studies/week</li>
                <li>• Target: 20 paying customers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-purple-600 mb-2">Month 3: Scale</h4>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Launch partner program (agencies)</li>
                <li>• Paid ads (LinkedIn, Google)</li>
                <li>• Host weekly demo webinars</li>
                <li>• Release industry templates</li>
                <li>• Target: 50 total customers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default BusinessModelCanvas;