import React from 'react';
import { Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import styled from 'styled-components';

interface ProgrammeTreeProps {
  checkedKeys: any; // Array of checked keys
  onCheck: any; // Function to handle check events
  currentProgramme: string; // The currently selected programme
  baseTreeData: DataNode[];
}

// Styled component to customize the Tree checkboxes
const StyledTree = styled(Tree)`
  .ant-tree-checkbox-inner {
    border: var(--dark-red) 2px solid !important; /* Change the border color to red */
    background-color: white !important; /* Change the checkbox background to black */
  }

  .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    border: black;
  }
  .ant-tree-checkbox-inner:hover {
    border: black;
    background-color: rgba(238, 64, 45, 0.2) !important;
  }

  .ant-tree-checkbox-checked .ant-tree-checkbox-inner::after {
    border-color: var(--dark-red);
  }

  .ant-tree-checkbox-disabled .ant-tree-checkbox-inner {
    border-color: #d9d9d9 !important; /* Change the border color to grey when disabled */
  }
`;

// Static tree data
function ProgrammeTree({
  checkedKeys,
  onCheck,
  currentProgramme,
  baseTreeData,
}: ProgrammeTreeProps) {
  // Function to get tree data based on the current programme
  const getTreeData = () => {
    if (currentProgramme === 'all') {
      // Enable all nodes when 'all' is selected
      return baseTreeData;
    }

    return baseTreeData.map(item => {
      // If the current programme is biofin or frameworks, enable only that item
      if (item.key === 'biofin' || item.key === 'frameworks') {
        return {
          ...item,
          disabled: item.key !== currentProgramme,
        };
      }

      // For items with children, disable all other items except the current programme
      if (item.children) {
        return {
          ...item,
          disabled: item.key !== currentProgramme,
          children: item.children.map(child => ({
            ...child,
            disabled:
              currentProgramme !== item.key && currentProgramme !== child.key,
          })),
        };
      }

      // Disable items that don't match the current programme
      return {
        ...item,
        disabled: item.key !== currentProgramme,
      };
    });
  };

  return (
    <StyledTree
      checkable
      className='undp-checkbox'
      defaultExpandAll
      checkedKeys={checkedKeys}
      treeData={getTreeData()} // Dynamically adjust tree data based on the current programme
      onCheck={onCheck}
      icon={null}
    />
  );
}

export default ProgrammeTree;
