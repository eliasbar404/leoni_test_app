export interface Answer {
    text: string;
    isCorrect: boolean;
  }
  
  export interface NumberAnswer {
    number: number;
    text: string;
  }
  
  export interface Question {
    text: string;
    point: string;
    type: "ONE_SELECTE" | "MULTI_SELECTE" | "IMAGE";
    
    answers: Answer[];
    imageFile?: File;
    imagePreviewUrl?: string;
    numberAnswers?: NumberAnswer[];
  }