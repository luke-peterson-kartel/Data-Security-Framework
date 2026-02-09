import './style.css';

// ─── Navigation scroll behavior ───
function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const handleScroll = (): void => {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ─── Active nav link highlight on scroll ───
function initActiveNavTracking(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link[data-section]');
  const sections = document.querySelectorAll<HTMLElement>('.section');

  if (navLinks.length === 0 || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === sectionId);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ─── Scroll-triggered animations ───
function initScrollAnimations(): void {
  const animatedElements = document.querySelectorAll<HTMLElement>('[data-animate]');

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// ─── Smooth scroll for anchor links ───
function initSmoothScroll(): void {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');

    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector<HTMLElement>(targetId);
    if (!targetElement) return;

    e.preventDefault();

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}

// ─── Modal system for data flow grid ───
interface ModalContent {
  dataType: string;
  badgeClass: string;
  phase: string;
  title: string;
  body: string;
}

const MODAL_DATA: Record<string, ModalContent> = {
  'raw-ingest': {
    dataType: 'Raw Training Data',
    badgeClass: 'badge-raw',
    phase: 'PHASE 01 — INGEST',
    title: 'Client Data Ingestion',
    body: `
      <p>Client data enters the Kartel pipeline through multiple secure channels, determined by client preference and data sensitivity classification.</p>
      <table class="modal-table">
        <thead><tr><th>Ingestion Method</th><th>Description</th><th>Security Controls</th></tr></thead>
        <tbody>
          <tr><td><strong>AWS S3 (Recommended)</strong></td><td>Client uploads to a private S3 bucket provisioned by Kartel. Recommended for all HIGH sensitivity and RED CODE data.</td><td>SOC 2 / ISO 27001 compliant; AES-256 at rest; TLS 1.3 in transit; 2FA; bucket-level access controls</td></tr>
          <tr><td><strong>Physical Hard Drive</strong></td><td>Client ships or hand-delivers encrypted drives to Beverly Hills office.</td><td>Chain-of-custody tracking from receipt; stored in locked physical safe; drive contents cataloged on intake</td></tr>
          <tr><td><strong>Google Drive</strong></td><td>Client uploads to Kartel Google Drive or grants access to their own.</td><td>2FA via Google Workspace; limited access permissions; client controls user access when sharing their own Drive</td></tr>
          <tr><td><strong>CIP Platform Upload</strong></td><td>Client uploads directly through the CIP Frontend interface. Note: CIP displays a notification advising clients not to upload secure or RED CODE data.</td><td>2FA authentication; gated access; secured via AWS Media Services DAM infrastructure</td></tr>
          <tr><td><strong>SharePoint / Dropbox / Other</strong></td><td>Client provides access via their preferred file sharing platform.</td><td>Client-controlled access permissions; data downloaded locally upon receipt</td></tr>
        </tbody>
      </table>
      <div class="modal-callout"><strong>Key principle:</strong> Regardless of ingestion method, all client data is downloaded locally for processing. No client source data remains solely on third-party platforms during active engagement.</div>
    `,
  },

  'raw-store': {
    dataType: 'Raw Training Data',
    badgeClass: 'badge-raw',
    phase: 'PHASE 02 — STORE',
    title: 'Client Data Storage',
    body: `
      <p>Once ingested, client data is stored in a controlled environment with strict access limitations.</p>
      <table class="modal-table">
        <thead><tr><th>Storage Location</th><th>What Is Stored</th><th>Security Measures</th></tr></thead>
        <tbody>
          <tr><td><strong>Internal NAS (Primary)</strong></td><td>All client source data (images, video, brand assets, product photography)</td><td>Physically secured at Beverly Hills office; internal login only; access limited to assigned team members; fully protected network</td></tr>
          <tr><td><strong>Locked Physical Safe</strong></td><td>Hard drives received from clients</td><td>Physical safe with restricted key holders; maintained at secure facility</td></tr>
          <tr><td><strong>AWS S3 (Intake/Delivery)</strong></td><td>Intake bucket for S3-based transfers; private buckets for RED CODE data; delivery staging</td><td>SOC 2 / ISO 27001 compliant; 2FA; encrypted at rest; data moved to local NAS after transfer</td></tr>
          <tr><td><strong>CIP Platform (DAM)</strong></td><td>Organized client assets within the Creative Intelligence Platform. Non-sensitive materials only unless client explicitly authorizes.</td><td>AWS Media Services infrastructure; 2FA; gated access; full access logging</td></tr>
        </tbody>
      </table>
      <p><strong>Core Storage Principles:</strong></p>
      <ul class="modal-list">
        <li><strong>Data Isolation:</strong> Each client's data is siloed in separate NAS directories and S3 buckets. Client data is never commingled.</li>
        <li><strong>Air-Gap Option:</strong> RED CODE data stored on air-gapped NAS with network interfaces physically disabled.</li>
        <li><strong>Physical Security:</strong> 407 Maple Drive, Beverly Hills. Keycard + biometric access; 24/7 surveillance; locked server cabinets; visitor escort policy.</li>
      </ul>
    `,
  },

  'raw-access': {
    dataType: 'Raw Training Data',
    badgeClass: 'badge-raw',
    phase: 'PHASE 03 — ACCESS',
    title: 'Client Data Access & Downloading',
    body: `
      <p>Access to client data is tightly controlled with the principle of least privilege applied throughout.</p>
      <table class="modal-table">
        <thead><tr><th>Control</th><th>Implementation</th><th>Monitoring</th></tr></thead>
        <tbody>
          <tr><td><strong>Personnel Vetting</strong></td><td>Background verification, NDA with non-compete and IP assignment, completed before project assignment</td><td>HR records; annual re-verification</td></tr>
          <tr><td><strong>Least Privilege Access</strong></td><td>Only team members assigned to specific client account have access to that client's data</td><td>Access grants reviewed per project</td></tr>
          <tr><td><strong>Access Logging</strong></td><td>All file access logged with timestamp, user ID, and action type on both CIP and IPP platforms</td><td>Real-time alerting on anomalous access patterns</td></tr>
          <tr><td><strong>Local Download Only</strong></td><td>All data downloaded to internal NAS for training. No local copies on personal devices permitted.</td><td>Network monitoring; DLP controls</td></tr>
          <tr><td><strong>Physical Security</strong></td><td>Keycard and biometric access; 24/7 surveillance; visitor logs; locked server cabinets</td><td>Security camera retention; access logs</td></tr>
        </tbody>
      </table>
      <p><strong>Contractor Vetting & Onboarding:</strong></p>
      <ul class="modal-list">
        <li><strong>W-9 Verification:</strong> Identity and tax status confirmed</li>
        <li><strong>NDA Execution:</strong> Non-disclosure with IP assignment clause</li>
        <li><strong>Google Workspace Provisioning:</strong> 2FA-enforced account creation</li>
        <li><strong>Project-Scoped Access:</strong> Access limited to assigned projects only</li>
        <li><strong>Activity Monitoring:</strong> All actions logged with same standards as employees</li>
        <li><strong>Offboarding Revocation:</strong> Immediate access revocation upon project completion or termination</li>
      </ul>
    `,
  },

  'raw-train': {
    dataType: 'Raw Training Data',
    badgeClass: 'badge-raw',
    phase: 'PHASE 04 — TRAIN',
    title: 'Raw Data Consumed in Training',
    body: `
      <p>Kartel trains custom LoRA (Low-Rank Adaptation) models on client data. These models learn stylistic and structural patterns but cannot reconstruct original source assets. The training environment is governed by the Two-Tier Classification system.</p>
      <table class="modal-table">
        <thead><tr><th>Environment</th><th>Description</th><th>Security</th></tr></thead>
        <tbody>
          <tr><td><strong>Local GPUs (Primary)</strong></td><td>On-premises GPU infrastructure at Beverly Hills office. Used for all RED CODE training and as primary for all standard training.</td><td>Air-gapped option available; network interfaces physically disabled for RED CODE; no internet during sensitive training</td></tr>
          <tr><td><strong>RunPod (Overflow)</strong></td><td>External GPU rental for overflow capacity when internal GPUs are at capacity. NEVER used for RED CODE data.</td><td>SOC 2 Type II certified; Kartel 2FA secured account; data transferred via secure S3 bucket connection; client notified and must approve before use</td></tr>
        </tbody>
      </table>
      <p><strong>How RunPod Is Used (When Approved):</strong></p>
      <ul class="modal-list">
        <li>Internal GPU capacity reached or dataset requires more compute</li>
        <li>Client notified and provides written approval for cloud overflow</li>
        <li>Data transferred via encrypted S3 connection to RunPod instance</li>
        <li>Training executed on ephemeral instance (wiped on termination)</li>
        <li>Trained model (safetensor) extracted and stored on Hugging Face</li>
        <li>RunPod instance terminated; no residual data</li>
      </ul>
    `,
  },

  'lora-train': {
    dataType: 'LoRA Model',
    badgeClass: 'badge-lora',
    phase: 'PHASE 04 — TRAIN',
    title: 'Custom LoRA Model Created',
    body: `
      <p>Training produces a safetensor file — a compact mathematical representation of learned visual patterns. This is the client's custom LoRA model.</p>
      <p><strong>Model Storage (Hugging Face):</strong></p>
      <ul class="modal-list">
        <li>Private repository with authentication keys and 2FA</li>
        <li>Currently Pro plan; Enterprise Hub available for clients requiring SOC 2 audit trails and SSO</li>
        <li>Organization-level access controls limit who can view or download models</li>
        <li><strong>RED CODE option:</strong> Local-only model storage, never uploaded to any cloud service</li>
      </ul>
      <div class="modal-callout"><strong>Key distinction:</strong> Trained models contain only learned parameters (stylistic patterns), not recoverable source imagery or data. The model cannot reconstruct original client assets. This is mathematically analogous to a human artist learning from reference: the knowledge is retained, not the source material.</div>
    `,
  },

  'lora-generate': {
    dataType: 'LoRA Model',
    badgeClass: 'badge-lora',
    phase: 'PHASE 05 — GENERATE',
    title: 'LoRA Model Applied Locally in Generation',
    body: `
      <p>During generation, Kartel builds a custom workflow where prompts call the third-party API (e.g., Runway, Kling) to generate a base result, which is then processed through the client's LoRA model locally. The client's visual DNA stays exclusively on Kartel infrastructure.</p>
      <table class="modal-table">
        <thead><tr><th>Component</th><th>Function</th><th>Security</th></tr></thead>
        <tbody>
          <tr><td><strong>IPP</strong></td><td>Internal production platform where all client content creation and generations occur.</td><td>2FA Google authentication; logged and gated access; Kartel employees and approved contractors only</td></tr>
          <tr><td><strong>FAL (API Gateway)</strong></td><td>Enterprise-grade vendor providing API access to third-party generation models. Client data is NOT sent through FAL. Only generation prompts and parameters are transmitted.</td><td>SOC 2 Type II compliant; private account with security authentication keys; no client data exposure</td></tr>
          <tr><td><strong>Generation Platform (GP)</strong></td><td>AI content generation engine embedded within IPP. Executes workflows, accesses LoRA models, creates assets.</td><td>Inherits IPP access controls; runs within IPP environment</td></tr>
        </tbody>
      </table>
      <div class="modal-callout"><strong>Critical Architecture Detail:</strong> Client data does NOT pass through third-party generation APIs. The prompts sent to third-party APIs do not contain client data, brand assets, or proprietary content. All client-specific intelligence lives exclusively in the custom model, which remains on Kartel's infrastructure.</div>
    `,
  },

  'lora-deliver': {
    dataType: 'LoRA Model',
    badgeClass: 'badge-lora',
    phase: 'PHASE 06 — DELIVER',
    title: 'LoRA Model Storage & Client Ownership',
    body: `
      <p>The trained LoRA model is retained as client-owned intellectual property and remains fully portable.</p>
      <p><strong>Storage Details:</strong></p>
      <ul class="modal-list">
        <li>Stored on Hugging Face private repository with 2FA authentication</li>
        <li>Organization-level access controls limit who can view or download</li>
        <li>Enterprise Hub available for clients requiring SOC 2 audit trails and SSO</li>
        <li>RED CODE option: Local-only model storage, never uploaded to any cloud service</li>
      </ul>
      <div class="modal-callout"><strong>Data destruction note:</strong> Raw training data is destroyed per NIST 800-88 with written certification to client. The LoRA model is retained on Hugging Face (or locally for RED CODE) as client-owned IP and remains portable. Performance insights are retained as operational data to support the ongoing feedback loop.</div>
    `,
  },

  'gen-generate': {
    dataType: 'Generation Input',
    badgeClass: 'badge-gen',
    phase: 'PHASE 05 — GENERATE',
    title: 'Generation Input: Prompts & Parameters Only',
    body: `
      <p>Content generation occurs within the Internal Production Platform (IPP), which integrates third-party AI generation APIs through a secure intermediary. Only prompts and parameters are sent externally — never client data.</p>
      <p><strong>Generation Workflow:</strong></p>
      <ul class="modal-list">
        <li>Artist or generative engineer creates a generation brief in IPP</li>
        <li>Generation Platform loads the client's trained LoRA model</li>
        <li>Performance insights (if available) are applied as generation parameters</li>
        <li>Prompts and parameters sent to third-party model via FAL API</li>
        <li>Base result returned to IPP</li>
        <li>LoRA model applied locally to base output, producing brand-accurate result</li>
        <li>Result enters review/approval workflow in IPP</li>
      </ul>
      <p><strong>Generation Metadata & Audit Trail:</strong></p>
      <p>Every generation created in the IPP captures comprehensive metadata:</p>
      <ul class="modal-list">
        <li>Timestamp, user ID, and project association</li>
        <li>Prompt text and parameters used</li>
        <li>Performance insight inputs applied (if any)</li>
        <li>LoRA model version referenced</li>
        <li>Third-party model and API endpoint used</li>
        <li>Output file hash and storage location</li>
      </ul>
      <div class="modal-callout"><strong>Critical Architecture Detail:</strong> Client data does NOT pass through third-party generation APIs. The prompts sent to third-party APIs do not contain client data, brand assets, or proprietary content. All client-specific intelligence lives exclusively in the custom model on Kartel infrastructure.</div>
    `,
  },

  'del-generate': {
    dataType: 'Client Deliverables',
    badgeClass: 'badge-del',
    phase: 'PHASE 05 — GENERATE',
    title: 'Brand-Accurate Outputs Created',
    body: `
      <p>Deliverables are brand-accurate images, video, and creative assets produced by the generation engine. Every output carries a full metadata audit trail.</p>
      <p><strong>Generation Metadata & Audit Trail:</strong></p>
      <p>Every generation created in the IPP captures comprehensive metadata:</p>
      <ul class="modal-list">
        <li>Timestamp, user ID, and project association</li>
        <li>Prompt text and parameters used</li>
        <li>Performance insight inputs applied (if any)</li>
        <li>LoRA model version referenced</li>
        <li>Third-party model and API endpoint used</li>
        <li>Output file hash and storage location</li>
      </ul>
      <p>Results enter a review/approval workflow within IPP before being delivered to clients.</p>
    `,
  },

  'del-deliver': {
    dataType: 'Client Deliverables',
    badgeClass: 'badge-del',
    phase: 'PHASE 06 — DELIVER',
    title: 'Asset Delivery & Output to Client',
    body: `
      <p>Deliverables are submitted to clients through their preferred method. All delivery channels maintain security and traceability.</p>
      <table class="modal-table">
        <thead><tr><th>Delivery Method</th><th>Description</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><strong>CIP Platform (Recommended)</strong></td><td>Client logs into CIP Frontend to review, approve, and download deliverables from their Asset Library</td><td>Full audit trail of views, downloads, and approvals. Most comprehensive tracking.</td></tr>
          <tr><td><strong>AWS S3 Delivery</strong></td><td>Assets delivered to a secure S3 bucket for client pickup. Recommended for RED CODE deliverables.</td><td>SOC 2 compliant; encrypted transfer</td></tr>
          <tr><td><strong>Frame.io</strong></td><td>Secure review and approval platform commonly used in media production</td><td>Industry-standard for creative review</td></tr>
          <tr><td><strong>WeTransfer / Figma</strong></td><td>Secure third-party transfer platforms based on client preference</td><td>Encryption in transit</td></tr>
          <tr><td><strong>Google Drive</strong></td><td>Shared folder delivery to client Google Workspace</td><td>2FA; access controls</td></tr>
        </tbody>
      </table>
      <p>Delivery method is always determined by client preference. CIP Platform and AWS S3 provide the most comprehensive audit trails and are recommended for clients with elevated security requirements.</p>
    `,
  },

  'perf-generate': {
    dataType: 'Performance Insights',
    badgeClass: 'badge-perf',
    phase: 'PHASE 05 — GENERATE',
    title: 'Performance Insights Inform Generation',
    body: `
      <p>Performance Insights are aggregated creative performance metrics sourced from third-party vendors that the brand already works with. The primary example is VidMob, a creative intelligence platform that provides data on how distributed media performs across channels.</p>
      <p><strong>Examples of performance insight data:</strong></p>
      <ul class="modal-list">
        <li>Creative effectiveness scores by visual style, format, or messaging approach</li>
        <li>Engagement metrics by audience segment and channel</li>
        <li>A/B test results on creative variations</li>
        <li>Platform-specific performance benchmarks (Instagram, TikTok, YouTube, etc.)</li>
        <li>Trend data on emerging visual styles or content formats</li>
      </ul>
      <table class="modal-table">
        <thead><tr><th>Stage</th><th>What Happens</th><th>Security</th></tr></thead>
        <tbody>
          <tr><td><strong>Initial Ingestion</strong></td><td>When a new client's creative intelligence engine is first built, historical performance data from the brand's analytics vendor is ingested into the generation step.</td><td>Lower sensitivity: aggregated performance metrics, not core brand assets or PII.</td></tr>
          <tr><td><strong>Ongoing Feedback</strong></td><td>Once the creative engine is live, the brand's media performance data flows back from the Deliver phase to the Generate phase creating a continuous optimization cycle.</td><td>Same low-sensitivity classification. Performance data is aggregated — does not contain source creative assets.</td></tr>
        </tbody>
      </table>
      <div class="modal-callout"><strong>Not core client data:</strong> Performance insights are aggregated media metrics (click rates, engagement scores, creative effectiveness data) — not brand assets, source imagery, or PII. They represent a fundamentally different and lower-sensitivity data class.</div>
    `,
  },

  'perf-deliver': {
    dataType: 'Performance Insights',
    badgeClass: 'badge-perf',
    phase: 'PHASE 06 — DELIVER',
    title: 'Performance Feedback Loop',
    body: `
      <p>The performance feedback loop is what makes the creative engine adaptive, not just generative. Once deliverables are distributed by the client, performance data begins flowing back into the Generate phase.</p>
      <p><strong>The Feedback Loop: Deliver &rarr; Generate</strong></p>
      <ul class="modal-list">
        <li><strong>Generate:</strong> Creative content is produced using the trained LoRA model + performance insight parameters</li>
        <li><strong>Deliver:</strong> Approved assets are sent to the client and distributed across media channels</li>
        <li><strong>Perform:</strong> Content runs in market across platforms (Instagram, TikTok, YouTube, programmatic, etc.)</li>
        <li><strong>Measure:</strong> Brand's analytics vendor (VidMob, etc.) captures creative performance data</li>
        <li><strong>Feed Back:</strong> Performance data is ingested back into the Generate phase as updated insight parameters</li>
        <li><strong>Refine:</strong> Next generation cycle uses updated insights to produce better-performing content</li>
      </ul>
      <p>This cycle repeats continuously, with each round of content creating data that improves the next.</p>
      <div class="modal-callout"><strong>Sourced from brand's existing vendors:</strong> This data comes from third-party analytics platforms the brand already uses (e.g. VidMob, Meta Ads Manager data). Kartel does not collect this data independently.</div>
    `,
  },

  'fb-deliver': {
    dataType: 'Feedback Loop',
    badgeClass: 'badge-perf',
    phase: 'PHASE 06 — DELIVER',
    title: 'Asset Delivery & Output to Client',
    body: `
      <p>Deliverables are submitted to clients through their preferred method. All delivery channels maintain security and traceability.</p>
      <table class="modal-table">
        <thead><tr><th>Delivery Method</th><th>Description</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><strong>CIP Platform (Recommended)</strong></td><td>Client logs into CIP Frontend to review, approve, and download deliverables from their Asset Library</td><td>Full audit trail of views, downloads, and approvals. Most comprehensive tracking.</td></tr>
          <tr><td><strong>AWS S3 Delivery</strong></td><td>Assets delivered to a secure S3 bucket for client pickup. Recommended for RED CODE deliverables.</td><td>SOC 2 compliant; encrypted transfer</td></tr>
          <tr><td><strong>Frame.io</strong></td><td>Secure review and approval platform commonly used in media production</td><td>Industry-standard for creative review</td></tr>
          <tr><td><strong>WeTransfer / Figma</strong></td><td>Secure third-party transfer platforms based on client preference</td><td>Encryption in transit</td></tr>
          <tr><td><strong>Google Drive</strong></td><td>Shared folder delivery to client Google Workspace</td><td>2FA; access controls</td></tr>
        </tbody>
      </table>
      <p>Once deliverables are distributed by the client, performance data begins flowing back from the brand's analytics vendors into the Generate phase, creating a continuous optimization loop.</p>
      <div class="modal-callout"><strong>Data destruction note:</strong> Raw training data is destroyed per NIST 800-88 with written certification to client. The LoRA model is retained on Hugging Face (or locally for RED CODE) as client-owned IP and remains portable. Performance insights are retained as operational data to support the ongoing feedback loop.</div>
    `,
  },

  'fb-generate': {
    dataType: 'Feedback Loop',
    badgeClass: 'badge-perf',
    phase: 'PHASE 05 — GENERATE',
    title: 'Insight-Driven Content Generation',
    body: `
      <p>Content generation occurs within the Internal Production Platform (IPP). When performance insights are available, they inform the generation parameters — enabling content that reflects real audience behavior and preferences.</p>
      <table class="modal-table">
        <thead><tr><th>Component</th><th>Function</th><th>Security</th></tr></thead>
        <tbody>
          <tr><td><strong>IPP</strong></td><td>Internal production platform where all client content creation and generations occur.</td><td>2FA Google authentication; logged and gated access; Kartel employees and approved contractors only</td></tr>
          <tr><td><strong>FAL (API Gateway)</strong></td><td>Enterprise-grade vendor providing API access to third-party generation models. Client data is NOT sent through FAL.</td><td>SOC 2 Type II compliant; private account with security authentication keys; no client data exposure</td></tr>
          <tr><td><strong>Generation Platform (GP)</strong></td><td>AI content generation engine embedded within IPP. Executes workflows, accesses LoRA models, creates assets.</td><td>Inherits IPP access controls; runs within IPP environment</td></tr>
        </tbody>
      </table>
      <p><strong>Performance Insights in Generation:</strong></p>
      <p>In addition to the core generation inputs (prompts + LoRA model), the generation step can be informed by Performance Insights — aggregated creative performance data from third-party vendors (e.g. VidMob) that the brand already works with. This data informs generation parameters, enabling insight-driven content creation.</p>
    `,
  },

  'fb-loop-cycle': {
    dataType: 'Feedback Loop',
    badgeClass: 'badge-perf',
    phase: 'CONTINUOUS OPTIMIZATION',
    title: 'The Performance Feedback Loop Cycle',
    body: `
      <p>The performance feedback loop is what makes the creative engine adaptive, not just generative. It creates a continuous optimization cycle between Deliver and Generate.</p>
      <p><strong>The Full Cycle:</strong></p>
      <ul class="modal-list">
        <li><strong>Generate:</strong> Creative content is produced using the trained LoRA model + performance insight parameters</li>
        <li><strong>Deliver:</strong> Approved assets are sent to the client and distributed across media channels</li>
        <li><strong>Perform:</strong> Content runs in market across platforms (Instagram, TikTok, YouTube, programmatic, etc.)</li>
        <li><strong>Measure:</strong> Brand's analytics vendor (VidMob, etc.) captures creative performance data</li>
        <li><strong>Feed Back:</strong> Performance data is ingested back into the Generate phase as updated insight parameters</li>
        <li><strong>Refine:</strong> Next generation cycle uses updated insights to produce better-performing content</li>
      </ul>
      <p>This cycle repeats continuously, with each round of content creating data that improves the next.</p>
      <table class="modal-table">
        <thead><tr><th>Attribute</th><th>Performance Insights</th></tr></thead>
        <tbody>
          <tr><td><strong>Sensitivity Level</strong></td><td>LOW — Aggregated performance metrics, not core brand assets, source imagery, or PII.</td></tr>
          <tr><td><strong>Source</strong></td><td>Third-party analytics vendors the brand already works with (e.g. VidMob, Meta Ads Manager). Kartel does not collect this data independently.</td></tr>
          <tr><td><strong>Contains Client Data?</strong></td><td>No core brand assets, no PII, no proprietary creative materials. Contains aggregated metrics about how creative content performs in market.</td></tr>
          <tr><td><strong>Retention</strong></td><td>Retained as operational data to support the ongoing feedback loop. Not subject to NIST 800-88 destruction (not source data).</td></tr>
        </tbody>
      </table>
      <div class="modal-callout"><strong>Key principle:</strong> Performance insights are actionable in generation — once the brand's creative intelligence engine is built (LoRA model trained), performance insights become parameters that guide what to generate, enabling hyper-targeted content that reflects real audience behavior.</div>
    `,
  },
};

function initModal(): void {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalBadge = document.getElementById('modal-badge');
  const modalPhase = document.getElementById('modal-phase');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (!overlay || !closeBtn || !modalBadge || !modalPhase || !modalTitle || !modalBody) return;

  function openModal(key: string): void {
    const data = MODAL_DATA[key];
    if (!data) return;

    modalBadge!.textContent = data.dataType;
    modalBadge!.className = 'modal-badge ' + data.badgeClass;
    modalPhase!.textContent = data.phase;
    modalTitle!.textContent = data.title;
    modalBody!.innerHTML = data.body;

    overlay!.classList.add('modal--active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(): void {
    overlay!.classList.remove('modal--active');
    document.body.style.overflow = '';
  }

  // Click on active cells
  document.addEventListener('click', (e: MouseEvent) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-modal]');
    if (cell) {
      const key = cell.dataset.modal;
      if (key) openModal(key);
      return;
    }
  });

  // Close handlers
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e: MouseEvent) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ─── Initialize ───
function init(): void {
  initNavScroll();
  initActiveNavTracking();
  initScrollAnimations();
  initSmoothScroll();
  initModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
