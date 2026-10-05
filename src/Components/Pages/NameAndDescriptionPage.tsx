import React from 'react';
import SetNamePage from './SetNamePage';
import ActivationKeyDescription from '../ActivationKey/ActivationKeyDescription';
import type { ActivationKey } from '../../hooks/types';

export interface NameAndDescriptionPageProps {
  isEditMode: boolean;
  /** Accepted but unused — ActivationKeyWizard passes it. */
  activationKey?: ActivationKey;
  name: string;
  setName: (value: string) => void;
  nameIsValid: boolean;
  description?: string;
  setDescription: (value: string) => void;
  descriptionIsValid: boolean;
  isNameDisabled: boolean;
}

const NameAndDescriptionPage = ({
  isEditMode,
  name,
  setName,
  nameIsValid,
  description,
  setDescription,
  descriptionIsValid,
  isNameDisabled
}: NameAndDescriptionPageProps) => {
  return (
    <div className="pf-l-grid pf-m-gutter">
      <div className="pf-v6-u-mb-xl">
        <SetNamePage
          name={name}
          setName={setName}
          nameIsValid={nameIsValid}
          isNameDisabled={isNameDisabled}
        />
      </div>
      <div className="pf-v6-u-mb-xl">
        <div className="pf-v6-u-text-wrap">
          <ActivationKeyDescription
            isEditMode={isEditMode}
            description={description}
            setDescription={setDescription}
            descriptionIsValid={descriptionIsValid}
          />
        </div>
      </div>
    </div>
  );
};

export default NameAndDescriptionPage;
