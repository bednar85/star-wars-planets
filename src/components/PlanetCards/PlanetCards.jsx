import React, { Component, Fragment } from 'react';

class PlanetCards extends Component {
  constructor(props) {
    super(props);

    this.appearancesGroupedByEra = this.appearancesGroupedByEra.bind(this);
    this.renderAppearances = this.renderAppearances.bind(this);
    this.renderEraVisualizer = this.renderEraVisualizer.bind(this);
  }

  appearancesGroupedByEra(appearances, media) {
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
  }

  renderAppearances(planet) {
    const { appearances } = planet;

    const filmAppearances = this.appearancesGroupedByEra(appearances, 'Film');
    const tvAppearances = this.appearancesGroupedByEra(
      appearances,
      'TV Series'
    );

    const renderEntries = appearances =>
      appearances.map((appearance, index) => {
        const eraModifier = appearance.era.split(' ')[0].toLowerCase();

        return (
          <li
            key={`appearance-${index}`}
            className={`planet-card-appearances-list-item planet-card-appearances-list-item--${eraModifier}`}
          >
            {appearance.title} ({appearance.year})
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
  }

  renderEraVisualizer(planet) {
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
  }

  render() {
    const { planets } = this.props;

    if (!planets.length) {
      return (
        <div className="planet-cards planet-cards--no-data">
          <p className="">
            Sorry, no planets match the filters you've selected.
          </p>
        </div>
      );
    }

    return (
      <div className="planet-cards">
        {planets.map((planet, index) => (
          <div key={`planet-${index}`} className="planet-card">
            {this.renderEraVisualizer(planet)}
            <h3 className="planet-card-heading">{planet.name}</h3>
            {this.renderAppearances(planet)}
          </div>
        ))}
      </div>
    );
  }
}

export default PlanetCards;
