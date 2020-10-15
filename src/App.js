import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { search, includesAny, fetchData } from 'utils';

import Header from 'components/Header/Header.jsx';
import FilterBar from 'components/FilterBar/FilterBar.jsx';
import PlanetCards from 'components/PlanetCards/PlanetCards.jsx';

import planetsData from 'planets.json';

const filterOutNonCanonAppearances = appearances =>
  appearances.filter(
    ({ title }) =>
      title !== 'Star Wars: The Clone Wars' &&
      title !== 'Star Wars Resistance' &&
      !title.startsWith('Episode VII') &&
      !title.startsWith('Episode VIII') &&
      !title.startsWith('Episode IX')
  );

const filterBySearchQuery = (planets, filters) => {
  if (!filters.searchQuery.length) return planets;

  return planets.filter(({ name }) => search(filters.searchQuery, name));
};

const filterByMyCanon = (planets, filters) => {
  if (!filters.myCanon) return planets;

  return planets.reduce((acc, planet) => {
    const modifiedAppearances = filterOutNonCanonAppearances(
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

const filterByMedia = (planets, filters) => {
  if (filters.media === 'All') return planets;

  return planets.filter(planet => {
    const { appearances } = planet;

    const mediaPlanetAppearedIn = appearances.map(({ media }) => media);
    const titlesPlanetAppearedIn = appearances.map(({ title }) => title);

    return filters.media === 'Film (Episodes Only)'
      ? mediaPlanetAppearedIn.includes('Film') &&
          titlesPlanetAppearedIn.some(title => title.startsWith('Episode'))
      : mediaPlanetAppearedIn.includes(filters.media);
  });
};

const filterByEra = (planets, filters) => {
  if (!filters.era.length) return planets;

  return planets.filter(({ appearances }) => {
    const erasPlanetAppearedIn = appearances.map(({ era }) => era);

    return includesAny(filters.era, erasPlanetAppearedIn);
  });
};

const filteredPlanets = (planets, filters) =>
  [
    filterBySearchQuery, //
    filterByMyCanon,
    filterByMedia,
    filterByEra
  ].reduce(
    (newPlanetsArray, currentFilterFunction) =>
      currentFilterFunction(newPlanetsArray, filters),
    planets
  );

function App() {
  // SETUP FILTERS AND FORM
  const defaultValues = {
    searchQuery: '',
    media: 'All',
    era: [],
    myCanon: false
  };

  const methods = useForm({ defaultValues });

  const watchAll = methods.watch();
  const filters = Object.keys(watchAll).length ? watchAll : defaultValues;

  // SETUP DATA
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!data.length) {
      fetchData(setData, planetsData);
    }
  }, [data]);

  const planets = data.length ? filteredPlanets(data, filters) : data;

  return (
    <div className="App">
      <Header />
      <FilterBar {...methods} />
      <PlanetCards planets={planets} />
    </div>
  );
}

export default App;
