import React, { ReactElement } from 'react';

import logo from 'assets/imgs/star-wars-logo-yellow.png';
import './Header.scss';

const Header = (): ReactElement => (
  <header className="header">
    <img className="app-logo" src={logo} alt="Star Wars" />
    <span className="image-attribution">
      Illustration by{' '}
      <a
        href="https://www.artstation.com/pabloolivera"
        target="_blank"
        rel="noreferrer noopener"
      >
        Pablo Olivera
      </a>
    </span>
  </header>
);

export default Header;
