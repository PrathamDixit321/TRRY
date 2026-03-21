import Solution from "@/models/Solution";

export async function evaluateWithAI(problemText, solutionId, solutionText, origin) {
  try {
    const res = await fetch(`${origin}/api/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem: problemText, solution: solutionText })
    });
    
    if (!res.ok) return null;
    const scores = await res.json();
    
    // Fallback if Mongoose is mocked or unavailable
    try {
      if (Solution && Solution.findByIdAndUpdate) {
        await Solution.findByIdAndUpdate(solutionId, {
          aiScore: scores.finalScore,
          aiFeedback: JSON.stringify(scores)
        });
      }
    } catch(e) { /* Ignore */ }
    
    return scores;
  } catch (error) {
    console.error("evaluateWithAI integration error:", error);
    return null;
  }
}
