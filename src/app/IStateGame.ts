export interface IStateGame{
    question: string;
      answer: string;
      partialAnswer: string;
      score: number;
      isOneLetter: boolean;
      isBlockInput: boolean;
      isOnGame: boolean;
      remainingAttempts: number;
      currentIndex?: number;
}