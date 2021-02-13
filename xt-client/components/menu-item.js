import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const MenuItem = ({ item }) => {
  return (
    <li className="nav-item active">
      <Link href={ item.href }>
        <a className="nav-link">{ item.label }</a>
      </Link>
    </li>
  )
}

MenuItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default MenuItem;
