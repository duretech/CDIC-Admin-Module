
import React from 'react';
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table'
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const { t, i18n } = useTranslation();
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  });
  const handleClear = () => {
    setValue("");
    onChange("");
  };

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {t("Search")}:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count}` + t("Cases") + `...`}
        style={{
          fontSize: "1.1rem",
          // border: "1px solid #ccc",
          // padding: "8px 30px 8px 10px", // Padding for clear button
          borderRadius: "4px",
          // width: "250px",
        }}

      />
            {value && (
        <button
          onClick={handleClear}
          style={{
            position: "absolute",
            top: "50%",
            right: "-7px",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            color: "#000",
          }}
        >
          &times;
        </button>
      )}
    </span>
  );
}

const Table = (props) => {
  // console.log(props)
  const { t, i18n } = useTranslation();

  const data = React.useMemo(
    () => props.userData,
    []
  )
  // const getUser = (user) => {
  //   console.log("edituser",user,props)
  //   props.edituser(user)
  // }

  const getUser = (user) => {
    props.setUserEditObject(user); // Ensure this function updates the userEditObject state
    props.setUserEditVariable(true); // Ensure the edit form is visible
  };
  

  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'surname',
      },
       {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Status',
        Cell: props => <span>{props?.row?.original?.userCredentials.disabled ? "Inactive" : "Active"}</span>
        ,
        accessor: 'Status',
      },
      {
        Header: 'Edit',
        Cell: props => <button className="btn btn-primary"
          onClick={(e) => {
            getUser(props?.row?.original)
          }}><FontAwesomeIcon className='mr-0' icon={faPencil} /></button>,
        accessor: 'Edit',
      }
    ],
    []
  )

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
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0 },
  },
    useGlobalFilter,
    usePagination)
  return (
    <>
      <div className="pagination">
        <div className="alertfiltercontainer" style={{ display: 'none' }}>
        </div>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          style={{ marginRight: "10px" }}
        />
        <button
          style={{ marginLeft: "10px",cursor: canPreviousPage ? "pointer" : "default", }}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}

        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          style={{cursor: canPreviousPage ? "pointer" : "default", }}

        >
          {"<"}
        </button>{" "}
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          style={{
            cursor: canNextPage ? "pointer" : "default",
          }}>
          {">"}
        </button>{" "}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          style={{
            cursor: canNextPage ? "pointer" : "default",
          }}
        >
          {">>"}
        </button>{" "}
        <span>
          {t("Page")} {" "}
          {/* <strong> */}
          {pageIndex + 1} {t("of")} {pageOptions.length}
          {/* </strong>{" "} */}
        </span>
        <span>
          | {t("Go to page")}:{" "}
          <select
            value={pageIndex + 1}
            onChange={(e) => {
              const page = Number(e.target.value) - 1;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          >
            {Array.from({ length: pageOptions.length }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
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
      <div
        style={{
          width: "100%",
          overflowX: "auto", // Horizontal scroll
          overflowY: "auto", // Vertical scroll
          maxHeight: "500px", // Set the max height for vertical scroll
        }}
      >
      <table {...getTableProps()} className='linelistTable' style={{ width: "100%" }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                >
                  {t(column.render('Header'))}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 ? (
          page.map((row, i) => {
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
          })
        ):
        (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              No records found
            </td>
          </tr>
        )
        }
        </tbody>
      </table>
      </div>
    </>
  )
}
export default Table