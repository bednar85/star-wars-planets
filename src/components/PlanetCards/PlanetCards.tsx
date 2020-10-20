import React, { Component, Fragment, ReactElement } from 'react';
import { Appearance, Planet } from '../../models/ui';

interface PlanetCardsProps {
  planets: Planet[];
}

class PlanetCards extends Component<PlanetCardsProps> {
  appearancesGroupedByEra = (
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

  renderEraVisualizer = (planet: Planet): ReactElement => {
    const { appearances } = planet;

    const renderSegments = this.appearancesGroupedByEra(appearances).map(
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

  getBriefDescription = (description: string): string => {
    const modifiedDescription = description.substring(0, 200);

    return description.length > 200
      ? modifiedDescription.concat('...')
      : modifiedDescription;
  };

  renderAppearances = (planet: Planet): ReactElement => {
    const { appearances } = planet;

    const filmAppearances = this.appearancesGroupedByEra(appearances, 'Film');
    const tvAppearances = this.appearancesGroupedByEra(
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
          <Fragment>
            <h4 className="planet-card-appearances-heading">Film</h4>
            <ul className="planet-card-appearances-list">
              {renderEntries(filmAppearances)}
            </ul>
          </Fragment>
        ) : null}
        {tvAppearances.length ? (
          <Fragment>
            <h4 className="planet-card-appearances-heading">TV</h4>
            <ul className="planet-card-appearances-list">
              {renderEntries(tvAppearances)}
            </ul>
          </Fragment>
        ) : null}
      </div>
    );
  };

  render() {
    const { planets } = this.props;

    if (!planets.length) {
      return (
        <div className="planet-cards planet-cards--no-data">
          <p className="planet-cards-no-data-message">
            Sorry, no planets match the filters you've selected.
          </p>
        </div>
      );
    }

    return (
      <div className="planet-cards">
        {planets.map((planet: Planet, index: number) => (
          <div key={`planet-${index}`} className="planet-card">
            {this.renderEraVisualizer(planet)}
            <h3 className="planet-card-name">{planet.name}</h3>
            <p className="planet-card-description">
              {this.getBriefDescription(planet.description)}
            </p>
            {this.renderAppearances(planet)}
          </div>
        ))}
      </div>
    );
  }
}

export default PlanetCards;
