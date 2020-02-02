import Header from './Header';

describe('App Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Header />);

    expect(wrapper).toMatchSnapshot();
  });
});
