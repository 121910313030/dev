import json
from groq import Groq

client = Groq()

def get_resume_score(resumes, jd_text):

    results = []

    for resume in resumes:

        prompt = f"""
        Evaluate how well the resume matches the job description.

        SCORING RULES:
        - 90–100 → Excellent match (skills + experience match strongly)
        - 70–89 → Good match (most skills match, minor gaps)
        - 50–69 → Average match (some skills match)
        - 30–49 → Weak match (few relevant skills)
        - 0–29 → Poor match (not relevant)

        EVALUATION CRITERIA:
        1. Skills match (50%)
        2. Experience match (30%)
        3. Semantic similarity (20%) (related technologies count)

        IMPORTANT RULES:
        - Do NOT give 0 unless completely unrelated
        - Focus on core backend skills first
        - Related technologies count (Flask ≈ Django)

        Compare this resume with the job description.
        Job Description:
        {jd_text}

        Resume:
        {resume['text']}

        Return ONLY a raw JSON object. No markdown, no backticks, no preamble.
        {{
        "score": number between 0 and 100,
        "skills": ["skill1","skill2"],
        "experience_years": number,
        "reason": "short explanation"
        }}
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )

        content = response.choices[0].message.content

        print("AI raw response:", content)  

        try:
            parsed = json.loads(content)
        except:
            parsed = {
                "score": 0,
                "skills": [],
                "experience_years": 0,
                "reason": content
            }

        results.append(parsed)
 
    return results