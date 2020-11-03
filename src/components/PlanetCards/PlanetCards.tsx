import React from 'react';
import { Planet } from '../../models/ui';
import PlanetCard from './PlanetCard';

export interface PlanetCardsProps {
  planets: Planet[];
  isLoaded: boolean;
}

function PlanetCards(props: PlanetCardsProps) {
  const { planets, isLoaded } = props;

  if (!planets.length) {
    const noDataMessage = isLoaded ? "Sorry, no planets match the filters you've selected.": "Loading...";

    return (
      <div className="planet-cards planet-cards--no-data">
        <p className="planet-cards-no-data-message">
          {noDataMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="planet-cards">
      {planets.map((planet: Planet) => (
        <PlanetCard key={`planet-${planet.id}`} {...planet} />
      ))}
    </div>
  );
}

export default PlanetCards;
