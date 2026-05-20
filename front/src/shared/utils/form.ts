import React from 'react';

/**
 * Higher-order function pour encapsuler le preventDefault.
 * Elle accepte une action qui peut, ou non, recevoir l'événement.
 */
export const preventDefault = <T extends React.SyntheticEvent>(
  action: (e: T) => void,
) => {
  return (e: T) => {
    e.preventDefault();
    action(e);
  };
};
