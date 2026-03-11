import React from 'react';

interface TableSkeletonProps {
  headers: string[];
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ headers, rows = 4 }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex}>
        {headers.map((_, cellIndex) => (
          <td key={cellIndex} className="whitespace-nowrap px-6 py-4">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default TableSkeleton;
