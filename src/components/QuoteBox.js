import React from 'react';

// A simple component that displays a motivational quote in a dark box
// The quote and author are passed as props. If no author is provided
// the author line will not be rendered.
export default function QuoteBox({ quote, author }) {
  return (
    <div className="bg-gray-800 text-gray-100 rounded-xl p-4 mb-6 italic shadow-lg">
      <p className="mb-2">"{quote}"</p>
      {author && <p className="text-right font-medium">- {author}</p>}
    </div>
  );
}