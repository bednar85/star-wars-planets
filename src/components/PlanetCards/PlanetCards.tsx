import React, { useState, useEffect } from 'react';
import { fetchData, includesAny, search } from '../../utils';
import { Appearance, Filters, Planet } from '../../models/ui';
import { MEDIA } from '../../constants';
import PlanetCard from './PlanetCard';
import mockData from '../../mockData/planets.json';

export interface PlanetCardsProps {
  filters: Filters;
}

// if an appearance object includes the title
const filterOutNonCanonAppearances = (
  appearances: Appearance[]
): Appearance[] =>
  appearances.filter(
    ({ title }) =>
      title !== 'Star Wars: The Clone Wars' &&
      title !== 'Star Wars Resistance' &&
      !title.startsWith('Episode VII') &&
      !title.startsWith('Episode VIII') &&
      !title.startsWith('Episode IX')
  );

const filterBySearchQuery = (planets: Planet[], filters: Filters): Planet[] => {
  if (!filters.searchQuery.length) return planets;

  return planets.filter(({ name }: Planet) =>
    search(filters.searchQuery, name)
  );
};

const filterByMyCanon = (planets: Planet[], filters: Filters): Planet[] => {
  if (!filters.myCanon) return planets;

  return planets.reduce((acc: Planet[], planet: Planet) => {
    const modifiedAppearances: Appearance[] = filterOutNonCanonAppearances(
      planet.appearances
    );

    /**
     * after filtering out non-canon appearances, if there are any left
     * add that planet to the array of new planets
     * and update that planet's appearances with the filtered appearances
     * else skip/exclude the current planet from the array of new planets
     */
    if (modifiedAppearances.length) {
      acc.push({
        ...planet,
        appearances: modifiedAppearances
      });
    }

    return acc;
  }, []);
};

const filterByMedia = (planets: Planet[], filters: Filters): Planet[] => {
  if (filters.media === MEDIA.ALL) return planets;

  return planets.filter((planet: Planet) => {
    const { appearances } = planet;

    const mediaPlanetAppearedIn: string[] = appearances.map(
      ({ media }: Appearance) => media
    );
    const titlesPlanetAppearedIn: string[] = appearances.map(
      ({ title }: Appearance) => title
    );

    /**
     * if "Film (Episodes Only)" was selected
     * also verify that at least 1 title from that planet's appearances starts with the word "Episode"
     */
    return filters.media === MEDIA.EPISODES
      ? mediaPlanetAppearedIn.includes(MEDIA.FILM) &&
          titlesPlanetAppearedIn.some(title => title.startsWith('Episode'))
      : mediaPlanetAppearedIn.includes(filters.media);
  });
};

const filterByEra = (planets: Planet[], filters: Filters): Planet[] => {
  if (!filters.era.length) return planets;

  return planets.filter(({ appearances }: Planet) => {
    const erasPlanetAppearedIn: string[] = appearances.map(
      ({ era }: Appearance) => era
    );

    return includesAny(filters.era, erasPlanetAppearedIn);
  });
};

// iteratively filter all of the planets based on the filters applied
const getFilteredPlanets = (planets: Planet[], filters: Filters): Planet[] =>
  [
    filterBySearchQuery, //
    filterByMyCanon,
    filterByMedia,
    filterByEra
  ].reduce(
    (newPlanetsArray: Planet[], currentFilterFunction: Function) =>
      currentFilterFunction(newPlanetsArray, filters),
    planets
  );

function PlanetCards(props: PlanetCardsProps) {
  const [initialPlanets, setInitialPlanets] = useState([]);

  const filteredPlanets = initialPlanets.length ? getFilteredPlanets(initialPlanets, props.filters) : initialPlanets;

  useEffect(() => {
    fetchData(setInitialPlanets, mockData);
  }, []);

  // if there are no filtered planets
  if (!filteredPlanets.length) {
    /**
     * if there are initial planets (i.e. the data was loaded),
     * display a message related to the filters and not being able to find any matching planets
     * else, display a loading message
     */
    const noDataMessage = initialPlanets.length ? "Sorry, no planets match the filters you've selected." : "Loading...";

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
      {filteredPlanets.map((planet: Planet) => (
        <PlanetCard key={`planet-${planet.id}`} {...planet} />
      ))}
    </div>
  );
}

export default PlanetCards;
