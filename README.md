# CRIMESHIELD AI
### AI-Powered Criminal Network Intelligence & Investigation Assistance Platform

**Smart India Hackathon (SIH 2026) — Problem Statement SIH 26189**  
**Organization:** Ministry of Home Affairs — National Crime Records Bureau (NCRB), Women Safety Division  

---

## 1. Executive Summary & Core Innovation

Traditional law enforcement analytics ask: *"Show me the criminal network."*  
**CRIMESHIELD AI** asks:  
> **"Show me how the network is changing, what new relationships are forming, why the pattern is suspicious, what evidence supports it, and what I should investigate next."**

The platform unifies fragmented crime-related datasets:
- **First Information Reports (FIRs)** & Police incident statements
- **Call Data Records (CDR)** & cellular tower handoffs
- **Financial transactions**, mule accounts, and shell entities
- **Vehicle registration records** (Vahan national telemetry)
- **Geolocations** & incident coordinates
- **OSINT** (Public-web records, gazette notices, and commercial filings)

### The Intelligence Pipeline
```
Raw Data Sources (FIR, CDR, Banking, Vahan, OSINT)
                     │
                     ▼
             Entity Extraction
                     │
                     ▼
         Heterogeneous Graph Engine
                     │
                     ▼
  Temporal Emerging Network Detection (USP)
                     │
                     ▼
 Explainable Alerts ("Why Detected?") + Evidence Citing
                     │
                     ▼
   Prioritized Investigation Leads (1 to N)
```

---

## 2. Technology Stack

### Backend
- **Framework:** Python 3.13 / FastAPI (Asynchronous High-Throughput REST APIs)
- **Graph Analytics:** NetworkX (Degree, Betweenness, PageRank, Closeness Centrality, Community Detection, Shortest Path Traversal, Adamic-Adar Link Prediction)
- **Data Modeling:** Pydantic v2, Pandas, NumPy, SciPy
- **AI / LLM Layer:** Groq Cloud API (`llama-3.3-70b-versatile`) with grounded RAG context retrieval
- **Evidence Ledger:** SHA-256 cryptographic hashing & tamper-evident validation
- **Database:** Supabase PostgreSQL with local embedded SQLite/JSON fallback for offline demonstration

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Law-enforcement dark intelligence theme)
- **Network Visualization:** Cytoscape.js (Interactive graph canvas, multi-layout algorithms, shortest path highlighter, node inspector drawer)
- **Charts & Metrics:** Recharts (Temporal network acceleration, alert distributions)
- **Maps:** Leaflet & OpenStreetMap (Crime scene & convergence clusters)
- **Icons:** Lucide React

---

## 3. The Demonstration Scenario: Operation Trident

The prototype comes preloaded with an interconnected synthetic dataset:
- **105 Persons** (across 3 criminal syndicates + bridge coordinators)
- **50 Phone Numbers** (with cellular tower locations and CDR pings)
- **30 Vehicles** (including target surveillance SUV `DL-01-AX-9921`)
- **40 Locations** (port terminals, transit corridors, vaults, safehouses)
- **20 Organizations** (shell entities, logistics fronts, transport unions)
- **70 Bank Accounts** (mule routing, circular wash accounts, clearing hubs)
- **320 Graph Relationships**
- **210 Banking Transactions** (sub-lakh smurfing and multi-lakh wires)
- **50 FIR Incident Reports**
- **120 Communications** (VoIP, cellular calls, encrypted sessions)
- **30 Evidence Items** with SHA-256 cryptographic hashes

### The Convergence Narrative
Three seemingly unrelated investigations were ongoing:
1. **Case A (Transport Extortion):** Gang coercing truck drivers along GT Road tolls (`FIR-102`, `FIR-108`).
2. **Case B (Port Contraband):** Tampered container seals at Nhava Sheva Port (`FIR-145`, `FIR-152`).
3. **Case C (Cyber Loan Extortion & Hawala):** Micro-lending app extortion syndicates routing ransoms into bullion (`FIR-201`, `FIR-219`).

**CRIMESHIELD AI Discovered:**
All three syndicates converge around:
- **Person P-014 (Vikram Malhotra / "V.M."):** Coordinator and structural bridge (Betweenness centrality: 0.84, Network Influence: 96/100).
- **Vehicle V-009 (`DL-01-AX-9921`):** Black Fortuner observed at both GT Road extortion sites and port berths.
- **Location L-012 (Dockyard Warehouse 4B):** Where P-014, Tariq Ahmed (P-021), and Kunal Verma (P-033) met.
- **Bank Account B-021 (Swift Horizons):** Aggregates extortion and cyber scam proceeds, laundering ₹10.4 Lakh through bullion dealers.

---

## 4. Master 5-to-7 Minute Hackathon Demo Flow

Follow this sequence for an impactful live demonstration:

1. **Dashboard (`/`)**:
   - Inspect key KPIs: 135 Entities, 3 Emerging Networks, 18 Suspicious Patterns, 8 Priority Leads.
   - Review the **Temporal Network Acceleration** chart showing the +73% surge in Week 4.
