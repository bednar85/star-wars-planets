import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { search, includesAny, fetchData } from './utils/index';
import { Appearance, Planet } from './models/ui';
import { ERA, MEDIA } from './constants';

import Header from './components/Header/Header';
import FilterBar from './components/FilterBar/FilterBar';
import PlanetCards, { PlanetCardsProps } from './components/PlanetCards/PlanetCards';

import planetsData from './planets.json';

interface Filters {
  searchQuery: string;
  media: string;
  era: string[];
  myCanon: boolean;
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
const filteredPlanets = (planets: Planet[], filters: Filters): Planet[] =>
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

function App() {
  // SETUP FILTERS AND FORM
  const defaultValues: Filters = {
    searchQuery: '',
    media: MEDIA.ALL,
    era: [
      ...Object.values(ERA)
    ],
    myCanon: false
  };

  const methods = useForm({ defaultValues });

  const watchAll = methods.watch() as Filters;
  const filters: Filters = Object.keys(watchAll).length
    ? watchAll
    : defaultValues;

  // SETUP DATA
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(setData, planetsData);
  }, []);

  const planetCardProps: PlanetCardsProps = {
    planets: data.length ? filteredPlanets(data, filters) : data,
    isLoaded: data.length > 0
  };

  return (
    <div className="App">
      <Header />
      <FilterBar {...methods} />
      <PlanetCards {...planetCardProps} />
    </div>
  );
}

export default App;
