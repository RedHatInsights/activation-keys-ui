import React, { useEffect, useState } from 'react';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Radio } from '@patternfly/react-core/dist/dynamic/components/Radio';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormSelect } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { FormSelectOption } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import PropTypes from 'prop-types';
import useEusVersions from '../../hooks/useEusVersions';

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
  setExtendedReleaseRepositories,
}) => {
  const { isLoading, error, data: releaseVersions } = useEusVersions();
  const [inferredReleaseProduct, setInferredReleaseProduct] = useState('');
  const [errorInferringProduct, setErrorInferringProduct] = useState(false);

  /**
   * Handle default settings
   *
   * Upon render, or workload change, set the correct defaults for release
   * product and version
   */
  useEffect(() => {
    if (workload.includes('Extended') && releaseVersions?.length > 0) {
      // In edit, we need to infer the product based on the repos
      if (isEditMode) {
        const inferredReleaseProduct = releaseVersions.find((product) =>
          product.configurations.find(
            (c) =>
              c.version == activationKey.releaseVersion &&
              c.repositories.every((repo) =>
                activationKey.additionalRepositories.find(
                  (has) => has.repositoryLabel == repo
                )
              )
          )
        )?.name;

        if (!inferredReleaseProduct) {
          setErrorInferringProduct(true);
        } else {
          setInferredReleaseProduct(inferredReleaseProduct);
        }
      }
      setExtendedReleaseProduct(
        (prev) => prev || inferredReleaseProduct || releaseVersions[0]?.name
      );
      setExtendedReleaseVersion(
        (prev) =>
          prev ||
          activationKey?.releaseVersion ||
          releaseVersions[0]?.configurations[0]?.version
      );
    } else {
      setExtendedReleaseProduct('');
      setExtendedReleaseVersion('');
    }
  }, [releaseVersions, workload]);

  /**
   * Update the EUS repos
   *
   * Based on the currently selected EUS product and version, set the
   * applicable repos
   */
  useEffect(() => {
    if (
      releaseVersions &&
      workload.includes('Extended') &&
      extendedReleaseProduct
    ) {
      console.log(releaseVersions, extendedReleaseProduct);
      setExtendedReleaseRepositories(
        releaseVersions
          .find((product) => extendedReleaseProduct == product.name)
          .configurations.find(
            (configuration) => extendedReleaseVersion == configuration.version
          ).repositories
      );
    } else {
      setExtendedReleaseRepositories([]);
    }
  }, [releaseVersions, extendedReleaseProduct, extendedReleaseVersion]);

  return (
    <>
      <Title headingLevel="h2" className="pf-v5-u-mb-sm">
        {isEditMode ? 'Edit Workload' : 'Select Workload'}
      </Title>
      <Text component={TextVariants.p} className="pf-v5-u-mb-xl">
        Choose a workload option to associate an appropriate selection of
        repositories to the activation key. Repositories can be edited on the
        activation key detail page.
      </Text>
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
                  <TextContent>
                    <Text
                      className="pf-v5-u-color-light-100"
                      component={TextVariants.small}
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
                    </Text>
                  </TextContent>
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
              <Text component="small" className="pf-v5-u-warning-color-200">
                Unable to infer product based on current additional
                repositories. &quot;{extendedReleaseProduct}&quot; has been
                selected by default.
              </Text>
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
          <Text component="small" className="pf-v5-u-warning-color-200">
            Editing the release version or product may remove all existing
            additional repositories from this key.
          </Text>
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
};
export default SetWorkloadPage;
