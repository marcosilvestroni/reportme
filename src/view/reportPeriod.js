import React from 'react'
import { getFatture } from '../api'
import AccontingTable from '../components/AccontingTable'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'

export default class reportPeriod extends React.Component {
  static propTypes = {
    prop: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    getFatture().then(res => this.setState({ data: res.recordset }))
  }

  render() {
    const { data } = this.state

    return (
      <div>
        <Header tag="h2">Fatture</Header>
        {data.length > 0 && <AccontingTable data={data} />}
      </div>
    )
  }
}
