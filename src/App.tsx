import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { search, includesAny, fetchData } from './utils/index';
import { Appearance, Planet } from './models/ui';

import Header from './components/Header/Header';
import FilterBar from './components/FilterBar/FilterBar';
import PlanetCards from './components/PlanetCards/PlanetCards';

import planetsData from './planets.json';

interface Filters {
  searchQuery: string;
  media: string;
  era: string[];
  myCanon: boolean;
}

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
  if (filters.media === 'All') return planets;

  return planets.filter((planet: Planet) => {
    const { appearances } = planet;

    const mediaPlanetAppearedIn: string[] = appearances.map(
      ({ media }: Appearance) => media
    );
    const titlesPlanetAppearedIn: string[] = appearances.map(
      ({ title }: Appearance) => title
    );

    return filters.media === 'Film (Episodes Only)'
      ? mediaPlanetAppearedIn.includes('Film') &&
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
    media: 'All',
    era: [],
    myCanon: false
  };

  const methods = useForm({ defaultValues });

  const watchAll: Filters = methods.watch();
  const filters: Filters = Object.keys(watchAll).length
    ? watchAll
    : defaultValues;

  // SETUP DATA
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!data.length) {
      fetchData(setData, planetsData);
    }
  }, [data]);

  // console.log('data:', data);

  const planets: Planet[] = data.length ? filteredPlanets(data, filters) : data;

  // change up the messaging based on if the data has loaded or not yet, like if it wasn't loaded yet don't show the sorry message
  // if it was and after filtering it there is nothing then yeah show the sorry messaging
  return (
    <div className="App">
      <Header />
      <FilterBar {...methods} />
      <PlanetCards planets={planets} />
    </div>
  );
}

export default App;
