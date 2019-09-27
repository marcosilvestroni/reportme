import React from 'react'
import { Form } from 'semantic-ui-react'

const selectData = () => {
  const filterReport = () => alert('filtro!!')
  return (
    <Form onSubmit={filterReport}>
      <Form.Group widths="equal">
        <Form.Input label="Da data" type="date" name="dateFrom"></Form.Input>
        <Form.Input label="A data" type="date" name="dateTo"></Form.Input>
      </Form.Group>
      <Form.Group>
        <Form.Button type="submit">Genera Report</Form.Button>
      </Form.Group>
    </Form>
  )
}

export default selectData
