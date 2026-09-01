'use client';

import { useEffect, useState } from 'react';

const TYPE_DELAY = 120;
const DELETE_DELAY = 60;
const HOLD_DELAY = 1000;

export function TypingText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const delay = displayedText === text && !deleting
      ? HOLD_DELAY
      : deleting
        ? displayedText.length === 0 ? 0 : DELETE_DELAY
        : TYPE_DELAY;

    const timeout = window.setTimeout(() => {
      if (displayedText === text && !deleting) {
        setDeleting(true);
        return;
      }

      if (deleting) {
        if (displayedText.length === 0) {
          setDeleting(false);
          return;
        }

        setDisplayedText(text.substring(0, displayedText.length - 1));
        return;
      }

      setDisplayedText(text.substring(0, displayedText.length + 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, displayedText, text]);

  return (
    <span className="typing-text" aria-label={text}>
      <span aria-hidden="true">{displayedText}</span>{' '}
      <span className="typing-cursor" aria-hidden="true">|</span>
    </span>
  );
}
