import React from 'react'

function Pagination({curPage, totalPage, rowPerPage, next, previous, onRowNumberChange}) {
    return (
        <div className="shadow d-flex justify-content-around py-3 px-1">
            <div className="d-flex align-items-center">Rows per page:  
                <select value={rowPerPage} style={{width: 70}} className="form-control ml-2" onChange={(e) => onRowNumberChange(e.target.value)}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div>
                {curPage}-{totalPage}
                <button className="btn btn-link" onClick={() => previous(curPage-1)}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button className="btn btn-link" onClick={() => next(curPage+1)}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    )
}

export default Pagination
