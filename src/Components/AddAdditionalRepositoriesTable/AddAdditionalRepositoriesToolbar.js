import React, { useState } from "react";
import { SearchInput } from "@patternfly/react-core/dist/dynamic/components/SearchInput";
import { ToggleGroupItem } from "@patternfly/react-core/dist/dynamic/components/ToggleGroup";
import { Toolbar } from "@patternfly/react-core/dist/dynamic/components/Toolbar";
import { ToolbarContent } from "@patternfly/react-core/dist/dynamic/components/Toolbar";
import { ToolbarGroup } from "@patternfly/react-core/dist/dynamic/components/Toolbar";
import { ToolbarItem } from "@patternfly/react-core/dist/dynamic/components/Toolbar";
import { ToggleGroup } from "@patternfly/react-core/dist/dynamic/components/ToggleGroup";
import { Select, SelectOption } from "@patternfly/react-core/deprecated";

import FilterIcon from "@patternfly/react-icons/dist/dynamic/icons/filter-icon";
import propTypes from "prop-types";

const AddAdditionalRepositoriesToolbar = ({
  friendlyNameMap,
  filter,
  setFilter,
  filterBy,
  setFilterBy,
  selectedOnlyToggleIsDisabled,
  searchIsDisabled,
  dropdownSelectisDisabled,
  pagination,
  onlyShowSelectedRepositories,
  setOnlyShowSelectedRepositories,
}) => {
  const [isSelectFilterByExpanded, setIsSelectFilterByExpanded] =
    useState(false);

  return (
    <Toolbar id="add-additional-repositories-toolbar">
      <ToolbarContent>
        <ToolbarGroup>
          <ToolbarItem spacer={{ default: "spacerNone" }}>
            <Select
              isOpen={isSelectFilterByExpanded}
              onToggle={(_event, isSelectFilterByExpanded) =>
                setIsSelectFilterByExpanded(isSelectFilterByExpanded)
              }
              toggleIcon={<FilterIcon />}
              placeholderText={friendlyNameMap[filterBy]}
              onSelect={(_, value) => {
                setFilterBy(value);
                setIsSelectFilterByExpanded(false);
              }}
              isDisabled={dropdownSelectisDisabled}
            >
              <SelectOption value="repo_name">
                {friendlyNameMap.repo_name}
              </SelectOption>
              <SelectOption value="repo_label">
                {friendlyNameMap.repo_label}
              </SelectOption>
            </Select>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder={`Filter by ${friendlyNameMap[filterBy]}`}
              value={filter}
              onChange={(_event, value) => setFilter(value)}
              isDisabled={searchIsDisabled}
              onClear={() => setFilter("")}
              style={{ width: "400px" }}
            />
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
        <ToolbarItem variant="pagination" align={{ default: "alignRight" }}>
          {pagination}
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

AddAdditionalRepositoriesToolbar.propTypes = {
  friendlyNameMap: propTypes.object.isRequired,
  filter: propTypes.string.isRequired,
  setFilter: propTypes.func.isRequired,
  filterBy: propTypes.string.isRequired,
  setFilterBy: propTypes.func.isRequired,
  selectedOnlyToggleIsDisabled: propTypes.bool.isRequired,
  searchIsDisabled: propTypes.bool.isRequired,
  pagination: propTypes.object.isRequired,
  onlyShowSelectedRepositories: propTypes.bool.isRequired,
  setOnlyShowSelectedRepositories: propTypes.func.isRequired,
  dropdownSelectisDisabled: propTypes.bool.isRequired,
};

export default AddAdditionalRepositoriesToolbar;
