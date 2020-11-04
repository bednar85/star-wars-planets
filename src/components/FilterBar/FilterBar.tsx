import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { ERA, FILTER_KEY, MEDIA } from '../../constants';
import { toKebabCase } from '../../utils';

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
      const formFieldId: string = toKebabCase(label);

      return (
        <div
          key={`filter-form__input-${index}`}
          className="filter-form__input-wrapper"
        >
          <input
            type={type}
            className="filter-form__input"
            id={`${name}-${formFieldId}`}
            name={name}
            value={label}
            defaultChecked={isCheckedByDefault}
            ref={register}
          />
          <label
            className="filter-form__label"
            htmlFor={`${name}-${formFieldId}`}
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
      <fieldset className="filter-form__fieldset">
        <h2 className="filter-form__heading">
          Media
        </h2>
        {renderInputs({
          type: 'radio',
          name: FILTER_KEY.MEDIA,
          labels: [...Object.values(MEDIA)],
          defaultChecked: 0
        })}
      </fieldset>
      <fieldset className="filter-form__fieldset">
        <h2 className="filter-form__heading">Era</h2>
        {renderInputs({
          type: 'checkbox',
          name: FILTER_KEY.ERA,
          labels: [...Object.values(ERA)]
        })}
      </fieldset>
      <fieldset className="filter-form__fieldset">
        <h2 className="filter-form__heading">Canon</h2>
        <div className="filter-form__input-wrapper">
          <input
            type="checkbox"
            className="filter-form__input"
            id={FILTER_KEY.MY_CANON}
            name={FILTER_KEY.MY_CANON}
            ref={register}
          />
          <label className="filter-form__label" htmlFor={FILTER_KEY.MY_CANON}>
            My Canon
          </label>
        </div>
      </fieldset>
    </form>
  );
}

export default FilterBar;
