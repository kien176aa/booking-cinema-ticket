let orderData = [];
let pageSize = 10;
let startDate = null;
let endDate = null;
let minPrice = null;
let maxPrice = null;
$(document).ready(function() {
    fetchBooking({
        condition: {},
        pageIndex: 1,
        pageSize: pageSize,
    });

    $('#searchButton').on('click', function() {
        startDate = $('#startDateSearch').val();
        endDate = $('#endDateSearch').val();
        minPrice = $('#minPriceSearch').val();
        maxPrice = $('#maxPriceSearch').val();
        fetchBooking({
           condition: {
               startTime: (!startDate || startDate.length === 0) ? null : new Date(startDate),
               endTime: (!endDate || endDate.length === 0) ? null : new Date(endDate),
               minPrice: minPrice,
               maxPrice: maxPrice
           },
           pageIndex: 1,
           pageSize: pageSize
        });
    });

    $('#resetButton').on('click', function() {
        $('#startDateSearch').val('');
        $('#endDateSearch').val('');
        $('#minPriceSearch').val('');
        $('#maxPriceSearch').val('');
        startDate = null;
        endDate = null;
        minPrice = null;
        maxPrice = null;
        fetchBooking({
            condition: {},
            pageIndex: 1,
            pageSize: pageSize
        });
    });

});

function fetchBooking(req){
    toggleLoading(true);
    $.ajax({
        url: "/booking/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function (response) {
            console.log('booking', response);
            orderData = response.data;
            const groupedOrders = groupOrdersByDate(orderData);
            renderGroupedOrderCards(groupedOrders);
            renderPaginationBooking(response.totalRecords, response.pageIndex, response.pageSize);
            toggleLoading(false);
        },
        error: function (xhr) {
            console.error("Lỗi khi tìm kiếm đặt chỗ:", xhr.responseText);
            toggleLoading(false);
        }
    });
}

function groupOrdersByDate(orders) {
    // Sắp xếp đơn hàng theo ngày giảm dần
    const sortedOrders = orders.sort((a, b) => {
        const dateA = new Date(a.bookingDate);
        const dateB = new Date(b.bookingDate);
        return dateB - dateA;
    });

    // Nhóm đơn hàng theo ngày
    const groupedOrders = sortedOrders.reduce((groups, order) => {
        const formattedDate = formatDateToVN(order.bookingDate.split('T')[0]);
        if (!groups[formattedDate]) {
            groups[formattedDate] = [];
        }
        groups[formattedDate].push(order);
        return groups;
    }, {});

    return groupedOrders;
}

