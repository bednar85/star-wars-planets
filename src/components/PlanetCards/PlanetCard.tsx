import React, { ReactElement } from 'react';
import { Appearance, Planet } from '../../models/ui';

const appearancesGroupedByEra = (
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
  const renderSegments = appearancesGroupedByEra(appearances).map(
    (appearance, index) => {
      const eraModifier = appearance.era.split(' ')[0].toLowerCase();

      return (
        <div
          key={`appearance-${index}`}
          className={`planet-card-era-visualizer-segment planet-card-era-visualizer-segment--${eraModifier}`}
        />
      );
    }
  );

  return <div className="planet-card-era-visualizer">{renderSegments}</div>;
};

const getBriefDescription = (description: string): string => {
  const modifiedDescription = description.substring(0, 200);

  return description.length > 200
    ? modifiedDescription.concat('...')
    : modifiedDescription;
};

const renderAppearances = (appearances: Appearance[]): ReactElement => {
  const filmAppearances = appearancesGroupedByEra(appearances, 'Film');
  const tvAppearances = appearancesGroupedByEra(
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
