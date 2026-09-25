import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudent } from "../App.jsx";

// 3 Curated career paths tailored to public service and official statistics
const CAREER_TRACKS = [
  {
    id: "leadership",
    title: "Operational Statistical Leadership",
    tagline: "Field administration, national survey execution, and regional cadre leadership",
    color: "blue",
    badge: "Most Direct Promotion Route",
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    stages: [
      {
        id: "l1",
        role: "Statistical Officer (SO)",
        payLevel: "Level 8 (7th CPC)",
        isCurrent: true,
        experience: "Current Role",
        description: "Primary field survey coordination, respondent data verification, and preliminary validation checks.",
        benchmarks: {
          survey_design: 45,
          sampling_methods: 55,
          data_collection: 75,
          statistical_analysis: 60,
          data_visualization: 65,
          data_governance: 50,
        },
        responsibilities: [
          "Supervise field enumerator teams during National Sample Survey (NSS) rounds",
          "Ensure high-accuracy CAPI digital questionnaire capture",
          "Conduct field inspection and draft regional query notes",
        ],
      },
      {
        id: "l2",
        role: "Senior Statistical Officer (SSO)",
        payLevel: "Level 10 (₹56,100 - ₹1,77,500)",
        isTarget: true,
        experience: "3-5 Yrs + DPC Clearance",
        description: "Autonomous district survey management, multi-stage sampling frame adaptation, and non-sampling error reduction.",
        benchmarks: {
          survey_design: 75,
          sampling_methods: 75,
          data_collection: 85,
          statistical_analysis: 75,
          data_visualization: 80,
          data_governance: 70,
        },
        responsibilities: [
          "Design stratified multi-stage cluster sampling frames for district surveys",
          "Conduct regional microdata auditing and non-sampling error minimization",
          "Lead survey teams and mentor junior statistical officers",
        ],
      },
      {
        id: "l3",
        role: "Assistant Director of Surveys",
        payLevel: "Level 11 (₹67,700 - ₹2,08,700)",
        experience: "5+ Yrs in SSO Cadre",
        description: "Zonal survey planning, multi-ministry indicator alignment, and national questionnaire formulation.",
        benchmarks: {
          survey_design: 85,
          sampling_methods: 85,
          data_collection: 90,
          statistical_analysis: 82,
          data_visualization: 85,
          data_governance: 80,
        },
        responsibilities: [
          "Collaborate with NITI Aayog to finalize survey schedules and indicators",
          "Direct zonal field logistics and financial appropriations",
          "Formulate strategic capacity building initiatives for subordinate divisions",
        ],
      },
      {
        id: "l4",
        role: "Joint Director (Field Operations)",
        payLevel: "Level 13 (₹1,23,100 - ₹2,15,900)",
        experience: "Apex Selection",
        description: "National executive leadership of all regional offices, survey digitalization, and international statistical liaison.",
        benchmarks: {
          survey_design: 92,
          sampling_methods: 90,
          data_collection: 95,
          statistical_analysis: 88,
          data_visualization: 90,
          data_governance: 90,
        },
        responsibilities: [
          "Set national policy for nationwide survey operations and digital CAPI transition",
          "Represent India at the United Nations Statistical Commission (UNSC)",
          "Approve annual state-level statistical capacity allocations",
        ],
      },
    ],
  },
  {
    id: "analytics",
    title: "Data Science & Advanced Informatics",
    tagline: "Econometric forecasting, machine learning pipelines, and national data architectures",
    color: "indigo",
    badge: "High Growth Technical Track",
    icon: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    stages: [
      {
        id: "a1",
        role: "Statistical Officer (Informatics)",
        payLevel: "Level 8 (7th CPC)",
        isCurrent: true,
        experience: "Current Role",
        description: "Data pipeline validation, routine exploratory analysis, and automated summary chart generation.",
        benchmarks: {
          survey_design: 45,
          sampling_methods: 55,
          data_collection: 75,
          statistical_analysis: 65,
          data_visualization: 70,
          data_governance: 50,
        },
        responsibilities: [
          "Validate incoming digital datasets from field servers",
          "Automate routine tabulation routines with Python/R scripts",
          "Maintain division indicator databases and metadata catalogs",
        ],
      },
      {
        id: "a2",
        role: "Lead Statistical Analyst",
        payLevel: "Level 10 (₹56,100 - ₹1,77,500)",
        isTarget: true,
        experience: "3-5 Yrs + Analytics Specialization",
        description: "Advanced multivariate econometric modeling, nowcasting of CPI/IIP indices, and executive visual dashboards.",
        benchmarks: {
          survey_design: 60,
          sampling_methods: 70,
          data_collection: 80,
          statistical_analysis: 85,
          data_visualization: 90,
          data_governance: 68,
        },
        responsibilities: [
          "Develop predictive time-series models for monthly macro indicators",
          "Design interactive geospatial GIS dashboards for ministry leadership",
          "Lead division technical workshops on statistical programming",
        ],
      },
      {
        id: "a3",
        role: "Principal Data Scientist / Modeler",
        payLevel: "Level 11 (₹67,700 - ₹2,08,700)",
        experience: "Demonstrated Research Track Record",
        description: "AI-driven anomaly detection in national accounts, remote sensing satellite integration, and synthetic data models.",
        benchmarks: {
          survey_design: 65,
          sampling_methods: 80,
          data_collection: 85,
          statistical_analysis: 92,
          data_visualization: 94,
          data_governance: 78,
        },
        responsibilities: [
          "Fuse satellite imagery with agricultural crop cutting surveys for yield prediction",
          "Deploy machine learning algorithms for outlier and fraud detection in microdata",
          "Publish working papers in official national statistical bulletins",
        ],
      },
      {
        id: "a4",
        role: "Chief Data Officer (NDAP Platform)",
        payLevel: "Level 13 (₹1,23,100 - ₹2,15,900)",
        experience: "Senior Informatics Leadership",
        description: "Executive architecture of India's Open Government Data and inter-ministerial data exchange protocols.",
        benchmarks: {
          survey_design: 75,
          sampling_methods: 85,
          data_collection: 90,
          statistical_analysis: 95,
          data_visualization: 96,
          data_governance: 92,
        },
        responsibilities: [
          "Direct national sovereign data APIs across 50+ central ministries",
          "Oversee petabyte-scale national statistical cloud data lake",
          "Establish national AI ethics and data sharing standards",
        ],
      },
    ],
  },
  {
    id: "governance",
    title: "Policy Evaluation & Statistical Governance",
    tagline: "Public policy monitoring, DPDP Act compliance, and evidence-based governance advisory",
    color: "emerald",
    badge: "Policy Impact Track",
    icon: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    stages: [
      {
        id: "g1",
        role: "Statistical Officer (Governance)",
        payLevel: "Level 8 (7th CPC)",
        isCurrent: true,
        experience: "Current Role",
        description: "Microdata anonymization checks, metadata documentation, and data release compliance.",
        benchmarks: {
          survey_design: 45,
          sampling_methods: 55,
          data_collection: 75,
          statistical_analysis: 60,
          data_visualization: 65,
          data_governance: 55,
        },
        responsibilities: [
          "Apply k-anonymity masking protocols on household survey microdata",
          "Ensure data release compliance with the Collection of Statistics Act",
          "Maintain NDSAP national metadata repository records",
        ],
      },
      {
        id: "g2",
        role: "Senior Policy & Monitoring Analyst",
        payLevel: "Level 10 (₹56,100 - ₹1,77,500)",
        isTarget: true,
        experience: "3-5 Yrs + Policy Specialization",
        description: "Centrally Sponsored Scheme outcome evaluation, SDG localization tracking, and DPDP Act statutory compliance.",
        benchmarks: {
          survey_design: 70,
          sampling_methods: 72,
          data_collection: 80,
          statistical_analysis: 78,
          data_visualization: 82,
          data_governance: 82,
        },
        responsibilities: [
          "Conduct quasi-experimental impact evaluation of welfare schemes",
          "Audit compliance with the Digital Personal Data Protection (DPDP) Act",
          "Author policy briefs for the Committee of Secretaries",
        ],
      },
      {
        id: "g3",
        role: "Lead M&E Specialist (NITI Aayog / MoSPI)",
        payLevel: "Level 11 (₹67,700 - ₹2,08,700)",
        experience: "Senior Evaluation Track Record",
        description: "National Indicator Framework custodian, multi-sector randomized impact evaluations, and regulatory doctrine.",
        benchmarks: {
          survey_design: 80,
          sampling_methods: 82,
          data_collection: 85,
          statistical_analysis: 85,
          data_visualization: 88,
          data_governance: 92,
        },
        responsibilities: [
          "Oversee district SDG localization index across 766 districts",
          "Commission third-party impact assessments for major infrastructure outlays",
          "Liaise with multilateral development partners (World Bank, UNDP)",
        ],
      },
      {
        id: "g4",
        role: "Director of Statistical Governance",
        payLevel: "Level 13 (₹1,23,100 - ₹2,15,900)",
        experience: "Apex Regulatory Cadre",
        description: "Apex statutory authority on official statistics integrity, data privacy architecture, and statistical legislation.",
        benchmarks: {
          survey_design: 88,
          sampling_methods: 88,
          data_collection: 90,
          statistical_analysis: 90,
          data_visualization: 90,
          data_governance: 96,
        },
        responsibilities: [
          "Draft statutory revisions to the Collection of Statistics Act and Data Rules",
          "Chair the National Statistical Audit Committee",
          "Set data governance directives for government-wide AI adoption",
        ],
      },
    ],
  },
];

