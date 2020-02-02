import App from 'App';

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
  // change this to a describe with it blocks in it
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
});