2. **Open Operation Trident (`/investigations`)**:
   - Walk through the three converging cases (Extortion, Port Contraband, Hawala).
   - View connected FIRs and verified evidence items.
3. **Network Explorer (`/network`)**:
   - Explore the Cytoscape.js interactive graph.
   - Click on **Person P-014 (Vikram Malhotra)**:
     * Right-hand intelligence panel opens.
     * View Network Influence (96/100), Role (Bridge / Coordinator), 37 active connections, 3 communities linked.
     * Read the explainable **"Why was this role assigned?"** breakdown.
   - Test the **Path Traversal Analyzer**: trace shortest path between `per-p-014` and `per-p-037`.
4. **Emerging Networks — The Main USP (`/emerging`)**:
   - Inspect **🚨 ALERT NET-017** (Confidence: 89.4%).
   - Review **Why was this detected?**:
     * 4 new communications
     * 3 shared locations
     * 4 financial links
     * 2 shared vehicles
     * 73% activity increase
   - Click on supporting evidence badges (`FIR-102`, `CDR-783`, `TX-091`, `VR-021`, `SUR-009`) to open the **Evidence Detail Modal**.
   - Review the 4-week **Temporal Window Evolution**.
5. **Timeline Intelligence (`/timeline`)**:
   - Drag the **Day 1 to Day 35 slider** or click **Play Network Evolution**.
   - Watch the active nodes grow from 28 to 135 and relationships surge to 320.
6. **Financial Intelligence (`/financial`)**:
   - Inspect the **Circular Wash Transfer Loop** (`B-008` → `B-015` → `B-021` → `B-014` → `B-008`).
   - Examine rapid mule account structuring into Swift Horizons.
7. **Hidden Connections (`/hidden`)**:
   - Inspect latent link between **P-014** and **P-037 (Aman Singhania)** with 0 direct calls, but 4 mutual associates and 3 shared locations.
8. **OSINT Search (`/osint`)**:
   - Search: *"Trident Global Logistics Vikram Malhotra JNPT port expansion"*.
   - View public news report card with source domain and relevance score.
   - Click **Add to Investigation Graph** $\rightarrow$ marked as **Public Source — Unverified**.
9. **Document Intelligence (`/documents`)**:
   - Click **Parse Sample FIR-102** $\rightarrow$ NLP parses suspects, vehicles, dates, and locations.
   - Click **Add to Investigation Graph** to merge into live network topology.
10. **AI Investigator (`/ai-investigator`)**:
    - Ask: *"Why was NET-017 flagged?"*
    - Receives grounded response adhering strictly to the required 5-part NCRB structure:
      * **### Finding**
      * **### Evidence**
      * **### Confidence**
      * **### Recommended Lead**
      * **### Sources**
11. **Evidence Vault (`/evidence`)**:
    - Click **Verify Hash** on `EVID-1023` $\rightarrow$ recalculates SHA-256 $\rightarrow$ confirms *"✓ Evidence unchanged: SHA-256 cryptographic signature matches custody ledger"*.
    - Click **Test Tamper** to demonstrate anti-tamper alert.
12. **Audit Logs (`/audit-logs`)**:
    - Verify that all searches, hash checks, and user actions are recorded with timestamps.

---

## 5. Setup & Installation Guide

### Prerequisites
- Python 3.11+ (Python 3.13 recommended)
- Node.js 18+ (Node.js 24 installed)
- npm 9+

### 1. Clone & Configure
```bash
git clone <repo-url>
cd prototype
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m backend.app.database.build_seed
python -m backend.tests.test_backend
```

Run the backend server:
```bash
python -m backend.app.main
# Backend runs at http://127.0.0.1:8000 (Swagger docs at /docs)
```

### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run build
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 6. Supabase Integration

The repository includes ready-to-run Supabase PostgreSQL scripts in `supabase/`:
- `supabase/schema.sql`: Full DDL with all 16 tables, constraints, UUID generation, foreign keys, and indexes.
- `supabase/seed.sql`: Complete synthetic seed data for Operation Trident.

### How to Connect Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run `supabase/schema.sql`, then `supabase/seed.sql`.
3. In your `.env` file, set:
   ```env
   SUPABASE_URL=https://<your-project>.supabase.co
   SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```
4. Restart the FastAPI backend. It will automatically route all queries to your live Supabase cloud instance!

---

## 7. Ethical Safety & Legal Compliance

1. **Non-Judicial Determination:** CRIMESHIELD AI strictly provides **Investigative Leads** to assist human investigators. It never declares guilt or innocence.
2. **Synthetic Data Only:** All names, telephone numbers, bank accounts, vehicle registration numbers, and incident narratives are completely fictional.
3. **OSINT Verification Safeguard:** All public-web data is marked **Public Source — Unverified** until manually reviewed and corroborated by an authorized officer.
4. **Evidence Chain of Custody:** Integrates SHA-256 cryptographic hashing to adhere to Section 65B requirements of the Indian Evidence Act.
