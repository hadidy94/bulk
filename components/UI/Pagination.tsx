import ReactPaginate from 'react-paginate';


function Pagination({ count, handlePageClick, pageNumber }) {

    const handlePageClickEvent = (event: Event) => {
        handlePageClick(event.selected + 1)
    };

    return (

        <nav aria-label="Page navigation comments" className="mt-4">
            <ReactPaginate
                previousLabel="prevw"
                nextLabel="next"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={count}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClickEvent}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                hrefAllControls
                forcePage={pageNumber - 1}
            />
        </nav>
    );
}

export default Pagination;