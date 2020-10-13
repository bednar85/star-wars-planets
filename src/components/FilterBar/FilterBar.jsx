import React from 'react';
import PropTypes from 'prop-types';
import { FILTER_KEY } from '../../constants';

function FilterBar(props) {
  const { filterFormHandler, searchFormHandler } = props;

  const renderInputs = inputData => {
    const { name, defaultChecked, labels, type } = inputData;

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
            id={`${name}-${labelKebabCased}`}
            name={name}
            value={label}
            defaultChecked={isCheckedByDefault}
          />
          <label
            className="filter-form-label"
            htmlFor={`${name}-${labelKebabCased}`}
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
            name: FILTER_KEY.MEDIA,
            labels: ['All', 'Film', 'Film (Episodes Only)', 'TV Series'],
            defaultChecked: 0
          })}
        </fieldset>
        <fieldset className="filter-form-fieldset">
          <h2 className="filter-form-heading">Era:</h2>
          {renderInputs({
            type: 'checkbox',
            name: FILTER_KEY.ERA,
            labels: ['Prequel Trilogy', 'Original Trilogy', 'Sequel Trilogy']
          })}
        </fieldset>
        <fieldset className="filter-form-fieldset">
          <h2 className="filter-form-heading">Canon:</h2>
          <div className="filter-form-input-wrapper">
            <input
              type="checkbox"
              className="filter-form-input"
              id={FILTER_KEY.MY_CANON}
              name={FILTER_KEY.MY_CANON}
              value={FILTER_KEY.MY_CANON}
            />
            <label className="filter-form-label" htmlFor={FILTER_KEY.MY_CANON}>
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
