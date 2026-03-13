import json
from groq import Groq

client = Groq()

def get_resume_score(resumes, jd_text):

    results = []

    for resume in resumes:

        prompt = f"""
You are an ATS system.

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
            messages=[{"role": "user", "content": prompt}]
        )

        content = response.choices[0].message.content

        print("AI raw response:", content)  

        try:
            parsed = json.loads(content)
        except:
            parsed = {
                "score": 0,
                "skills": [],
                "Experience": 0,
                "reason": content
            }

        results.append(parsed)

    return results