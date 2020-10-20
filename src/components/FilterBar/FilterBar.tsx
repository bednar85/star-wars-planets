import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { FILTER_KEY } from '../../constants';

interface Input {
  type: string;
  name: string;
  labels: string[];
  defaultChecked?: number;
}

interface FilterBarProps {
  register: ReturnType<typeof useForm>['register'];
}

function FilterBar({ register }: FilterBarProps) {
  const renderInputs = ({
    type,
    name,
    labels,
    defaultChecked
  }: Input): ReactElement[] => {
    return labels.map((label: string, index: number) => {
      const isCheckedByDefault: boolean =
        defaultChecked !== undefined ? defaultChecked === index : false;
      const labelKebabCased: string = label
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
            ref={register}
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
    <form className="filter-form">
      <input
        type="text"
        name="searchQuery"
        className="search-form-input"
        ref={register}
      />
      <fieldset className="filter-form-fieldset">
        <h2 className="filter-form-heading">
          Media <em>(choose one)</em>
        </h2>
        {renderInputs({
          type: 'radio',
          name: FILTER_KEY.MEDIA,
          labels: ['All', 'Film', 'Film (Episodes Only)', 'TV Series'],
          defaultChecked: 0
        })}
      </fieldset>
      <fieldset className="filter-form-fieldset">
        <h2 className="filter-form-heading">Era</h2>
        {renderInputs({
          type: 'checkbox',
          name: FILTER_KEY.ERA,
          labels: ['Prequel Trilogy', 'Original Trilogy', 'Sequel Trilogy']
        })}
      </fieldset>
      <fieldset className="filter-form-fieldset">
        <h2 className="filter-form-heading">Canon</h2>
        <div className="filter-form-input-wrapper">
          <input
            type="checkbox"
            className="filter-form-input"
            id={FILTER_KEY.MY_CANON}
            name={FILTER_KEY.MY_CANON}
            ref={register}
          />
          <label className="filter-form-label" htmlFor={FILTER_KEY.MY_CANON}>
            My Canon
          </label>
        </div>
      </fieldset>
    </form>
  );
}

export default FilterBar;
