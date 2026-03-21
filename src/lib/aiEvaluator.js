// Simulated Fine-Tuned AI Evaluator System

const trainingMemory = [
  { type: "good", keywords: ["scalable", "optimal", "microservices", "clean", "cache", "efficiency"], baseScore: 90 },
  { type: "mid", keywords: ["loop", "function", "basic", "working", "simple pattern"], baseScore: 65 },
  { type: "bad", keywords: ["test", "idk", "hello world", "dummy", "unfinished", "todo"], baseScore: 30 }
];

const rubric = {
  innovation: { w: 0.25, max: 25 },
  feasibility: { w: 0.25, max: 25 },
  clarity: { w: 0.20, max: 20 },
  marketPotential: { w: 0.30, max: 30 }
};

export async function evaluate(problem, solutionText) {
  const text = (solutionText || "").toLowerCase();
  
  let matchHits = { good: 0, mid: 0, bad: 0 };
  
  trainingMemory.forEach(category => {
    category.keywords.forEach(kw => {
      if (text.includes(kw)) matchHits[category.type]++;
    });
  });

  const wordCount = text.split(/\s+/).length;
  const lengthBonus = Math.min(wordCount / 10, 15); 
  
  let baseline = 50; 
  if (matchHits.bad > matchHits.good && matchHits.bad > matchHits.mid) {
    baseline = 35;
  } else if (matchHits.good > matchHits.mid) {
    baseline = 75;
  } else if (matchHits.mid > 0) {
    baseline = 60;
  }

  let finalScore = Math.min(Math.round(baseline + lengthBonus + (matchHits.good * 2)), 100);
  if (wordCount < 10) finalScore = Math.max(0, finalScore - 30); 
  
  const innovation = Math.min(Math.round(finalScore * rubric.innovation.w), rubric.innovation.max);
  const feasibility = Math.min(Math.round(finalScore * rubric.feasibility.w), rubric.feasibility.max);
  const clarity = Math.min(Math.round(finalScore * rubric.clarity.w), rubric.clarity.max);
  const marketPotential = Math.max(0, finalScore - (innovation + feasibility + clarity));

  const summaries = {
    excellent: "A highly innovative, technically feasible and well-structured solution displaying excellent market potential.",
    good: "A solid implementation with good clarity and feasibility, though slightly lacking in deep innovation.",
    average: "A basic solution that addresses the problem but lacks comprehensive structuring, scalability, or market insight.",
    poor: "An incomplete or poorly structured solution that requires significant improvement in clarity and approach."
  };

  let category = "average";
  if (finalScore >= 85) category = "excellent";
  else if (finalScore >= 65) category = "good";
  else if (finalScore < 50) category = "poor";

  let reasoningStr = "The AI Evaluation Engine analyzed your submission against industry standards. ";
  
  if (matchHits.good >= 2) {
    reasoningStr += "Your approach demonstrated an excellent command of scalable architecture and optimal design patterns. ";
  } else if (matchHits.good === 1) {
    reasoningStr += "It recognized practical core technical implementations, though there is room to expand on structural details. ";
  } else {
    reasoningStr += "The technical depth was somewhat superficial, missing key architectural keywords expected in enterprise-grade solutions. ";
  }
  
  if (matchHits.bad > 0) {
    reasoningStr += "Several segments appeared unfinished or relied heavily on basic placeholder logic, which impacted the overall feasibility score. ";
  }
  
  if (wordCount < 40) {
    reasoningStr += `Because the explanation was exceptionally brief (${wordCount} words), it severely limited the model's ability to thoroughly validate your core hypothesis.`;
  } else {
    reasoningStr += `Overall, the level of detail (${wordCount} words) provided a sufficiently ${category} foundation for evaluating your technical roadmap.`;
  }

  return {
    innovation,
    feasibility,
    clarity,
    marketPotential,
    finalScore,
    summary: summaries[category],
    reasoning: reasoningStr.trim()
  };
}
