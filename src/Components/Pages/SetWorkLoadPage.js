import React, { useEffect } from 'react';
import {
  Title,
  Text,
  TextVariants,
  Radio,
  Spinner,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Tooltip,
  TextContent,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useEusVersions from '../../hooks/useEusVersions';

const SetWorkloadPage = ({
  isEditMode,
  releaseVersions,
  workloadOptions,
  workload,
  setWorkload,
  extendedReleaseProduct,
  setExtendedReleaseProduct,
  extendedReleaseVersion,
  setExtendedReleaseVersion,
  setExtendedReleaseRepositories,
}) => {
  const { isLoading, error, data } = useEusVersions();

  useEffect(() => {
    if (workload.includes('Extended') && data?.length > 0) {
      setExtendedReleaseProduct(extendedReleaseProduct || data[0]?.name);
      setExtendedReleaseVersion(
        extendedReleaseVersion || data[0]?.configurations[0]?.version
      );
    } else {
      setExtendedReleaseProduct('');
      setExtendedReleaseVersion('');
    }
  }, [data, workload]);

  useEffect(() => {
    if (data && workload.includes('Extended')) {
      const selectedProduct = data.find(
        (product) => extendedReleaseProduct === product.name
      );
      const selectedVersion = selectedProduct?.configurations.find(
        (configuration) => extendedReleaseVersion === configuration.version
      );
      setExtendedReleaseRepositories(selectedVersion?.repositories || []);
    } else {
      setExtendedReleaseRepositories([]);
    }
  }, [data, extendedReleaseProduct, extendedReleaseVersion]);

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
          console.log('wl:', wl, ' workload:', workload);
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
      {workload === workloadOptions[1] && (
        <Form>
          <FormGroup label="Product">
            <FormSelect
              onChange={(_event, v) => setExtendedReleaseProduct(v)}
              value={extendedReleaseProduct}
              id="product"
              // isDisabled={isEditMode}
            >
              {data?.map((product, i) => (
                <FormSelectOption
                  key={i}
                  value={product.name}
                  label={product.name}
                />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Version">
            <FormSelect
              onChange={(_event, v) => setExtendedReleaseVersion(v)}
              value={extendedReleaseVersion || 'Not Defined'}
              id="version"
            >
              {isEditMode
                ? releaseVersions.length > 0
                  ? releaseVersions.map((version, i) => (
                      <FormSelectOption
                        key={i}
                        value={version}
                        label={version}
                      />
                    ))
                  : [
                      <FormSelectOption
                        key="0"
                        value=""
                        label="No versions available"
                      />,
                    ]
                : data
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
    </>
  );
};

SetWorkloadPage.propTypes = {
  isEditMode: PropTypes.bool,
  releaseVersions: PropTypes.array,
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
