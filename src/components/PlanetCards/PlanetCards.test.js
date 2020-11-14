import React from 'react';
import { render } from '@testing-library/react';
import PlanetCards from './PlanetCards';

import planets from '../../mockData/planets.json';

describe('PlanetCards Component', () => {
  it('renders correctly (detailed)', () => {
    const wrapper = render(<PlanetCards planets={planets} />);

    expect(wrapper).toMatchSnapshot();
  });
});
