function renderPagination(response, id, callbackFunc) {
    const {totalRecords, pageIndex, pageSize} = response;
    console.log("starting pagination", totalRecords, pageIndex, pageSize, id);
    const totalPages = Math.ceil(totalRecords / pageSize);
    console.log('total pages: ', totalPages);
    const $pagination = $(id);
    $pagination.empty();

    if (totalPages <= 1) return;

    $pagination.append(`
        <li class="page-item first ${pageIndex === 1 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0);" data-page="1">
                <i class="tf-icon ri-skip-back-mini-line ri-22px"></i>
            </a>
        </li>
        <li class="page-item prev ${pageIndex === 1 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0);" data-page="${pageIndex - 1}">
                <i class="tf-icon ri-arrow-left-s-line ri-22px"></i>
            </a>
        </li>
    `);

    let startPage = Math.max(1, pageIndex - 2);
    let endPage = Math.min(totalPages, pageIndex + 2);

    if (startPage > 1) {
        $pagination.append(`<li class="page-item"><a class="page-link" href="javascript:void(0);" data-page="1">1</a></li>`);
        if (startPage > 2) {
            $pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        $pagination.append(`
            <li class="page-item ${i === pageIndex ? 'active' : ''}">
                <a class="page-link" href="javascript:void(0);" data-page="${i}">${i}</a>
            </li>
        `);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            $pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
        $pagination.append(`<li class="page-item"><a class="page-link" href="javascript:void(0);" data-page="${totalPages}">${totalPages}</a></li>`);
    }

    // Tạo nút "Next" và "Last"
    $pagination.append(`
        <li class="page-item next ${pageIndex === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0);" data-page="${pageIndex + 1}">
                <i class="tf-icon ri-arrow-right-s-line ri-22px"></i>
            </a>
        </li>
        <li class="page-item last ${pageIndex === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0);" data-page="${totalPages}">
                <i class="tf-icon ri-skip-forward-mini-line ri-22px"></i>
            </a>
        </li>
    `);

    // Sự kiện click thay đổi trang
    $('.pagination .page-link').on('click', function () {
        const newPage = parseInt($(this).data('page'));
        if (!isNaN(newPage) && newPage !== pageIndex) {
            callbackFunc(totalRecords, newPage, pageSize);
        }
    });
    console.log("end pagination");
}

