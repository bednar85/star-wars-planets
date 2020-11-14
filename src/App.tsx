import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { Filters } from './models/ui';
import { ERA, MEDIA } from './constants';
import Header from './components/Header/Header';
import FilterBar from './components/FilterBar/FilterBar';
import PlanetCards from './components/PlanetCards/PlanetCards';
import './index.scss';

const App = (): ReactElement => {
  // SETUP FILTERS AND FORM
  const defaultValues: Filters = {
    searchQuery: '',
    media: MEDIA.ALL,
    era: [...Object.values(ERA)],
    myCanon: false
  };

  const { watch, register } = useForm({ defaultValues });

  const watchAll = watch() as Filters;
  const filters: Filters = Object.keys(watchAll).length
    ? watchAll
    : defaultValues;

  return (
    <div className="star-wars-planets-app">
      <Header />
      <FilterBar register={register} />
      <PlanetCards filters={filters} />
    </div>
  );
};

export default App;
