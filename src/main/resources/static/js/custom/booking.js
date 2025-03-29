let searchText = '', currentPageIndex = 1, currentPageSize = 7;
let orderData = [];
const btnCheckbox = $('#defaultCheck1');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputAddress = $('#address');
const inputEmail = $('#emailLarge');
const inputPhone = $('#phone');
const modalDialog = $('#largeModal');
let startDate = null, endDate = null, minPrice = null, maxPrice = null;
function fetchBooking(req) {
    toggleLoading(true);
    $.ajax({
        url: "/booking/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function (response) {
            console.log('booking', response);
            orderData = response.data;
            currentPageIndex = response.pageIndex;
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="6" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#booking-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function (xhr) {
            console.error("Lỗi khi tìm kiếm đơn hàng:", xhr.responseText);
            toggleLoading(false);
        }
    });
}

function changePageIndex(totalRecords, newPage, pageSize){
    getSearchInfo();
    fetchBooking({
        condition: {
            isSearchByAccountId: false,
            keyWord: searchText,
            startTime: startDate,
            endTime: endDate,
            minPrice: minPrice,
            maxPrice: maxPrice
        },
        pageIndex: newPage,
        pageSize: currentPageSize
    });
}

fetchBooking({condition: {
        isSearchByAccountId: false
    }, pageSize: currentPageSize, pageIndex: 1});


function renderTableRow(item) {
    return `
        <tr id="booking-tr-${item.bookingId}">
            <td>
                <span>${item.bookingId}</span>
            </td>
            <td>${item?.account?.email}</td>
            <td>${item?.account?.phone}</td>
            <td>${formatDate(item?.bookingDate)}</td>
            <td>${item?.totalAmount.toLocaleString()} VND</td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-outline-primary" onclick="showOrderDetail('${item.bookingId}')">
                        <i class="ri-eye-line me-1"></i> Chi tiết
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function showOrderDetail(id) {
    const order = orderData.find(item => item.bookingId === Number(id));
    console.log('id', id, order);

    // Cập nhật thông tin đơn hàng
    $("#bookingId").text(order.bookingId);
    $("#bookingDate").text(new Date(order.bookingDate).toLocaleString());
    $("#totalAmount").text(order.totalAmount.toLocaleString());

    // Cập nhật thông tin khách hàng
    $("#customerName").text(order.account.fullName);
    $("#customerEmail").text(order.account.email);
    $("#customerPhone").text(order.account.phone);

// Xử lý khuyến mãi (ẩn nếu không có)
    if (order.promotion) {
        $("#promoTitle").text(order.promotion.title);

        let discountText = "Không có";
        if (order.promotion.discountPercent) {
            discountText = `${order.promotion.discountPercent}%`;
        } else if (order.promotion.discountAmount) {
            discountText = `${order.promotion.discountAmount.toLocaleString()} VND`;
        }

        $("#promoDiscount").text(discountText);
        $("#promoSection").removeClass("d-none"); // Hiện khuyến mãi nếu có
    } else {
        $("#promoSection").addClass("d-none"); // Ẩn nếu không có
    }


    // Lấy thông tin phim từ vé đầu tiên
    if (order.tickets.length > 0) {
        const firstTicket = order.tickets[0];
        $("#movieTitle").text(firstTicket.showtime.movieTitle);
        $("#branchName").text(`${firstTicket.showtime.branchName} - ${firstTicket.showtime.branchAddress}`);
        $("#roomName").text(`${firstTicket.showtime.roomName} (${firstTicket.showtime.roomRoomType})`);
        $("#showtime").text(new Date(firstTicket.showtime.startTime).toLocaleString());

        // Gộp danh sách ghế
        const seatNumbers = order.tickets.map(ticket => ticket.seatNumber).join(", ");
        $("#seatList").text(seatNumbers);
    } else {
        $("#movieTitle, #roomName, #showtime, #seatList").text("-");
    }

    // Cập nhật danh sách đồ ăn
    let foodHtml = order.foodOrders.length > 0 ? "" : "<tr><td colspan='3' class='text-center'>Không có</td></tr>";
    order.foodOrders.forEach(food => {
        foodHtml += `
            <tr>
                <td>${food.foodFoodName}</td>
                <td>${food.price.toLocaleString()} VND</td>
                <td>${food.quantity}</td>
            </tr>
        `;
    });
    $("#foodList").html(foodHtml);

    // Hiển thị modal
    $("#largeModal").modal("show");
}

function exportOrdersToExcel(orderData) {
    if (!orderData || orderData.length === 0) {
        alert("Không có dữ liệu để xuất!");
        return;
    }

    // Chuẩn bị dữ liệu cho Excel
    let data = orderData.map(order => ({
        "Mã đơn hàng": order.bookingId,
        "Ngày đặt": new Date(order.bookingDate).toLocaleString("vi-VN"),
        "Trạng thái": order.bookingStatus,
        "Phương thức thanh toán": order.paymentMethod,
        "Tổng tiền (VND)": order.totalAmount.toLocaleString(),
        "Khách hàng": order.account.fullName,
        "Email": order.account.email,
        "Điện thoại": order.account.phone,
        "Khuyến mãi": order.promotion ? order.promotion.title : "Không áp dụng",
        "Giảm giá": order.promotion ? (order.promotion.discountPercent ? `${order.promotion.discountPercent}%` : `${order.promotion.discountAmount.toLocaleString()} VND`) : "-",
        "Số lượng vé": order.tickets.length,
        "Số lượng đồ ăn": order.foodOrders.length
    }));

    // Tạo worksheet và workbook
    let ws = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachDonHang.xlsx");
}


function getSearchInfo(){
    searchText = $('#searchText').val().trim();
    startDate = $('#startDate1').val();
    endDate = $('#endDate1').val();
    minPrice = $('#minPrice').val();
    maxPrice = $('#maxPrice').val();
}

$(document).ready(function() {
    $('#button-addon2').on('click', function() {
        getSearchInfo();
        fetchBooking({
            condition: {
                keyWord: searchText,
                isSearchByAccountId: false,
                startTime: (!startDate || startDate.length === 0) ? null : new Date(startDate),
                endTime: (!endDate || endDate.length === 0) ? null : new Date(endDate),
                minPrice: minPrice,
                maxPrice: maxPrice
            },
            pageIndex: 1,
            pageSize: currentPageSize
        });
    });
    $('#advanceSearch').on('click', function () {
        getSearchInfo();
        fetchBooking({
            condition: {
                keyWord: searchText,
                isSearchByAccountId: false,
                startTime: (!startDate || startDate.length === 0) ? null : new Date(startDate),
                endTime: (!endDate || endDate.length === 0) ? null : new Date(endDate),
                minPrice: minPrice,
                maxPrice: maxPrice
            },
            pageIndex: 1,
            pageSize: currentPageSize
        });
    });

    $("#exportBooking").on('click', function () {
        toggleLoading(true);
        $.ajax({
            url: "/booking/search",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                condition: {
                    keyWord: searchText,
                    isSearchByAccountId: false,
                    startTime: (!startDate || startDate.length === 0) ? null : new Date(startDate),
                    endTime: (!endDate || endDate.length === 0) ? null : new Date(endDate),
                    minPrice: minPrice,
                    maxPrice: maxPrice
                },
                pageIndex: 1,
                pageSize: 99999
            }),
            success: function (response) {
                console.log('booking', response);
                exportOrdersToExcel(response.data);
                toggleLoading(false);
            },
            error: function (xhr) {
                console.error("Lỗi khi tìm kiếm đơn hàng:", xhr.responseText);
                toggleLoading(false);
            }
        });
    })
});