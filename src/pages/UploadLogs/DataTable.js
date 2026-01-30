import React from "react";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faCancel,
  faUserCheck,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const { t, i18n } = useTranslation();

  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  });

  return (
    <span>
      {t("Search")}:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} ` + t("Cases") + `...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
}

const Table = (props) => {
  // console.log(props)
  const { t, i18n } = useTranslation();

  const data = React.useMemo(() => props.userData, []);
  const deactivateClient = (user) => {
    props.deactivateUser(user);
  };
  const activateClient = (user) => {
    props.activateUser(user);
  };

  const columns = React.useMemo(
    () =>
      props.dummyVariable
        ? [
          {
            Header: "Uploaded by",
            accessor: "username",
          },
          {
            Header: "Total Entries",
            accessor: "totalentries",
          },
          {
            Header: "Valid",
            accessor: "validentries",
          },
          {
            Header: "Invalid",
            accessor: "invalidentries",
          },
          {
            Header: "Upload Date",
            accessor: "uploaddate",
          },
          {
            Header: "URL",
            accessor: "fileurl",
          },
          // {
          //   Header: 'Phone number',
          //   accessor: 'Phone number',
          // },

          // {
          //   Header: 'Date Of Reg.',
          //   accessor: 'dateofreg',
          // },
          // {
          //   Header: 'Deactivate',
          //   Cell: props => <button className="btn btn-primary"
          //     onClick={(e) => {
          //       deactivateClient(props?.row?.original)
          //     }}><FontAwesomeIcon className='mr-0' icon={faCancel} /></button>,
          //   accessor: 'Deactivate',
          // }
        ]
        : [
          {
            Header: "Uploaded by",
            accessor: "username",
          },
          {
            Header: "Total Entries",
            accessor: "totalentries",
          },
          {
            Header: "Valid",
            accessor: "validentries",
          },
          {
            Header: "Invalid",
            accessor: "invalidentries",
          },
          {
            Header: "Upload Date",
            accessor: "uploaddate",
          },
          // {
          //   Header: 'URL',
          //   accessor: 'fileurl',
          // },
          // {
          //   Header: 'District',
          //   accessor: 'District',
          // },
          // {
          //   Header: 'Facility Name',
          //   accessor: 'Facility Name',
          // },
          // {
          //   Header: 'Phone number',
          //   accessor: 'Phone number',
          // },

          // {
          //   Header: 'Date Of Reg.',
          //   accessor: 'dateofreg',
          // },
          {
            Header: "Response File",
            Cell: (props) => (
              <a href={props.cell.value} target="_blank">
                <button className="btn btn-primary">
                  <FontAwesomeIcon className="mr-0" icon={faFileExcel} />
                </button>
              </a>
            ),
            accessor: "fileurl",
          },
        ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
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
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );
  return (
    <>
      <div className="pagination headerfixedcontainer subnavheaderfixedcontainer"  >
        <div className="alertfiltercontainer" style={{ display: "none" }}></div>
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
          {t("Page")} {/* <strong> */}
          {pageIndex + 1} of {pageOptions.length}
          {/* </strong>{" "} */}
        </span>
        <span>
          | {t("Go to page")}:{" "}
          <input
            type="number"
            min="1"
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onKeyDown={(e) => {
              if (
                !["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key) &&
                !/^[0-9]$/.test(e.key)
              ) {
                e.preventDefault();
              }
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
            }}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            onBlur={(e) => {
              if (e.target.value.trim() === "" || e.target.value.trim() === "0") {
                e.target.value = 1;
                gotoPage(0);
              }
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
      </div>
      <div style={{
        width: "100%",
        overflowX: "auto", // Horizontal scroll
        overflowY: "auto", // Vertical scroll
        maxHeight: "400px", // Set the max height for vertical scroll
      }}>

        <table
          {...getTableProps()}
          className="linelistTable"
          style={{ width: "90%", marginTop: "100px" }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{t(column.render("Header"))}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </>
  );
};
export default Table;
