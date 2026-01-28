import requests
import json
import os
from dotenv import load_dotenv
from app.domains.memory_bank import find_relevant_precedent
from app.domains.policy_engine import get_active_policy

load_dotenv()

class TribunalService:
    @staticmethod
    async def conduct_tribunal(scenario_ctx: str, user_input: str, actions: list, rubric: dict):
        
        # ---------------------------------------------------------
        # LAYER 1: MEMORY (Precedent)
        # ---------------------------------------------------------
        precedent = find_relevant_precedent(user_input)
        precedent_text = "NO PRIOR INCIDENTS FOUND."
        citation_val = "None"

        if precedent:
            citation_val = precedent['name']
            precedent_text = f"""
            CRITICAL WARNING - HISTORICAL MATCH FOUND:
            Incident ID: {precedent['id']}
            Event: {precedent['name']}
            Cause: {precedent['trigger']}
            Outcome: {precedent['outcome']}
            """

        # ---------------------------------------------------------
        # LAYER 2: POLICY (PDF)
        # ---------------------------------------------------------
        real_policy = get_active_policy()
        policy_context = "NO SPECIFIC POLICY LOADED."
        
        if real_policy:
            # Truncate slightly to fit Llama context window if needed
            policy_context = f"""
            ACTIVE POLICY (THE LAW):
            {real_policy[:4000]}...
            """

        # ---------------------------------------------------------
        # LAYER 3: OLLAMA INFERENCE
        # ---------------------------------------------------------
        
        # Use the variable from docker-compose, or default to localhost
        ollama_host = os.getenv("OLLAMA_HOST", "http://host.docker.internal:11434")
        api_url = f"{ollama_host}/api/generate"

        # Llama 3.1 Prompt Engineering
        # We put the instruction in the 'system' style prompt for better adherence
        prompt = f"""
        CONTEXT:
        You are S.Y.B.I.L., a Tribunal of 3 Sub-Personalities:
        1. HAWK (Risk/Compliance - Aggressive)
        2. DOVE (Business Value - Forgiving)
        3. OWL (Logic/Coherence - Neutral)

        INPUT DATA:
        [MEMORY]: {precedent_text}
        [POLICY]: {policy_context}
        [SCENARIO]: {scenario_ctx}
        [USER ACTION]: "{user_input}"

        TASK:
        Evaluate the USER ACTION against the MEMORY and POLICY.
        If a Memory or Policy violation exists, HAWK must be 5/5 (High Risk).
        
        OUTPUT FORMAT:
        Respond ONLY with valid JSON. Do not write explanations outside the JSON.
        {{
            "HAWK": {{ "score": <int 1-5>, "reasoning": "<string>" }},
            "DOVE": {{ "score": <int 1-5>, "reasoning": "<string>" }},
            "OWL":  {{ "score": <int 1-5>, "reasoning": "<string>" }},
            "citation": "{citation_val}"
        }}
        """

        try:
            print(f"📡 CONTACTING OLLAMA AT: {api_url}")
            
            response = requests.post(api_url, json={
                "model": "llama3.1:8b-instruct-q4_K_M",  # Exact model tag
                "prompt": prompt,
                "stream": False,
                "format": "json", # <--- CRITICAL: Forces Llama to output valid JSON
                "options": {
                    "temperature": 0.1, # Keep it strict
                    "num_ctx": 4096     # Ensure enough context for the PDF
                }
            }, timeout=120) # 120s timeout to prevent hanging

            if response.status_code != 200:
                print(f"❌ OLLAMA ERROR: {response.text}")
                return {"status": "ERROR", "final_score": 0, "variance": 0, "graders": {}}

            # Parse Response
            result_json = response.json()
            generated_text = result_json.get("response", "")
            
            data = json.loads(generated_text)
            
            # ---------------------------------------------------------
            # LAYER 4: FORMATTING
            # ---------------------------------------------------------
            final_verdict = {
                "final_score": 0,
                "variance": 0,
                "status": "SCORED",
                "graders": {},
                "citation": data.get("citation", citation_val) 
            }
            
            scores = []
            for judge in ["HAWK", "DOVE", "OWL"]:
                result = data.get(judge, {"score": 1, "reasoning": "Analysis failed."})
                final_verdict["graders"][judge] = {
                    "score": result["score"],
                    "reasoning": result["reasoning"]
                }
                scores.append(result["score"])

            if scores:
                final_verdict["final_score"] = round(sum(scores) / len(scores), 1)
                final_verdict["variance"] = round(max(scores) - min(scores), 1)

            return final_verdict

        except Exception as e:
            print(f"❌ CONNECTION ERROR: {e}")
            # Fallback for debugging (so the UI doesn't just die)
            return {
                "status": "ERROR", 
                "final_score": 0, 
                "variance": 0, 
                "graders": {
                    "HAWK": {"score": 0, "reasoning": "Ollama Unreachable"},
                    "DOVE": {"score": 0, "reasoning": "Check Docker Logs"},
                    "OWL": {"score": 0, "reasoning": str(e)}
                }
            }