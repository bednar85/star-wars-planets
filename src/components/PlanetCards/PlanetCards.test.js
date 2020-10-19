import PlanetCards from './PlanetCards';

import planets from 'planets.json';

describe('PlanetCards Component', () => {
  it('renders correctly (detailed)', () => {
    const wrapper = render(<PlanetCards planets={planets} />);

    expect(wrapper).toMatchSnapshot();
  });
});
