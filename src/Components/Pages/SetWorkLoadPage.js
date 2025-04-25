import React from 'react';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Radio } from '@patternfly/react-core/dist/dynamic/components/Radio';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormSelect } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { FormSelectOption } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';

import PropTypes from 'prop-types';

const SetWorkloadPage = ({
  activationKey,
  isEditMode,
  workloadOptions,
  workload,
  setWorkload,
  extendedReleaseProduct,
  setExtendedReleaseProduct,
  extendedReleaseVersion,
  setExtendedReleaseVersion,
  isLoading,
  error,
  releaseVersions,
  errorInferringProduct,
  inferredReleaseProduct,
}) => {
  return (
    <>
      <Title headingLevel="h2" className="pf-v5-u-mb-sm">
        {isEditMode ? 'Edit Workload' : 'Select Workload'}
      </Title>
      <Content component={ContentVariants.p} className="pf-v5-u-mb-xl">
        Choose a workload option to associate an appropriate selection of
        repositories to the activation key. Repositories can be edited on the
        activation key detail page.
      </Content>
      {!isLoading ? (
        workloadOptions.map((wl, i) => {
          const isDisabled = i === 1 && error === 400;
          return (
            <Tooltip
              key={i}
              content={
                isDisabled ? (
                  'Your account has no extended support subscriptions'
                ) : i === 0 ? (
                  'Activation key will use the latest RHEL release'
                ) : (
                  <Content>
                    <Content
                      className="pf-v5-u-color-light-100"
                      component={ContentVariants.small}
                    >
                      Activation key can be version locked to a specific version
                      of RHEL. You can only version lock an activation key to a
                      RHEL release that has the option of Extended Update
                      Support (EUS). For more information, please refer to:
                      <a
                        href="https://access.redhat.com/articles/rhel-eus#c9"
                        target="_blank"
                        rel="noreferrer"
                      >
                        https://access.redhat.com/articles/rhel-eus#c9
                      </a>
                    </Content>
                  </Content>
                )
              }
              position="left"
            >
              <Radio
                label={wl}
                onChange={() => setWorkload(wl)}
                isChecked={wl === workload}
                className="pf-v5-u-mb-md"
                name={wl}
                id={wl}
                isDisabled={isDisabled}
              />
            </Tooltip>
          );
        })
      ) : (
        <Spinner />
      )}
      {!isLoading && workload === workloadOptions[1] && (
        <Form>
          <FormGroup label="Product">
            <FormSelect
              onChange={(_event, v) => setExtendedReleaseProduct(v)}
              value={extendedReleaseProduct}
              id="product"
            >
              {releaseVersions.map((product, i) => {
                return (
                  <FormSelectOption
                    key={i}
                    value={product.name}
                    label={product.name}
                  />
                );
              })}
            </FormSelect>
            {errorInferringProduct && (
              <Content component="small" className="pf-v5-u-warning-color-200">
                Unable to infer product based on current additional
                repositories. &quot;{extendedReleaseProduct}&quot; has been
                selected by default.
              </Content>
            )}
          </FormGroup>
          <FormGroup label="Version">
            <FormSelect
              onChange={(_event, v) => setExtendedReleaseVersion(v)}
              value={
                extendedReleaseVersion ||
                activationKey?.releaseVersion ||
                'Not Defined'
              }
              id="version"
            >
              {releaseVersions
                ?.find((product) => product.name === extendedReleaseProduct)
                ?.configurations.map((configuration, i) => (
                  <FormSelectOption
                    key={i}
                    value={configuration.version}
                    label={configuration.version}
                  />
                ))}
            </FormSelect>
          </FormGroup>
        </Form>
      )}
      {!isLoading &&
        isEditMode &&
        !(
          activationKey?.releaseVersion == undefined &&
          extendedReleaseVersion == ''
        ) &&
        (activationKey?.releaseVersion != extendedReleaseVersion ||
          inferredReleaseProduct != extendedReleaseProduct) && (
          <Content component="small" className="pf-v5-u-warning-color-200">
            Editing the release version or product may remove all existing
            additional repositories from this key.
          </Content>
        )}
    </>
  );
};

SetWorkloadPage.propTypes = {
  activationKey: PropTypes.obj,
  isEditMode: PropTypes.bool,
  workloadOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  workload: PropTypes.string.isRequired,
  setWorkload: PropTypes.func.isRequired,
  extendedReleaseProduct: PropTypes.string.isRequired,
  setExtendedReleaseProduct: PropTypes.func.isRequired,
  extendedReleaseVersion: PropTypes.string.isRequired,
  setExtendedReleaseVersion: PropTypes.func.isRequired,
  setExtendedReleaseRepositories: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  releaseVersions: PropTypes.arrayOf(PropTypes.object).isRequired,
  errorInferringProduct: PropTypes.bool.isRequired,
  inferredReleaseProduct: PropTypes.string.isRequired,
};
export default SetWorkloadPage;
