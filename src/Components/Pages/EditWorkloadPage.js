import React, { useEffect } from 'react';
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

const EditWorkloadPage = ({
  releaseVersions,
  workloadOptions,
  workload,
  setWorkload,
  extendedReleaseProduct,
  extendedReleaseVersion,
  setExtendedReleaseVersion,
  setExtendedReleaseProduct,
}) => {
  const { isLoading, error, data } = useEusVersions();

  const options = releaseVersions.map((version, i) => (
    <FormSelectOption value={version} label={version} key={i} />
  ));

  options.push(
    <FormSelectOption
      value=""
      label="Not defined"
      key={releaseVersions?.length}
    />
  );
  useEffect(() => {
    if (workload.includes('Extended') && data) {
      setExtendedReleaseProduct(extendedReleaseProduct || data[0].name);
      setExtendedReleaseVersion(
        extendedReleaseVersion || data[0].configurations[0].version
      );
    } else {
      setExtendedReleaseProduct('');
      setExtendedReleaseVersion('');
    }
  }, [data, workload]);

  return (
    <>
      <Title headingLevel="h2" className="pf-v5-u-mb-sm">
        Edit Workload
      </Title>
      <Text component={TextVariants.p} className="pf-v5-u-mb-xl">
        Choose a workload option to associate an appropriate selection of
        repositories to the activation key. Repositories can be edited on the
        activation key detail page.{' '}
      </Text>
      {!isLoading ? (
        workloadOptions.map((wl, i) => {
          const isDisabled = i == 1 && error == 400;

          const button = (
            <Radio
              label={wl}
              onChange={() => setWorkload(wl)}
              isChecked={wl == workload}
              className="pf-v5-u-mb-md"
              name={wl}
              id={wl}
              // isDisabled={isDisabled}
              key={wl}
            />
          );

          return (
            <Tooltip
              key={i}
              content={
                isDisabled ? (
                  'Your account has no extended support subscriptions'
                ) : i == 0 ? (
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
                      Support (EUS). For more information please refer to:{' '}
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
              {button}
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
              value={extendedReleaseProduct}
              id="product"
              // onChange={(event) =>
              //   setExtendedReleaseProduct(event.target.value)
              // }
              isDisabled
            >
              {data.map((product, i) => {
                return (
                  <FormSelectOption
                    key={i}
                    value={product.name}
                    label={product.name}
                  />
                );
              })}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Version">
            <FormSelect
              onChange={(event) =>
                setExtendedReleaseVersion(event.target.value)
              }
              value={extendedReleaseVersion || 'Not Defined'}
              id="version"
            >
              {options}
            </FormSelect>
          </FormGroup>
        </Form>
      )}
    </>
  );
};

EditWorkloadPage.propTypes = {
  workloadOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  setWorkload: PropTypes.func.isRequired,
  releaseVersions: PropTypes.array,
  workload: PropTypes.string.isRequired,
  extendedReleaseProduct: PropTypes.string.isRequired,
  setExtendedReleaseProduct: PropTypes.func.isRequired,
  extendedReleaseVersion: PropTypes.string.isRequired,
  setExtendedReleaseVersion: PropTypes.func.isRequired,
  setExtendedReleaseRepositories: PropTypes.func.isRequired,
  setActivationVersion: PropTypes.func.isRequired,
};

export default EditWorkloadPage;
