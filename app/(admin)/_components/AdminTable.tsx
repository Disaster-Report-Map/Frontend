import React from "react";

type Column<T> = {
  key: string;
  title: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export function AdminTable<T>({
  columns,
  rows,
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${column.className || ""}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr
              key={index}
              className="transition-colors duration-200 hover:bg-slate-50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-3 py-3 text-sm text-slate-700"
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
