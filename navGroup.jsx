import PropTypes from 'prop-types';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import NavCollapse from '../NavCollapse';
import NavItem from '../NavItem';

const NavGroup = ({ layout, group }) => {
  // Debugging: Log the incoming data
  // console.log('NavGroup Data:', group);

  let navItems = [];

  if (Array.isArray(group.children)) {
    const seenKeys = new Set(); // Track used keys

    navItems = group.children.map((item, index) => {
      let uniqueKey = item.id || `${group.id}-${index}`;

      // If key is already used, append index
      while (seenKeys.has(uniqueKey)) {
        uniqueKey = `${uniqueKey}-${index}`;
      }
      seenKeys.add(uniqueKey);

      switch (item.type) {
        case 'collapse':
          return <NavCollapse key={uniqueKey} collapse={item} type="main" />;
        case 'item':
          return <NavItem layout={layout} key={uniqueKey} item={item} />;
        default:
          return null;
      }
    });
  } else {
    console.error('Error: group.children should be an array but got:', typeof group.children);
  }

  return (
    <React.Fragment>
      <ListGroup.Item as="li" bsPrefix=" " key={group.id} className="nav-item pcoded-menu-caption">
        <label>{group.title}</label>
      </ListGroup.Item>
      {navItems}
    </React.Fragment>
  );
};

// Corrected PropTypes
NavGroup.propTypes = {
  layout: PropTypes.string,
  group: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        type: PropTypes.oneOf(['collapse', 'item']).isRequired
      })
    )
  }).isRequired
};

export default NavGroup;