// Helper to compute match readiness between current/simulated scores and a role's benchmark
function calculateRoleFit(scores, benchmarks) {
  let totalWeights = 0;
  let earnedPoints = 0;
  const gaps = [];
  const strengths = [];

  for (const [skillKey, target] of Object.entries(benchmarks)) {
    const current = scores[skillKey] || 50;
    totalWeights += target;
    earnedPoints += Math.min(current, target);

    const diff = target - current;
    const name = skillKey.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

    if (diff > 0) {
      gaps.push({ skillKey, name, current, target, deficit: diff });
    } else {
      strengths.push({ skillKey, name, current, target, surplus: Math.abs(diff) });
    }
  }

  const readinessPct = Math.round((100 * earnedPoints) / Math.max(1, totalWeights));
  gaps.sort((a, b) => b.deficit - a.deficit);

  return {
    readinessPct,
    gaps,
    strengths,
    nextBestSkill: gaps[0] || null,
  };
}

export default function CareerPathGenerator() {
  const { student, competencies } = useStudent();

  // Baseline competency scores map
  const baselineScores = useMemo(() => {
    const map = {
      survey_design: 50,
      sampling_methods: 65,
      data_collection: 90,
      statistical_analysis: 70,
      data_visualization: 85,
      data_governance: 55,
    };
    if (competencies && competencies.length > 0) {
      competencies.forEach((c) => {
        if (c.id && map[c.id] !== undefined) {
          map[c.id] = c.current;
        }
      });
    }
    return map;
  }, [competencies]);

  // Dynamic simulated scores that can be adjusted in real time
  const [simulatedScores, setSimulatedScores] = useState({ ...baselineScores });
  const [activeTrackId, setActiveTrackId] = useState("leadership");
  const [selectedStageIndex, setSelectedStageIndex] = useState(1); // default to immediate target role (stage 2)
  const [aiCareerGoal, setAiCareerGoal] = useState("Fast-track to Senior Statistical Officer (DPC Review) in 12 months");
  const [aiAdvisorAdvice, setAiAdvisorAdvice] = useState(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  // Active track object
  const activeTrack = useMemo(
    () => CAREER_TRACKS.find((t) => t.id === activeTrackId) || CAREER_TRACKS[0],
    [activeTrackId]
  );

  // Compute readiness for all stages of active track under current simulated scores
  const trackEvaluations = useMemo(() => {
    return activeTrack.stages.map((stage) => {
      const fit = calculateRoleFit(simulatedScores, stage.benchmarks);
      return {
        ...stage,
        fit,
      };
    });
  }, [activeTrack, simulatedScores]);

  const activeStage = trackEvaluations[selectedStageIndex] || trackEvaluations[1];

  // Quick simulation actions: "Updates suggestions automatically as the employee gains new skills"
  const handleApplyReassessment = () => {
    setSimulatedScores((prev) => ({
      ...prev,
      survey_design: 78, // Jump from 50 to 78
      data_governance: 76, // Jump from 55 to 76
      sampling_methods: 82, // Jump from 65 to 82
    }));
  };

  const handleSimulateSurveyMastery = () => {
    setSimulatedScores((prev) => ({
      ...prev,
      survey_design: Math.min(100, prev.survey_design + 25),
    }));
  };

  const handleSimulateGovernanceMastery = () => {
    setSimulatedScores((prev) => ({
      ...prev,
      data_governance: Math.min(100, prev.data_governance + 20),
    }));
  };

  const handleResetScores = () => {
    setSimulatedScores({ ...baselineScores });
  };

  const handleGenerateAdvice = () => {
    setIsGeneratingAdvice(true);
    setTimeout(() => {
      setAiAdvisorAdvice({
        strategy: "Accelerated Promotion Preparation for Statistical Cadre (Level 10)",
        timeline: "6 - 9 Months to Departmental Promotion Committee (DPC) Eligibility",
        priorityMilestone:
          "Raise Survey Design from 50% to ≥75% via NSSTA Modular Workshop, and complete DPDP Act statutory microdata compliance on iGOT Karmayogi.",
        dpcScoreEstimate: "Current Readiness: " + activeStage.fit.readinessPct + "% → Post-Plan Readiness: 96%",
        steps: [
          {
            phase: "Month 1-2: Core Methodology",
            desc: "Complete Survey Design Fundamentals (iGOT) & take CogniPath Diagnostic Re-Test.",
          },
          {
            phase: "Month 3-4: Field Application",
            desc: "Lead one regional NSS multi-stage cluster validation and document error mitigation.",
          },
          {
            phase: "Month 5-6: Statutory Governance",
            desc: "Obtain DPDP Act 2023 Microdata Anonymization certification.",
          },
          {
            phase: "Month 7-9: Dossier Submission",
            desc: "Submit verified CogniPath competency badge report to Departmental Promotion Board.",
          },
        ],
      });
      setIsGeneratingAdvice(false);
    }, 450);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Career Trajectory & Mobility Engine
            </span>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              AI Powered Promotion Roadmap
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            AI Career Path Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Suggests future learning and career growth options based on what you are already good at.
            Evaluates your competency scores, identifies high-leverage promotion requirements, and adapts suggestions in real time as you gain new skills.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/training-roi"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Training ROI Dashboard</span>
            <span>&rarr;</span>
          </Link>
          <Link
            to="/learning-path"
            className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Start Learning Modules</span>
          </Link>
        </div>
      </div>

      {/* ── Active Officer Baseline Strip ── */}
      <div className="bg-gradient-to-r from-[#0F2F64] via-[#1E3A8A] to-[#2563EB] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-2xl -mr-24 -mt-24 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-black shrink-0">
              {student?.name?.split(" ").map((n) => n[0]).join("") || "KP"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{student?.name || "Krishna Patel"}</h2>
                <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {student?.role || "Statistical Officer"}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Current Pay Level 8 &bull; {student?.department || "Official Statistical System"} &bull;{" "}
                <span className="font-semibold text-emerald-300">Overall Competency: 68%</span>
              </p>
            </div>
          </div>

          {/* Superpowers pill summary */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
              <span className="text-[10px] uppercase font-bold text-blue-200 block tracking-wider">
                Natural Strengths (Superpowers)
              </span>
              <p className="text-xs font-bold text-white mt-0.5">
                Data Collection (90%) &bull; Data Visualization (85%)
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
              <span className="text-[10px] uppercase font-bold text-rose-200 block tracking-wider">
                Key Promotion Prerequisite
              </span>
              <p className="text-xs font-bold text-white mt-0.5">
                Survey Design (50% &rarr; Need 75%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Multiple Possible Career Tracks (Not Just One Fixed Route!) ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Multiple Career Pathways (3 Trajectories)
            </h2>
            <p className="text-xs text-slate-500">
              CogniPath AI analyzes what you&apos;re good at and generates diverse promotion pathways — not just one fixed ladder
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Select a pathway to explore role ladders & skill prerequisites
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {CAREER_TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId;
            // Quick preview readiness for immediate next role in this track
            const nextRole = track.stages[1];
            const fit = calculateRoleFit(simulatedScores, nextRole.benchmarks);

            return (
              <button
                key={track.id}
                onClick={() => {
                  setActiveTrackId(track.id);
                  setSelectedStageIndex(1); // focus on next target role
                }}
                className={`text-left p-5 rounded-2xl border transition-all relative ${
                  isSelected
                    ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {track.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {track.badge}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {track.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Next: <strong className="text-slate-800">{nextRole.role}</strong>
                  </span>
                  <span
                    className={`font-black px-2 py-0.5 rounded-md ${
                      fit.readinessPct >= 85
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {fit.readinessPct}% Ready
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Interactive Career Stepper Ladder ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Career Ladder Progression</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {activeTrack.title}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any stage below to inspect responsibilities, pay grade, and required competency benchmarks
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            4 Promotion Milestones
          </span>
        </div>

        {/* Stepper Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trackEvaluations.map((stage, idx) => {
            const isSelected = selectedStageIndex === idx;
            const isEligible = stage.fit.readinessPct >= 85;

            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStageIndex(idx)}
                className={`cursor-pointer p-4 rounded-xl border transition-all text-left relative ${
                  isSelected
                    ? "bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500"
                    : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                {stage.isCurrent && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                    Current Role
                  </span>
                )}
                {stage.isTarget && !stage.isCurrent && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Target Promotion ⭐
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Stage {idx + 1}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                  {stage.role}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{stage.payLevel}</p>

                {/* Readiness meter bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Role Match</span>
                    <span
                      className={`font-black ${
                        isEligible ? "text-emerald-700" : "text-blue-700"
                      }`}
                    >
                      {stage.fit.readinessPct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isEligible ? "bg-emerald-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${stage.fit.readinessPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active Stage Deep-Dive: Strengths, Gaps, and Next Best Skill ── */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Target Role Analysis & Skill Gaps (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Role Deep-Dive
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs font-medium text-slate-500">
                  {activeStage.experience}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {activeStage.role}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pay Commission Band: <strong className="text-slate-700">{activeStage.payLevel}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Overall Role Match
              </span>
              <span
                className={`text-2xl font-black ${
                  activeStage.fit.readinessPct >= 85
                    ? "text-emerald-600"
                    : activeStage.fit.readinessPct >= 70
                    ? "text-blue-600"
                    : "text-amber-600"
                }`}
              >
                {activeStage.fit.readinessPct}%
              </span>
              <span
                className={`block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                  activeStage.fit.readinessPct >= 85
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {activeStage.fit.readinessPct >= 85
                  ? "DPC Review Ready ✓"
                  : "Active Upskilling Needed"}
              </span>
            </div>
          </div>

          {/* Description & Responsibilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Role Scope & Government Mandate
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {activeStage.description}
            </p>
          </div>

          {/* Actionable Skill Gaps to Close */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Competencies to Build Next (Gaps for this Role)
              </h4>
              <span className="text-xs text-slate-400">
                {activeStage.fit.gaps.length} skills to strengthen
              </span>
            </div>

            {activeStage.fit.gaps.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-sm font-bold text-emerald-800 block">
                  🎉 All competency benchmarks achieved for this role!
                </span>
                <span className="text-xs text-emerald-700">
                  You satisfy all technical benchmarks set by the Departmental Promotion Committee.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {activeStage.fit.gaps.map((gap) => (
                  <div
                    key={gap.skillKey}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="font-bold text-slate-900">{gap.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          Current: <strong>{gap.current}%</strong> &bull; Target:{" "}
                          <strong>{gap.target}%</strong>
                        </span>
                        <span className="font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md text-[11px]">
                          Need +{gap.deficit}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all"
                        style={{ width: `${(gap.current / gap.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* What you are already good at */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
              <span>✅</span>
              <span>What You&apos;re Already Good At (Exceeds Benchmark)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeStage.fit.strengths.map((str) => (
                <span
                  key={str.skillKey}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  <span>✓</span>
                  <span>{str.name}:</span>
                  <strong>{str.current}%</strong>
                  <span className="text-[10px] text-emerald-600">
                    (+{str.surplus}% above requirement)
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Skill Simulator & Next Best Skill (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Highlight Card: Next Best Skill to Learn */}
          {activeStage.fit.nextBestSkill && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>#1 Highest-Leverage Skill to Build</span>
                </span>
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  Priority
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-blue-950">
                  {activeStage.fit.nextBestSkill.name}
                </h4>
                <p className="text-xs text-blue-900/80 mt-1">
                  Closing this <strong>+{activeStage.fit.nextBestSkill.deficit}%</strong> gap delivers the largest single jump in your promotion board match rating.
                </p>
              </div>

              <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-blue-200/60 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Recommended Training:</span>
                <p className="text-slate-600">
                  &ldquo;Survey Design Fundamentals & Questionnaire Pre-Testing&rdquo; via NSSTA & iGOT Karmayogi (14 Hours)
                </p>
              </div>

              <Link
                to="/learning-path"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <span>Enroll in Learning Path</span>
                <span>&rarr;</span>
              </Link>
            </div>
          )}

          {/* Interactive Skill Gain Simulator Panel */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>🎛️</span>
                  <span>Live Skill Gain Simulator</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Updates suggestions automatically as you gain new skills
                </p>
              </div>
              <button
                onClick={handleResetScores}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600"
              >
                Reset
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Simulation Presets:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={handleApplyReassessment}
                  className="text-left p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-xs font-bold text-emerald-900 transition-all flex items-center justify-between"
                >
                  <span>Apply Post-Training Re-Assessment Scores</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">
                    +28% Uplift
                  </span>
                </button>

                <button
                  onClick={handleSimulateSurveyMastery}
                  className="text-left p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-xs font-semibold text-blue-900 transition-all flex items-center justify-between"
                >
                  <span>Simulate Survey Design Completion</span>
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black">
                    +25%
                  </span>
                </button>

                <button
                  onClick={handleSimulateGovernanceMastery}
                  className="text-left p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-xs font-semibold text-purple-900 transition-all flex items-center justify-between"
                >
                  <span>Simulate DPDP Act Certification</span>
                  <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-black">
                    +20%
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive Sliders for Core Skills */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Adjust Competencies Manually:
              </span>

              {/* Slider 1: Survey Design */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Survey Design</span>
                  <span className="font-black text-blue-600">{simulatedScores.survey_design}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={simulatedScores.survey_design}
                  onChange={(e) =>
                    setSimulatedScores({
                      ...simulatedScores,
                      survey_design: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Slider 2: Data Governance */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Data Governance</span>
                  <span className="font-black text-purple-600">{simulatedScores.data_governance}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={simulatedScores.data_governance}
                  onChange={(e) =>
                    setSimulatedScores({
                      ...simulatedScores,
                      data_governance: Number(e.target.value),
                    })
                  }
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Slider 3: Sampling Methods */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Sampling Methods</span>
                  <span className="font-black text-indigo-600">{simulatedScores.sampling_methods}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={simulatedScores.sampling_methods}
                  onChange={(e) =>
                    setSimulatedScores({
                      ...simulatedScores,
                      sampling_methods: Number(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* AI Career Advisor Strategy Copilot */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <span>🤖</span>
                <span>AI Career Advisor Copilot</span>
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                Personalized
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium block">
                Your Career Ambition:
              </label>
              <input
                type="text"
                value={aiCareerGoal}
                onChange={(e) => setAiCareerGoal(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleGenerateAdvice}
              disabled={isGeneratingAdvice}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingAdvice ? (
                <span>Generating Strategy...</span>
              ) : (
                <>
                  <span>Generate Custom AI Promotion Strategy</span>
                  <span>&rarr;</span>
                </>
              )}
            </button>

            {aiAdvisorAdvice && (
              <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="font-bold text-blue-300 block">{aiAdvisorAdvice.strategy}</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">{aiAdvisorAdvice.timeline}</span>
                  <p className="text-slate-300 mt-2 text-[11px] leading-relaxed">
                    {aiAdvisorAdvice.priorityMilestone}
                  </p>
                </div>

                <div className="space-y-1.5">
                  {aiAdvisorAdvice.steps.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-300">
                        <strong className="text-white">{s.phase}:</strong> {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
