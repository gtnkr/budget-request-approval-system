import { useMemo, useState, type ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number | null;
  searchValue?: (row: T) => string;
};

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  emptyMessage: string;
  searchPlaceholder?: string;
  rowClassName?: (row: T) => string | undefined;
  initialSort?: { key: string; direction: "ascending" | "descending" };
  pageSize?: number;
};

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  emptyMessage,
  searchPlaceholder = "ค้นหาในตาราง",
  rowClassName,
  initialSort,
  pageSize: initialPageSize = 10,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("th");
    if (!normalizedQuery) return rows;
    return rows.filter((row) =>
      columns
        .map((column) =>
          column.searchValue?.(row) ??
          (column.sortValue ? String(column.sortValue(row) ?? "") : ""),
        )
        .join(" ")
        .toLocaleLowerCase("th")
        .includes(normalizedQuery),
    );
  }, [columns, query, rows]);

  const sortedRows = useMemo(() => {
    if (!sort) return filteredRows;
    const column = columns.find((candidate) => candidate.key === sort.key);
    if (!column?.sortValue) return filteredRows;
    const direction = sort.direction === "ascending" ? 1 : -1;
    return [...filteredRows].sort((a, b) => {
      const aValue = column.sortValue?.(a);
      const bValue = column.sortValue?.(b);
      if (aValue == null) return bValue == null ? 0 : 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction;
      }
      return String(aValue).localeCompare(String(bValue), "th", {
        numeric: true,
        sensitivity: "base",
      }) * direction;
    });
  }, [columns, filteredRows, sort]);

  const pageCount = Math.ceil(sortedRows.length / pageSize);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const pageRows = sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const firstItem = sortedRows.length === 0 ? 0 : currentPage * pageSize + 1;
  const lastItem = Math.min((currentPage + 1) * pageSize, sortedRows.length);

  const toggleSort = (key: string) => {
    setSort((currentSort) => ({
      key,
      direction:
        currentSort?.key === key && currentSort.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
    setPage(0);
  };

  return (
    <div className="data-table">
      <div className="data-table-toolbar">
        <label className="data-table-search">
          <span className="visually-hidden">ค้นหาในตาราง</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
          />
        </label>
        <label className="data-table-page-size">
          <span>แสดง</span>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(0);
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span>รายการ</span>
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    aria-sort={
                      isSorted
                        ? sort.direction === "ascending"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    {column.sortValue ? (
                      <button
                        type="button"
                        className="data-table-sort"
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.header}
                        <span aria-hidden="true">
                          {isSorted
                            ? sort.direction === "ascending" ? " ▲" : " ▼"
                            : " ↕"}
                        </span>
                      </button>
                    ) : column.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={getRowKey(row)} className={rowClassName?.(row)}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td className="data-table-empty" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="data-table-pagination">
        <span>
          {sortedRows.length === 0
            ? emptyMessage
            : `แสดง ${firstItem}–${lastItem} จาก ${sortedRows.length} รายการ`}
        </span>
        <div>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={currentPage === 0}
          >
            ก่อนหน้า
          </button>
          <span>{pageCount === 0 ? 0 : currentPage + 1} / {pageCount}</span>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(pageCount - 1, current + 1))
            }
            disabled={currentPage >= pageCount - 1}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