function formatDateToVN(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function filterOrders(orders, startDate, endDate, minPrice, maxPrice) {
    return orders.filter(order => {
        const orderDate = new Date(order.bookingDate);
        const dateMatch = (!startDate || orderDate >= new Date(startDate)) &&
            (!endDate || orderDate <= new Date(endDate));

        const minPriceMatch = !minPrice || order.totalAmount >= parseInt(minPrice);
        const maxPriceMatch = !maxPrice || order.totalAmount <= parseInt(maxPrice);

        return dateMatch && minPriceMatch && maxPriceMatch;
    });
}

function renderGroupedOrderCards(groupedOrders) {
    const $container = $('#orderCardContainer');
    $container.empty();

    Object.keys(groupedOrders).forEach(date => {
        $container.append(`
            <div class="col-12 date-header">
                <h4>${date}</h4>
            </div>
        `);

        groupedOrders[date].forEach(order => {
            let showtime = order?.tickets[0]?.showtime;
            const $card = $(`
                <div class="col-md-4">
                    <div class="card movie-card">
                        <div class="movie-card-header p-3 d-flex justify-content-between align-items-center">
                            <small>Mã đơn: ${order.bookingId}</small>
                        </div>
                        <div class="card-body p-3">
                            <div class="d-flex">
                                <img src="${showtime?.moviePosterUrl || commonDefaultImgUrl}" class="rounded shadow" style="width: 100px; height: 150px; object-fit: cover;">
                                <div class="ms-3 flex-grow-1">
                                    <h5 class="card-title mb-2">${showtime?.movieTitle}</h5>
                                    <p class="card-text mb-1">
                                        <i class="bi bi-calendar me-2"></i>${formatDateToVN(order.bookingDate.split('T')[0])} - ${order.bookingDate.split('T')[1].slice(0,5)}
                                    </p>
                                    <p class="card-text mb-1">
                                        <i class="bi bi-geo-alt me-2"></i>${showtime?.branchName}
                                    </p>
                                    <div class="d-flex justify-content-between align-items-center mt-2">
                                        <div>
                                            <span class="badge bg-info me-2">
                                                ${order.tickets.length} Vé
                                            </span>
                                            <strong>${order.totalAmount.toLocaleString()} VND</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent d-flex justify-content-between">
                            <button class="btn btn-outline-primary view-order" data-id="${order.bookingId}">
                                <i class="bi bi-eye me-1"></i>Chi Tiết
                            </button>
                            <button class="btn btn-outline-success download-ticket" data-id="${order.bookingId}">
                                <i class="bi bi-download me-1"></i>Tải Vé
                            </button>
                        </div>
                    </div>
                </div>
            `);

            $container.append($card);
        });
    });

    $('.download-ticket').on('click', function () {
       let id = $(this).data("id");
        generateTicketPDF(id);
    });

    // Hiển thị thông báo nếu không có kết quả
    if ($container.children('.col-md-4').length === 0) {
        $container.append(`
          <div class="col-12 text-center">
            <p class="alert alert-info">Không tìm thấy đơn hàng nào.</p>
          </div>
        `);
    }
}

function generateTicketPDF(id) {
    toggleLoading(true);
    $.ajax({
        url: `/booking/generate-pdf/${id}`,
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function(data) {
            console.log('aa', data);
            const blob = new Blob([data], {type: 'application/pdf'});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Chi_Tiet_Don_Hang_${id}.pdf`;
            link.click();
            toggleLoading(false);
        },
        error: function(xhr, status, error) {
            toggleLoading(false);
            console.log('Lỗi tạo PDF: ' + error);
        }
    });
}
function renderOrderDetails(order) {
    const $modalDetails = $('#modalOrderDetails');
    $modalDetails.empty();

    const foodTotal = order.foodOrders.reduce((total, food) => total + (food.price * food.quantity), 0);
    const subtotal = order.totalAmount - foodTotal;
    const finalTotal = order.totalAmount;
    let showtime = order?.tickets[0]?.showtime;

    const $details = $(`
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <h5>Thông Tin Phim</h5>
                    <p class="mb-1"><strong>Tên Phim:</strong> ${showtime?.movieTitle}</p>
                    <p class="mb-1"><strong>Địa chỉ:</strong> ${showtime?.branchAddress}</p>
                    <p class="mb-1"><strong>Phòng Chiếu:</strong> ${showtime?.roomName}</p>

                    <h5 class="mt-3">Ghế Đã Đặt</h5>
                    <div class="seats-list">
                        ${order.tickets.map(ticket => `<span style="background-color: ${ticket?.seatColor || 'gray'}" class="seat-tag">${ticket.seatNumber}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <h5 class="mb-3">Chi Tiết Đơn Hàng</h5>
                <div class="order-summary-item">
                    <span>Vé Phim</span>
                    <strong>${subtotal.toLocaleString()} VND</strong>
                </div>
                <div class="order-summary-item">
                    <span>Đồ Ăn & Thức Uống</span>
                    <strong>${foodTotal.toLocaleString()} VND</strong>
                </div>
                ${order.promotion ? `
                <div class="order-summary-item">
                    <span class="badge coupon-badge ms-2">${order.promotion.title}</span>
                    <strong>-${order.promotion.discountAmount ? order.promotion.discountAmount.toLocaleString() : '0'} VND</strong>
                </div>
                ` : ''}
                <div class="order-summary-item bg-light fw-bold">
                    <span>Tổng Cộng</span>
                    <strong>${finalTotal.toLocaleString()} VND</strong>
                </div>

                <h5 class="mt-4 mb-3">Đồ Ăn & Thức Uống</h5>
                ${order.foodOrders.map(food => `
                    <div class="order-summary-item">
                        <span>${food.foodFoodName}</span>
                        <span>
                            x${food.quantity}
                            <strong class="ms-2">${(food.price ).toLocaleString()} VND</strong>
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
    `);

    $modalDetails.append($details);
}

$(document).on('click', '.view-order', function() {
    const bookingId = $(this).data('id');
    const order = orderData.find(o => o.bookingId === bookingId);

    $('#modalOrderId').text(`Chi Tiết Đơn Hàng ${bookingId}`);
    renderOrderDetails(order);

    new bootstrap.Modal(document.getElementById('orderDetailModal')).show();
});

function renderPaginationBooking(totalElements, pageIndex, pageSize) {
    var totalPages = Math.ceil(totalElements / pageSize);
    console.log('aa', totalElements, pageIndex, pageSize, totalPages);
    var $pagination = $(".pagination");
    $pagination.empty();

    if (totalPages <= 1) return;

    function createPageItem(page, isActive = false) {
        return `<li class="page-item ${isActive ? 'active' : ''}">
                  <a class="page-link" href="#" data-page="${page}">${page}</a>
                </li>`;
    }

    if (pageIndex > 1) {
        $pagination.append(`<li class="page-item">
                              <a class="page-link" href="#" data-page="${pageIndex - 1}">&laquo;</a>
                            </li>`);
    }

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            $pagination.append(createPageItem(i, i === pageIndex));
        }
    } else {
        $pagination.append(createPageItem(1, pageIndex === 1)); // Trang đầu

        if (pageIndex > 3) {
            $pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`); // Dấu "..."
        }

        let start = Math.max(2, pageIndex - 1);
        let end = Math.min(totalPages - 1, pageIndex + 1);

        for (let i = start; i <= end; i++) {
            $pagination.append(createPageItem(i, i === pageIndex));
        }

        if (pageIndex < totalPages - 2) {
            $pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`); // Dấu "..."
        }

        $pagination.append(createPageItem(totalPages, pageIndex === totalPages)); // Trang cuối
    }

    // Nút "Sau"
    if (pageIndex < totalPages) {
        $pagination.append(`<li class="page-item">
                              <a class="page-link" href="#" data-page="${pageIndex + 1}">&raquo;</a>
                            </li>`);
    }

    $(".pagination").off("click").on("click", ".page-link", function (e) {
        e.preventDefault();
        let newPage = parseInt($(this).data("page"));
        if (!isNaN(newPage)) {
            renderPaginationBooking(totalElements, newPage, pageSize);
            fetchBooking({
                condition: {
                    startDate: startDate,
                    endDate: endDate,
                    minPrice: minPrice,
                    maxPrice: maxPrice
                },
                pageIndex: newPage,
                pageSize: pageSize
            });
        }
    });
}