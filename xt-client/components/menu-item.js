import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const MenuItem = ({ item }) => {
  return (
    <Link href={ item.href }>
      <a className="nav-link">{ item.label }</a>
    </Link>
  )
}

MenuItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default MenuItem;
