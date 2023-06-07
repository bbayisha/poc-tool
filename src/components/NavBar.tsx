import React from 'react';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBell, faFileAlt, faQuestionCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css'; // Import the custom CSS file
import logo from '../images/logo (2).png'

const NavBar: React.FC = () => {
  return (
    <div className='navbar'>
      <img width={'200px'} src={logo}/>
      <div className='icons'>
        <div><FontAwesomeIcon icon={faCog} className='grey-color' size="lg"></FontAwesomeIcon></div>
        <div><FontAwesomeIcon icon={faBell} className='grey-color' size="lg"></FontAwesomeIcon></div>
        <div><FontAwesomeIcon icon={faFileAlt} className='grey-color' size="lg"></FontAwesomeIcon></div>
        <div><FontAwesomeIcon icon={faQuestionCircle} className='grey-color' size="lg"></FontAwesomeIcon></div>
        <div><FontAwesomeIcon icon={faUser} className="grey-color" size="lg"/></div>
        {/* <select >
            <option >Profile</option>
            <option >Settings</option>
            <option >Logout</option>
          </select> */}
      </div>
    </div>
  );
}

export default NavBar;
