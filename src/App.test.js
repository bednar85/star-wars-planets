import App from './App';

import planets from 'planets.json';

describe('App Component', () => {
  const defaultState = {
    filters: {
      media: 'All',
      era: [],
      myCanon: false
    },
    searchQuery: ''
  };

  it('renders correctly', () => {
    const wrapper = shallow(<App />);

    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (detailed)', () => {
    const wrapper = render(<App />);

    expect(wrapper).toMatchSnapshot();
  });

  it('handles search query changes', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();

    expect(instance.handleSearchQueryChange).toBeDefined();

    const mockEvent = {
      target: {
        value: 'Tatooine'
      }
    };

    instance.handleSearchQueryChange(mockEvent);

    const expectedState = {
      ...defaultState,
      searchQuery: 'Tatooine'
    };

    expect(wrapper.state()).toEqual(expectedState);
  });

  // refactor this, it's brittle bc it relies on a specific order for checking the state changes
  // consider changing this so it's a describe with it blocks in it / so it's more modular
  it('handles filter changes', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();

    expect(instance.handleFilterChange).toBeDefined();

    let mockEvent = {
      target: {
        value: 'my-canon'
      }
    };

    instance.handleFilterChange(mockEvent);

    let expectedState = {
      ...defaultState,
      filters: {
        ...defaultState.filters,
        myCanon: true
      }
    };

    expect(wrapper.state()).toEqual(expectedState);

    mockEvent = {
      target: {
        value: 'media:Film'
      }
    };

    instance.handleFilterChange(mockEvent);

    expectedState = {
      ...expectedState,
      filters: {
        ...expectedState.filters,
        media: 'Film'
      }
    };

    expect(wrapper.state()).toEqual(expectedState);

    mockEvent = {
      target: {
        value: 'era:Prequel Trilogy'
      }
    };

    instance.handleFilterChange(mockEvent);

    expectedState = {
      ...expectedState,
      filters: {
        ...expectedState.filters,
        era: ['Prequel Trilogy']
      }
    };

    expect(wrapper.state()).toEqual(expectedState);

    mockEvent = {
      target: {
        value: 'era:Original Trilogy'
      }
    };

    instance.handleFilterChange(mockEvent);

    expectedState = {
      ...expectedState,
      filters: {
        ...expectedState.filters,
        era: ['Prequel Trilogy', 'Original Trilogy']
      }
    };

    expect(wrapper.state()).toEqual(expectedState);
  });

  it('handles filtering appearance based on what I deem canon', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();

    expect(instance.ryanApprovedAppearances).toBeDefined();

    const tatooine = planets.find(planet => planet.name === 'Tatooine');
    const updatedAppearances = instance
      .ryanApprovedAppearances(tatooine)
      .map(appearance => appearance.title);

    expect(updatedAppearances).toContain('Episode IV - A New Hope');
    expect(updatedAppearances).not.toContain('Star Wars: The Clone Wars');
    expect(updatedAppearances).not.toContain(
      'Episode IX - The Rise of Skywalker'
    );
  });

  it('handles filtering planets based on the filters stored in the state', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();

    expect(instance.filteredPlanets).toBeDefined();

    const tatooine = planets.find(planet => planet.name === 'Tatooine');
    let updatedAppearances = instance
      .ryanApprovedAppearances(tatooine)
      .map(appearance => appearance.title);

    expect(updatedAppearances).toContain('Episode IV - A New Hope');
    expect(updatedAppearances).not.toContain('Star Wars: The Clone Wars');
    expect(updatedAppearances).not.toContain(
      'Episode IX - The Rise of Skywalker'
    );

    const ahchTo = planets.find(planet => planet.name === 'Ahch-To');

    updatedAppearances = instance
      .ryanApprovedAppearances(ahchTo)
      .map(appearance => appearance.title);

    expect(updatedAppearances.length).toEqual(0);
  });
});
