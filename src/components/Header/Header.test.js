import Header from './Header';

describe('App Component', () => {
  it('renders correctly', () => {
    const wrapper = render(<Header />);

    expect(wrapper).toMatchSnapshot();
  });
});
