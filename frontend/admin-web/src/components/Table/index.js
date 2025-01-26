"use client";

import PropTypes from "prop-types";
import "./Table.css";

const Table = ({ columns, data, onRowClick }) => {
    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                No data available.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={onRowClick ? "clickable-row" : ""}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {/* Check if the column has a custom render function */}
                                        {col.render ? col.render(row) : row[col.accessor]}
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

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired, // Column header text
            accessor: PropTypes.string,          // Key in the row object to access
            render: PropTypes.func,             // Custom render function (optional)
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of row data objects
    onRowClick: PropTypes.func, // Function called when a row is clicked
};

Table.defaultProps = {
    onRowClick: null,
};

export default Table;
