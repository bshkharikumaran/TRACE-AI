"""
Script to build persistent seed JSON and SQL files.
"""

import json
from pathlib import Path
from backend.app.database.seed_generator import generate_full_dataset

def build():
    data = generate_full_dataset()
    base_dir = Path(__file__).resolve().parent
    data_dir = base_dir.parent.parent / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Save seed_data.json
    json_path = data_dir / "seed_data.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {json_path} successfully ({json_path.stat().st_size} bytes)")

    # Generate supabase/seed.sql
    supabase_dir = base_dir.parent.parent.parent / "supabase"
    supabase_dir.mkdir(parents=True, exist_ok=True)
    sql_path = supabase_dir / "seed.sql"
    
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write("-- CRIMESHIELD AI — SUPABASE SYNTHETIC SEED DATA FOR OPERATION TRIDENT\n\n")
        
        # Users
        for u in data["users"]:
            f.write(f"INSERT INTO users (id, name, email, role, department, badge_number, created_at) "
                    f"VALUES ('{u['id']}', '{u['name']}', '{u['email']}', '{u['role']}', '{u['department']}', '{u['badge_number']}', '{u['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Investigations
        for inv in data["investigations"]:
            desc = inv['description'].replace("'", "''")
            title = inv['title'].replace("'", "''")
            f.write(f"INSERT INTO investigations (id, investigation_code, title, description, status, priority, created_at) "
                    f"VALUES ('{inv['id']}', '{inv['investigation_code']}', '{title}', '{desc}', '{inv['status']}', '{inv['priority']}', '{inv['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Locations
        for loc in data["locations"]:
            name = loc['name'].replace("'", "''")
            addr = loc['address'].replace("'", "''")
            f.write(f"INSERT INTO locations (id, name, address, city, state, latitude, longitude, location_type, created_at) "
                    f"VALUES ('{loc['id']}', '{name}', '{addr}', '{loc['city']}', '{loc['state']}', {loc['latitude']}, {loc['longitude']}, '{loc['location_type']}', '{loc['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Organizations
        for org in data["organizations"]:
            name = org['name'].replace("'", "''")
            hq = f"'{org['headquarters_location_id']}'" if org.get('headquarters_location_id') else "NULL"
            f.write(f"INSERT INTO organizations (id, name, type, registration_id, headquarters_location_id, created_at) "
                    f"VALUES ('{org['id']}', '{name}', '{org['type']}', '{org['registration_id']}', {hq}, '{org['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Persons
        for p in data["persons"]:
            name = p['name'].replace("'", "''")
            alias = p['alias'].replace("'", "''") if p.get('alias') else ""
            occ = p['occupation'].replace("'", "''")
            f.write(f"INSERT INTO persons (id, person_code, name, alias, age, gender, occupation, risk_score, network_score, primary_role, status, created_at) "
                    f"VALUES ('{p['id']}', '{p['person_code']}', '{name}', '{alias}', {p['age']}, '{p['gender']}', '{occ}', {p['risk_score']}, {p['network_score']}, '{p['primary_role']}', '{p['status']}', '{p['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Phone Numbers
        for ph in data["phone_numbers"]:
            lbl = ph['label'].replace("'", "''")
            owner = f"'{ph['owner_person_id']}'" if ph.get('owner_person_id') else "NULL"
            f.write(f"INSERT INTO phone_numbers (id, phone_hash, masked_number, label, carrier, owner_person_id, created_at) "
                    f"VALUES ('{ph['id']}', '{ph['phone_hash']}', '{ph['masked_number']}', '{lbl}', '{ph['carrier']}', {owner}, '{ph['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Vehicles
        for v in data["vehicles"]:
            m = v['make_model'].replace("'", "''")
            owner = f"'{v['owner_person_id']}'" if v.get('owner_person_id') else "NULL"
            f.write(f"INSERT INTO vehicles (id, registration_number, vehicle_type, make_model, color, owner_person_id, created_at) "
                    f"VALUES ('{v['id']}', '{v['registration_number']}', '{v['vehicle_type']}', '{m}', '{v['color']}', {owner}, '{v['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Bank Accounts
        for b in data["bank_accounts"]:
            h_p = f"'{b['holder_person_id']}'" if b.get('holder_person_id') else "NULL"
            h_o = f"'{b['holder_org_id']}'" if b.get('holder_org_id') else "NULL"
            f.write(f"INSERT INTO bank_accounts (id, account_reference, bank_name, account_type, holder_person_id, holder_org_id, is_flagged, created_at) "
                    f"VALUES ('{b['id']}', '{b['account_reference']}', '{b['bank_name']}', '{b['account_type']}', {h_p}, {h_o}, {b['is_flagged']}, '{b['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # FIRs
        for fir in data["firs"]:
            title = fir['title'].replace("'", "''")
            desc = fir['description'].replace("'", "''")
            acts = fir['acts_sections'].replace("'", "''")
            loc = f"'{fir['location_id']}'" if fir.get('location_id') else "NULL"
            inv = f"'{fir['investigation_id']}'" if fir.get('investigation_id') else "NULL"
            f.write(f"INSERT INTO firs (id, fir_number, title, description, acts_sections, date, police_station, location_id, investigation_id, created_at) "
                    f"VALUES ('{fir['id']}', '{fir['fir_number']}', '{title}', '{desc}', '{acts}', '{fir['date']}', '{fir['police_station']}', {loc}, {inv}, '{fir['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Evidence
        for ev in data["evidence"]:
            title = ev['title'].replace("'", "''")
            desc = ev['description'].replace("'", "''")
            f.write(f"INSERT INTO evidence (id, evidence_code, investigation_id, title, description, file_path, file_size_bytes, sha256_hash, source_type, source_url, verification_status, created_at) "
                    f"VALUES ('{ev['id']}', '{ev['evidence_code']}', '{ev['investigation_id']}', '{title}', '{desc}', '{ev['file_path']}', {ev['file_size_bytes']}, '{ev['sha256_hash']}', '{ev['source_type']}', '{ev['source_url']}', '{ev['verification_status']}', '{ev['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Transactions
        for tx in data["transactions"]:
            reason = tx['suspicion_reason'].replace("'", "''") if tx.get('suspicion_reason') else ""
            f.write(f"INSERT INTO transactions (id, sender_account_id, receiver_account_id, amount, currency, timestamp, transaction_type, is_suspicious, suspicion_reason, created_at) "
                    f"VALUES ('{tx['id']}', '{tx['sender_account_id']}', '{tx['receiver_account_id']}', {tx['amount']}, '{tx['currency']}', '{tx['timestamp']}', '{tx['transaction_type']}', {tx['is_suspicious']}, '{reason}', '{tx['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Communications
        for c in data["communications"]:
            loc = f"'{c['tower_location_id']}'" if c.get('tower_location_id') else "NULL"
            f.write(f"INSERT INTO communications (id, source_phone_id, target_phone_id, timestamp, duration, communication_type, tower_location_id, created_at) "
                    f"VALUES ('{c['id']}', '{c['source_phone_id']}', '{c['target_phone_id']}', '{c['timestamp']}', {c['duration']}, '{c['communication_type']}', {loc}, '{c['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Relationships
        for r in data["relationships"]:
            src = r['source'].replace("'", "''")
            evid = f"'{r['evidence_id']}'" if r.get('evidence_id') else "NULL"
            f.write(f"INSERT INTO relationships (id, investigation_id, source_entity_type, source_entity_id, target_entity_type, target_entity_id, relationship_type, confidence, timestamp, source, evidence_id, created_at) "
                    f"VALUES ('{r['id']}', '{r['investigation_id']}', '{r['source_entity_type']}', '{r['source_entity_id']}', '{r['target_entity_type']}', '{r['target_entity_id']}', '{r['relationship_type']}', {r['confidence']}, '{r['timestamp']}', '{src}', {evid}, '{r['timestamp']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # Alerts
        for a in data["alerts"]:
            title = a['title'].replace("'", "''")
            desc = a['description'].replace("'", "''")
            entities_json = json.dumps(a['entities']).replace("'", "''")
            evid_json = json.dumps(a['supporting_evidence_codes']).replace("'", "''")
            factors_json = json.dumps(a['explanation_factors']).replace("'", "''")
            f.write(f"INSERT INTO alerts (id, alert_code, alert_type, title, description, confidence, severity, status, investigation_id, entities, supporting_evidence_codes, explanation_factors, created_at) "
                    f"VALUES ('{a['id']}', '{a['alert_code']}', '{a['alert_type']}', '{title}', '{desc}', {a['confidence']}, '{a['severity']}', '{a['status']}', '{a['investigation_id']}', '{entities_json}'::jsonb, '{evid_json}'::jsonb, '{factors_json}'::jsonb, '{a['created_at']}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

        # OSINT Results
        for osint in data["osint_results"]:
            title = osint['title'].replace("'", "''")
            snippet = osint['snippet'].replace("'", "''")
            query = osint['query'].replace("'", "''")
            entities_json = json.dumps(osint['entities_found']).replace("'", "''")
            created_at = osint.get('created_at', osint['retrieved_at'])
            f.write(f"INSERT INTO osint_results (id, investigation_id, query, title, snippet, url, source_domain, published_at, retrieved_at, relevance_score, entities_found, verification_status, created_at) "
                    f"VALUES ('{osint['id']}', '{osint['investigation_id']}', '{query}', '{title}', '{snippet}', '{osint['url']}', '{osint['source_domain']}', '{osint['published_at']}', '{osint['retrieved_at']}', {osint['relevance_score']}, '{entities_json}'::jsonb, '{osint['verification_status']}', '{created_at}') "
                    f"ON CONFLICT (id) DO NOTHING;\n")
        f.write("\n")

    print(f"Wrote {sql_path} successfully ({sql_path.stat().st_size} bytes)")

if __name__ == "__main__":
    build()
