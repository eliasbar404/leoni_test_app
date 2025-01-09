export interface Test {
    id: string;
    title: string;
    description: string;
    code: string;
    category: string;
    testPoints: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    createdAt: string;
    open_time: string;
    close_time:string;
    timeLimit:number;
    creatorName: string;
  }