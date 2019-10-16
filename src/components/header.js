import React from "react";
//import PropTypes from 'prop-types'
import { Header, Icon } from "semantic-ui-react";

const HeaderCustom = () => {
  return (
    <Header as="h3" icon textAlign='center'>
      <Icon name="chart line"  circular/>
      ReportMe
    </Header>
  );
};

HeaderCustom.propTypes = {};

export default HeaderCustom;
