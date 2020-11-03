import React, { ReactElement } from 'react';
import { Appearance, Planet } from '../../models/ui';


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
    appearance => appearance.era === 'Prequel Trilogy'
  );

  const originalAppearances = appearancesByMedia.filter(
    appearance => appearance.era === 'Original Trilogy'
  );

  const sequelAppearances = appearancesByMedia.filter(
    appearance => appearance.era === 'Sequel Trilogy'
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
    if (appearance.era === 'Prequel Trilogy') acc.prequel += 1;
    if (appearance.era === 'Original Trilogy') acc.original += 1;
    if (appearance.era === 'Sequel Trilogy') acc.sequel += 1;

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
        className={`planet-card-era-visualizer-segment planet-card-era-visualizer-segment--${era}`}
        style={{width: `${per}%`}}
      />
    );
  });

  return (<div className="planet-card-era-visualizer">{segments}</div>);
};

const getBriefDescription = (description: string): string => {
  const modifiedDescription = description.substring(0, 200);

  return description.length > 200
    ? modifiedDescription.concat('...')
    : modifiedDescription;
};

const renderAppearances = (appearances: Appearance[]): ReactElement => {
  const filmAppearances = appearancesSortedByEra(appearances, 'Film');
  const tvAppearances = appearancesSortedByEra(
    appearances,
    'TV Series'
  );

  const renderEntries = (appearances: Appearance[]): ReactElement[] =>
    appearances.map((appearance: Appearance, index: number) => {
      const { title, year, media, era } = appearance;

      const eraModifier = era.split(' ')[0].toLowerCase();
      const updatedTitle =
        title.includes('Clone Wars') && media === 'TV Series'
          ? `${title} (${year})`
          : title;

      return (
        <li
          key={`appearance-${index}`}
          className={`planet-card-appearances-list-item planet-card-appearances-list-item--${eraModifier}`}
        >
          {updatedTitle}
        </li>
      );
    });

  return (
    <div className="planet-card-appearances">
      {filmAppearances.length ? (
        <>
          <h4 className="planet-card-appearances-heading">Film</h4>
          <ul className="planet-card-appearances-list">
            {renderEntries(filmAppearances)}
          </ul>
        </>
      ) : null}
      {tvAppearances.length ? (
        <>
          <h4 className="planet-card-appearances-heading">TV</h4>
          <ul className="planet-card-appearances-list">
            {renderEntries(tvAppearances)}
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
      <h3 className="planet-card-name">{name}</h3>
      <p className="planet-card-description">
        {getBriefDescription(description)}
      </p>
      {renderAppearances(appearances)}
    </div>
  );
}

export default PlanetCard;