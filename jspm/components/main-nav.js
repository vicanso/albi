'use strict';
import React, { PropTypes, Component } from 'react';

class MainNav extends Component {
  render() {
    return (
      <nav className='mainNav'>
        <div className='logo'>albi</div>
        <ul>
          <li>
            <i className='fa fa-tachometer' aria-hidden='true'></i>Dashboard</li>
          <li>
            <i className='fa fa-bars' aria-hidden='true'></i>Setting</li>
        </ul>
      </nav>
    );
  }
}

export default MainNav;