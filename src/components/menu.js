import React, { useState } from "react";
import PropTypes from "prop-types";
import {  Menu } from "semantic-ui-react";

import router from "../router";

const MenuCustom = ({ children }) => {
  const [active, setActive] = useState("report");

  return (
    <div>
      <Menu pointing secondary>
        <Menu.Item
          name="Reportistica"
          active={active === "report"}
          onClick={() => setActive("report")}
        />
        <Menu.Item
          name="Esportazione"
          active={active === "export"}
          onClick={() => setActive("export")}
          disabled
        />
      </Menu>

      {router[active]}
    </div>
  );
};

MenuCustom.propTypes = {
  children: PropTypes.node
};

export default MenuCustom;
