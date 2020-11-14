import React, {
  FunctionComponent,
  ReactElement,
  useState,
  useEffect
} from 'react';
import { fetchData, overlap, search, unique } from '../../utils';
import { Appearance, Filters, Media, Planet } from '../../models/ui';
import { ERA, MEDIA } from '../../constants';
import PlanetCard from './PlanetCard';
import Loader from '../Loader/Loader';
import mockData from '../../mockData/planets.json';
import './PlanetCards.scss';

interface PlanetCardsProps {
  filters: Filters;
}

type AppearancesFilterFunction = (
  appearances: Appearance[],
  selectedMedia?: Media
) => Appearance[];
type PlanetsFilterFunction = (planets: Planet[], filters: Filters) => Planet[];

const filterAppearancesByCanon: AppearancesFilterFunction = appearances =>
  appearances.filter(
    ({ title }) =>
      title !== 'Star Wars: The Clone Wars' &&
      title !== 'Star Wars Resistance' &&
      !title.startsWith('Episode VII') &&
      !title.startsWith('Episode VIII') &&
      !title.startsWith('Episode IX')
  );

const filterAppearancesByMedia: AppearancesFilterFunction = (
  appearances,
  selectedMedia
) =>
  appearances.filter(({ media, title }) => {
    if (selectedMedia === MEDIA.EPISODES) {
      return media === MEDIA.FILM && title.includes('Episode');
    }
    if (selectedMedia === MEDIA.SPINOFFS) {
      return media === MEDIA.FILM && !title.includes('Episode');
    }

    return media === selectedMedia;
  });

const filterBySearchQuery: PlanetsFilterFunction = (
  planets,
  { searchQuery }
) => {
  if (!searchQuery.length) return planets;

  return planets.filter(({ name }: Planet) => search(searchQuery, name));
};

const filterByMyCanon: PlanetsFilterFunction = (planets, { myCanon }) => {
  if (!myCanon) return planets;

  return planets.reduce((acc: Planet[], planet: Planet) => {
    const modifiedAppearances: Appearance[] = filterAppearancesByCanon(
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

const filterByEra: PlanetsFilterFunction = (planets, filters) => {
  if (!filters.era.length || filters.era.length === Object.values(ERA).length) {
    return planets;
  }

  return planets.filter((planet: Planet) => {
    const eras: string[] = planet.appearances.map(({ era }) => era);

    return overlap(eras, filters.era);
  });
};

const filterByMedia: PlanetsFilterFunction = (planets, filters) => {
  if (filters.media === MEDIA.ALL) return planets;

  // if some eras but not all eras are selected, crossReference by selected eras
  const crossReferenceByEras =
    filters.era.length && filters.era.length < Object.values(ERA).length;

  return planets.reduce((acc: Planet[], planet: Planet) => {
    const filteredAppearances = filterAppearancesByMedia(
      planet.appearances,
      filters.media
    );

    // if cross referencing
    if (crossReferenceByEras) {
      const eras = unique(filteredAppearances.map(({ era }) => era));
      const erasOverlapFilters = overlap(eras, filters.era);
      // AND planet has appearances that match selected media AND eras overlap selected eras
      if (filteredAppearances.length && erasOverlapFilters) {
        acc.push(planet);
      }
    }
    // if NOT cross referencing
    else {
      // AND planet has appearances that match selected media
      if (filteredAppearances.length) {
        acc.push(planet);
      }
    }

    return acc;
  }, []);
};

// iteratively filter all of the planets based on the filters applied
const getFilteredPlanets: PlanetsFilterFunction = (planets, filters) =>
  // prettier-ignore
  [
    filterBySearchQuery,
    filterByMyCanon,
    filterByEra,
    filterByMedia
  ].reduce(
    (newPlanetsArray, currentFilterFunction) =>
      currentFilterFunction(newPlanetsArray, filters),
    planets
  );

const PlanetCards: FunctionComponent<PlanetCardsProps> = ({
  filters
}: PlanetCardsProps): ReactElement => {
  const [initialPlanets, setInitialPlanets] = useState([]);

  const filteredPlanets = initialPlanets.length
    ? getFilteredPlanets(initialPlanets, filters)
    : initialPlanets;

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
    const content = initialPlanets.length ? (
      <p className="planet-cards__message">
        Sorry, no planets match the filters you&apos;ve selected.
      </p>
    ) : (
      <>
        <Loader />
        <p className="planet-cards__message">Loading...</p>
      </>
    );

    return <div className="planet-cards planet-cards--no-data">{content}</div>;
  }

  return (
    <div className="planet-cards">
      {filteredPlanets.map((planet: Planet) => (
        <PlanetCard key={`planet-${planet.id}`} {...planet} />
      ))}
    </div>
  );
};

export default PlanetCards;
