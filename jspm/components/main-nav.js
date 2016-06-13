'use strict';
/* eslint  import/no-unresolved:0 */
import React from 'react';

const MainNav = () => (
  <nav className="mainNav">
    <div className="logo">albi</div>
    <ul>
      <li>
        <i className="fa fa-tachometer" aria-hidden="true"></i>Dashboard</li>
      <li>
        <i className="fa fa-bars" aria-hidden="true"></i>Setting</li>
    </ul>
  </nav>
);

export default MainNav;
