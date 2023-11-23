import React from "react";
import logo from './../../assets/img/logo.png'

const Loader = () => {
  return (
    <div className="loading">
      <div id="spinner-container">
        <div id="spinner"></div>
        <img id="image" src={logo} alt="Your Image" />
      </div>
    </div>
  );
};

export default Loader;
