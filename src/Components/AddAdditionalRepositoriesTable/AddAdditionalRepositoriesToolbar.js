import React, { useState } from 'react';
import { SearchInput } from '@patternfly/react-core/dist/dynamic/components/SearchInput';
import { ToggleGroupItem } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { Toolbar } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarContent } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToggleGroup } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { Select, SelectOption } from '@patternfly/react-core/deprecated';
import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import propTypes from 'prop-types';
import { Chip } from '@patternfly/react-core/dist/dynamic/components/Chip';
import { ChipGroup } from '@patternfly/react-core/dist/dynamic/components/Chip';

const AddAdditionalRepositoriesToolbar = ({
  friendlyNameMap,
  filters,
  selectedOnlyToggleIsDisabled,
  searchIsDisabled,
  dropdownSelectisDisabled,
  pagination,
  onlyShowSelectedRepositories,
  setOnlyShowSelectedRepositories,
}) => {
  const [isSelectFilterByExpanded, setIsSelectFilterByExpanded] =
    useState(false);

  const [isMultiSelectOptionsExanded, setIsMultiSelectOptionsExpanded] =
    useState(false);

  const [activeFilter, setActiveFilter] = useState(Object.keys(filters)[0]);

  return (
    <Toolbar id="add-additional-repositories-toolbar">
      <ToolbarContent>
        <ToolbarGroup>
          <ToolbarItem spacer={{ default: 'spacerNone' }}>
            <Select
              isOpen={isSelectFilterByExpanded}
              onToggle={(_event, isSelectFilterByExpanded) =>
                setIsSelectFilterByExpanded(isSelectFilterByExpanded)
              }
              toggleIcon={<FilterIcon />}
              placeholderText={friendlyNameMap[activeFilter]}
              onSelect={(_, value) => {
                setActiveFilter(value[0]);
                setIsSelectFilterByExpanded(false);
              }}
              isDisabled={dropdownSelectisDisabled}
            >
              {Object.entries(filters).map(([k, v]) => {
                return (
                  <SelectOption value={[k, v]} key={k}>
                    {friendlyNameMap[k]}
                  </SelectOption>
                );
              })}
            </Select>
          </ToolbarItem>
          <ToolbarItem>
            {!Array.isArray(filters[activeFilter].value) && (
              <SearchInput
                placeholder={`Filter by ${friendlyNameMap[activeFilter]}`}
                value={filters[activeFilter].value}
                onChange={(_event, value) => filters[activeFilter].set(value)}
                isDisabled={searchIsDisabled}
                onClear={() => filters[activeFilter].set('')}
                style={{ width: '400px' }}
              />
            )}
            {Array.isArray(filters[activeFilter].value) && (
              <Select
                isOpen={isMultiSelectOptionsExanded}
                placeholderText={filters[activeFilter].placeholder}
                onToggle={(_, isOpen) =>
                  setIsMultiSelectOptionsExpanded(isOpen)
                }
                onSelect={(_, value) => {
                  filters[activeFilter].set([
                    ...filters[activeFilter].value,
                    value,
                  ]);
                  setIsMultiSelectOptionsExpanded(false);
                }}
              >
                {filters[activeFilter].opts.map((opt) => {
                  return (
                    <SelectOption
                      key={opt}
                      isDisabled={filters[activeFilter].value.includes(opt)}
                      value={opt}
                    >
                      {opt}
                    </SelectOption>
                  );
                })}
              </Select>
            )}
          </ToolbarItem>
          <ToolbarItem>
            <ToggleGroup>
              <ToggleGroupItem
                text="All"
                isSelected={!onlyShowSelectedRepositories}
                onChange={(_event, selected) => {
                  if (selected) {
                    setOnlyShowSelectedRepositories(false);
                  }
                }}
              />
              <ToggleGroupItem
                text="Selected"
                isSelected={onlyShowSelectedRepositories}
                onChange={(_event, selected) => {
                  if (selected) {
                    setOnlyShowSelectedRepositories(true);
                  }
                }}
                isDisabled={selectedOnlyToggleIsDisabled}
              />
            </ToggleGroup>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          {pagination}
        </ToolbarItem>
      </ToolbarContent>
      <ToolbarContent>
        <ToolbarGroup>
          {Object.entries(filters)
            .filter(([, v]) =>
              Array.isArray(v.value) ? v.value.length > 0 : v.value !== ''
            )
            .map(([k, v]) => (
              <ToolbarItem key={k}>
                <ChipGroup categoryName={friendlyNameMap[k]}>
                  {Array.isArray(v.value) && (
                    <>
                      {v.value.map((filter, i) => (
                        <Chip
                          key={i}
                          onClick={() => {
                            v.set(v.value.toSpliced(i, 1));
                          }}
                        >
                          {filter}
                        </Chip>
                      ))}
                    </>
                  )}
                  {!Array.isArray(v.value) && (
                    <Chip onClick={() => v.set('')}>{v.value}</Chip>
                  )}
                </ChipGroup>
              </ToolbarItem>
            ))}
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

AddAdditionalRepositoriesToolbar.propTypes = {
  friendlyNameMap: propTypes.object.isRequired,
  filters: propTypes.object.isRequired,
  selectedOnlyToggleIsDisabled: propTypes.bool.isRequired,
  searchIsDisabled: propTypes.bool.isRequired,
  pagination: propTypes.object.isRequired,
  onlyShowSelectedRepositories: propTypes.bool.isRequired,
  setOnlyShowSelectedRepositories: propTypes.func.isRequired,
  dropdownSelectisDisabled: propTypes.bool.isRequired,
};

export default AddAdditionalRepositoriesToolbar;
