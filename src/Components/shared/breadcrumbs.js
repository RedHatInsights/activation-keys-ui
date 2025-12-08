import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Breadcrumb } from '@patternfly/react-core/dist/dynamic/components/Breadcrumb';
import { BreadcrumbItem } from '@patternfly/react-core/dist/dynamic/components/Breadcrumb';

const Breadcrumbs = (breadcrumbs) => {
  return breadcrumbs ? (
    <Breadcrumb>
      {Object.values(breadcrumbs).map((item) =>
        item.title ? (
          <BreadcrumbItem key={item.title} isActive={item.isActive}>
            {(item.to && (
              <NavLink exact to={item.to}>
                {item.title}
              </NavLink>
            )) ||
              item.title}
          </BreadcrumbItem>
        ) : (
          '/'
        ),
      )}
    </Breadcrumb>
  ) : null;
};

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.object,
};

export default Breadcrumbs;
