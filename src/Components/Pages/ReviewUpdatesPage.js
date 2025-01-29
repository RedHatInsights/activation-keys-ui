import React from 'react';
import { TextVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { DescriptionList } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListTerm } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListGroup } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListDescription } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import Loading from '../LoadingState/Loading';
import PropTypes from 'prop-types';

const ReviewUpdatesPage = ({
  name,
  description,
  workload,
  role,
  sla,
  usage,
  isLoading,
  activationKey,
}) => {
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
      original: activationKey?.workload || 'Not Defined',
      updated: workload || 'Not Defined',
    },
    {
      term: 'Role',
      original: activationKey?.role || 'Not Defined',
      updated: role || 'Not Defined',
    },
    {
      term: 'Service level agreement(sla)',
      original: activationKey?.serviceLevel || 'Not Defined',
      updated: sla || 'Not Defined',
    },
    {
      term: 'Usage',
      original: activationKey?.usage || 'Not Defined',
      updated: usage || 'Not Defined',
    },
  ];

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Title headingLevel="h2" className="pf-v5-u-mb-sm">
        Review
      </Title>
      <Text component={TextVariants.p} className="pf-v5-u-mb-xl">
        Review the following information and click <b>Update</b> to finish
        editing the activation key. The updates will only affect the future
        systems that register with this activation key, but not the systems that
        already registered.
      </Text>
      <DescriptionList isHorizontal>
        {rows.map((row, index) => (
          <DescriptionListGroup key={index}>
            <DescriptionListTerm style={{ flexBasis: '30%' }}>
              {row.term}
            </DescriptionListTerm>
            <DescriptionListDescription>
              <div
                style={{ display: 'flex', justifyContent: ' space-between' }}
              >
                <span style={{ flexBasis: '45%' }}>{row.original}</span>
                <span style={{ flexBasis: '45%' }}>{row.updated}</span>
              </div>
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </>
  );
};

ReviewUpdatesPage.propTypes = {
  activationKey: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    workload: PropTypes.string,
    role: PropTypes.string,
    serviceLevel: PropTypes.string,
    usage: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  workload: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  sla: PropTypes.string.isRequired,
  usage: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  extendedReleaseProduct: PropTypes.string.isRequired,
  extendedReleaseVersion: PropTypes.string.isRequired,
};

export default ReviewUpdatesPage;
