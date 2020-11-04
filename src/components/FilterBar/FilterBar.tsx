import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { ERA, FILTER_KEY, MEDIA } from '../../constants';
import { toKebabCase } from '../../utils';
import './FilterBar.scss';

interface Input {
  type: string;
  name: string;
  labels: string[];
  defaultChecked?: number;
}

interface FilterBarProps {
  register: ReturnType<typeof useForm>['register'];
}

const getDisplayLabel = (label: string) => {
  if (label === MEDIA.ALL) return `${MEDIA.ALL} – 🎥 📺`;
  if (label === MEDIA.FILM) return `${MEDIA.FILM} – 🎥`;
  if (label === MEDIA.EPISODES) return `${MEDIA.EPISODES}`;
  if (label === MEDIA.SPINOFFS) return `${MEDIA.SPINOFFS}`;
  if (label === MEDIA.TV) return `${MEDIA.TV} – 📺`;

  return label;
}

function FilterBar({ register }: FilterBarProps) {
  const renderInputs = ({
    type,
    name,
    labels,
    defaultChecked
  }: Input): ReactElement[] => labels.map((label: string, index: number) => {
      const formFieldId: string = toKebabCase(label);
      const displayLabel = getDisplayLabel(label)
      const subsetClass = (label === MEDIA.EPISODES || label === MEDIA.SPINOFFS) ? 'filter-bar__input-wrapper--subset' : '';

      return (
        <div
          key={`filter-bar__input-${index}`}
          className={`filter-bar__input-wrapper ${subsetClass}`}
        >
          <input
            type={type}
            className="filter-bar__input"
            id={`${name}-${formFieldId}`}
            name={name}
            value={label}
            ref={register}
          />
          <label
            className="filter-bar__label"
            htmlFor={`${name}-${formFieldId}`}
          >
            {displayLabel}
          </label>
        </div>
      );
    });

  return (
    <form className="filter-bar">
      <input
        type="text"
        name="searchQuery"
        className="search-form-input"
        ref={register}
      />
      <fieldset className="filter-bar__fieldset">
        <h2 className="filter-bar__heading">
          Media
        </h2>
        {renderInputs({
          type: 'radio',
          name: FILTER_KEY.MEDIA,
          labels: [...Object.values(MEDIA)]
        })}
      </fieldset>
      <fieldset className="filter-bar__fieldset">
        <h2 className="filter-bar__heading">Era</h2>
        {renderInputs({
          type: 'checkbox',
          name: FILTER_KEY.ERA,
          labels: [...Object.values(ERA)]
        })}
      </fieldset>
      <fieldset className="filter-bar__fieldset">
        <h2 className="filter-bar__heading">Canon</h2>
        <div className="filter-bar__input-wrapper">
          <input
            type="checkbox"
            className="filter-bar__input"
            id={FILTER_KEY.MY_CANON}
            name={FILTER_KEY.MY_CANON}
            ref={register}
          />
          <label className="filter-bar__label" htmlFor={FILTER_KEY.MY_CANON}>
            My Canon
          </label>
        </div>
      </fieldset>
    </form>
  );
}

export default FilterBar;
