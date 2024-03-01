import React, { Component } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <Link to="/" className="navbar-brand logo-text text-white">
          <span>MedSync</span> <strong>Pro</strong>
        </Link>
      </nav>
    );
  }
}

export default Navbar;
