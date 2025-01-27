import React from 'react';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import Loading from '../LoadingState/Loading';
import PropTypes from 'prop-types';
import {
  TableComposable,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
} from '@patternfly/react-table';

const ReviewEditWizardPage = ({ existingData, updatedData, isLoading }) => {
  const updatedFields = Object.keys(updatedData).filter(
    (key) => updatedData[key] !== existingData[key]
  );
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
      {updatedFields.length > 0 ? (
        <TableComposable aria-label="Updated Fields Table">
          <Thead>
            <Tr>
              <Th>Updated Fields</Th>
              <Th>Existing</Th>
              <Th>Updated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {updatedFields.map((field) => (
              <Tr key={field}>
                <Td>{field}</Td>
                <Td>{existingData[field]}</Td>
                <Td>{updatedData[field]}</Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      ) : (
        <Text component={TextVariants.p} className="pf-v5-u-mb-l">
          No Changes Detected
        </Text>
      )}
    </>
  );
};

ReviewEditWizardPage.propTypes = {
  existingData: PropTypes.object.isRequired,
  updatedData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ReviewEditWizardPage;
