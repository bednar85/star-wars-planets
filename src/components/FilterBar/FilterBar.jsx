import React from 'react';

function FilterBar(props) {
  const { searchFormHandler, filterFormHandler } = props;

  return (
    <div className="search-and-filter-forms">
      <form className="search-form" onChange={searchFormHandler}>
        <input type="text" className="search-form-input" />
      </form>
      <form className="filter-form" onChange={filterFormHandler}>
        <fieldset className="filter-form-fieldset">
          <h2 className="filter-form-heading">Media:</h2>
          <div className="filter-form-input-wrapper">
            <input
              type="radio"
              className="filter-form-input"
              id="media-all"
              name="media"
              value="media:All"
              defaultChecked
            />
            <label className="filter-form-label" htmlFor="media-all">
              All
            </label>
          </div>
          <div className="filter-form-input-wrapper">
            <input
              type="radio"
              className="filter-form-input"
              id="media-film"
              name="media"
              value="media:Film"
            />
            <label className="filter-form-label" htmlFor="media-film">
              Film
            </label>
          </div>
          <div className="filter-form-input-wrapper">
            <input
              type="radio"
              className="filter-form-input"
              id="media-film-episodes-only"
              name="media"
              value="media:Film (Episodes Only)"
            />
            <label
              className="filter-form-label"
              htmlFor="media-film-episodes-only"
            >
              Film (Episodes Only)
            </label>
          </div>
          <div className="filter-form-input-wrapper">
            <input
              type="radio"
              className="filter-form-input"
              id="media-tv"
              name="media"
              value="media:TV Series"
            />
            <label className="filter-form-label" htmlFor="media-tv">
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
              id="era-prequel-trilogy"
              name="era"
              value="era:Prequel Trilogy"
            />
            <label className="filter-form-label" htmlFor="era-prequel-trilogy">
              Prequel Trilogy
            </label>
          </div>
          <div className="filter-form-input-wrapper">
            <input
              type="checkbox"
              className="filter-form-input"
              id="era-original-trilogy"
              name="era"
              value="era:Original Trilogy"
            />
            <label className="filter-form-label" htmlFor="era-original-trilogy">
              Original Trilogy
            </label>
          </div>
          <div className="filter-form-input-wrapper">
            <input
              type="checkbox"
              className="filter-form-input"
              id="era-sequel-trilogy"
              name="era"
              value="era:Sequel Trilogy"
            />
            <label className="filter-form-label" htmlFor="era-sequel-trilogy">
              Sequel Trilogy
            </label>
          </div>
        </fieldset>
        <fieldset className="filter-form-fieldset">
          <h2 className="filter-form-heading">Canon:</h2>
          <div className="filter-form-input-wrapper">
            <input
              type="checkbox"
              className="filter-form-input"
              id="my-canon"
              name="my-canon"
              value="my-canon"
            />
            <label className="filter-form-label" htmlFor="my-canon">
              My Canon
            </label>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default FilterBar;
