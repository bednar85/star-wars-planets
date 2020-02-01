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

  it('handles filter changes', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();

    expect(instance.handleFilterChange).toBeDefined();
  });
});
