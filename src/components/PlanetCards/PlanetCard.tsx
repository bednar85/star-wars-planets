import React, { ReactElement } from 'react';
import { Appearance, Planet } from '../../models/ui';
import { ERA, MEDIA } from '../../constants';
import './PlanetCard.scss';

interface AppearanceTally {
  prequel: number;
  original: number;
  sequel: number;
}

const appearancesSortedByEra = (
  appearances: Appearance[],
  media?: string
): Appearance[] => {
  const appearancesByMedia = media
    ? appearances.filter(appearance => appearance.media === media)
    : appearances;

  const prequelAppearances = appearancesByMedia.filter(
    appearance => appearance.era === ERA.PREQUEL
  );

  const originalAppearances = appearancesByMedia.filter(
    appearance => appearance.era === ERA.ORIGINAL
  );

  const sequelAppearances = appearancesByMedia.filter(
    appearance => appearance.era === ERA.SEQUEL
  );

  return [
    ...prequelAppearances,
    ...originalAppearances,
    ...sequelAppearances
  ];
};

const renderEraVisualizer = (appearances: Appearance[]): ReactElement => {
  const totalAppearances = appearances.length;

  /**
   * tally up all appearances by era
   * on final item, convert tally to percents
   */
  const appearancesAsPercents = appearances.reduce((acc: AppearanceTally, appearance: Appearance, index: number): AppearanceTally => {
    if (appearance.era === ERA.PREQUEL) acc.prequel += 1;
    if (appearance.era === ERA.ORIGINAL) acc.original += 1;
    if (appearance.era === ERA.SEQUEL) acc.sequel += 1;

    // is last item
    if (totalAppearances - 1 === index) {
      return {
        prequel: (acc.prequel / totalAppearances) * 100,
        original: (acc.original / totalAppearances) * 100,
        sequel: (acc.sequel / totalAppearances) * 100
      };
    }

    return acc;
  }, {
    prequel: 0,
    original: 0,
    sequel: 0
  });

  // render out a segment per each percent, set each segments width equal to percent
  const segments = Object.entries(appearancesAsPercents).map(([era, per]) => {
    // if percent is 0, exclude segment
    if (!per) return null;

    return (
      <div
        key={era}
        className={`planet-card__era-visualizer__segment planet-card__era-visualizer__segment--${era}`}
        style={{width: `${per}%`}}
      />
    );
  });

  return (<div className="planet-card__era-visualizer">{segments}</div>);
};

const getBriefDescription = (description: string): string => {
  const modifiedDescription = description.substring(0, 200);

  return description.length > 200
    ? modifiedDescription.concat('...')
    : modifiedDescription;
};

const renderAppearances = (appearances: Appearance[]): ReactElement => {
  const filmAppearances = appearancesSortedByEra(appearances, MEDIA.FILM);
  const tvAppearances = appearancesSortedByEra(
    appearances,
    MEDIA.TV
  );

  const renderAppearance = (appearances: Appearance[]): ReactElement[] =>
    appearances.map((appearance: Appearance, index: number) => {
      const { title, year, media, era } = appearance;

      const eraModifier = era.split(' ')[0].toLowerCase();
      const updatedTitle =
        title.includes('Clone Wars') && media === MEDIA.TV
          ? `${title} (${year})`
          : title;

      return (
        <li
          key={`appearance-${index}`}
          className={`planet-card__appearances__list-item planet-card__appearances__list-item--${eraModifier}`}
        >
          {updatedTitle}
        </li>
      );
    });

  return (
    <div className="planet-card__appearances">
      {filmAppearances.length ? (
        <>
          <h4 className="planet-card__appearances__heading">Film <span role="img" aria-label="film">🎥</span></h4>
          <ul className="planet-card__appearances__list">
            {renderAppearance(filmAppearances)}
          </ul>
        </>
      ) : null}
      {tvAppearances.length ? (
        <>
          <h4 className="planet-card__appearances__heading">TV <span role="img" aria-label="tv">📺</span></h4>
          <ul className="planet-card__appearances__list">
            {renderAppearance(tvAppearances)}
          </ul>
        </>
      ) : null}
    </div>
  );
};

function PlanetCard(props: Planet) {
  const { appearances, name, description } = props;

  return (
    <div className="planet-card">
      {renderEraVisualizer(appearances)}
      <h3 className="planet-card__name">{name}</h3>
      <p className="planet-card__description">
        {getBriefDescription(description)}
      </p>
      {renderAppearances(appearances)}
    </div>
  );
}

export default PlanetCard;
