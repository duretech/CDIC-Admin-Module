import React, { useState, useEffect } from "react";
import { Button, DropdownItem } from "reactstrap";
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table'
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faCancel, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";

// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length;
//   const { t, i18n } = useTranslation();
//   const [value, setValue] = React.useState(globalFilter);
//   const onChange = useAsyncDebounce((value) => {
//     setGlobalFilter(value || undefined);
//   });

//   return (
//     <span>
//       {t("Search:")}{" "}
//       <input
//         value={value || ""}
//         onChange={(e) => {
//           setValue(e.target.value);
//           onChange(e.target.value);
//         }}
//         placeholder={`${count} ` + t("Cases") + `...`}
//         style={{
//           fontSize: "1.1rem",
//           border: "0",
//         }}

//       />
//     </span>
//   );
// }

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

  const clearInput = () => {
    setValue(""); // Clear local state
    setGlobalFilter(undefined); // Clear global filter
  };

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {t("Search:")}{" "}
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
          paddingRight: "24px", // Space for the clear button
        }}
      />
      {value && (
        <button
          onClick={clearInput}
          style={{
            position: "absolute",
            right: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#888",
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
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("")
  const data = React.useMemo(
    () => props.userData,
    []
  )
  const deactivateClient = (user) => {
    props.deactivateUser(user)
  }
  const activateClient = (user) => {
    props.activateUser(user)
  }

  const handleCancel = () => {
    setShowModal(false); // Close the modal on cancel
  };

  const handleConfirmDeactivate = (user) => {
    setShowModal(false); // Close the modal
    deactivateClient(user); // Proceed with logout
  };

  const columns =
    React.useMemo(
      () => props.dummyVariable ?
        [
          {
            Header: 'UIC',
            accessor: 'uic',
          },
          {
            Header: 'Patient Name',
            accessor: 'firstname',
          },
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Gender',
            accessor: 'gender',
          },
          // {
          //   Header: 'Address',
          //   accessor: 'ADDRESS',
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
            Header: 'Deactivate',
            Cell: props => <button className="btn btn-primary"
              onClick={(e) => {
                setShowModal(true)
                setSelectedUser(props?.row?.original)
                // deactivateClient(props?.row?.original)
              }}><FontAwesomeIcon className='mr-0' icon={faCancel} /></button>,
            accessor: 'Deactivate',
          }
        ] :
        [
          {
            Header: 'UIC',
            accessor: 'UIC',
          },
          {
            Header: 'Patient Name',
            accessor: 'Contact Fullname',
          },
          {
            Header: 'Age',
            accessor: 'Ages',
          },
          {
            Header: 'Gender',
            accessor: 'Gender',
          },
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
            Header: 'Activate',
            Cell: props => <button className="btn btn-primary"
              onClick={(e) => {
                activateClient(props?.row?.original)
              }}><FontAwesomeIcon className='mr-0' icon={faUserCheck} /></button>,
            accessor: 'Activate',
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
      <div className="pagination headerfixedcontainer subnavheaderfixedcontainer" style={{ width: '90%' }}>
        <div className="alertfiltercontainer" style={{ display: 'none' }}>
        </div>
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
          className={!canPreviousPage ? 'disabled' : ''}
        >
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className={!canPreviousPage ? 'disabled' : ''}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage} className={!canPreviousPage ? 'disabled' : ''}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className={!canPreviousPage ? 'disabled' : ''}>
          {">>"}
        </button>{" "}
        <span>
          {t("Page")} {" "}
          {/* <strong> */}
          {pageIndex + 1} of {pageOptions.length}
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
            style={{ width: "80px" }}
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
              Show {pageSize}
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
        <table {...getTableProps()} className='linelistTable ' style={{ width: "100%" }}>
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
                  <tr {...row.getRowProps()} key={i}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>
                        {cell.column.id === "Deactivate" || cell.column.id === "Activate" // Check for the "Deactivate" column
                          ? cell.render("Cell") // Render the button as is
                          : cell.value != null && cell.value !== "" // For other cells
                            ? cell.render("Cell")
                            : "-"}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCancel} centered>
        <Modal.Header style={{ color: "#fff" }} closeButton closeVariant="white" >
          <Modal.Title style={{ background: "none" }}>Confirm Deactivation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", color: "#000", background: "none" }}>
          Are you sure you want to deactivate this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" className="btn btn-danger" onClick={() => handleConfirmDeactivate(selectedUser)}>
            Deactivate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default Table