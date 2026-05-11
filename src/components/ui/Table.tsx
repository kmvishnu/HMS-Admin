import React from 'react';

interface TableProps {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (item: any) => React.ReactNode;
  }[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: any) => void;
}

export const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  isLoading, 
  emptyMessage = "No data available",
  onRowClick 
}) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-12 bg-[var(--color-border)]/50 rounded-lg animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-[var(--color-border)]/30 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--color-border)] glass scrollbar-hide">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]/50">
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-xs">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-[var(--color-text-muted)] font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr 
                key={item.id || rowIndex} 
                onClick={() => onRowClick?.(item)}
                className={`
                  border-b border-[var(--color-border)] last:border-0 
                  transition-all duration-200 
                  ${onRowClick ? 'cursor-pointer hover:bg-[var(--color-primary)]/5' : 'hover:bg-[var(--color-background)]/30'}
                `}
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
