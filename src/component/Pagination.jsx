// import { useState } from "react"
import {Link} from 'react-router-dom'

// eslint-disable-next-line react/prop-types หหห
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // จำนวนปุ่มที่แสดง
        const startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 1); // หน้าเริ่มต้น
        const endPage = Math.min(startPage + maxVisible - 1, totalPages); // หน้าสิ้นสุด


        // ปุ่มแรก (หน้า 1)
        if (startPage > 1) {
            pages.push(
                <li key={1} className={`${currentPage === 1 ? 'active' : ''} page-item`}>
                    <a  
                        onClick={() => onPageChange(1)}
                        className="page-link"
                    >
                        1
                    </a>
                </li>
            )
            if (startPage > 2) {
            pages.push(<span key="start-dots" className='mt-2'>...</span>) // Dots หลังหน้าแรก
            }
        }

        // ปุ่มในช่วงที่แสดง
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
            <li key={i} className={`${currentPage === i ? 'active' : ''} page-item`}>
                {i > 0 &&
                    <a onClick={() => onPageChange(i)} className="page-link">
                        {i}
                    </a>
                }
            </li>
            );
        }

        // ปุ่มหน้าสุดท้าย (Last Page)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="end-dots" className='mt-2'>...</span>); // Dots ก่อนหน้าสุดท้าย
            }
            pages.push(
                <li key={totalPages} className={`page-item`}>
                    <a onClick={() => onPageChange(totalPages)} className="page-link">
                        {totalPages}
                    </a>
                </li>
            )
        }

        // console.log(currentPage)

        return pages;
    
    }

    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    {currentPage !== 1 && 
                    <li className="page-item">
                        <Link
                            onClick={() => onPageChange(1)}
                            className="page-link"
                            rel="start">หน้าแรก
                        </Link>
                    </li>
                    }
                    {/* <li className="page-item">
                        <Link 
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="page-link" 
                            aria-label="Previous"
                        >
                            <span aria-hidden="true">«</span>
                            <span className="sr-only">Previous</span>
                        </Link>
                    </li> */}
                    {/* แสดงปุ่มเลขหน้า */}

                    {renderPageNumbers()}

                    {/* <li className="page-item">
                        <Link 
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-link" 
                        aria-label="Previous"
                        >
                            <span aria-hidden="true">»</span>
                            <span className="sr-only">Next</span>
                        </Link>
                    </li> */}
                    {currentPage !== totalPages && 
                    <li className="page-item">
                        <Link 
                            onClick={() => onPageChange(totalPages)}
                            className="page-link"
                            aria-label="End">หน้าสุดท้าย
                        </Link>
                    </li>
                    }
                </ul>
            </nav>
        </>
    )
}

export default Pagination