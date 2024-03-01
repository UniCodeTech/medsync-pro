import React, { Component } from 'react';

class Footer extends Component {
    state = {  } 
    render() { 
        return (
            <footer style={{ position: 'fixed', bottom: 0, width: '100%', background: '#007ACC', color: 'white', textAlign: 'center', padding: '10px' }}>
                &copy; {new Date().getFullYear()} MedSync Pro. All rights reserved.
                </footer>

        );
  }
}

export default Footer;