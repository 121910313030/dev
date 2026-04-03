import json
from groq import Groq

client = Groq()

def get_resume_score(resumes, jd_text, weights):
    results = []

    for resume in resumes:
        prompt = f"""
        Evaluate how well the resume matches the job description and assess data quality.

        SCORING RULES:
        - 90–100 → Excellent match
        - 70–89 → Good match
        - 50–69 → Average match
        - 30–49 → Weak match
        - 0–29 → Poor match

        CONFIDENCE BADGE RULES (Based on Resume Formatting/Structure):
        - "High": Well-structured text, clear sections (Experience, Education, Skills).
        - "Medium": Readable but some formatting is inconsistent or sections are merged.
        - "Low": Garbled text, missing key headers, or poor OCR/extraction quality.

        EVALUATION CRITERIA (USE THESE EXACT PERCENTAGES):
        1. Skills match ({weights['skills']}%)
        2. Experience match ({weights['experience']}%)
        3. Semantic similarity ({weights['semantic']}%)

        Job Description:
        {jd_text}

        Resume Text:
        {resume['text']}

        Return ONLY a raw JSON object:
        {{
        "score": number,
        "confidence_level": "High" | "Medium" | "Low",
        "experience_years": number,
        "reason": "short explanation",
        "formatting_note": "brief comment on resume structure"
        }}
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content

        try:
            parsed = json.loads(content)
        except:
            parsed = {
                "score": 0,
                "confidence_level": "Low",
                "experience_years": 0,
                "reason": "Failed to parse AI response",
                "formatting_note": "Technical error during evaluation"
            }

        results.append(parsed)
 
    return results