import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, Menu, Segment } from "semantic-ui-react";

import router from "../router";

const MenuCustom = ({ children }) => {
  const [active, setActive] = useState("export");

  return (
    <Grid>
      <Grid.Column width={4}>
        <Menu fluid vertical tabular>
          <Menu.Item
            name="Reportistica"
            active={active === "reportPeriod"}
            onClick={() => setActive("reportPeriod")}
          />
          <Menu.Item
            name="Esportazione"
            active={active === "export"}
            onClick={() => setActive("export")}
          />
        </Menu>
      </Grid.Column>

      <Grid.Column stretched width={12}>
        <Segment>{router[active]}</Segment>
      </Grid.Column>
    </Grid>
  );
};

MenuCustom.propTypes = {
  children: PropTypes.node
};

export default MenuCustom;
