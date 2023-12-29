export interface Quiz {
  id: string;
  items: QuizItem[];
  name: string;
  author: string;
}

export interface QuizItem {
  id: string;
  question: string;
  multi_choice: boolean;
  options: QuizOptions[];
}

export interface QuizOptions {
  id: string;
  value: string;
}