import React from "react";
import { useTable, useExpanded } from "react-table";
import classNames from "classnames";
import PaginationNav from "../Pagination/Pagination";
// import Pagination from "@mui/material/Pagination";
// import { useRouter } from "next/router";
// import SpinnerOverlay from "../../atoms/spinner-overlay/spinner-overlay";

const Table = ({
  columns,
  data,
  isLoading,
  renderSubComponent,
  getRowProps,
  fullHeight = false,
  pagination = true,
  total,
  pageSize = 50,
  className,
}) => {
  // const history = useRouter();
  // const { page } = history.query;
  const totalPages = Math.ceil(total / pageSize);
  const tableInstance = useTable({ columns, data }, useExpanded);
  // console.log("tablr")

  const tbleFun = () => {
    // console.log("abc")
  }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    // apply the table props
    <div>
      <div
        className={classNames(
          `overflow-auto h-viewport   relative`,
          className
        )}
        style={{ height: '75vh' }} // Adjust the height as needed
      >
        {/* {isLoading && <SpinnerOverlay className="rounded" />} */}
        <table
          {...getTableProps()}
          className="w-full table-auto  border-collapse text-black"
        >
          <thead className="border-b">
            {
              // Loop over the header rows
              headerGroups.map((headerGroup, gIdx) => (
                // Apply the header row props
                <tr key={gIdx} {...headerGroup.getHeaderGroupProps()} >
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column, cIdx) => (
                      // Apply the header cell props
                      <th
                        {...column.getHeaderProps()}
                        key={cIdx}
                        className="px-2 py-4 font-bold uppercase text-xs text-white sticky top-0 z-10 bg-blue-400
                        text-center"

                      >
                        {
                          // Render the header
                          column.render("Header")
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>

          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                const rowProps = getRowProps
                  ? row.getRowProps(getRowProps(row))
                  : row.getRowProps();
                return (
                  // Apply the row props
                  <React.Fragment key={rowProps.key}>
                    <tr
                      //  onClick={tbleFun}
                      {...rowProps}
                      className=" border-b border-dashed "
                    >
                      {
                        // Loop over the rows cells
                        row.cells.map((cell, cIdx) => {
                          // Apply the cell props
                          return (
                            <td
                              key={cIdx}
                              {...cell.getCellProps()}
                              className="px-2 py-2 text-sm text-center max-w-xs break-words text-green-50"
                            >
                              {
                                // Render the cell contents
                                cell.render("Cell", {
                                  row: {
                                    ...row,
                                    canExpand: !!renderSubComponent,
                                  },
                                })
                              }
                            </td>
                          );
                        })
                      }
                    </tr>
                    {row.isExpanded &&
                      renderSubComponent &&
                      renderSubComponent({ row, rowProps })}
                  </React.Fragment>
                );
              })
            }
          </tbody>
        </table>
      </div>
      <div className='flex justify-center text-center'>
        <PaginationNav data={data}/>
      </div>
      {/* {pagination && (
        <Pagination
          className="m-4 float-right"
          count={totalPages}
          color="primary"
          page={parseInt(page) || 1}
          onChange={(e, page) => {
            history.push({
              pathname: history.pathname,
              query: { ...history.query, page },
            });
          }}
        />
      )} */}
    </div>
  );
};

Table.defaultProps = {};

export default Table;
