import FilterBar from './FilterBar';

describe('App Component', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <FilterBar searchFormHandler={() => {}} filterFormHandler={() => {}} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
