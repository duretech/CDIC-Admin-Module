import React,{useState} from "react";
//import styled from "styled-components";
import { Button, Dropdown } from "react-bootstrap";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useExpanded,
} from "react-table";

import { lineListCategories } from "../../config/appConfig";

import exportFromJSON from 'export-from-json'  

import { useTranslation } from 'react-i18next';


// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  
  const { t, i18n } = useTranslation();
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      {t("Search")}:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        // placeholder={`${count} Cases...`}
        placeholder={t("Cases") + `...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
}

// Our table component
function Table({
  columns,
  data,
  exportData,
  renderRowSubComponent,
  changeCategory,
  selectedCategory,
}) {
  
  const { t, i18n } = useTranslation();
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const [cellValue, setCellValue] = useState('');

  const defaultColumn = React.useMemo(() => ({}), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,

    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn /* Be sure to pass the defaultColumn option */,
      filterTypes,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    useExpanded,
    usePagination
  );
  //console.log(columns);
  //console.log(data);

  return (
    <>
      <div className="pagination">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          style={{ marginRight: "10px" }}
        />
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          {t("Page")}{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span className="mobile-css">
          | {t("Go to page")}:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {t("Show")} {pageSize}
            </option>
          ))}
        </select>
        <Button
        className="excelDownload pl-2 btn btn-primary"
         onClick={e => {
          // console.log(data)
          const fileName = 'download'  
          const exportType = 'xls'  
          const data = exportData
          exportFromJSON({ data, fileName, exportType})
        }}>
          {t("Excel Download")}
        </Button>
        {/* <ReactHTMLTableToExcel
          id="tableExportButton"
          table="linelistTable"
          filename="linelistData"
          sheet="line list"
          buttonText="Export Data"
        /> */}
      </div>
      <table {...getTableProps()} id="linelistTable" style={{ width: "90%" , margin:"0 auto "}}>
        <thead>
          {/* <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: "left",
              }}
            ></th>
          </tr> */}

          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className="fixHead" {...column.getHeaderProps()}>
                  {t(column.render("Header"))}
                  {/* Render the columns filter UI */}
                  {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {data.length > 0 ? (
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              let rowProps = row.getRowProps();
              return (
                <React.Fragment key={row.id}>
                  <tr {...rowProps} key={row.id}>
                    {row.cells.map((cell) => {
                      let cellProps = cell.getCellProps();
                      if (cell.value !== undefined) {
                        return (
                          <td {...cellProps} key={cell.column.id}>
                            {cell.render("Cell")}
                          </td>
                        );
                      } else {
                        // console.log(cell);
                        return <td {...cellProps} key={cell.column.id}></td>;
                      }
                    })}
                  </tr>
                  {row.isExpanded &&
                    renderRowSubComponent({ row, rowProps, visibleColumns })}
                </React.Fragment>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={columns.length}>No Data</td>
            </tr>
          </tbody>
        )}
      </table>
      <br />
    </>
  );
}

export default Table;
