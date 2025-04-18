import { Poem } from '../types';

// Mock data for poems
export const poems: Poem[] = [
  {
    id: '1',
    title: 'Whispers of Dawn',
    subtitle: 'A reflection on new beginnings',
    content: `The morning light filters through leaves,
    Dancing patterns on the ground.
    Dew-kissed grass, a silent witness,
    To another day unbound.

    Birds announce the sun's arrival,
    With melodies pure and sweet.
    The world awakens from its slumber,
    As night and day gently meet.`,
    coverImage: 'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg',
    language: 'english',
    isListed: true,
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: '2',
    title: 'ಮಳೆಯ ಹನಿಗಳು',
    subtitle: 'ಮಳೆಯ ಮೌನ ಸಂಗೀತ',
    content: `ಮಳೆಯ ಹನಿಗಳು ಬೀಳುತಿವೆ ಮೆಲ್ಲನೆ,
    ಮನದಾಳದಲ್ಲಿ ಹಾಡುತಿವೆ ಹಾಡು.
    ನೆನಪಿನ ದಾರಿಯಲ್ಲಿ ಓಡಾಡುತಿವೆ,
    ಮಲೆನಾಡಿನ ಮಣ್ಣಿನ ಪರಿಮಳ.

    ಹಸಿರು ಹೊದ್ದ ಬೆಟ್ಟಗಳು,
    ಮಬ್ಬಿನ ಮುಸುಕಿನಲ್ಲಿ ಮುಳುಗುತಿವೆ.
    ಚಿಲಿಪಿಲಿ ಹಕ್ಕಿಗಳ ಕಲರವ,
    ಮಳೆಯ ಸಂಗೀತಕ್ಕೆ ತಾಳ ಹಾಕುತಿದೆ.`,
    coverImage: 'https://images.pexels.com/photos/5767577/pexels-photo-5767577.jpeg',
    language: 'kannada',
    isListed: true,
    createdAt: new Date(2023, 6, 22).toISOString(),
    updatedAt: new Date(2023, 6, 22).toISOString(),
  },
  {
    id: '3',
    title: 'Midnight Thoughts',
    subtitle: 'When stars become companions',
    content: `In the quiet hours past midnight,
    When the world has gone to sleep,
    My thoughts become my companions,
    Secrets that I alone keep.

    The stars shine like distant memories,
    Each with a story to tell.
    The moon, a silent observer,
    Casting its enchanting spell.`,
    coverImage: 'https://images.pexels.com/photos/1694000/pexels-photo-1694000.jpeg',
    language: 'english',
    isListed: true,
    createdAt: new Date(2023, 7, 3).toISOString(),
    updatedAt: new Date(2023, 7, 3).toISOString(),
  },
  {
    id: '4',
    title: 'Ocean Dreams',
    subtitle: 'Waves of inspiration',
    content: `The ocean whispers ancient tales,
    Of voyages and distant shores.
    Waves crash against weathered rocks,
    Like time against closed doors.

    Salt-laden breeze carries memories,
    Of adventures yet to come.
    The horizon beckons dreamers,
    Where sky and water become one.`,
    coverImage: 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg',
    language: 'english',
    isListed: false,
    createdAt: new Date(2023, 8, 10).toISOString(),
    updatedAt: new Date(2023, 8, 10).toISOString(),
  },
];

// Helper functions for working with poems
export const getPoems = (listedOnly = true): Poem[] => {
  return listedOnly 
    ? poems.filter(poem => poem.isListed) 
    : [...poems];
};

export const getPoemById = (id: string): Poem | undefined => {
  return poems.find(poem => poem.id === id);
};

export const getPoemsByLanguage = (language: string, listedOnly = true): Poem[] => {
  return poems.filter(poem => 
    poem.language === language && 
    (listedOnly ? poem.isListed : true)
  );
};