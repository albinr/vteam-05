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
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} onClick={() => onRowClick?.(row)}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>{row[col.accessor]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRowClick: PropTypes.func,
};

Table.defaultProps = {
    onRowClick: null,
};

export default Table;
