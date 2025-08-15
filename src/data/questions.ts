export interface Question {
  id: string;
  statement: string;
  answer: boolean;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export const categories = {
  general: "General Knowledge",
  pop: "Pop Culture", 
  weird: "Weird Facts",
  kids: "Kids Mode",
  traps: "Trick Questions"
};

export const questions: Question[] = [
  // General Knowledge
  { id: "g1", statement: "Water boils at 100°C at sea level", answer: true, category: "general" },
  { id: "g2", statement: "There are 365 days in a year", answer: false, category: "general", explanation: "365.25 days (leap years)" },
  { id: "g3", statement: "The Earth is flat", answer: false, category: "general" },
  { id: "g4", statement: "Light travels faster than sound", answer: true, category: "general" },
  { id: "g5", statement: "Humans have 10 fingers", answer: true, category: "general" },
  { id: "g6", statement: "The moon is made of cheese", answer: false, category: "general" },
  { id: "g7", statement: "Fish can't swim backwards", answer: false, category: "general" },
  { id: "g8", statement: "Gravity pulls objects downward", answer: true, category: "general" },
  
  // Pop Culture
  { id: "p1", statement: "Harry Potter was written by J.K. Rowling", answer: true, category: "pop" },
  { id: "p2", statement: "Mickey Mouse was created by Walt Disney", answer: true, category: "pop" },
  { id: "p3", statement: "Superman can fly", answer: true, category: "pop" },
  { id: "p4", statement: "The Beatles had 5 members", answer: false, category: "pop" },
  { id: "p5", statement: "Netflix started as a DVD rental service", answer: true, category: "pop" },
  { id: "p6", statement: "TikTok was originally called Musical.ly", answer: false, category: "pop", explanation: "Musical.ly merged with TikTok" },
  
  // Weird Facts
  { id: "w1", statement: "Bananas are berries", answer: true, category: "weird" },
  { id: "w2", statement: "Octopuses have 3 hearts", answer: true, category: "weird" },
  { id: "w3", statement: "Wombats have cube-shaped poop", answer: true, category: "weird" },
  { id: "w4", statement: "Honey never spoils", answer: true, category: "weird" },
  { id: "w5", statement: "Sharks are older than trees", answer: true, category: "weird" },
  { id: "w6", statement: "Your stomach gets entirely new cells every week", answer: false, category: "weird", explanation: "Every 3-5 days" },
  
  // Kids Mode
  { id: "k1", statement: "Cats say 'moo'", answer: false, category: "kids" },
  { id: "k2", statement: "Ice cream is cold", answer: true, category: "kids" },
  { id: "k3", statement: "Dogs have 4 legs", answer: true, category: "kids" },
  { id: "k4", statement: "The sun is hot", answer: true, category: "kids" },
  { id: "k5", statement: "Fish live in trees", answer: false, category: "kids" },
  { id: "k6", statement: "Elephants are small animals", answer: false, category: "kids" },
  
  // Trick Questions/Traps
  { id: "t1", statement: "2 + 2 = 5", answer: false, category: "traps" },
  { id: "t2", statement: "This statement is false", answer: false, category: "traps" },
  { id: "t3", statement: "You are reading this right now", answer: true, category: "traps" },
  { id: "t4", statement: "All cats are animals", answer: true, category: "traps" },
  { id: "t5", statement: "Some birds cannot fly", answer: true, category: "traps" },
  { id: "t6", statement: "Monday comes after Sunday", answer: true, category: "traps" },
];

export const getQuestionsByCategory = (category: string): Question[] => {
  return questions.filter(q => q.category === category);
};

export const getRandomQuestions = (count: number, category?: string): Question[] => {
  const pool = category ? getQuestionsByCategory(category) : questions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};