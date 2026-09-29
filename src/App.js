import React, { useEffect, useState } from 'react';
import './App.css';
import EngineeringJournal from './components/EngineeringJournal';
import Book from './book/Book';

// The book needs room for a two-page spread; smaller screens keep the
// scrolling journal for now.
const BOOK_QUERY = '(min-width: 1024px) and (min-height: 600px)';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false
  ));

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [query]);

  return matches;
}

function App() {
  const desktop = useMediaQuery(BOOK_QUERY);

  return (
    <div className="app-root">
      {desktop ? <Book /> : <EngineeringJournal />}
    </div>
  );
}

export default App;
