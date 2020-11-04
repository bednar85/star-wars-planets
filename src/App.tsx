import React from 'react';
import { useForm } from 'react-hook-form';
import { Filters } from './models/ui';
import { ERA, MEDIA } from './constants';
import Header from './components/Header/Header';
import FilterBar from './components/FilterBar/FilterBar';
import PlanetCards from './components/PlanetCards/PlanetCards';
import './App.scss';

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


  return (
    <div className="star-wars-planets-app">
      <Header />
      <FilterBar {...methods} />
      <PlanetCards filters={filters} />
    </div>
  );
}

export default App;
