import requests

def ask_llm(prompt, model="llama3"):
    try:
        r = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": model, "prompt": prompt},
            stream=False
        )
        r.raise_for_status()
        return r.json()["response"].strip()
    except Exception as e:
        return f"[Error] {e}"
