import React from "react";
import AccontingTable from "../components/AccontingTable";
import PropTypes from "prop-types";
import Filters from "../components/Filters";

export default class reportPeriod extends React.Component {
  static propTypes = {
    prop: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    //getFatture().then(res => this.setState({ data: res.recordset }));
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <Filters />
        {data.length > 0 && <AccontingTable data={data} />}
      </div>
    );
  }
}
