import React from 'react';
import { useForm } from 'react-hook-form';
import Header from 'components/Header/Header.jsx';
import FilterBar from 'components/FilterBar/FilterBar.jsx';
import PlanetCards from 'components/PlanetCards/PlanetCards.jsx';

import planets from 'planets.json';

function App() {
  const defaultValues = {
    media: 'All',
    era: [],
    myCanon: false,
    searchQuery: ''
  };

  const methods = useForm({ defaultValues });

  const watchAll = methods.watch();
  const values = methods.getValues();

  console.log('App');
  console.log('  watchAll:', watchAll);
  console.log('  values:', values);

  return (
    <div className="App">
      <Header />
      <FilterBar {...methods} />
      <PlanetCards planets={planets} />
    </div>
  );
}

export default App;

// need to refactor and work this filtering logic back in
// import { includesAny, search } from 'utils';
// import { FILTER_KEY } from './constants';

//   myCanonAppearances = planet =>
//     planet.appearances.filter(
//       ({ title }) =>
//         title !== 'Star Wars: The Clone Wars' &&
//         title !== 'Star Wars Resistance' &&
//         !title.startsWith('Episode VII') &&
//         !title.startsWith('Episode VIII') &&
//         !title.startsWith('Episode IX')
//     );

//   get filteredPlanets() {
//     const { filters, searchQuery } = this.state;

//     const searchedPlanets = searchQuery.length
//       ? planets.filter(({ name }) => search(searchQuery, name))
//       : planets;

//     const activeFilterKeys = Object.entries(filters).reduce(
//       (acc, [key, value]) => {
//         /**
//          * if key is media and value is not All
//          * OR
//          * if key is era and value array has a length
//          * add filter key to accumulator
//          */
//         if (
//           (key === FILTER_KEY.MEDIA && value !== 'All') ||
//           (key === FILTER_KEY.ERA && value.length)
//         ) {
//           acc.push(key);
//         }

//         return acc;
//       },
//       []
//     );

//     // first determine if myCanon was selected, if so, reduce and modify the planets array
//     const filteredPlanets = filters.myCanon
//       ? searchedPlanets.reduce((acc, planet) => {
//           const appearances = this.myCanonAppearances(planet);

//           if (appearances.length) {
//             acc.push({
//               ...planet,
//               appearances
//             });
//           }

//           return acc;
//         }, [])
//       : searchedPlanets;

//     // if both filters are applied check both conditions
//     if (activeFilterKeys.length) {
//       const { media: selectedMedia, era: selectedEras } = filters;

//       if (activeFilterKeys.length > 1) {
//         return filteredPlanets.filter(({ appearances }) => {
//           if (!appearances.length) {
//             return false;
//           }

//           const matchingAppearances = appearances
//             .filter(({ media, title }) =>
//               selectedMedia === 'Film (Episodes Only)'
//                 ? media === 'Film' && title.startsWith('Episode')
//                 : media === selectedMedia
//             )
//             .map(({ era }) => era);

//           return includesAny(selectedEras, matchingAppearances);
//         });
//       }

//       // if only one filter is applied
//       const activeFilterKey = activeFilterKeys[0];

//       return filteredPlanets.filter(({ appearances }) => {
//         // a map of either all of the eras or all of the media values associated with all of the appearances
//         const appearanceValues = appearances.map(
//           appearance => appearance[activeFilterKey]
//         );

//         if (activeFilterKey === 'era') {
//           return includesAny(selectedEras, appearanceValues);
//         }

//         // check if any of the film titles start with "Episode"
//         return selectedMedia === 'Film (Episodes Only)'
//           ? appearances
//               .filter(({ media }) => media === 'Film')
//               .some(({ title }) => title.startsWith('Episode'))
//           : appearanceValues.includes(selectedMedia);
//       });
//     }

//     return filteredPlanets;
//   }
