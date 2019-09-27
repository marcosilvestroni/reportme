import React from 'react'
import PropTypes from 'prop-types'
import Header from './header'
import Menu from './menu'

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Menu>{children}</Menu>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout
