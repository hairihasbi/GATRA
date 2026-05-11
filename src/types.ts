export type ModuleId = 'translasi' | 'refleksi' | 'dilatasi' | 'rotasi' | 'kombinasi' | 'lab';

export interface TransformationParams {
  a: number; // Vertical stretch/compression
  b: number; // Horizontal stretch/compression
  c: number; // Horizontal shift
  d: number; // Vertical shift
  x1: number; // Initial x position
  y1: number; // Initial y position
  reflectX: boolean;
  reflectY: boolean;
  rotation: number; // Rotation in degrees (though usually not standard in simple function transformations, but user asked for it)
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type QuizMode = 'solo' | 'duel';
export type QuestionType = 'single' | 'complex' | 'dragdrop';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  func: string;
  params: TransformationParams;
  options: string[]; // For single and complex
  correctIndex?: number; // For single
  correctIndices?: number[]; // For complex
  dragItems?: { id: string; content: string; matchId: string }[]; // For dragdrop
  dropZones?: { id: string; label: string; matchId: string }[]; // For dragdrop
  difficulty: QuizDifficulty;
}
