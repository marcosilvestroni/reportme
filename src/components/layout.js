import React from "react";
import PropTypes from "prop-types";
import Header from "./header";
import Menu from "./menu";
import "semantic-ui-css/semantic.min.css";
import { Segment } from "semantic-ui-react";
import '../styles.css'

const Layout = ({ children }) => {
  return (
    <div>
      <Segment className="noprint">
        <Header />
        <Menu>{children}</Menu>
      </Segment>
      <div id="print-zone"></div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
