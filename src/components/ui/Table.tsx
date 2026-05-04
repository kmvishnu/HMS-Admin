import React from 'react';

interface TableProps {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (item: any) => React.ReactNode;
  }[];
  data: any[];
  isLoading?: boolean;
}

export const Table: React.FC<TableProps> = ({ columns, data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-12 bg-[var(--color-border)] rounded-t-lg mb-2 opacity-50"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-[var(--color-border)] mb-2 opacity-30 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[var(--color-border)] glass">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-[var(--color-background)]/50 text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-semibold tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr 
                key={item.id || rowIndex} 
                className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]/30 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-[var(--color-text)]">
                    {col.cell ? col.cell(item) : item[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
