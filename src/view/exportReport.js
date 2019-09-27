import React from 'react'
import { Header } from 'semantic-ui-react'
import SelectData from '../components/selectData'

const exportReport = () => {
  return (
    <div>
      <Header tag="h3">Seleziona il periodo</Header>
      <SelectData />
    </div>
  )
}

export default exportReport
