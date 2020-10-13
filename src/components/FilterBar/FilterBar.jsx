import React from 'react';
import PropTypes from 'prop-types';

function FilterBar(props) {
  const { filterFormHandler, searchFormHandler } = props;

  const renderInputs = inputData => {
    const { category, defaultChecked, labels, type } = inputData;

    return labels.map((label, index) => {
      const isCheckedByDefault =
        defaultChecked !== undefined ? defaultChecked === index : false;
      const labelKebabCased = label
        .toLowerCase()
        .replace(/[^a-zA-Z']/gi, ' ')
        .trim()
        .replace(/\s+/g, '-');

      return (
        <div
          key={`filter-form-input-${index}`}
          className="filter-form-input-wrapper"
        >
          <input
            type={type}
            className="filter-form-input"
            id={`${category}-${labelKebabCased}`}
            name={category}
            value={label}
            defaultChecked={isCheckedByDefault}
          />
          <label
            className="filter-form-label"
            htmlFor={`${category}-${labelKebabCased}`}
          >
            {label}
          </label>
        </div>
      );
    });
  };

  return (
    <div className="search-and-filter-forms">
      <form className="search-form" onChange={searchFormHandler}>
        <input type="text" className="search-form-input" />
      </form>
      <form className="filter-form" onChange={filterFormHandler}>
        <fieldset className="filter-form-fieldset">
          <h2 className="filter-form-heading">Media:</h2>
          {renderInputs({
            type: 'radio',
            category: 'media',
            labels: ['All', 'Film', 'Film (Episodes Only)', 'TV Series'],
            defaultChecked: 0
          })}
        </fieldset>
        <fieldset className="filter-form-fieldset">
          <h2 className="filter-form-heading">Era:</h2>
          {renderInputs({
            type: 'checkbox',
            category: 'era',
            labels: ['Prequel Trilogy', 'Original Trilogy', 'Sequel Trilogy']
          })}
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

FilterBar.propTypes = {
  filterFormHandler: PropTypes.func.isRequired,
  searchFormHandler: PropTypes.func.isRequired
};

export default FilterBar;
