// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.scss';
// import uniqBy from 'lodash/uniqBy';
// import { sortByKey } from './utils';
import { findAny } from './utils';

import planets from './planets.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.renderPlanets = this.renderPlanets.bind(this);
    this.renderAppearances = this.renderAppearances.bind(this);

    this.state = {
      filters: {
        // title: [],
        media: [],
        era: []
      }
    };
  }

  handleFilterChange(event) {
    const { filters } = this.state;

    const [key, value] = event.target.value.split(':');

    const targetFilterGroup = filters[key];

    /**
     * if the filter already exists in the targetFilterGroup, remove it with .filter
     * else use the spread operator, create a copy of the targetFilterGroup and append the new filter to the end
     */
    const updatedFilterGroup = targetFilterGroup.includes(value)
      ? targetFilterGroup.filter(filter => filter !== value)
      : [...targetFilterGroup, value];

    const updatedFilters = { ...filters, [key]: updatedFilterGroup };

    this.setState({
      filters: updatedFilters
    });
  }

  get filteredPlanets() {
    const { filters } = this.state;

    // console.log('');
    // console.log('get filteredPlanets');
    // console.log('Object.entries(filters):', Object.entries(filters));

    const activeFilterKeys = Object.entries(filters).reduce((acc, curr) => {
      const [key, value] = curr;

      if (value.length) {
        acc.push(key);
      }

      return acc;
    }, []);

    // console.log('activeFilterKeys:', activeFilterKeys);

    if (activeFilterKeys.length) {
      return planets.filter(planet => {
        // console.log('activeFilterKeys:', activeFilterKeys);

        const conditions = {};

        // for each active filter key

        // // check each condition
        activeFilterKeys.forEach(currentFilterKey => {
          const planetValues = planet.appearances.map(p => p[currentFilterKey]);
          const filterValues = filters[currentFilterKey];

          // console.log('planetValues:', planetValues);
          // console.log('filterValues:', filterValues);

          // // console.log(planetValues.some(d => d. === 0));

          // console.log(
          //   'contains(planetValues, filterValues):',
          //   contains(planetValues, filterValues)
          // );

          // console.log('planetValues.includes(filterValue):', planetValues.includes(filterValue));
          conditions[currentFilterKey] = findAny(filterValues, planetValues);
        });

        // console.log('conditions:', conditions);
        // console.log('');

        return Object.values(conditions).every(
          currentValue => currentValue === true
        );
      });
    }

    return planets;
  }

  // get filterOptions() {
  //   const reducedAppearances = planets
  //     .map(planet => planet.appearances)
  //     .flat()
  //     .reduce((acc, curr) => {
  //       const itemAlreadyExists = acc.find(
  //         item => item.title === curr.title && item.media === curr.media
  //       );

  //       if (!itemAlreadyExists) {
  //         acc.push(curr);
  //       }

  //       return acc;
  //     }, []);

  //   return sortByKey(reducedAppearances, 'ascending', 'numerical', 'year');
  // }

  renderAppearances(planet) {
    return (
      <ul className="planet-card-appearances-list">
        {planet.appearances.map((appearance, index) => {
          const eraModifier = appearance.era.split(' ')[0].toLowerCase();

          return (
            <li
              key={`appearance-${index}`}
              className={`planet-card-appearances-list-item planet-card-appearances-list-item--${eraModifier}`}
            >
              {appearance.title} ({appearance.year})
            </li>
          );
        })}
      </ul>
    );
  }

  renderPlanets() {
    return this.filteredPlanets.map((planet, index) => {
      return (
        <div key={`planet-${index}`} className="planet-card">
          <h3 className="planet-card-heading">{planet.name}</h3>
          <div className="planet-card-appearances">
            <h4 className="planet-card-appearances-heading">Appearances:</h4>
            {this.renderAppearances(planet)}
          </div>
        </div>
      );
    });
  }

  get filterForm() {
    return (
      <header className="header">
        <form className="filter-form" onChange={this.handleFilterChange}>
          <fieldset className="filter-form-fieldset">
            <h2 className="filter-form-heading">Media:</h2>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="film"
                name="film"
                value="media:Film"
              />
              <label className="filter-form-label" htmlFor="film">
                Film
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="tv"
                name="tv"
                value="media:TV Series"
              />
              <label className="filter-form-label" htmlFor="tv">
                TV Series
              </label>
            </div>
          </fieldset>
          <fieldset className="filter-form-fieldset">
            <h2 className="filter-form-heading">Era:</h2>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="prequel-trilogy"
                name="prequel-trilogy"
                value="era:Prequel Trilogy"
              />
              <label className="filter-form-label" htmlFor="prequel-trilogy">
                Prequel Trilogy
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="original-trilogy"
                name="original-trilogy"
                value="era:Original Trilogy"
              />
              <label className="filter-form-label" htmlFor="original-trilogy">
                Original Trilogy
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="sequel-trilogy"
                name="sequel-trilogy"
                value="era:Sequel Trilogy"
              />
              <label className="filter-form-label" htmlFor="sequel-trilogy">
                Sequel Trilogy
              </label>
            </div>
          </fieldset>
        </form>
      </header>
    );
  }

  render() {
    // console.log('');
    // console.log('planets:', planets);
    // console.log('planets.length:', planets.length);
    // console.log('this.state:', this.state);

    // console.log('this.filterOptions:', this.filterOptions);

    return (
      <div className="App">
        {this.filterForm}
        <div className="planet-cards">{this.renderPlanets()}</div>
      </div>
    );
  }
}

export default App;
