interface DocumentAnalysis {
  original_filename: string
  summary_text: string
  risky_points: string[]
  favourable_points: string[]
  confidence_score: number
}

export function getDocumentShareContent(analysis: DocumentAnalysis): string {
  return `Document Analysis: ${analysis.original_filename}\n\n
		  Summary: ${analysis.summary_text}\n\nRisks: ${analysis.risky_points.length}\n
		  Favorable Points: ${analysis.favourable_points.length}\nConfidence: ${(analysis.confidence_score * 100).toFixed(0)}%`
}
