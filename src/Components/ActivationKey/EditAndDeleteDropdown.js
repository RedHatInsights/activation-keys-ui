import React, { useState } from 'react';
import { Dropdown } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownGroup } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import propTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteActivationKeyConfirmationModal from '../Modals/DeleteActivationKeyConfirmationModal';
import EditActivationKeyWizard from '../Modals/EditActivationKeyWizard';

export const EditAndDeleteDropdown = ({
  activationKey,
  onClick,
  releaseVersions,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };
  const onSelect = () => {
    setIsOpen(false);
  };

  const [isDeleteActivationKeyModalOpen, setIsDeleteActivationKeyModalOpen] =
    useState(false);
  const [isEditActivationKeyWizardOpen, setIsEditActivationKeyWizardOpen] =
    useState(false);
  const handleDeleteActivationKeysModalToggle = (keyDeleted) => {
    setIsDeleteActivationKeyModalOpen(!isDeleteActivationKeyModalOpen);

    if (keyDeleted === true) {
      navigate('..');
    }
  };

  const handleEditActivationKeyWizardToggle = () => {
    setIsEditActivationKeyWizardOpen(!isEditActivationKeyWizardOpen);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isOpen}
        onSelect={onSelect}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            onClick={onToggleClick}
            isExpanded={isOpen}
          >
            Actions
          </MenuToggle>
        )}
        onClick={onClick}
        shouldFocusToggleOnSelect
      >
        <DropdownGroup>
          <DropdownList>
            <DropdownItem
              value={0}
              key="edit"
              onClick={(event) => {
                event.preventDefault();
                handleEditActivationKeyWizardToggle();
              }}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              value={1}
              key="delete"
              onClick={(event) => {
                event.preventDefault();
                handleDeleteActivationKeysModalToggle();
              }}
            >
              Delete
            </DropdownItem>
          </DropdownList>
        </DropdownGroup>
      </Dropdown>
      <DeleteActivationKeyConfirmationModal
        handleModalToggle={handleDeleteActivationKeysModalToggle}
        isOpen={isDeleteActivationKeyModalOpen}
        name={id}
      />
      <EditActivationKeyWizard
        activationKey={activationKey}
        handleModalToggle={handleEditActivationKeyWizardToggle}
        isOpen={isEditActivationKeyWizardOpen}
        releaseVersions={releaseVersions}
      />
    </React.Fragment>
  );
};

EditAndDeleteDropdown.propTypes = {
  onClick: propTypes.func.isRequired,
  activationKey: propTypes.object,
  activationKeyName: propTypes.string,
  releaseVersions: propTypes.array,
};

export default EditAndDeleteDropdown;
