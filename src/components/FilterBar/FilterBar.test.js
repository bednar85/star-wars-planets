import React from 'react';
import { render } from '@testing-library/react';
import FilterBar from './FilterBar';

describe('App Component', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <FilterBar searchFormHandler={jest.fn()} filterFormHandler={jest.fn()} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
