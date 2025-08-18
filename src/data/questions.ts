export interface Question {
  id: string;
  statement: string;
  answer: boolean;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

const questionPool: Question[] = [
  // General Knowledge - Easy
  { id: "gen_001", statement: "The sun rises in the east", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_002", statement: "Water boils at 100°C", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_003", statement: "There are 7 days in a week", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_004", statement: "Ice is colder than water", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_005", statement: "A year has 365 days", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_006", statement: "Fire is cold", answer: false, category: "general", difficulty: "easy" },
  { id: "gen_007", statement: "Fish can fly", answer: false, category: "general", difficulty: "easy" },
  { id: "gen_008", statement: "2 + 2 = 5", answer: false, category: "general", difficulty: "easy" },
  { id: "gen_009", statement: "Cats bark", answer: false, category: "general", difficulty: "easy" },
  { id: "gen_010", statement: "Snow is hot", answer: false, category: "general", difficulty: "easy" },
  
  // General Knowledge - Medium
  { id: "gen_011", statement: "The Earth is round", answer: true, category: "general", difficulty: "medium" },
  { id: "gen_012", statement: "Humans have 5 senses", answer: true, category: "general", difficulty: "medium" },
  { id: "gen_013", statement: "Lightning is hotter than the sun's surface", answer: true, category: "general", difficulty: "medium" },
  { id: "gen_014", statement: "Bananas are berries", answer: true, category: "general", difficulty: "medium" },
  { id: "gen_015", statement: "Octopuses have 3 hearts", answer: true, category: "general", difficulty: "medium" },
  { id: "gen_016", statement: "The Great Wall of China is visible from space", answer: false, category: "general", difficulty: "medium" },
  { id: "gen_017", statement: "Goldfish have a 3-second memory", answer: false, category: "general", difficulty: "medium" },
  { id: "gen_018", statement: "Lightning never strikes the same place twice", answer: false, category: "general", difficulty: "medium" },
  { id: "gen_019", statement: "Hair and nails continue growing after death", answer: false, category: "general", difficulty: "medium" },
  { id: "gen_020", statement: "Humans only use 10% of their brain", answer: false, category: "general", difficulty: "medium" },

  // Pop Culture
  { id: "pop_001", statement: "Mickey Mouse was created by Walt Disney", answer: true, category: "pop_culture", difficulty: "easy" },
  { id: "pop_002", statement: "The iPhone was released in 2007", answer: true, category: "pop_culture", difficulty: "medium" },
  { id: "pop_003", statement: "TikTok was originally called Musical.ly", answer: true, category: "pop_culture", difficulty: "medium" },
  { id: "pop_004", statement: "Superman can fly", answer: true, category: "pop_culture", difficulty: "easy" },
  { id: "pop_005", statement: "Netflix started as a DVD rental service", answer: true, category: "pop_culture", difficulty: "medium" },
  { id: "pop_006", statement: "Harry Potter was written by J.R.R. Tolkien", answer: false, category: "pop_culture", difficulty: "easy" },
  { id: "pop_007", statement: "Instagram was launched before Facebook", answer: false, category: "pop_culture", difficulty: "medium" },
  { id: "pop_008", statement: "Pikachu is a Digimon", answer: false, category: "pop_culture", difficulty: "easy" },
  { id: "pop_009", statement: "The Beatles had 5 members", answer: false, category: "pop_culture", difficulty: "easy" },
  { id: "pop_010", statement: "YouTube was created by Google", answer: false, category: "pop_culture", difficulty: "medium" },

  // Science
  { id: "sci_001", statement: "The speed of light is faster than sound", answer: true, category: "science", difficulty: "easy" },
  { id: "sci_002", statement: "Gravity makes things fall down", answer: true, category: "science", difficulty: "easy" },
  { id: "sci_003", statement: "DNA stands for Deoxyribonucleic Acid", answer: true, category: "science", difficulty: "medium" },
  { id: "sci_004", statement: "The human body has 206 bones", answer: true, category: "science", difficulty: "medium" },
  { id: "sci_005", statement: "Sound travels faster in water than air", answer: true, category: "science", difficulty: "medium" },
  { id: "sci_006", statement: "The sun revolves around the Earth", answer: false, category: "science", difficulty: "easy" },
  { id: "sci_007", statement: "Glass is made from sand", answer: true, category: "science", difficulty: "medium" },
  { id: "sci_008", statement: "Diamonds are made of carbon", answer: true, category: "science", difficulty: "medium" },
  { id: "sci_009", statement: "Antibiotics work against viruses", answer: false, category: "science", difficulty: "medium" },
  { id: "sci_010", statement: "Vaccines cause autism", answer: false, category: "science", difficulty: "easy" },

  // Kids Mode
  { id: "kid_001", statement: "Dogs say 'woof'", answer: true, category: "kids", difficulty: "easy" },
  { id: "kid_002", statement: "Cows give milk", answer: true, category: "kids", difficulty: "easy" },
  { id: "kid_003", statement: "The color red and blue make purple", answer: true, category: "kids", difficulty: "easy" },
  { id: "kid_004", statement: "A triangle has 3 sides", answer: true, category: "kids", difficulty: "easy" },
  { id: "kid_005", statement: "Bees make honey", answer: true, category: "kids", difficulty: "easy" },
  { id: "kid_006", statement: "Elephants are small animals", answer: false, category: "kids", difficulty: "easy" },
  { id: "kid_007", statement: "Fish live in trees", answer: false, category: "kids", difficulty: "easy" },
  { id: "kid_008", statement: "The moon is made of cheese", answer: false, category: "kids", difficulty: "easy" },
  { id: "kid_009", statement: "Birds have four legs", answer: false, category: "kids", difficulty: "easy" },
  { id: "kid_010", statement: "Chocolate grows on trees", answer: false, category: "kids", difficulty: "easy" },

  // Weird Facts
  { id: "weird_001", statement: "Wombat poop is cube-shaped", answer: true, category: "weird_facts", difficulty: "medium" },
  { id: "weird_002", statement: "Honey never spoils", answer: true, category: "weird_facts", difficulty: "medium" },
  { id: "weird_003", statement: "A group of flamingos is called a flamboyance", answer: true, category: "weird_facts", difficulty: "medium" },
  { id: "weird_004", statement: "Butterflies taste with their feet", answer: true, category: "weird_facts", difficulty: "medium" },
  { id: "weird_005", statement: "Lobsters used to be prison food", answer: true, category: "weird_facts", difficulty: "medium" },
  { id: "weird_006", statement: "Penguins can swim backwards", answer: false, category: "weird_facts", difficulty: "medium" },
  { id: "weird_007", statement: "Sharks are older than trees", answer: true, category: "weird_facts", difficulty: "hard" },
  { id: "weird_008", statement: "A shrimp's heart is in its head", answer: true, category: "weird_facts", difficulty: "medium" },
  { id: "weird_009", statement: "Cleopatra lived closer to the moon landing than the pyramids being built", answer: true, category: "weird_facts", difficulty: "hard" },
  { id: "weird_010", statement: "There are more possible chess games than atoms in the universe", answer: true, category: "weird_facts", difficulty: "hard" },

  // More General Knowledge
  { id: "gen_021", statement: "Mount Everest is the tallest mountain", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_022", statement: "The Pacific Ocean is the largest ocean", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_023", statement: "Russia is the largest country by land area", answer: true, category: "general", difficulty: "medium" },
  { id: "gen_024", statement: "The Amazon River is longer than the Nile", answer: false, category: "general", difficulty: "medium" },
  { id: "gen_025", statement: "Africa has 54 countries", answer: true, category: "general", difficulty: "medium" },

  // Additional General Knowledge Questions
  { id: "gen_026", statement: "The capital of Australia is Sydney", answer: false, category: "general", difficulty: "easy" },
  { id: "gen_027", statement: "The Eiffel Tower can be found in Paris", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_028", statement: "Mount Everest is the tallest mountain in the world", answer: true, category: "general", difficulty: "easy" },
  { id: "gen_029", statement: "Humans have four lungs", answer: false, category: "general", difficulty: "easy" },

  // Additional Pop Culture Questions
  { id: "pop_011", statement: "Lady Gaga starred in the film 'A Star Is Born'", answer: true, category: "pop_culture", difficulty: "easy" },
  { id: "pop_012", statement: "Hogwarts is the school in The Lord of the Rings", answer: false, category: "pop_culture", difficulty: "easy" },
  { id: "pop_013", statement: "Stranger Things is set in the 1980s", answer: true, category: "pop_culture", difficulty: "easy" },
  { id: "pop_014", statement: "Beyoncé released an album called 'Lemonade'", answer: true, category: "pop_culture", difficulty: "easy" },

  // Additional Science Questions
  { id: "sci_011", statement: "Water is made up of hydrogen and oxygen", answer: true, category: "science", difficulty: "easy" },
  { id: "sci_012", statement: "The Sun orbits around the Earth", answer: false, category: "science", difficulty: "easy" },
  { id: "sci_013", statement: "Lightning is hotter than the surface of the Sun", answer: true, category: "science", difficulty: "medium" },
  { id: "sci_014", statement: "Penguins live naturally at the North Pole", answer: false, category: "science", difficulty: "medium" },

  // Additional Kids Mode Questions
  { id: "kid_011", statement: "A triangle is a shape with three sides", answer: true, category: "kids", difficulty: "easy" },
  { id: "kid_012", statement: "Elephants can fly in real life", answer: false, category: "kids", difficulty: "easy" },
  { id: "kid_013", statement: "The moon is made of cheese", answer: false, category: "kids", difficulty: "easy" },
  { id: "kid_014", statement: "Pluto is smaller than Earth's moon", answer: true, category: "kids", difficulty: "easy" },

  // Additional Weird Facts Questions
  { id: "weird_011", statement: "Octopuses have three hearts", answer: true, category: "weird_facts", difficulty: "medium" },
  { id: "weird_012", statement: "Bananas grow on trees", answer: false, category: "weird_facts", difficulty: "medium" },
  { id: "weird_013", statement: "Sloths take more than a month to digest one leaf", answer: true, category: "weird_facts", difficulty: "hard" },
  { id: "weird_014", statement: "Anyone has ever landed on Mars", answer: false, category: "weird_facts", difficulty: "medium" },

  // Misleading Questions for "Misleading" Mode
  { id: "mislead_001", statement: "Is it false that the sun doesn't rise in the west?", answer: true, category: "misleading", difficulty: "medium" },
  { id: "mislead_002", statement: "Water doesn't freeze at temperatures above 0°C, correct?", answer: true, category: "misleading", difficulty: "medium" },
  { id: "mislead_003", statement: "It's not true that fish don't breathe underwater, right?", answer: false, category: "misleading", difficulty: "medium" },
  { id: "mislead_004", statement: "Isn't it incorrect to say that cats don't meow?", answer: true, category: "misleading", difficulty: "medium" },
  { id: "mislead_005", statement: "You wouldn't agree that snow isn't cold, would you?", answer: false, category: "misleading", difficulty: "medium" },
  { id: "mislead_006", statement: "The Earth doesn't orbit around the sun - false statement?", answer: true, category: "misleading", difficulty: "hard" },
  { id: "mislead_007", statement: "It's untrue that humans don't have two lungs, isn't it?", answer: true, category: "misleading", difficulty: "hard" },
  { id: "mislead_008", statement: "Would you say it's wrong that elephants can't fly?", answer: false, category: "misleading", difficulty: "medium" },
  { id: "mislead_009", statement: "Isn't it false that the moon is not made of cheese?", answer: false, category: "misleading", difficulty: "hard" },
  { id: "mislead_010", statement: "You can't say that dogs don't bark, can you?", answer: false, category: "misleading", difficulty: "medium" },

  // Trick Questions
  { id: "trick_001", statement: "This statement is false", answer: false, category: "general", difficulty: "hard" },
  { id: "trick_002", statement: "You are currently reading this", answer: true, category: "general", difficulty: "easy" },
  { id: "trick_003", statement: "The word 'short' is longer than the word 'long'", answer: true, category: "general", difficulty: "medium" },
  { id: "trick_004", statement: "Tomorrow never comes", answer: true, category: "general", difficulty: "medium" },
  { id: "trick_005", statement: "Silence makes a sound", answer: false, category: "general", difficulty: "medium" },
];

// Question selection with anti-repeat algorithm
class QuestionSelector {
  private recentQuestions: Set<string> = new Set();
  private readonly maxRecentQuestions = 8; // Avoid repeats for 8 questions

  selectQuestions(count: number, category?: string): Question[] {
    let availableQuestions = questionPool.filter(q => 
      !this.recentQuestions.has(q.id) && 
      (!category || category === 'all' || q.category === category)
    );

    // If we don't have enough non-recent questions, allow some repeats
    if (availableQuestions.length < count) {
      availableQuestions = questionPool.filter(q => 
        !category || category === 'all' || q.category === category
      );
      this.recentQuestions.clear(); // Reset recent questions
    }

    // Shuffle and select
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    // Update recent questions
    selected.forEach(q => {
      this.recentQuestions.add(q.id);
      if (this.recentQuestions.size > this.maxRecentQuestions) {
        const oldestId = this.recentQuestions.values().next().value;
        this.recentQuestions.delete(oldestId);
      }
    });

    return selected;
  }

  reset() {
    this.recentQuestions.clear();
  }
}

const questionSelector = new QuestionSelector();

export const getRandomQuestions = (count: number, category?: string): Question[] => {
  const questions = questionSelector.selectQuestions(count, category);
  console.log("getRandomQuestions called:", { count, category, returnedQuestions: questions.length });
  return questions;
};

export const resetQuestionHistory = () => {
  questionSelector.reset();
};

export const getCategories = () => [
  { value: 'all', label: 'All Categories' },
  { value: 'general', label: 'General Knowledge' },
  { value: 'pop_culture', label: 'Pop Culture' },
  { value: 'science', label: 'Science' },
  { value: 'kids', label: 'Kids Mode' },
  { value: 'weird_facts', label: 'Weird Facts' }
];

export const categories = {
  general: 'General Knowledge',
  pop_culture: 'Pop Culture',
  science: 'Science',
  kids: 'Kids Mode',
  weird_facts: 'Weird Facts'
};