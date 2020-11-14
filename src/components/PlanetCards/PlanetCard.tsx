import React, { FunctionComponent, ReactElement } from 'react';
import { Appearance, Planet } from '../../models/ui';
import { ERA, MEDIA } from '../../constants';

type AppearanceTally = {
  Prequel: number;
  Original: number;
  Sequel: number;
};

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

  return [...prequelAppearances, ...originalAppearances, ...sequelAppearances];
};

const renderEraBar = (appearances: Appearance[]): ReactElement => {
  const totalAppearances = appearances.length;

  /**
   * tally up all appearances by era
   * on final item, convert tally to percents
   */
  const appearancesAsPercents = appearances.reduce(
    (acc: AppearanceTally, { era }: Appearance, index: number): AppearanceTally => {
      acc[era] += 1;

      // is last item
      if (totalAppearances - 1 === index) {
        return {
          Prequel: (acc.Prequel / totalAppearances) * 100,
          Original: (acc.Original / totalAppearances) * 100,
          Sequel: (acc.Sequel / totalAppearances) * 100
        };
      }

      return acc;
    },
    {
      Prequel: 0,
      Original: 0,
      Sequel: 0
    }
  );

  // render out a segment per each percent, set each segments width equal to percent
  const segments = Object.entries(appearancesAsPercents).map(([era, perc]) => {
    // if percent is 0, exclude segment
    if (!perc) return null;

    return (
      <div
        key={era}
        className={`planet-card__era-visualizer__segment planet-card__era-visualizer__segment--${era}`}
        style={{ width: `${perc}%` }}
      />
    );
  });

  return <div className="planet-card__era-visualizer">{segments}</div>;
};

const getBriefDescription = (description: string): string => {
  const modifiedDescription = description.substring(0, 200);

  return description.length > 200
    ? modifiedDescription.concat('...')
    : modifiedDescription;
};

const renderAppearances = (appearances: Appearance[]): ReactElement => {
  const filmAppearances = appearancesSortedByEra(appearances, MEDIA.FILM);
  const tvAppearances = appearancesSortedByEra(appearances, MEDIA.TV);

  const renderAppearanceList = (
    appearances: Appearance[],
    categoryHeading: string
  ): ReactElement => (
    <>
      <h4 className="planet-card__appearances__heading">{categoryHeading}</h4>
      <ul className="planet-card__appearances__list">
        {appearances.map(
          ({ title, year, media, era }: Appearance, index: number): ReactElement => {
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
          }
        )}
      </ul>
    </>
  );

  // there will always be at least one appearance/group
  return (
    <div className="planet-card__appearances">
      {filmAppearances.length ? renderAppearanceList(filmAppearances, 'Film 🎥') : null}
      {tvAppearances.length ? renderAppearanceList(tvAppearances, 'TV 📺') : null}
    </div>
  );
};

const PlanetCard: FunctionComponent<Planet> = ({
  appearances,
  name,
  description
}: Planet): ReactElement => (
  <div className="planet-card">
    {renderEraBar(appearances)}
    <h3 className="planet-card__name">{name}</h3>
    <p className="planet-card__description">{getBriefDescription(description)}</p>
    {renderAppearances(appearances)}
  </div>
);

export default PlanetCard;
