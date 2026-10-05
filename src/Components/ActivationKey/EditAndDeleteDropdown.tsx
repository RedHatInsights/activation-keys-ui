import React, { useState } from 'react';
import { Dropdown } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownGroup } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteActivationKeyConfirmationModal from '../Modals/DeleteActivationKeyConfirmationModal';
import ActivationKeyWizard from '../Modals/ActivationKeyWizard';
import type { ActivationKey } from '../../hooks/types';

export interface EditAndDeleteDropdownProps {
  onClick: () => void;
  activationKey?: ActivationKey;
}

export const EditAndDeleteDropdown = ({ activationKey, onClick }: EditAndDeleteDropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };
  const onSelect = () => {
    setIsOpen(false);
  };

  const [isDeleteActivationKeyModalOpen, setIsDeleteActivationKeyModalOpen] = useState(false);
  const [isEditActivationKeyWizardOpen, setIsEditActivationKeyWizardOpen] = useState(false);

  const handleDeleteActivationKeysModalToggle = (_name: string, keyDeleted: boolean) => {
    setIsDeleteActivationKeyModalOpen(!isDeleteActivationKeyModalOpen);

    if (keyDeleted === true) {
      navigate('..');
    }
  };

  const isEditMode = activationKey !== undefined;

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
          <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
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
                handleDeleteActivationKeysModalToggle(activationKey?.name || '', false);
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
        name={id as string}
      />
      <ActivationKeyWizard
        isEditMode={isEditMode}
        activationKey={activationKey}
        handleModalToggle={handleEditActivationKeyWizardToggle}
        isOpen={isEditActivationKeyWizardOpen}
      />
    </React.Fragment>
  );
};

export default EditAndDeleteDropdown;
