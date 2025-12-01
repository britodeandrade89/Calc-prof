export interface HistoryItem {
  id: number;
  value: number;
  originalInput: string;
}

export interface StudentGrade {
  id: number;
  studentName?: string;
  total: number;
  details: string;
  timestamp: string;
}
