import React from 'react'

function Pagination({curPage, totalPage, rowPerPage, next, previous, onRowNumberChange}) {
    return (
        <div className="shadow d-flex justify-content-between py-3 px-5">
            <div className="d-flex align-items-center">Rows per page:  
                <select value={rowPerPage} style={{width: 70}} class="form-control ml-2" onChange={(e) => onRowNumberChange(e.target.value)}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
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
