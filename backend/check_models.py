import google.generativeai as genai
import os

# --- HARDCODE THE KEY JUST FOR THIS TEST ---
# Go to your .env file, copy the text after GEMINI_API_KEY=, and paste it here.
REAL_KEY = "AIzaSyBFpzwlsh4XgeWRxAdTmwIMktlHypK_Ooo"
# -------------------------------------------

if "PASTE" in REAL_KEY:
    print("❌ YOU FORGOT TO PASTE THE KEY!")
    exit()

genai.configure(api_key=REAL_KEY)

print("---------------------------------------------------")
print("Checking available models...")

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ AVAILABLE: {m.name}")
except Exception as e:
    print(f"❌ ERROR: {e}")