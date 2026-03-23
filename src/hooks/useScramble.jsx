import { useState, useEffect, useRef, useCallback } from 'react';

const useScramble = (text, speed = 30) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+";

  const scramble = useCallback(() => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 2;
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    scramble();
    return () => clearInterval(intervalRef.current);
  }, [scramble]);

  const trigger = () => scramble();
  return { displayText, trigger };
};

export const DecryptText = ({ text, className = "" }) => {
  const { displayText, trigger } = useScramble(text);
  return (
    <span className={`font-mono cursor-default inline-block ${className}`} onMouseEnter={trigger}>
      {displayText}
    </span>
  );
};

export default useScramble;
