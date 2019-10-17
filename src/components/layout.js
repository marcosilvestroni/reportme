import React from "react";
import PropTypes from "prop-types";
import Header from "./header";
import Menu from "./menu";
import "semantic-ui-css/semantic.min.css";
import { Segment } from "semantic-ui-react";

const Layout = ({ children }) => {
  return (
    <Segment>
      <Header />
      <Menu>{children}</Menu>
    </Segment>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
