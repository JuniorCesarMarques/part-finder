export function cosineSimilarity(a: number[], b: number[]) {
  if (!a || !b) return 0;

  if (a.length !== b.length) {
    console.warn("Embedding size mismatch:", a.length, b.length);
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const ai = Number(a[i]);
    const bi = Number(b[i]);

    if (!Number.isFinite(ai) || !Number.isFinite(bi)) {
      continue;
    }

    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);

  if (!Number.isFinite(denom) || denom === 0) return 0;

  const result = dot / denom;

  if (result > 1) return 1;
  if (result < -1) return -1;

  return result;
}