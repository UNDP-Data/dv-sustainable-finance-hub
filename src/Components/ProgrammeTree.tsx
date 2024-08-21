import React from 'react';
import { Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import styled from 'styled-components';

interface ProgrammeTreeProps {
  checkedKeys: any; // Array of checked keys
  onCheck: any; // Function to handle check events
  currentProgramme: string; // The currently selected programme
  baseTreeData: ExtendedDataNode[];
  countsByProgram: { [key: string]: number }; // Counts by program
}

interface ExtendedDataNode extends DataNode {
  data?: {
    fullLabel?: string;
  };
}

const StyledTree = styled(Tree)`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: auto; /* Ensure content is scrollable if it overflows */

  .ant-tree-checkbox-inner {
    border: var(--dark-red) 2px solid !important;
    background-color: white !important;
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
    border-color: #d9d9d9 !important;
  }

  .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner:after {
    background-color: var(--dark-red);
  }

   // Hovered state
    .ant-tree-node-content-wrapper:hover {
      background-color: transparent !important;
    }
    .ant-tree-node-content-wrapper-open {
      background-color: transparent !important;
    }

    // Selected state
    .ant-tree-node-selected .ant-tree-node-content-wrapper {
      background-color: transparent !important;
    }
  }

  .ant-tree-treenode {
    padding: 4px 0;
    border-bottom: 0.07rem solid var(--gray-300);
    width: 100% !important;

    &:last-child {
      border-bottom: none;
    }

    .ant-tree-title {
      width: 100% !important;
    }

    .ant-tree-node-content-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100% !important;
    }
  }
`;

const StyledTag = styled.div`
  border-radius: 2px;
  border: 1px solid var(--gray-400);
  background-color: var(--gray-100);
  padding: 0px 8px;
  margin: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  min-width: 16px;
  justify-content: center;
`;

// Static tree data
function ProgrammeTree({
  checkedKeys,
  onCheck,
  currentProgramme,
  baseTreeData,
  countsByProgram,
}: ProgrammeTreeProps) {
  // Function to add counts to the tree node titles
  const addCountsToTreeData = (
    treeData: ExtendedDataNode[],
  ): ExtendedDataNode[] => {
    return treeData.map(item => {
      const count = countsByProgram[item.key] || 0;
      const label = String(item.title);
      const fullLabel = item.data?.fullLabel;

      const updatedTitle = (
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
          title={fullLabel ? String(fullLabel) : label}
        >
          {label}
          <StyledTag>{count}</StyledTag>
        </span>
      );

      if (item.children) {
        return {
          ...item,
          title: updatedTitle,
          children: addCountsToTreeData(item.children), // Recursively update children
        };
      }

      return {
        ...item,
        title: updatedTitle,
      };
    });
  };

  // Function to get tree data based on the current programme
  const getTreeData = () => {
    const updatedTreeData = addCountsToTreeData(baseTreeData);

    if (currentProgramme === 'all') {
      return updatedTreeData;
    }

    return updatedTreeData.map(item => {
      if (item.key === 'biofin' || item.key === 'frameworks') {
        return {
          ...item,
          disabled: item.key !== currentProgramme,
        };
      }

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
      checkedKeys={checkedKeys}
      treeData={getTreeData()} // Dynamically adjust tree data based on the current programme
      onCheck={onCheck}
      icon={null}
    />
  );
}

export default ProgrammeTree;
