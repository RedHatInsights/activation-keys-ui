import React, { type ReactNode, useState } from 'react';
import { SearchInput } from '@patternfly/react-core/dist/dynamic/components/SearchInput';
import { ToggleGroupItem } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { Toolbar } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarContent } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToggleGroup } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { Select, SelectList } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectOption } from '@patternfly/react-core/dist/dynamic/components/Select';
import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import { LabelGroup } from '@patternfly/react-core/dist/dynamic/components/Label';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';

/** A free-text filter, rendered as a SearchInput. */
export interface TextRepositoryFilter {
  value: string;
  set: (value: string) => void;
}

/** A multi-value filter, rendered as a Select with removable Labels. */
export interface MultiRepositoryFilter {
  value: string[];
  set: (value: string[]) => void;
  opts: string[];
  placeholder: string;
}

export type RepositoryFilter = TextRepositoryFilter | MultiRepositoryFilter;

export const isMultiRepositoryFilter = (
  filter: RepositoryFilter
): filter is MultiRepositoryFilter => Array.isArray(filter.value);

export interface AddAdditionalRepositoriesToolbarProps {
  friendlyNameMap: Record<string, string>;
  filters: Record<string, RepositoryFilter>;
  selectedOnlyToggleIsDisabled: boolean;
  searchIsDisabled: boolean;
  pagination: ReactNode;
  onlyShowSelectedRepositories: boolean;
  setOnlyShowSelectedRepositories: (value: boolean) => void;
}

const AddAdditionalRepositoriesToolbar = ({
  friendlyNameMap,
  filters,
  selectedOnlyToggleIsDisabled,
  searchIsDisabled,
  pagination,
  onlyShowSelectedRepositories,
  setOnlyShowSelectedRepositories
}: AddAdditionalRepositoriesToolbarProps) => {
  const [isSelectFilterByExpanded, setIsSelectFilterByExpanded] = useState(false);

  const [isMultiSelectOptionsExanded, setIsMultiSelectOptionsExpanded] = useState(false);

  const [activeFilter, setActiveFilter] = useState(Object.keys(filters)[0]);

  const activeFilterDefinition = filters[activeFilter];

  return (
    <Toolbar id="add-additional-repositories-toolbar">
      <ToolbarContent>
        <ToolbarGroup>
          <ToolbarItem gap={{ default: 'gapNone' }}>
            <Select
              isOpen={isSelectFilterByExpanded}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  icon={<FilterIcon />}
                  onClick={() => setIsSelectFilterByExpanded(!isSelectFilterByExpanded)}
                  isExpanded={isSelectFilterByExpanded}
                >
                  {friendlyNameMap[activeFilter]}
                </MenuToggle>
              )}
              onSelect={(_, value) => {
                setActiveFilter(value[0]);
                setIsSelectFilterByExpanded(false);
              }}
              onOpenChange={(isOpen) => setIsSelectFilterByExpanded(isOpen)}
            >
              <SelectList>
                {Object.entries(filters).map(([k, v]) => {
                  return (
                    <SelectOption value={[k, v]} key={k} isFocused={activeFilter == k}>
                      {friendlyNameMap[k]}
                    </SelectOption>
                  );
                })}
              </SelectList>
            </Select>
          </ToolbarItem>
          <ToolbarItem>
            {!isMultiRepositoryFilter(activeFilterDefinition) && (
              <SearchInput
                placeholder={`Filter by ${friendlyNameMap[activeFilter]}`}
                value={activeFilterDefinition.value}
                onChange={(_event, value) => activeFilterDefinition.set(value)}
                isDisabled={searchIsDisabled}
                onClear={() => activeFilterDefinition.set('')}
                style={{ width: '400px' }}
              />
            )}
            {isMultiRepositoryFilter(activeFilterDefinition) && (
              <Select
                isOpen={isMultiSelectOptionsExanded}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    icon={<FilterIcon />}
                    onClick={() => setIsMultiSelectOptionsExpanded(!isMultiSelectOptionsExanded)}
                    isExpanded={isMultiSelectOptionsExanded}
                  >
                    {activeFilterDefinition.placeholder}
                  </MenuToggle>
                )}
                onSelect={(_, value) => {
                  activeFilterDefinition.set([...activeFilterDefinition.value, value]);
                  setIsMultiSelectOptionsExpanded(false);
                }}
                onOpenChange={(isOpen) => {
                  setIsMultiSelectOptionsExpanded(isOpen);
                }}
              >
                <SelectList>
                  {activeFilterDefinition.opts.map((opt) => {
                    return (
                      <SelectOption
                        key={opt}
                        isDisabled={activeFilterDefinition.value.includes(opt)}
                        value={opt}
                      >
                        {opt}
                      </SelectOption>
                    );
                  })}
                </SelectList>
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
        <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
          {pagination}
        </ToolbarItem>
      </ToolbarContent>
      <ToolbarContent>
        <ToolbarGroup>
          {Object.entries(filters)
            .filter(([, v]) => (isMultiRepositoryFilter(v) ? v.value.length > 0 : v.value !== ''))
            .map(([k, v]) => (
              <ToolbarItem key={k}>
                <LabelGroup categoryName={friendlyNameMap[k]}>
                  {isMultiRepositoryFilter(v) && (
                    <>
                      {v.value.map((filter, i) => (
                        <Label
                          key={i}
                          variant="outline"
                          onClose={() => {
                            v.set(v.value.toSpliced(i, 1));
                          }}
                        >
                          {filter}
                        </Label>
                      ))}
                    </>
                  )}
                  {!isMultiRepositoryFilter(v) && (
                    <Label variant="outline" onClose={() => v.set('')}>
                      {v.value}
                    </Label>
                  )}
                </LabelGroup>
              </ToolbarItem>
            ))}
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

export default AddAdditionalRepositoriesToolbar;
