import React from 'react';
import TableSkeleton from '../Loaders/TableLoader';

interface CustomTableProps {
  /** Column header labels, in the same order as the <td> cells you render in children */
  headers: string[];
  /** Set to true while fetching data to show the skeleton loader */
  isLoading?: boolean;
  /** Number of skeleton rows to render while loading (default: 4) */
  skeletonRows?: number;
  /** Table body rows — render your <tr> elements here */
  children: React.ReactNode;
}

/**
 * Reusable table shell.
 *
 * Usage:
 * ```tsx
 * <CustomTable headers={['Name', 'Email', 'Status']} isLoading={loading}>
 *   {data.map(row => (
 *     <tr key={row.id}>
 *       <td className="px-6 py-4">{row.name}</td>
 *       <td className="px-6 py-4">{row.email}</td>
 *       <td className="px-6 py-4">{row.status}</td>
 *     </tr>
 *   ))}
 * </CustomTable>
 *
 * // Pagination lives outside — use the shared <Pagination /> component
 * <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
 * ```
 */
const CustomTable: React.FC<CustomTableProps> = ({
  headers,
  isLoading = false,
  skeletonRows = 4,
  children,
}) => (
  <div className="relative w-full overflow-x-auto">
    <div className="w-full overflow-auto max-h-[500px] rounded-2xl border border-[#F2F4F7] shadow-sm">
      <table className="w-full min-w-[600px] font-semibold text-[#344054] text-sm border-collapse">
        {/* Header */}
        <thead className="bg-[#F9FAFB] sticky top-0 z-10">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-left text-sm font-semibold text-[#344054] border-b border-[#EAECF0] whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-[#F2F4F7]">
          {isLoading ? (
            <TableSkeleton headers={headers} rows={skeletonRows} />
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default CustomTable;
