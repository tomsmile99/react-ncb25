import {Link} from 'react-router-dom'

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

    const fristPage = () => {
        setCurrentPage(1)
    }
    const endPage = () => {
        setCurrentPage(nPages)
    }
    const nextPage = () => {
            if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if(currentPage !== 1) setCurrentPage(currentPage - 1)
    }

    //console.log(currentPage)
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                {currentPage !== 1 && 
                    <>
                        <li className="page-item">
                            <Link
                                onClick={fristPage}
                                className="page-link"
                                rel="start">หน้าแรก
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link 
                                onClick={prevPage} 
                                className="page-link" 
                                aria-label="Previous">
                                <span aria-hidden="true">«</span>
                                <span className="sr-only">Previous</span>
                            </Link>
                        </li>
                    </>
                }
                {pageNumbers.map(pgNumber => (
                    <li key={pgNumber} className={`${currentPage === pgNumber ? 'active' : ''} page-item`}>
                        <a  
                            onClick={() => setCurrentPage(pgNumber)}
                            className="page-link">{pgNumber}
                        </a>
                    </li>
                ))}
                {currentPage !== nPages && 
                    <>
                        <li className="page-item">
                            <Link 
                                onClick={nextPage} 
                                className="page-link" 
                                aria-label="Next">
                                <span aria-hidden="true">»</span>
                                <span className="sr-only">Next</span>
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link 
                                onClick={endPage} 
                                className="page-link"
                                aria-label="End">หน้าสุดท้าย
                            </Link>
                        </li>
                    </>
                }
            </ul>
        </nav>
    )
}

export default Pagination