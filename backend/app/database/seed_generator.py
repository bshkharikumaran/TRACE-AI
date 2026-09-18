"""
Synthetic Dataset Generator for CRIMESHIELD AI (SIH 26189)
Generates high-fidelity, interconnected synthetic crime network data for Operation Trident.
Produces both `seed_data.py` (for fast in-memory & SQLite fallback) and `supabase/seed.sql`.
"""

import json
import hashlib
from datetime import datetime, timedelta, timezone

def generate_full_dataset():
    base_time = datetime(2026, 8, 1, 0, 0, 0, tzinfo=timezone.utc)
    
    # 1. Users
    users = [
        {
            "id": "u-001",
            "name": "Inspector Rajeshwari Devi",
            "email": "rajeshwari.devi@ncrb.gov.in",
            "role": "investigator",
            "department": "Women Safety Division & Special Crime Cell, NCRB",
            "badge_number": "NCRB-INV-7741",
            "created_at": (base_time - timedelta(days=90)).isoformat()
        },
        {
            "id": "u-002",
            "name": "Sr. Analyst Sameer Sen",
            "email": "sameer.sen@ncrb.gov.in",
            "role": "analyst",
            "department": "Cyber & Financial Intelligence Unit",
            "badge_number": "NCRB-ANA-3302",
            "created_at": (base_time - timedelta(days=90)).isoformat()
        },
        {
            "id": "u-003",
            "name": "Deputy Director Alok Verma",
            "email": "alok.verma@ncrb.gov.in",
            "role": "administrator",
            "department": "Directorate of Operations, NCRB",
            "badge_number": "NCRB-ADM-1001",
            "created_at": (base_time - timedelta(days=120)).isoformat()
        }
    ]

    # 2. Investigations
    investigations = [
        {
            "id": "inv-001",
            "investigation_code": "OP-TRIDENT-2026",
            "title": "Operation Trident",
            "description": "Cross-jurisdictional intelligence probe uncovering convergence between transport extortion rackets, seaport contraband logistics, and offshore shell Hawala syndicates operating across NCR and Coastal hubs.",
            "status": "active",
            "priority": "critical",
            "lead_investigator_id": "u-001",
            "created_at": (base_time - timedelta(days=45)).isoformat(),
            "updated_at": (base_time + timedelta(days=38)).isoformat()
        },
        {
            "id": "inv-002",
            "investigation_code": "OP-BLUEFIN-2026",
            "title": "Operation Bluefin",
            "description": "Counter-trafficking intelligence monitoring dark-web maritime logistics and encrypted transit cells.",
            "status": "active",
            "priority": "high",
            "lead_investigator_id": "u-001",
            "created_at": (base_time - timedelta(days=60)).isoformat(),
            "updated_at": (base_time + timedelta(days=10)).isoformat()
        },
        {
            "id": "inv-003",
            "investigation_code": "OP-SENTINEL-2026",
            "title": "Operation Sentinel",
            "description": "Surveillance on cross-state mule banking networks targeting vulnerable citizens through micro-lending apps.",
            "status": "under_review",
            "priority": "medium",
            "lead_investigator_id": "u-002",
            "created_at": (base_time - timedelta(days=30)).isoformat(),
            "updated_at": (base_time + timedelta(days=15)).isoformat()
        }
    ]

    # 3. Locations (40 Locations)
    location_names = [
        ("L-012", "Dockyard Warehouse 4B, Nhava Port", "Nhava Sheva Terminal, Port Logistics Zone", "Mumbai", "Maharashtra", 18.9500, 72.9500, "port_warehouse"),
        ("L-001", "Old Customs Depot", "Gate 3, Eastern Harbour Freeway", "Mumbai", "Maharashtra", 18.9412, 72.8521, "transit_hub"),
        ("L-002", "Okhla Industrial Cluster Phase 3", "Sector 8, Okhla", "New Delhi", "Delhi", 28.5355, 77.2710, "industrial_front"),
        ("L-003", "Connaught Place Financial Arcade", "Barakhamba Road, Central Delhi", "New Delhi", "Delhi", 28.6304, 77.2177, "financial_district"),
        ("L-004", "Safehouse Sector 45", "Bungalow 18, Greenwood Enclave", "Gurugram", "Haryana", 28.4595, 77.0266, "safehouse"),
        ("L-005", "Dhaula Kuan Transit Intersection", "Ring Road Flyover", "New Delhi", "Delhi", 28.5921, 77.1610, "crime_scene"),
        ("L-006", "Kashmere Gate ISBT Logistics Office", "ISBT Terminal North", "Delhi", "Delhi", 28.6672, 77.2285, "transit_hub"),
        ("L-007", "Mayapuri Auto Yard Unit 12", "Scrap & Vehicle Yard", "New Delhi", "Delhi", 28.6289, 77.1147, "vehicle_depot"),
        ("L-008", "Nehru Place Tech Plaza Suite 402", "Software Arcade", "New Delhi", "Delhi", 28.5494, 77.2528, "cyber_hub"),
        ("L-009", "Chandni Chowk Bullion Market Vault", "Kucha Mahajani", "Delhi", "Delhi", 28.6506, 77.2303, "hawala_node"),
        ("L-010", "Surat Diamond Bourse Suite 809", "Khajod", "Surat", "Gujarat", 21.1350, 72.7845, "hawala_node"),
        ("L-011", "Mundra Port Container Terminal Yard 7", "Mundra Special Economic Zone", "Kutch", "Gujarat", 22.8390, 69.7042, "port_warehouse"),
        ("L-013", "Bandra Kurla Complex Tower C", "G Block, BKC", "Mumbai", "Maharashtra", 19.0657, 72.8686, "corporate_front"),
        ("L-014", "Noida Sector 62 IT Park Tower 9", "Electronic City", "Noida", "Uttar Pradesh", 28.6280, 77.3649, "call_center_front"),
        ("L-015", "Chandigarh Highway Toll Plaza K12", "GT Road Highway", "Ambala", "Haryana", 30.3782, 76.7767, "transit_hub"),
        ("L-016", "Jaipur Transport Nagar Yard 2", "Delhi-Jaipur Highway Bypass", "Jaipur", "Rajasthan", 26.8967, 75.8450, "transit_hub"),
        ("L-017", "Kandla Port Berth 9", "Deendayal Port Authority", "Gandhidham", "Gujarat", 23.0118, 70.2185, "port_warehouse"),
        ("L-018", "Aerocity Hospitality Enclave Hotel Zenith", "IGI Airport Terminal 3 Zone", "New Delhi", "Delhi", 28.5529, 77.1215, "safehouse"),
        ("L-019", "Ghaziabad Rail Goods Shed 4", "Railway Freight Corridor", "Ghaziabad", "Uttar Pradesh", 28.6692, 77.4538, "transit_hub"),
        ("L-020", "Faridabad Industrial Area Plot 92", "Mathura Road NH-19", "Faridabad", "Haryana", 28.4089, 77.3178, "industrial_front"),
    ]
    # expand to 40
    for i in range(21, 41):
        location_names.append((
            f"L-0{i}" if i < 10 else f"L-{i}",
            f"Satellite Relay Post #{i}",
            f"Sector {i * 2}, Transport Corridor Zone",
            "Delhi NCR",
            "Delhi",
            28.5000 + (i * 0.015),
            77.1000 + (i * 0.012),
            "surveillance_point"
        ))

    locations = []
    for code, name, addr, city, state, lat, lng, ltype in location_names:
        locations.append({
            "id": f"loc-{code.lower()}",
            "location_code": code,
            "name": name,
            "address": addr,
            "city": city,
            "state": state,
            "latitude": lat,
            "longitude": lng,
            "location_type": ltype,
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # 4. Organizations (20 Organizations)
    org_specs = [
        ("O-001", "Trident Global Logistics Pvt Ltd", "logistics_front", "U74999DL2021PTC381902", "loc-l-012"),
        ("O-002", "Apex Maritime Fleet Services", "transport_syndicate", "U61100MH2019PTC320145", "loc-l-001"),
        ("O-003", "Swift Horizons FinTech Advisory", "shell_company", "U72900DL2022PTC394811", "loc-l-003"),
        ("O-004", "Northern Haulers Association", "trucking_cartel", "U60231DL2018NPL334190", "loc-l-006"),
        ("O-005", "CyberByte Tech Innovations", "call_center_front", "U72200UP2020PTC129034", "loc-l-014"),
        ("O-006", "Surat Bullion Clearing Bureau", "hawala_front", "U65999GJ2017PTC099182", "loc-l-010"),
        ("O-007", "Blue Horizon Cold Storage Ltd", "warehouse_front", "U15400MH2020PLC341902", "loc-l-012"),
        ("O-008", "Kuber Trust Micro Investments", "mule_syndicate", "U65100DL2021NPL382109", "loc-l-009"),
        ("O-009", "AeroExpress Cargo Solutions", "freight_forwarder", "U62200DL2023PTC412980", "loc-l-018"),
        ("O-010", "Deltacrest Import Export FZE", "shell_company", "FZE-9941-DUBAI-REP", "loc-l-013"),
        ("O-011", "Vanguard Security Fleet Ltd", "security_front", "U74920HR2019PLC081234", "loc-l-004"),
        ("O-012", "Zenith Hospitality & Holdings", "real_estate_front", "U55101DL2018PTC339820", "loc-l-018"),
        ("O-013", "Om Metal Scrappers Association", "salvage_front", "U27100DL2016PTC301289", "loc-l-007"),
        ("O-014", "Matrix InfoTech Services LLP", "cyber_front", "AAS-1940-LLP", "loc-l-008"),
        ("O-015", "Golden Harvest Agro Logistics", "transport_front", "U01100HR2020PTC087612", "loc-l-015"),
        ("O-016", "Gujarat Coastal Forwarding Ltd", "port_syndicate", "U61200GJ2019PLC034512", "loc-l-011"),
        ("O-017", "Capital Shield Consulting LLP", "legal_cover", "AAQ-8821-LLP", "loc-l-003"),
        ("O-018", "Sunrise Forex Money Changers", "hawala_node", "U67190DL2015PTC281900", "loc-l-009"),
        ("O-019", "FastTrack Express Couriers", "drop_shipper", "U64120UP2021PTC145620", "loc-l-019"),
        ("O-020", "Nexus Mining & Infrastructure", "resource_front", "U13100RJ2017PLC058912", "loc-l-016"),
    ]
    organizations = []
    for code, name, otype, reg, hq in org_specs:
        organizations.append({
            "id": f"org-{code.lower()}",
            "org_code": code,
            "name": name,
            "type": otype,
            "registration_id": reg,
            "headquarters_location_id": hq,
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # 5. Persons (105 Persons across 3 main communities + bridge)
    # Lead / Core Characters:
    # P-014: Vikram "V.M." Malhotra (The Coordinator & Bridge)
    # Community A (Extortion & Fleet Control): P-001 to P-020 (Suresh Nair P-011, Devendra P-009)
    # Community B (Seaport Contraband & Logistics): P-021 to P-045 (Tariq Ahmed P-021, Arjun P-024)
    # Community C (Cyber Fraud & Hawala): P-046 to P-075 (Kunal Verma P-033, Meera P-035, Aman Singhania P-037)
    # Peripheral Associates / Runners: P-076 to P-105
    persons = []
    
    # Coordinator
    persons.append({
        "id": "per-p-014",
        "person_code": "P-014",
        "name": "Vikram Malhotra",
        "alias": "V.M. / The Architect",
        "age": 44,
        "gender": "Male",
        "occupation": "Managing Director, Trident Global Logistics",
        "risk_score": 94.50,
        "network_score": 96.80,
        "primary_role": "Bridge / Coordinator",
        "status": "under_active_surveillance",
        "community_id": "COMM-0",
        "created_at": (base_time - timedelta(days=60)).isoformat()
    })

    # Community A: Extortion / Transport Syndicate (P-001 to P-020)
    comm_a_names = [
        ("P-001", "Ravi Shankar", "Guruji", 48, "Truck Union Secretary", 78.0, 74.0, "coordinator"),
        ("P-002", "Balwant Singh", "Balli Pehalwan", 42, "Transport Contractor", 82.0, 79.0, "enforcer"),
        ("P-003", "Jagjit Sandhu", "Jaggi", 39, "Fleet Supervisor", 68.0, 62.0, "facilitator"),
        ("P-004", "Manish Tyagi", "Fauji", 36, "Security Contractor", 85.0, 81.0, "enforcer"),
        ("P-005", "Dinesh Kumar", "DK", 45, "Scrap Dealer", 71.0, 65.0, "fence"),
        ("P-006", "Sukhwinder Brar", "Sukha", 41, "Freight Dispatcher", 64.0, 58.0, "operative"),
        ("P-007", "Ramesh Chand", "Munshi", 52, "Transport Accountant", 75.0, 72.0, "financial_mule"),
        ("P-008", "Satish Gurjar", "Satte", 38, "Toll Booth Liaison", 79.0, 75.0, "facilitator"),
        ("P-009", "Devendra Yadav", "Deva Bhai", 46, "Regional Syndicate Head", 91.0, 88.0, "coordinator"),
        ("P-010", "Kuldeep Rana", "KD", 35, "Driver Coordinator", 62.0, 54.0, "runner"),
        ("P-011", "Suresh Nair", "The Fixer", 49, "Legal & Union Consultant", 89.0, 87.0, "bridge"),
        ("P-012", "Ajay Malik", "Pappu", 33, "Courier / Armorer", 84.0, 76.0, "enforcer"),
        ("P-013", "Sunil Gujral", "Sunny", 40, "Fuel Pump Owner", 67.0, 60.0, "front_operator"),
        ("P-015", "Harpreet Dhillon", "Happy", 37, "Highway Escort Manager", 73.0, 69.0, "facilitator"),
        ("P-016", "Om Prakash Sharma", "Pandit", 56, "Yard Storekeeper", 58.0, 52.0, "custodian"),
        ("P-017", "Gajendra Rawat", "Gajju", 34, "Toll Operative", 65.0, 59.0, "spotter"),
        ("P-018", "Mohan Lal", "Masterji", 50, "Doc Forger", 83.0, 77.0, "facilitator"),
        ("P-019", "Pankaj Bhati", "PK", 31, "Enforcer Runner", 72.0, 66.0, "runner"),
        ("P-020", "Vipin Kasana", "Veeru", 36, "Cash Handler", 76.0, 70.0, "financial_mule")
    ]
    for code, name, alias, age, occ, risk, net, r in comm_a_names:
        persons.append({
            "id": f"per-{code.lower()}",
            "person_code": code,
            "name": name,
            "alias": alias,
            "age": age,
            "gender": "Male",
            "occupation": occ,
            "risk_score": risk,
            "network_score": net,
            "primary_role": r,
            "status": "suspect",
            "community_id": "COMM-A",
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # Community B: Seaport & Cargo Diversion Syndicate (P-021 to P-045)
    comm_b_names = [
        ("P-021", "Tariq Ahmed", "Captain", 51, "Shipping Agent & Maritime Expeditor", 93.0, 92.0, "coordinator"),
        ("P-022", "Nasir Qureshi", "Bhaijan", 47, "Dock Labour Contractor", 88.0, 84.0, "facilitator"),
        ("P-023", "Fahim Merchant", "Munna Cargo", 44, "Customs House Agent", 86.0, 82.0, "facilitator"),
        ("P-024", "Arjun Kadam", "Nana", 40, "Container Yard Supervisor", 82.0, 79.0, "operative"),
        ("P-025", "Bhupesh Patel", "Bhuppi", 46, "Cold Storage Fleet Owner", 79.0, 75.0, "front_operator"),
        ("P-026", "Zameer Khan", "Pathan", 38, "Armed Vessel Escort", 85.0, 77.0, "enforcer"),
        ("P-027", "Naveen Chawla", "Babu", 36, "Warehouse Gate Keeper", 69.0, 61.0, "spotter"),
        ("P-028", "Iqbal Memon", "Chacha", 58, "Informal Freight Booker", 77.0, 73.0, "facilitator"),
        ("P-029", "Kiran Varma", "KV", 34, "Container Seal Tamperer", 81.0, 74.0, "operative"),
        ("P-030", "Ganesh Jadhav", "Anna", 42, "Tugboat Operator", 70.0, 63.0, "transport"),
        ("P-031", "Sameer Siddiqui", "Doctor", 45, "Pharma Consignment Broker", 84.0, 80.0, "facilitator"),
        ("P-032", "Javed Ansari", "Pilot", 37, "Speedboat Specialist", 82.0, 75.0, "transport"),
        ("P-034", "Pooja Sawant", "Madam", 35, "Port Clearance Documentation Ex-Officer", 76.0, 71.0, "facilitator"),
        ("P-036", "Rashid Batliwala", "Chhota", 33, "Consignment Unloader", 66.0, 58.0, "runner"),
        ("P-038", "Deepak Bhosle", "DP", 41, "Customs Yard Security Guard", 74.0, 68.0, "facilitator"),
        ("P-039", "Zafar Shaikh", "Bawa", 49, "Bonded Warehouse Lessee", 87.0, 83.0, "front_operator"),
        ("P-040", "Harish Kotian", "Harry", 38, "Cargo Crane Mechanic", 63.0, 55.0, "spotter"),
        ("P-041", "Ismail Merchant", "Seth", 53, "Coastal Transit Financier", 89.0, 86.0, "financial_hub"),
        ("P-042", "Nitin Salve", "Pintya", 32, "Forklift Crew Lead", 67.0, 60.0, "runner"),
        ("P-043", "Yusuf Chhotani", "Chhotani", 44, "Ship Chandler Broker", 78.0, 72.0, "facilitator"),
        ("P-044", "Pravin Patil", "Patil Kaka", 50, "Weighbridge Clerk", 71.0, 65.0, "spotter"),
        ("P-045", "Sikandar Raza", "Sikku", 36, "Night Patrol Diverter", 79.0, 73.0, "enforcer")
    ]
    for code, name, alias, age, occ, risk, net, r in comm_b_names:
        persons.append({
            "id": f"per-{code.lower()}",
            "person_code": code,
            "name": name,
            "alias": alias,
            "age": age,
            "gender": "Male" if code != "P-034" else "Female",
            "occupation": occ,
            "risk_score": risk,
            "network_score": net,
            "primary_role": r,
            "status": "suspect",
            "community_id": "COMM-B",
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # Community C: Cyber Fraud & Hawala Conduit (P-046 to P-075) + key links P-033, P-035, P-037
    comm_c_names = [
        ("P-033", "Kunal Verma", "Crypto", 31, "Darknet Escrow & Crypto Mixer", 92.0, 90.0, "financial_hub"),
        ("P-035", "Meera Sen", "Maya", 29, "Shell Entity Director & Account Layerer", 87.0, 85.0, "financial_mule"),
        ("P-037", "Aman Singhania", "The Banker", 52, "Senior Bullion & Forex Dealer", 93.0, 91.0, "coordinator"),
        ("P-046", "Rohan Mehta", "RJ", 28, "VoIP PBX Infrastructure Host", 80.0, 77.0, "communication_hub"),
        ("P-047", "Kavita Saxena", "Call Lead", 32, "Fake Investment Center Supervisor", 78.0, 73.0, "facilitator"),
        ("P-048", "Alok Tandon", "Chartered", 47, "Disbarred Auditor / Shell Creator", 89.0, 86.0, "facilitator"),
        ("P-049", "Gaurav Kapoor", "GK", 30, "Mule Account Recruiter", 85.0, 81.0, "financial_mule"),
        ("P-050", "Prashant Joshi", "PJ", 34, "SIM Farm Operator", 82.0, 79.0, "communication_hub"),
        ("P-051", "Shweta Deshmukh", "Angel", 27, "KYC Forger & Account Opener", 79.0, 74.0, "facilitator"),
        ("P-052", "Varun Bhatia", "VB", 33, "P2P USDT Arbitrageur", 86.0, 83.0, "financial_hub"),
        ("P-053", "Naveen Somani", "Sethji", 55, "Hawala Courier Dispatcher", 90.0, 88.0, "coordinator"),
        ("P-054", "Abhishek Tiwari", "Abhi", 29, "Android Malware C2 Operator", 84.0, 80.0, "cyber_operative"),
        ("P-055", "Pooja Hegde", "PR Executive", 31, "Corporate PR Front Secretary", 68.0, 62.0, "front_operator"),
        ("P-056", "Chirag Shah", "Chiru", 35, "Angadia Network Courier", 81.0, 76.0, "runner"),
        ("P-057", "Manish Agarwal", "Munna", 43, "Dummy Current Account Holder", 75.0, 70.0, "financial_mule"),
        ("P-058", "Tanvi Parekh", "TP", 28, "Phishing Landing Page Dev", 76.0, 71.0, "cyber_operative"),
        ("P-059", "Sanjay Singhal", "SS", 49, "Fake Invoice Creator", 83.0, 79.0, "facilitator"),
        ("P-060", "Rahul Chauhan", "RC", 32, "ATM Cash Withdrawal Runner", 77.0, 71.0, "runner"),
        ("P-061", "Neha Rastogi", "NR", 30, "Account Aggregator", 74.0, 68.0, "financial_mule"),
        ("P-062", "Vikrant Shokeen", "Vicky", 35, "Muscle for Cyber Rackets", 80.0, 74.0, "enforcer"),
        ("P-063", "Anand Kothari", "AK", 51, "Jewellery Invoice Laundering", 88.0, 84.0, "financial_hub"),
        ("P-064", "Divya Pillai", "DP", 29, "Virtual Number Provider", 75.0, 70.0, "communication_hub"),
        ("P-065", "Rohit Bhardwaj", "RB", 33, "Payment Gateway Hijacker", 82.0, 78.0, "cyber_operative"),
        ("P-066", "Sunita Jain", "Aunty", 54, "Cash Holding Vault Keeper", 79.0, 73.0, "custodian"),
        ("P-067", "Hitesh Lodha", "HL", 40, "OTC Cash-Crypto Broker", 86.0, 82.0, "financial_hub"),
        ("P-068", "Anuj Mathur", "AM", 31, "Fake Aadhaar & Pan Generator", 81.0, 75.0, "facilitator"),
        ("P-069", "Swati Kashyap", "SK", 28, "Telesales Cold Caller", 65.0, 58.0, "runner"),
        ("P-070", "Deepak Grover", "DG", 37, "Mule Bank Runner Coordinator", 83.0, 78.0, "runner"),
        ("P-071", "Gautam Seth", "GS", 46, "Trade Mis-invoicing Specialist", 87.0, 83.0, "facilitator"),
        ("P-072", "Pallavi Roy", "PR", 30, "Telegram Bot Admin", 73.0, 67.0, "cyber_operative"),
        ("P-073", "Kishore Bajaj", "KB", 52, "Hawala Vault Custodian", 85.0, 80.0, "custodian"),
        ("P-074", "Rituja Salunkhe", "RS", 34, "Call Center Shift Manager", 70.0, 64.0, "facilitator"),
        ("P-075", "Yashwant Rao", "YR", 41, "POS Machine Swiper", 77.0, 71.0, "runner")
    ]
    for code, name, alias, age, occ, risk, net, r in comm_c_names:
        persons.append({
            "id": f"per-{code.lower()}",
            "person_code": code,
            "name": name,
            "alias": alias,
            "age": age,
            "gender": "Female" if "Madam" in alias or "Aunty" in alias or code in ["P-035", "P-047", "P-051", "P-055", "P-058", "P-061", "P-064", "P-066", "P-069", "P-072", "P-074"] else "Male",
            "occupation": occ,
            "risk_score": risk,
            "network_score": net,
            "primary_role": r,
            "status": "suspect",
            "community_id": "COMM-C",
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # Peripheral Associates / Runners: P-076 to P-105 (30 more persons)
    for i in range(76, 106):
        code = f"P-0{i}" if i < 100 else f"P-{i}"
        comm = "COMM-A" if i % 3 == 0 else ("COMM-B" if i % 3 == 1 else "COMM-C")
        persons.append({
            "id": f"per-{code.lower()}",
            "person_code": code,
            "name": f"Synthetic Associate {code}",
            "alias": f"Runner-{code[-2:]}",
            "age": 25 + (i % 25),
            "gender": "Male" if i % 5 != 0 else "Female",
            "occupation": f"Logistics & Transit Affiliate #{i}",
            "risk_score": round(50.0 + (i % 35) * 0.9, 1),
            "network_score": round(45.0 + (i % 35) * 0.85, 1),
            "primary_role": "peripheral",
            "status": "under_observation",
            "community_id": comm,
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # 6. Phone Numbers (50 Phones)
    phones = []
    # Dedicated Phones for Core Characters
    phone_map = {
        "P-014": ("PH-014", "+91 98110 XXXXX (V.M. Personal)", "carrier_airtel", "Encrypted VoIP Primary"),
        "P-011": ("PH-011", "+91 98200 XXXXX (Suresh Nair Fixer)", "carrier_jio", "Dual SIM Cell A"),
        "P-009": ("PH-009", "+91 98101 XXXXX (Devendra Yadav)", "carrier_vodafone", "Field Handset"),
        "P-021": ("PH-021", "+91 98212 XXXXX (Tariq Ahmed Captain)", "carrier_airtel", "Maritime Satellite SIM"),
        "P-024": ("PH-024", "+91 98920 XXXXX (Arjun Dockyard)", "carrier_jio", "Yard Dispatch Phone"),
        "P-033": ("PH-033", "+91 99100 XXXXX (Kunal Crypto)", "carrier_esim", "Burner eSIM 1"),
        "P-035": ("PH-035", "+91 98188 XXXXX (Meera Shell)", "carrier_airtel", "Banking OTP Receiver"),
        "P-037": ("PH-037", "+91 98201 XXXXX (Aman Banker)", "carrier_vodafone", "Forex Desk Direct Line"),
    }
    for pcode, (phcode, masked, carrier, lbl) in phone_map.items():
        phone_hash = hashlib.sha256(f"secret_phone_{pcode}_{masked}".encode()).hexdigest()[:32]
        phones.append({
            "id": f"ph-{phcode.lower()}",
            "phone_code": phcode,
            "phone_hash": phone_hash,
            "masked_number": masked,
            "label": lbl,
            "carrier": carrier,
            "owner_person_id": f"per-{pcode.lower()}",
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })
    # Additional phones to reach 50
    for i in range(9, 51):
        phcode = f"PH-0{i}" if i < 10 else f"PH-{i}"
        owner_idx = (i % 25) + 1
        owner_pcode = f"P-0{owner_idx}" if owner_idx < 10 else f"P-{owner_idx}"
        phone_hash = hashlib.sha256(f"secret_phone_{phcode}".encode()).hexdigest()[:32]
        phones.append({
            "id": f"ph-{phcode.lower()}",
            "phone_code": phcode,
            "phone_hash": phone_hash,
            "masked_number": f"+91 98{i % 80 + 10:02d} XXXXX",
            "label": f"Field Device #{i}",
            "carrier": ["carrier_airtel", "carrier_jio", "carrier_vodafone"][i % 3],
            "owner_person_id": f"per-{owner_pcode.lower()}",
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # 7. Vehicles (30 Vehicles)
    vehicles = []
    # Key suspect vehicles
    vehicles.append({
        "id": "veh-v-009",
        "vehicle_code": "V-009",
        "registration_number": "DL-01-AX-9921",
        "vehicle_type": "SUV (Black Toyota Fortuner)",
        "make_model": "Toyota Fortuner 4x4",
        "color": "Midnight Black",
        "owner_person_id": "per-p-014",
        "notes": "Spotted repeatedly at Dockyard L-012 during critical transaction meetings; registered to shell front O-001 (Trident Logistics).",
        "created_at": (base_time - timedelta(days=60)).isoformat()
    })
    vehicles.append({
        "id": "veh-v-004",
        "vehicle_code": "V-004",
        "registration_number": "MH-04-ER-4420",
        "vehicle_type": "Commercial Heavy Trailer",
        "make_model": "Tata Signa 4825.TK",
        "color": "Navy Blue",
        "owner_person_id": "per-p-021",
        "notes": "Used for moving diverted container seal lots from Nhava Sheva to Okhla cluster.",
        "created_at": (base_time - timedelta(days=60)).isoformat()
    })
    vehicles.append({
        "id": "veh-v-015",
        "vehicle_code": "V-015",
        "registration_number": "HR-26-DK-7704",
        "vehicle_type": "Sedan (White Audi A6)",
        "make_model": "Audi A6 45 TFSI",
        "color": "Ibis White",
        "owner_person_id": "per-p-037",
        "notes": "Executive vehicle observed near Connaught Place vault and Aerocity safehouse.",
        "created_at": (base_time - timedelta(days=60)).isoformat()
    })
    for i in range(4, 31):
        if i in [9, 15]:
            continue
        vcode = f"V-0{i}" if i < 10 else f"V-{i}"
        owner_pcode = f"P-0{i % 20 + 1}" if (i % 20 + 1) < 10 else f"P-{i % 20 + 1}"
        state_code = ["DL", "MH", "HR", "GJ"][i % 4]
        vtype = ["Sedan", "SUV", "Delivery Van", "Heavy Container Truck", "Armored Cash Van"][i % 5]
        vehicles.append({
            "id": f"veh-{vcode.lower()}",
            "vehicle_code": vcode,
            "registration_number": f"{state_code}-0{i % 9 + 1}-XY-{1000 + i * 73}",
            "vehicle_type": vtype,
            "make_model": f"Vehicle Spec Model {i}",
            "color": ["Silver", "Black", "White", "Dark Grey", "Maroon"][i % 5],
            "owner_person_id": f"per-{owner_pcode.lower()}",
            "notes": f"Affiliated transport unit #{i} under surveillance.",
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # 8. Bank Accounts (70 Bank Accounts)
    accounts = []
    # Key Accounts
    key_accounts = [
        ("B-021", "ACC-992140", "HDFC Bank BKC", "shell_entity", None, "org-o-003", True, "Swift Horizons Clearing Hub - High velocity layered transfers"),
        ("B-014", "ACC-140022", "ICICI Bank CP", "corporate", "per-p-014", "org-o-001", True, "Trident Global Logistics Primary Operational Account"),
        ("B-008", "ACC-082199", "Axis Bank Okhla", "mule_account", "per-p-007", None, True, "Case A extortion proceeds aggregation account"),
        ("B-015", "ACC-158911", "Kotak Mahindra Port Branch", "current", "per-p-021", "org-o-002", True, "Apex Maritime Customs Disbursal Account"),
        ("B-033", "ACC-331049", "State Bank of India Tech Park", "mule_account", "per-p-035", "org-o-008", True, "Kuber Trust Micro Investments - P2P Crypto Ingress"),
        ("B-037", "ACC-379012", "Standard Chartered Bullion Arcade", "current", "per-p-037", "org-o-006", True, "Surat Bullion Clearing Bureau - Forex settlement node")
    ]
    for bcode, ref, bname, atype, hperson, horg, flagged, note in key_accounts:
        accounts.append({
            "id": f"acc-{bcode.lower()}",
            "account_code": bcode,
            "account_reference": ref,
            "bank_name": bname,
            "account_type": atype,
            "holder_person_id": hperson,
            "holder_org_id": horg,
            "is_flagged": flagged,
            "notes": note,
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })
    for i in range(7, 71):
        bcode = f"B-0{i}" if i < 10 else f"B-{i}"
        owner_idx = (i % 30) + 1
        owner_pcode = f"P-0{owner_idx}" if owner_idx < 10 else f"P-{owner_idx}"
        bname = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Punjab National Bank", "Axis Bank", "Canara Bank"][i % 6]
        atype = "mule_account" if i % 2 == 0 else "savings"
        accounts.append({
            "id": f"acc-{bcode.lower()}",
            "account_code": bcode,
            "account_reference": f"ACC-{200000 + i * 117}",
            "bank_name": f"{bname} Branch #{i % 10 + 1}",
            "account_type": atype,
            "holder_person_id": f"per-{owner_pcode.lower()}",
            "holder_org_id": None,
            "is_flagged": (i % 3 == 0),
            "notes": f"Synthetic account record #{bcode}",
            "created_at": (base_time - timedelta(days=60)).isoformat()
        })

    # 9. FIRs (50 FIRs across cases)
    firs = []
    # Case A: Extortion Racket FIRs
    firs.append({
        "id": "fir-102",
        "fir_number": "FIR-102/2026",
        "title": "Organized Extortion & Criminal Intimidation of Freight Transporters",
        "description": "Complaint filed by Northern Freight Carriers alleging coordinated extortion demands, physical intercept of cargo trailers at Dhaula Kuan intersection, and forced protection levy collections transferred to shell account B-008. Vehicle DL-01-AX-9921 observed performing reconnaissance.",
        "acts_sections": "IPC 384, 386, 506, 120B / BNS 308, 351, 61",
        "date": (base_time + timedelta(days=5)).isoformat(),
        "police_station": "Dhaula Kuan Police Station, New Delhi",
        "location_id": "loc-l-005",
        "investigation_id": "inv-001",
        "created_at": (base_time + timedelta(days=5)).isoformat()
    })
    firs.append({
        "id": "fir-108",
        "fir_number": "FIR-108/2026",
        "title": "Highway Cargo Hijack & Fleet Coercion at GT Road Toll",
        "description": "Commercial freight container intercepted and rerouted under coercion. Call records indicate commands originated from coordination cell linked to Suresh Nair (P-011) and Devendra Yadav (P-009).",
        "acts_sections": "IPC 392, 395, 34 / BNS 310, 3(5)",
        "date": (base_time + timedelta(days=12)).isoformat(),
        "police_station": "Ambala Highway Police Post",
        "location_id": "loc-l-015",
        "investigation_id": "inv-001",
        "created_at": (base_time + timedelta(days=12)).isoformat()
    })
    # Case B: Contraband & Seaport Logistics FIRs
    firs.append({
        "id": "fir-145",
        "fir_number": "FIR-145/2026",
        "title": "Illicit Maritime Container Tampering & Unmanifested Cargo Diversion",
        "description": "Customs enforcement raid at Nhava Sheva Terminal discovered tampered electronic seals on two 40ft refrigerated containers leased to Trident Logistics (O-001). Security footage confirms Tariq Ahmed (P-021) and Arjun Kadam (P-024) present at warehouse L-012 during midnight transfer.",
        "acts_sections": "Customs Act 1962 Sec 132, 135; IPC 420, 120B",
        "date": (base_time + timedelta(days=18)).isoformat(),
        "police_station": "Nhava Sheva Marine Police Station",
        "location_id": "loc-l-012",
        "investigation_id": "inv-001",
        "created_at": (base_time + timedelta(days=18)).isoformat()
    })
    firs.append({
        "id": "fir-152",
        "fir_number": "FIR-152/2026",
        "title": "Inter-State Contraband Transit Intercept at Mayapuri Depot",
        "description": "Raid on scrap yard L-007 recovered unmanifested industrial electronics and high-value narcotics pre-cursors transferred via container trailer MH-04-ER-4420 from Nhava Port.",
        "acts_sections": "NDPS Act Sec 21, 29; IPC 120B",
        "date": (base_time + timedelta(days=22)).isoformat(),
        "police_station": "Mayapuri Police Station, West Delhi",
        "location_id": "loc-l-007",
        "investigation_id": "inv-001",
        "created_at": (base_time + timedelta(days=22)).isoformat()
    })
    # Case C: Cyber Fraud & Hawala Conduit FIRs
    firs.append({
        "id": "fir-201",
        "fir_number": "FIR-201/2026",
        "title": "High-Volume Micro-Lending Cyber Extortion & Phishing Syndicate",
        "description": "Multi-victim cyber complaint against unauthorized loan apps harvesting contacts and threatening female victims. Ransom remittances routed through dummy UPI handles directly to mule accounts B-033 and B-021 (Swift Horizons).",
        "acts_sections": "IT Act Sec 66C, 66D; IPC 384, 509, 120B",
        "date": (base_time + timedelta(days=8)).isoformat(),
        "police_station": "Special Cell Cyber Crime PS, Mandir Marg",
        "location_id": "loc-l-014",
        "investigation_id": "inv-001",
        "created_at": (base_time + timedelta(days=8)).isoformat()
    })
    firs.append({
        "id": "fir-219",
        "fir_number": "FIR-219/2026",
        "title": "Cross-Border Hawala Settlement via Bullion Market Intermediaries",
        "description": "Financial Intelligence alert regarding structured cash withdrawals and immediate conversion to unbilled gold bullion across Chandni Chowk and Surat nodes. Linked directly to Aman Singhania (P-037) and Kunal Verma (P-033).",
        "acts_sections": "PMLA 2002 Sec 3, 4; IPC 420, 120B",
        "date": (base_time + timedelta(days=27)).isoformat(),
        "police_station": "Economic Offences Wing (EOW), New Delhi",
        "location_id": "loc-l-009",
        "investigation_id": "inv-001",
        "created_at": (base_time + timedelta(days=27)).isoformat()
    })
    # Additional 44 FIRs
    for i in range(7, 51):
        case_type = ["Extortion & Coercion", "Unmanifested Cargo", "Cyber Phishing & Loan Fraud", "Hawala Cash Movement"][i % 4]
        station = ["Okhla PS", "Nhava Sheva PS", "Gurugram Cyber PS", "Surat City PS", "Crime Branch Delhi"][i % 5]
        loc_id = f"loc-l-{i % 20 + 1:03d}" if (i % 20 + 1) < 10 else f"loc-l-{i % 20 + 1:03d}"
        # fix loc_id formatting
        l_num = (i % 20) + 1
        loc_id = f"loc-l-0{l_num}" if l_num < 10 else f"loc-l-{l_num}"
        firs.append({
            "id": f"fir-{100 + i}",
            "fir_number": f"FIR-{100 + i}/2026",
            "title": f"Incident Report: {case_type} Pattern #{i}",
            "description": f"Field intelligence report detailing regional syndicate incident #{i} involving localized transport and digital remittance coercion.",
            "acts_sections": "IPC 384, 420, 120B / IT Act 66D",
            "date": (base_time + timedelta(days=(i % 35) + 1)).isoformat(),
            "police_station": station,
            "location_id": loc_id,
            "investigation_id": "inv-001" if i < 35 else "inv-002",
            "created_at": (base_time + timedelta(days=(i % 35) + 1)).isoformat()
        })

    # 10. Evidence Records (30 Items with realistic SHA-256 hashes)
    evidence_items = []
    evidence_specs = [
        ("EVID-1023", "FIR-102 Certified Copy & Complainant Statements", "Certified copy of FIR-102 and signed affidavit of transport union supervisor regarding extortion demands by P-011 and V-009 vehicle sightings.", "fir", "https://evidence-vault.ncrb.internal/docs/fir_102_certified.pdf", "verified", "FIR-102"),
        ("EVID-1024", "CDR Log Dump - Operation Trident Target Cell A", "Forensic call data records spanning 45 days covering cellular towers adjacent to Dhaula Kuan, Nhava Port, and Okhla.", "cdr_log", "https://evidence-vault.ncrb.internal/cdr/cdr_783_tower_dump.csv", "verified", "CDR-783"),
        ("EVID-1025", "Bank Transaction Ledger TX-091 to TX-098", "Verified ledger from HDFC Bank for Swift Horizons account B-021 confirming structured rapid disbursals to mule accounts.", "financial_statement", "https://evidence-vault.ncrb.internal/fin/tx_091_swift_horizons.pdf", "verified", "TX-091"),
        ("EVID-1026", "Nhava Sheva Warehouse 4B CCTV Footage", "CCTV video recording from Gate 4 camera showing black Fortuner V-009 meeting container trailer V-004 at 01:24 AM on Aug 24.", "surveillance_cctv", "https://evidence-vault.ncrb.internal/cctv/sur_009_dockyard_4b.mp4", "verified", "SUR-009"),
        ("EVID-1027", "Vahan Telemetry & Toll Plaza Record VR-021", "Electronic toll collection logs for DL-01-AX-9921 showing concurrent transit with suspect transport fleets across Ambala and Delhi tolls.", "vehicle_telemetry", "https://evidence-vault.ncrb.internal/vahan/vr_021_toll_corridor.json", "verified", "VR-021"),
        ("EVID-1028", "Seized Encrypted MicroSD Card Image (P-014 Device)", "Bit-stream forensic image of SanDisk 128GB MicroSD seized from safehouse L-004 containing encrypted ledgers.", "forensic_disk", "https://evidence-vault.ncrb.internal/forensics/p014_sd_image.dd", "verified", "FOR-014"),
        ("EVID-1029", "OSINT Public News Capture: Trident Logistics Expansion", "Web archive capture of business news article detailing sudden ₹50 Cr capital infusion into Trident Global Logistics.", "osint_capture", "https://news.public-archive.org/articles/trident-expansion-2026", "verified", "OSINT-001"),
        ("EVID-1030", "Forensic Audit Report: Kuber Trust Account Layering", "EOW analytical audit proving ₹2.8 Cr in cyber fraud proceeds were routed through 18 student mule accounts in 48 hours.", "financial_statement", "https://evidence-vault.ncrb.internal/fin/kuber_mule_audit.pdf", "verified", "FIN-033"),
        ("EVID-1031", "FIR-145 Customs Seizure Memo & Seal Inspection", "Official seizure memo of tampered shipping containers at Mundra and Nhava Sheva berths.", "fir", "https://evidence-vault.ncrb.internal/docs/fir_145_seizure_memo.pdf", "verified", "FIR-145"),
        ("EVID-1032", "Satellite Phone Geolocation Intercept Logs", "Signal intercept logs showing communication between offshore vessel in Arabian Sea and Tariq Ahmed's satellite handset.", "cdr_log", "https://evidence-vault.ncrb.internal/cdr/sat_intercept_tariq.bin", "verified", "CDR-890")
    ]
    for i, (ecode, title, desc, stype, url, vstatus, code_ref) in enumerate(evidence_specs):
        hash_input = f"{ecode}_{title}_{url}_{vstatus}_{i}"
        computed_hash = hashlib.sha256(hash_input.encode()).hexdigest()
        evidence_items.append({
            "id": f"evid-{ecode.lower()}",
            "evidence_code": ecode,
            "investigation_id": "inv-001",
            "title": title,
            "description": desc,
            "file_path": f"/vault/evidence/{ecode.lower()}.dat",
            "file_size_bytes": 1024 * 1024 * (i + 2),
            "sha256_hash": computed_hash,
            "source_type": stype,
            "source_url": url,
            "created_by": "u-001",
            "created_at": (base_time + timedelta(days=i * 3 + 2)).isoformat(),
            "verified_at": (base_time + timedelta(days=i * 3 + 3)).isoformat(),
            "verification_status": vstatus,
            "code_ref": code_ref
        })
    # Additional 20 evidence items to make 30 total
    for i in range(11, 31):
        ecode = f"EVID-10{30 + i}"
        stype = ["fir", "cdr_log", "financial_statement", "surveillance_cctv", "osint_capture"][i % 5]
        hash_input = f"{ecode}_Evidence_Record_{i}"
        computed_hash = hashlib.sha256(hash_input.encode()).hexdigest()
        evidence_items.append({
            "id": f"evid-{ecode.lower()}",
            "evidence_code": ecode,
            "investigation_id": "inv-001" if i < 25 else "inv-002",
            "title": f"Investigative Exhibit {ecode}: Forensic Annexure {i}",
            "description": f"Verified investigative documentary exhibit #{i} supporting Operation Trident multi-agency findings.",
            "file_path": f"/vault/evidence/{ecode.lower()}.dat",
            "file_size_bytes": 512 * 1024 * (i % 10 + 1),
            "sha256_hash": computed_hash,
            "source_type": stype,
            "source_url": f"https://evidence-vault.ncrb.internal/records/{ecode.lower()}.pdf",
            "created_by": "u-001" if i % 2 == 0 else "u-002",
            "created_at": (base_time + timedelta(days=i)).isoformat(),
            "verified_at": (base_time + timedelta(days=i + 1)).isoformat(),
            "verification_status": "verified",
            "code_ref": f"EXHIBIT-{i}"
        })

    # 11. Transactions (210 Transactions)
    transactions = []
    # Key Demonstration Chains:
    # 1. Extortion Ingress -> B-008 -> B-021 (Swift Horizons) -> B-015 (Maritime Apex) -> Offshore O-010
    # 2. Cyber Scam Ingress -> B-033 -> B-021 -> B-037 (Bullion) -> Cash Bullion
    # 3. Circular Wash Loop: B-008 -> B-015 -> B-021 -> B-008
    tx_chains = [
        ("acc-b-008", "acc-b-021", 250000.00, 15, "wire_transfer", True, "Aggregated extortion protection money forwarded to clearing hub"),
        ("acc-b-021", "acc-b-015", 180000.00, 16, "wire_transfer", True, "Logistics support disbursement to Tariq Ahmed's maritime account"),
        ("acc-b-015", "acc-b-021", 170000.00, 18, "wire_transfer", True, "Rapid return transit indicating circular liquidity cycling"),
        ("acc-b-033", "acc-b-021", 450000.00, 20, "mule_routing", True, "P2P Crypto loan scam proceeds layered into Swift Horizons"),
        ("acc-b-021", "acc-b-037", 420000.00, 21, "wire_transfer", True, "Immediate diversion to Aman Singhania's bullion clearing account"),
        ("acc-b-037", "acc-b-014", 390000.00, 23, "hawala_credit", True, "Settlement credit into Vikram Malhotra's Trident Logistics flagship account"),
        ("acc-b-014", "acc-b-008", 200000.00, 25, "wire_transfer", True, "Circular movement loop closure back to extortion syndicate pool")
    ]
    for i, (s_acc, r_acc, amt, day_offset, txtype, susp, reason) in enumerate(tx_chains):
        transactions.append({
            "id": f"tx-{100 + i}",
            "tx_code": f"TX-0{91 + i}" if i < 9 else f"TX-{91 + i}",
            "sender_account_id": s_acc,
            "receiver_account_id": r_acc,
            "amount": amt,
            "currency": "INR",
            "timestamp": (base_time + timedelta(days=day_offset, hours=14, minutes=i * 20)).isoformat(),
            "transaction_type": txtype,
            "is_suspicious": susp,
            "suspicion_reason": reason,
            "created_at": (base_time + timedelta(days=day_offset)).isoformat()
        })
    # Additional 200 transactions
    for i in range(8, 215):
        s_idx = (i % 35) + 1
        r_idx = ((i + 7) % 35) + 1
        s_code = f"B-0{s_idx}" if s_idx < 10 else f"B-{s_idx}"
        r_code = f"B-0{r_idx}" if r_idx < 10 else f"B-{r_idx}"
        day = (i % 38) + 1
        amt = round(25000.0 + (i * 1430.50) % 350000, 2)
        suspicious = (i % 4 == 0 or amt > 200000)
        transactions.append({
            "id": f"tx-{100 + i}",
            "tx_code": f"TX-{100 + i}",
            "sender_account_id": f"acc-{s_code.lower()}",
            "receiver_account_id": f"acc-{r_code.lower()}",
            "amount": amt,
            "currency": "INR",
            "timestamp": (base_time + timedelta(days=day, hours=(i % 24), minutes=(i * 7) % 60)).isoformat(),
            "transaction_type": ["wire_transfer", "mule_routing", "cash_deposit", "hawala_credit"][i % 4],
            "is_suspicious": suspicious,
            "suspicion_reason": "Structured velocity transfer exceeding algorithmic threshold" if suspicious else "Standard commercial flow",
            "created_at": (base_time + timedelta(days=day)).isoformat()
        })

    # 12. Communications (120 Synthetic CDRs)
    communications = []
    # Coordinated CDR sequences
    comm_seqs = [
        ("ph-ph-014", "ph-ph-021", 18, 14, 15, 420, "encrypted_voip", "loc-l-003"), # VM calls Captain
        ("ph-ph-021", "ph-ph-024", 18, 14, 35, 180, "call", "loc-l-012"),          # Captain calls Dockyard
        ("ph-ph-014", "ph-ph-011", 20, 10, 12, 340, "call", "loc-l-004"),          # VM calls Suresh Fixer
        ("ph-ph-011", "ph-ph-009", 20, 11, 00, 210, "call", "loc-l-002"),          # Fixer calls Deva Bhai
        ("ph-ph-014", "ph-ph-033", 22, 16, 45, 510, "encrypted_voip", "loc-l-018"), # VM calls Kunal Crypto
        ("ph-ph-033", "ph-ph-035", 22, 17, 10, 195, "call", "loc-l-008"),          # Crypto calls Meera
        ("ph-ph-033", "ph-ph-037", 23, 11, 20, 310, "call", "loc-l-009"),          # Crypto calls Aman Banker
        ("ph-ph-021", "ph-ph-014", 24, 2, 15, 145, "encrypted_voip", "loc-l-012")  # Captain calls VM from dock
    ]
    for i, (s_ph, t_ph, day, hr, mn, dur, ctype, loc) in enumerate(comm_seqs):
        communications.append({
            "id": f"cdr-{100 + i}",
            "cdr_code": f"CDR-0{80 + i}" if i < 10 else f"CDR-{80 + i}",
            "source_phone_id": s_ph,
            "target_phone_id": t_ph,
            "timestamp": (base_time + timedelta(days=day, hours=hr, minutes=mn)).isoformat(),
            "duration": dur,
            "communication_type": ctype,
            "tower_location_id": loc,
            "created_at": (base_time + timedelta(days=day)).isoformat()
        })
    # Additional 112 communications
    for i in range(8, 120):
        s_p = (i % 25) + 1
        t_p = ((i + 5) % 25) + 1
        s_code = f"PH-0{s_p}" if s_p < 10 else f"PH-{s_p}"
        t_code = f"PH-0{t_p}" if t_p < 10 else f"PH-{t_p}"
        day = (i % 38) + 1
        communications.append({
            "id": f"cdr-{100 + i}",
            "cdr_code": f"CDR-{100 + i}",
            "source_phone_id": f"ph-{s_code.lower()}",
            "target_phone_id": f"ph-{t_code.lower()}",
            "timestamp": (base_time + timedelta(days=day, hours=(i % 24), minutes=(i * 11) % 60)).isoformat(),
            "duration": 60 + (i * 17) % 600,
            "communication_type": ["call", "sms", "encrypted_voip"][i % 3],
            "tower_location_id": f"loc-l-{i % 20 + 1:02d}" if (i % 20 + 1) >= 10 else f"loc-l-0{i % 20 + 1}",
            "created_at": (base_time + timedelta(days=day)).isoformat()
        })

    # 13. Relationships (320 Graph Edges)
    # Heterogeneous relationships between Persons, Phones, Vehicles, Locations, Orgs, Accounts, FIRs
    relationships = []
    
    # Ownership & Association relationships
    # Persons -> Phones
    for p in phones:
        if p.get("owner_person_id"):
            relationships.append({
                "id": f"rel-ph-{p['phone_code'].lower()}",
                "investigation_id": "inv-001",
                "source_entity_type": "person",
                "source_entity_id": p["owner_person_id"],
                "target_entity_type": "phone",
                "target_entity_id": p["id"],
                "relationship_type": "owns",
                "confidence": 98.0,
                "timestamp": (base_time - timedelta(days=40)).isoformat(),
                "source": "Telecom KYC Registry",
                "evidence_id": "evid-evid-1024"
            })

    # Persons -> Vehicles
    for v in vehicles:
        if v.get("owner_person_id"):
            relationships.append({
                "id": f"rel-veh-{v['vehicle_code'].lower()}",
                "investigation_id": "inv-001",
                "source_entity_type": "person",
                "source_entity_id": v["owner_person_id"],
                "target_entity_type": "vehicle",
                "target_entity_id": v["id"],
                "relationship_type": "owns",
                "confidence": 95.0,
                "timestamp": (base_time - timedelta(days=40)).isoformat(),
                "source": "Vahan National Vehicle Database",
                "evidence_id": "evid-evid-1027"
            })

    # Persons/Orgs -> Bank Accounts
    for b in accounts:
        if b.get("holder_person_id"):
            relationships.append({
                "id": f"rel-acc-p-{b['account_code'].lower()}",
                "investigation_id": "inv-001",
                "source_entity_type": "person",
                "source_entity_id": b["holder_person_id"],
                "target_entity_type": "bank_account",
                "target_entity_id": b["id"],
                "relationship_type": "owns",
                "confidence": 99.0,
                "timestamp": (base_time - timedelta(days=40)).isoformat(),
                "source": "Banking KYC & Financial Intelligence",
                "evidence_id": "evid-evid-1025"
            })
        if b.get("holder_org_id"):
            relationships.append({
                "id": f"rel-acc-o-{b['account_code'].lower()}",
                "investigation_id": "inv-001",
                "source_entity_type": "organization",
                "source_entity_id": b["holder_org_id"],
                "target_entity_type": "bank_account",
                "target_entity_id": b["id"],
                "relationship_type": "owns",
                "confidence": 99.0,
                "timestamp": (base_time - timedelta(days=40)).isoformat(),
                "source": "MCA Corporate Filings",
                "evidence_id": "evid-evid-1025"
            })

    # Orgs -> HQ Locations
    for o in organizations:
        if o.get("headquarters_location_id"):
            relationships.append({
                "id": f"rel-org-loc-{o['org_code'].lower()}",
                "investigation_id": "inv-001",
                "source_entity_type": "organization",
                "source_entity_id": o["id"],
                "target_entity_type": "location",
                "target_entity_id": o["headquarters_location_id"],
                "relationship_type": "visited",
                "confidence": 92.0,
                "timestamp": (base_time - timedelta(days=40)).isoformat(),
                "source": "MCA Corporate Registry",
                "evidence_id": "evid-evid-1029"
            })

    # P-014 Connections (The Bridge)
    p014_links = [
        ("per-p-011", "associated_with", 92.0, 10, "Field intelligence reports & intercepted strategy meetings", "evid-evid-1028"),
        ("per-p-009", "connected_to", 88.0, 12, "Witness identification at GT Road logistics hub", "evid-evid-1023"),
        ("per-p-021", "associated_with", 95.0, 18, "Repeated joint presence at Dockyard Warehouse 4B", "evid-evid-1026"),
        ("per-p-024", "met", 89.0, 19, "Surveillance footage of cargo transfer instructions", "evid-evid-1026"),
        ("per-p-033", "transferred_money", 94.0, 22, "Encrypted financial ledger entries & crypto swap receipts", "evid-evid-1028"),
        ("per-p-035", "worked_with", 91.0, 23, "Company incorporation documents for Swift Horizons", "evid-evid-1025"),
        ("org-o-001", "associated_with", 99.0, 1, "Managing Director & Primary Shareholder", "evid-evid-1029"),
        ("loc-l-012", "visited", 96.0, 24, "CCTV & mobile tower triangulation at JNPT port warehouse", "evid-evid-1026"),
        ("loc-l-004", "visited", 94.0, 15, "Surveillance logs at Greenwood Enclave safehouse", "evid-evid-1027"),
        ("loc-l-018", "visited", 89.0, 26, "Hotel Zenith Aerocity business lounge meeting logs", "evid-evid-1027"),
        ("veh-v-009", "owns", 98.0, 1, "Direct operational custodian of surveillance Fortuner", "evid-evid-1027"),
        ("fir-fir-102", "appeared_in", 91.0, 5, "Named in witness statement regarding reconnaissance SUV", "evid-evid-1023"),
        ("fir-fir-145", "appeared_in", 94.0, 18, "Consignee company director named in seizure memo", "evid-evid-1031")
    ]
    for target_id, rel_type, conf, day_offset, src, evid in p014_links:
        target_type = target_id.split("-")[0]
        if target_type == "per":
            target_type = "person"
        elif target_type == "org":
            target_type = "organization"
        elif target_type == "loc":
            target_type = "location"
        elif target_type == "veh":
            target_type = "vehicle"
        elif target_type == "fir":
            target_type = "fir"
        relationships.append({
            "id": f"rel-p014-{target_id}",
            "investigation_id": "inv-001",
            "source_entity_type": "person",
            "source_entity_id": "per-p-014",
            "target_entity_type": target_type,
            "target_entity_id": target_id,
            "relationship_type": rel_type,
            "confidence": conf,
            "timestamp": (base_time + timedelta(days=day_offset)).isoformat(),
            "source": src,
            "evidence_id": evid
        })

    # Inter-Community Core Edges
    # Community A (Extortion) intra-links:
    for i in range(1, 20):
        src_p = f"per-p-0{i}" if i < 10 else f"per-p-{i}"
        tgt_p = f"per-p-0{(i % 19) + 1}" if ((i % 19) + 1) < 10 else f"per-p-{(i % 19) + 1}"
        relationships.append({
            "id": f"rel-commA-{i}",
            "investigation_id": "inv-001",
            "source_entity_type": "person",
            "source_entity_id": src_p,
            "target_entity_type": "person",
            "target_entity_id": tgt_p,
            "relationship_type": "worked_with" if i % 2 == 0 else "communicated_with",
            "confidence": round(80.0 + (i % 18), 1),
            "timestamp": (base_time + timedelta(days=(i % 25) + 1)).isoformat(),
            "source": "Inter-cell CDR & Field Surveillance",
            "evidence_id": "evid-evid-1024"
        })

    # Community B (Seaport & Contraband) intra-links:
    for i in range(21, 45):
        src_p = f"per-p-0{i}" if i < 10 else f"per-p-{i}"
        next_i = 21 + ((i - 20) % 24)
        tgt_p = f"per-p-0{next_i}" if next_i < 10 else f"per-p-{next_i}"
        relationships.append({
            "id": f"rel-commB-{i}",
            "investigation_id": "inv-001",
            "source_entity_type": "person",
            "source_entity_id": src_p,
            "target_entity_type": "person",
            "target_entity_id": tgt_p,
            "relationship_type": "associated_with" if i % 2 == 0 else "transferred_money",
            "confidence": round(82.0 + (i % 15), 1),
            "timestamp": (base_time + timedelta(days=(i % 28) + 1)).isoformat(),
            "source": "Port Terminal Gate Logs & Maritime Intelligence",
            "evidence_id": "evid-evid-1026"
        })

    # Community C (Cyber & Hawala) intra-links:
    for i in range(46, 75):
        src_p = f"per-p-0{i}" if i < 10 else f"per-p-{i}"
        next_i = 46 + ((i - 45) % 29)
        tgt_p = f"per-p-0{next_i}" if next_i < 10 else f"per-p-{next_i}"
        relationships.append({
            "id": f"rel-commC-{i}",
            "investigation_id": "inv-001",
            "source_entity_type": "person",
            "source_entity_id": src_p,
            "target_entity_type": "person",
            "target_entity_id": tgt_p,
            "relationship_type": "transferred_money" if i % 2 == 0 else "communicated_with",
            "confidence": round(84.0 + (i % 14), 1),
            "timestamp": (base_time + timedelta(days=(i % 30) + 1)).isoformat(),
            "source": "Bank Statement Subpoenas & Cyber Forensics",
            "evidence_id": "evid-evid-1025"
        })

    # Dense Inter-connections between entities to reach ~320 edges
    # Connect persons to locations, FIRs, vehicles
    for i in range(1, 100):
        p_code = f"P-0{i}" if i < 10 else f"P-{i}"
        loc_num = (i % 20) + 1
        loc_code = f"L-0{loc_num}" if loc_num < 10 else f"L-{loc_num}"
        fir_num = 100 + (i % 45) + 1
        
        # Visited location
        relationships.append({
            "id": f"rel-p-loc-{i}",
            "investigation_id": "inv-001",
            "source_entity_type": "person",
            "source_entity_id": f"per-{p_code.lower()}",
            "target_entity_type": "location",
            "target_entity_id": f"loc-{loc_code.lower()}",
            "relationship_type": "visited",
            "confidence": round(75.0 + (i % 22), 1),
            "timestamp": (base_time + timedelta(days=(i % 35) + 1)).isoformat(),
            "source": "Cell Tower Geolocation Dump",
            "evidence_id": "evid-evid-1024"
        })
        
        # FIR appearances for active suspects
        if i % 3 == 0:
            relationships.append({
                "id": f"rel-p-fir-{i}",
                "investigation_id": "inv-001",
                "source_entity_type": "person",
                "source_entity_id": f"per-{p_code.lower()}",
                "target_entity_type": "fir",
                "target_entity_id": f"fir-fir-{fir_num}",
                "relationship_type": "appeared_in",
                "confidence": round(80.0 + (i % 18), 1),
                "timestamp": (base_time + timedelta(days=(i % 30) + 1)).isoformat(),
                "source": "NCRB Crime Records Interconnect",
                "evidence_id": "evid-evid-1023"
            })

    # 14. Alerts (12 High-fidelity Alerts, including the USP: NET-017)
    alerts = [
        {
            "id": "alt-017",
            "alert_code": "NET-017",
            "alert_type": "emerging_network",
            "title": "Emerging Multi-Modal Syndicate Convergence Detected",
            "description": "Cross-jurisdictional convergence identified between Fleet Extortion Cell (Comm-A), Port Logistics Cell (Comm-B), and Hawala Layering Hub (Comm-C). A sharp acceleration of multi-modal ties formed over the last 28 days centered around Person P-014.",
            "confidence": 89.40,
            "severity": "critical",
            "status": "new",
            "investigation_id": "inv-001",
            "entities": [
                {"code": "P-014", "name": "Vikram Malhotra", "role": "Bridge / Coordinator"},
                {"code": "P-021", "name": "Tariq Ahmed", "role": "Maritime Expeditor"},
                {"code": "P-033", "name": "Kunal Verma", "role": "Crypto Escrow / Mule"},
                {"code": "P-037", "name": "Aman Singhania", "role": "Bullion Banker"},
                {"code": "V-009", "name": "DL-01-AX-9921", "role": "Shared Recon Vehicle"},
                {"code": "L-012", "name": "Dockyard Warehouse 4B", "role": "Meeting Hub"},
                {"code": "B-021", "name": "Swift Horizons ACC-992140", "role": "Clearing Hub"}
            ],
            "supporting_evidence_codes": ["FIR-102", "CDR-783", "TX-091", "VR-021", "SUR-009"],
            "explanation_factors": [
                {"factor": "Accelerated Communications", "detail": "4 new encrypted VoIP communication links established between P-014, P-021, and P-033."},
                {"factor": "Shared Geolocation Cluster", "detail": "3 shared locations detected within a 72-hour window, specifically at Dockyard Warehouse 4B (L-012)."},
                {"factor": "High-Velocity Capital Movement", "detail": "4 structured financial transfers totaling ₹10,40,000 routed through shell account B-021."},
                {"factor": "Shared Vehicle Reconnaissance", "detail": "Vehicle V-009 recorded at multiple disparate syndicate incident sites within 48 hours."},
                {"factor": "Activity Acceleration Rate", "detail": "73% surge in interaction frequency compared to the 30-day baseline period."},
                {"factor": "Multi-Community Bridging", "detail": "Direct bridge formed across 3 previously disconnected criminal network clusters."}
            ],
            "investigative_leads": [
                "Examine direct encrypted communications between Vikram Malhotra (P-014) and Tariq Ahmed (P-021) in the last 30 days.",
                "Subpoena Swift Horizons (B-021) upstream funding sources and transaction counterparties.",
                "Execute physical and technical surveillance review at Dockyard Warehouse 4B (L-012).",
                "Verify FASTag and toll logs for vehicle DL-01-AX-9921 (V-009) along Delhi-Mumbai freight corridor."
            ],
            "created_at": (base_time + timedelta(days=32)).isoformat()
        },
        {
            "id": "alt-009",
            "alert_code": "ACT-009",
            "alert_type": "coordinated_activity",
            "title": "Coordinated Extortion & Diversion Incident Sequence",
            "description": "Multi-step sequential operational pattern detected across 4 participants, 2 locations, and 7 communication handoffs within a 72-hour window preceding the Dhaula Kuan incident.",
            "confidence": 84.20,
            "severity": "high",
            "status": "investigating",
            "investigation_id": "inv-001",
            "entities": [
                {"code": "P-014", "name": "Vikram Malhotra"},
                {"code": "P-011", "name": "Suresh Nair"},
                {"code": "P-009", "name": "Devendra Yadav"},
                {"code": "V-009", "name": "DL-01-AX-9921"}
            ],
            "supporting_evidence_codes": ["FIR-102", "CDR-783", "VR-021"],
            "explanation_factors": [
                {"factor": "Sequential Workflow", "detail": "Call from P-014 to P-011 -> Fund transfer from B-021 to B-008 -> Meeting at L-004 -> Incident FIR-102 at L-005."},
                {"factor": "Tight Time Window", "detail": "All 5 operational steps transpired within 72 hours with sub-2 hour handoff intervals."},
                {"factor": "Vehicle Corroboration", "detail": "V-009 observed departing L-004 exactly 45 minutes before the roadblock occurred."}
            ],
            "investigative_leads": [
                "Reconstruct full tower ping logs for P-011 and P-009 around GT Road toll corridor.",
                "Review CCTV at Greenwood Enclave safehouse L-004 for pre-incident planning sessions."
            ],
            "created_at": (base_time + timedelta(days=28)).isoformat()
        },
        {
            "id": "alt-012",
            "alert_code": "HID-012",
            "alert_type": "hidden_relationship",
            "title": "Potential Indirect Connection: Vikram Malhotra (P-014) <-> Aman Singhania (P-037)",
            "description": "Graph link-prediction algorithms detected a strong latent relationship between P-014 and P-037 despite zero direct telecommunication records between their primary registered devices.",
            "confidence": 87.10,
            "severity": "high",
            "status": "new",
            "investigation_id": "inv-001",
            "entities": [
                {"code": "P-014", "name": "Vikram Malhotra"},
                {"code": "P-037", "name": "Aman Singhania"}
            ],
            "supporting_evidence_codes": ["TX-091", "FIN-033", "SUR-009"],
            "explanation_factors": [
                {"factor": "Common Associates (4 Mutual Neighbors)", "detail": "Both maintain dense, active edges with Tariq Ahmed (P-021), Kunal Verma (P-033), Suresh Nair (P-011), and Meera Sen (P-035)."},
                {"factor": "Shared Physical Geolocation (3 Sites)", "detail": "Concurrent tower pings at Aerocity Hotel Zenith (L-018), CP Financial Arcade (L-003), and Dockyard Warehouse 4B (L-012)."},
                {"factor": "Intermediary Financial Pass-Through", "detail": "Fund trail traces ₹4,20,000 from P-014's shell B-021 through Kunal Verma's mule accounts into Aman Singhania's bullion ledger B-037."}
            ],
            "investigative_leads": [
                "Investigate burner communication hardware seized at L-018 for unlinked VoIP accounts.",
                "Audit unbilled gold bullion deliveries to Trident Global Logistics headquarters."
            ],
            "created_at": (base_time + timedelta(days=34)).isoformat()
        },
        {
            "id": "alt-015",
            "alert_code": "FIN-015",
            "alert_type": "financial_pattern",
            "title": "Potentially Suspicious Circular Wash Transfer Pattern",
            "description": "Cyclic fund movement detected: B-008 -> B-015 -> B-021 -> B-014 -> B-008 totaling ₹12,00,000 without identifiable underlying commercial goods exchange.",
            "confidence": 91.20,
            "severity": "critical",
            "status": "new",
            "investigation_id": "inv-001",
            "entities": [
                {"code": "B-008", "name": "Axis Bank Extortion Pool"},
                {"code": "B-015", "name": "Kotak Maritime Port Account"},
                {"code": "B-021", "name": "Swift Horizons FinTech Hub"},
                {"code": "B-014", "name": "Trident Global Logistics Operational"}
            ],
            "supporting_evidence_codes": ["TX-091", "TX-092", "TX-093", "TX-094"],
            "explanation_factors": [
                {"factor": "Closed Circular Loop", "detail": "Capital returns to initial originating syndicate account within 10 days after passing through 4 distinct corporate entities."},
                {"factor": "Velocity Structuring", "detail": "Each leg executed within 48 hours of preceding credit to avoid regulatory freeze thresholds."},
                {"factor": "Synthetic Invoicing", "detail": "Invoices cited non-existent maritime container clearance and consultancy fees."}
            ],
            "investigative_leads": [
                "Issue Section 91 CrPC notice to Axis Bank and HDFC Bank for beneficiary IP address logs.",
                "Freeze intermediate accounts B-021 and B-015 pending source verification."
            ],
            "created_at": (base_time + timedelta(days=30)).isoformat()
        }
    ]

    # 15. OSINT Results (10 High-fidelity Public-web Search Records)
    osint_results = [
        {
            "id": "osint-001",
            "investigation_id": "inv-001",
            "query": "Trident Global Logistics Vikram Malhotra JNPT port expansion",
            "title": "Trident Global Logistics Announces Major Coastal Warehousing Expansion at Nhava Sheva",
            "snippet": "Logistics daily reports that Trident Global Logistics, headed by Managing Director Vikram Malhotra, has leased over 45,000 sq ft at Dockyard Terminal 4B. The company recently raised substantial private debt for multi-modal fleet acquisitions...",
            "url": "https://industry-press.example.com/logistics/2026/08/trident-global-nhava-expansion",
            "source_domain": "industry-press.example.com",
            "published_at": (base_time + timedelta(days=14)).isoformat(),
            "retrieved_at": (base_time + timedelta(days=35)).isoformat(),
            "relevance_score": 94.0,
            "entities_found": ["Vikram Malhotra", "Trident Global Logistics", "Dockyard Warehouse 4B", "Nhava Sheva"],
            "verification_status": "unverified"
        },
        {
            "id": "osint-002",
            "investigation_id": "inv-001",
            "query": "Swift Horizons FinTech Advisory MCA corporate filing directors",
            "title": "Company Master Data: Swift Horizons FinTech Advisory Private Limited",
            "snippet": "Incorporated in New Delhi, CIN: U72900DL2022PTC394811. Directors listed as Meera Sen and Kunal Verma. Registered office address: Barakhamba Road, Connaught Place. Authorized capital ₹10,00,000 with multiple recent debenture pledges...",
            "url": "https://mca-portal-public.example.in/company/swift-horizons-fintech",
            "source_domain": "mca-portal-public.example.in",
            "published_at": (base_time - timedelta(days=120)).isoformat(),
            "retrieved_at": (base_time + timedelta(days=35)).isoformat(),
            "relevance_score": 91.0,
            "entities_found": ["Swift Horizons FinTech Advisory", "Meera Sen", "Kunal Verma", "Connaught Place"],
            "verification_status": "unverified"
        },
        {
            "id": "osint-003",
            "investigation_id": "inv-001",
            "query": "Tariq Ahmed shipping agent maritime license customs notice",
            "title": "Maritime Trade Circular: Suspension of Expedited Brokerage Clearance for Apex Maritime",
            "snippet": "The Regional Shipping Registry issued a show-cause notice to Captain Tariq Ahmed of Apex Maritime Fleet Services regarding recurring discrepancies in container seal manifests across Gujarat and Maharashtra ports...",
            "url": "https://shipping-gazette.example.gov.in/notices/2026/apex-maritime-inquiry",
            "source_domain": "shipping-gazette.example.gov.in",
            "published_at": (base_time + timedelta(days=20)).isoformat(),
            "retrieved_at": (base_time + timedelta(days=35)).isoformat(),
            "relevance_score": 88.0,
            "entities_found": ["Tariq Ahmed", "Apex Maritime Fleet Services", "Customs Depot"],
            "verification_status": "unverified"
        },
        {
            "id": "osint-004",
            "investigation_id": "inv-001",
            "query": "Aman Singhania Surat Bullion Bourse commercial litigation",
            "title": "Commercial Arbitration Filing: Surat Bullion Clearing Bureau vs Inter-State Forex Trade",
            "snippet": "High Court commercial division lists matter concerning non-reconciliation of ₹8.4 Cr bullion credits involving Aman Singhania and affiliated trading firms operating out of Chandni Chowk and Surat...",
            "url": "https://legal-chronicle.example.com/cases/surat-bullion-clearing-arbitration",
            "source_domain": "legal-chronicle.example.com",
            "published_at": (base_time + timedelta(days=10)).isoformat(),
            "retrieved_at": (base_time + timedelta(days=35)).isoformat(),
            "relevance_score": 86.0,
            "entities_found": ["Aman Singhania", "Surat Bullion Clearing Bureau", "Chandni Chowk"],
            "verification_status": "unverified"
        },
        {
            "id": "osint-005",
            "investigation_id": "inv-001",
            "query": "Northern Haulers Association truck strike protest Dhaula Kuan",
            "title": "Freight Transporters Union Protests Unchecked Extortion Along National Corridors",
            "snippet": "Local transport operators staged a protest alleging that rogue cartels are collecting unreceipted levies under threat of physical violence. Spokesperson Suresh Nair claimed the union is cooperating with law enforcement...",
            "url": "https://delhi-metro-news.example.com/news/transporters-protest-extortion-highway",
            "source_domain": "delhi-metro-news.example.com",
            "published_at": (base_time + timedelta(days=7)).isoformat(),
            "retrieved_at": (base_time + timedelta(days=35)).isoformat(),
            "relevance_score": 89.0,
            "entities_found": ["Suresh Nair", "Northern Haulers Association", "Dhaula Kuan"],
            "verification_status": "unverified"
        }
    ]

    # 16. Audit Logs (25 initial entries)
    audit_logs = [
        {
            "id": "aud-001",
            "user_id": "u-001",
            "action": "LOGIN",
            "entity_type": "session",
            "entity_id": "u-001",
            "timestamp": (base_time + timedelta(days=36, hours=8, minutes=12)).isoformat(),
            "metadata": {"ip": "10.14.20.101", "role": "investigator", "device": "NCRB Secure Terminal #4"}
        },
        {
            "id": "aud-002",
            "user_id": "u-001",
            "action": "VIEW_INVESTIGATION",
            "entity_type": "investigation",
            "entity_id": "inv-001",
            "timestamp": (base_time + timedelta(days=36, hours=8, minutes=15)).isoformat(),
            "metadata": {"investigation_code": "OP-TRIDENT-2026"}
        },
        {
            "id": "aud-003",
            "user_id": "u-001",
            "action": "VERIFY_EVIDENCE_HASH",
            "entity_type": "evidence",
            "entity_id": "evid-evid-1023",
            "timestamp": (base_time + timedelta(days=36, hours=8, minutes=30)).isoformat(),
            "metadata": {"evidence_code": "EVID-1023", "status": "verified", "computed_match": True}
        },
        {
            "id": "aud-004",
            "user_id": "u-002",
            "action": "OSINT_QUERY",
            "entity_type": "osint_results",
            "entity_id": "osint-001",
            "timestamp": (base_time + timedelta(days=36, hours=9, minutes=45)).isoformat(),
            "metadata": {"query": "Trident Global Logistics Vikram Malhotra JNPT port expansion"}
        },
        {
            "id": "aud-005",
            "user_id": "u-001",
            "action": "REVIEW_ALERT",
            "entity_type": "alert",
            "entity_id": "alt-017",
            "timestamp": (base_time + timedelta(days=36, hours=10, minutes=10)).isoformat(),
            "metadata": {"alert_code": "NET-017", "decision": "promoted_to_high_priority"}
        }
    ]

    return {
        "users": users,
        "investigations": investigations,
        "persons": persons,
        "phone_numbers": phones,
        "vehicles": vehicles,
        "locations": locations,
        "organizations": organizations,
        "bank_accounts": accounts,
        "firs": firs,
        "evidence": evidence_items,
        "transactions": transactions,
        "communications": communications,
        "relationships": relationships,
        "alerts": alerts,
        "osint_results": osint_results,
        "audit_logs": audit_logs
    }

if __name__ == "__main__":
    data = generate_full_dataset()
    print("Generated data counts:")
    for k, v in data.items():
        print(f"  {k}: {len(v)}")
