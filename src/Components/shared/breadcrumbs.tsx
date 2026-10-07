import React from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb } from '@patternfly/react-core/dist/dynamic/components/Breadcrumb';
import { BreadcrumbItem } from '@patternfly/react-core/dist/dynamic/components/Breadcrumb';

export interface BreadcrumbEntry {
  title?: string;
  to?: string;
  isActive?: boolean;
}

/**
 * Callers spread an array of entries as props, so the received object is
 * keyed by index rather than by name.
 */
type BreadcrumbsProps = Record<string, BreadcrumbEntry>;

const Breadcrumbs = (breadcrumbs: BreadcrumbsProps) => {
  return breadcrumbs ? (
    <Breadcrumb>
      {Object.values(breadcrumbs).map((item) =>
        item.title ? (
          <BreadcrumbItem key={item.title} isActive={item.isActive}>
            {(item.to && <NavLink to={item.to}>{item.title}</NavLink>) || item.title}
          </BreadcrumbItem>
        ) : (
          '/'
        )
      )}
    </Breadcrumb>
  ) : null;
};

export default Breadcrumbs;
