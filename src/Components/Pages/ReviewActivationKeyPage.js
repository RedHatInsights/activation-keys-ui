import React from 'react';
import {
  Title,
  Text,
  TextVariants,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';
import Loading from '../LoadingState/Loading';
import PropTypes from 'prop-types';

const ReviewActivationKeyPage = ({
  mode,
  name,
  description,
  workload,
  role,
  sla,
  usage,
  isLoading,
  activationKey,
  extendedReleaseProduct,
  extendedReleaseVersion,
}) => {
  if (isLoading) return <Loading />;
  const isEditMode = mode;
  const rows = [
    {
      term: 'Name',
      original: activationKey?.name,
      updated: name || 'Not Defined',
    },
    {
      term: 'Description',
      original: activationKey?.description || 'Not Defined',
      updated: description || 'Not Defined',
    },
    {
      term: 'Workload',
      original:
        isEditMode && activationKey?.releaseVersion
          ? 'Extended support releases'
          : 'Latest release',
      updated: workload || 'Not Defined',
    },
  ];
  if (workload === 'Extended support releases') {
    rows.push(
      {
        term: '',
        original: activationKey?.releaseProduct || 'Not Defined',
        updated: extendedReleaseProduct || 'Not Defined',
      },
      {
        term: '',
        original: activationKey?.releaseVersion || 'Not Defined',
        updated: extendedReleaseVersion || 'Not Defined',
      }
    );
  }
  rows.push(
    {
      term: 'Role',
      original: activationKey?.role || 'Not Defined',
      updated: role || 'Not Defined',
    },
    {
      term: 'Service level agreement (SLA)',
      original: activationKey?.serviceLevel || 'Not Defined',
      updated: sla || 'Not Defined',
    },
    {
      term: 'Usage',
      original: activationKey?.usage || 'Not Defined',
      updated: usage || 'Not Defined',
    }
  );

  console.log('Version:', activationKey?.releaseVersion);
  return (
    <>
      <Title headingLevel="h2" className="pf-v5-u-mb-sm">
        Review
      </Title>
      <Text component={TextVariants.p} className="pf-v5-u-mb-xl">
        {isEditMode
          ? 'Review the following information and click Edit to apply your changes. The updates will only affect future systems that register with this activation key, not currently registered systems.'
          : 'Review the following information and click Create to generate the activation key.'}
      </Text>
      <DescriptionList isHorizontal>
        {rows.map((row, index) => (
          <DescriptionListGroup key={index}>
            <DescriptionListTerm style={{ flexBasis: '35%' }}>
              {row.term}
            </DescriptionListTerm>
            <DescriptionListDescription>
              {isEditMode ? (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ flexBasis: '45%' }}>{row.original}</span>
                  <span style={{ flexBasis: '45%' }}>{row.updated}</span>
                </div>
              ) : (
                <span style={{ flexBasis: '45%' }}>{row.updated}</span>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </>
  );
};

ReviewActivationKeyPage.propTypes = {
  mode: PropTypes.bool.isRequired,
  activationKey: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    workload: PropTypes.string,
    role: PropTypes.string,
    serviceLevel: PropTypes.string,
    usage: PropTypes.string,
    releaseVersion: PropTypes.string,
    releaseProduct: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  workload: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  sla: PropTypes.string.isRequired,
  usage: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  extendedReleaseProduct: PropTypes.string,
  extendedReleaseVersion: PropTypes.string,
};
export default ReviewActivationKeyPage;
