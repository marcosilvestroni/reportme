import React from "react";
//import PropTypes from 'prop-types'
import { Header, Icon, Grid, Button } from "semantic-ui-react";

const printPage = () => {
  const elms = document.getElementsByClassName("printme");
  Array.prototype.forEach.call(elms, element => {
    document.getElementById("print-zone").appendChild(element.cloneNode(true));
  });
  window.print();
  document.getElementById("print-zone").innerHTML = "";
};

const closeApplication = () => {
  if (window.confirm("Confermi di voler uscire?")) {
    window.ipcRenderer.send("close-app");
  }
};

const minimizeApplication = () => {
  window.ipcRenderer.send("min-app");
};

const maximazeApplication = () => {
  window.ipcRenderer.send("max-app");
};

const HeaderCustom = () => {
  return (
    <Grid columns="equal" centered>
      <Grid.Column textAlign="left">
        <Button icon onClick={printPage}>
          <Icon name="print" size="large" />
        </Button>
      </Grid.Column>
      <Grid.Column>
        <Header as="h3" icon textAlign="center" className="printme">
          <Icon name="chart line" circular />
          ReportMe 
        </Header>
      </Grid.Column>
      <Grid.Column textAlign="right">
        <Button.Group>
          <Button icon onClick={minimizeApplication}>
            <Icon name="window minimize"  />
          </Button>
          <Button icon onClick={maximazeApplication}>
            <Icon name="window maximize"  />
          </Button>
          <Button icon onClick={closeApplication}>
            <Icon name="cancel" />
          </Button>
        </Button.Group>
      </Grid.Column>
    </Grid>
  );
};

HeaderCustom.propTypes = {};

export default HeaderCustom;
