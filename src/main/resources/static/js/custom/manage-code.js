let searchText = "";

function searchBooking() {
    toggleLoading(true);
    $.ajax({
        url: "/booking/get-by-code",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ code: searchText }),
        success: function(response) {
            console.log('response: ', response);
            renderBooking(response);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching account:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function changeStatus() {
    if (searchText === ''){
        return;
    }
    toggleLoading(true);
    $.ajax({
        url: "/booking/change-status",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ code: searchText }),
        success: function(response) {
            console.log('response: ', response);
            showSuccessToast('Thay đổi trạng thái đơn hàng thành công');
            $('#b-status').text("Đã sử dụng");
            renderColor('#b-status');
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching account:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function renderBooking(data) {
    const showtime = data.tickets[0].showtime;
    const seat = data.tickets[0].seatNumber;
    const seatColor = data.tickets[0].seatColor;
    const foodItems = data.foodOrders.map(food => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${food.foodFoodName} (x${food.quantity})
        <span class="badge bg-purple text-white rounded-pill">${food.price.toLocaleString()} đ</span>
      </li>
    `).join('');

    const html = `
      <h4 class="mb-4 fw-semibold">Chi tiết đơn hàng <span class="text-secondary">#${data.bookingCode}</span></h4>
      <div class="row g-4">
        <div class="col-md-6">
          <div class="mb-2"><strong>Khách hàng:</strong> ${data.account.fullName}</div>
          <div class="mb-2"><strong>Email:</strong> ${data.account.email}</div>
          <div class="mb-2"><strong>Điện thoại:</strong> ${data.account.phone}</div>
          <div class="mb-2"><strong>Ngày đặt:</strong> ${formatDate(data.bookingDate)}</div>
          <div class="mb-2"><strong>Trạng thái:</strong> <span id="b-status">${data.bookingStatus}</span></div>
          <div class="mb-2"><strong>Tổng tiền:</strong> <span class="text-danger fw-bold">${data.totalAmount.toLocaleString()} đ</span></div>
        </div>
        <div class="col-md-6">
          <div class="mb-2"><strong>Phim:</strong> ${showtime.movieTitle}</div>
          <div class="mb-2"><strong>Thời gian:</strong> ${formatDate(showtime.startTime)} - ${formatDate(showtime.endTime)}</div>
          <div class="mb-2"><strong>Rạp:</strong> ${showtime.roomName} (${showtime.roomRoomType}) - ${showtime.branchName}</div>
          <div class="mb-2"><strong>Địa Chỉ:</strong> ${showtime.branchAddress}</div>
          <div class="mb-2"><strong>Ghế:</strong> <span style="color:${seatColor}; font-weight: bold;">${seat}</span></div>
        </div>
      </div>

      ${foodItems ? `
        <h5 class="mt-4 fw-semibold">Đồ ăn/uống đã đặt</h5>
        <ul class="list-group">${foodItems}</ul>
      ` : ''}
    `;

    $('#data-booking').html(html);
    renderColor('#b-status');
}

function renderColor(id){
    let a = $(id).text();
    if (a === 'Đã sử dụng'){
        $(id).addClass('text-danger');
    } else if (a === 'Thành công'){
        $(id).addClass('text-success');
    }
}

$(document).ready(function() {
    $('#button-addon2').on('click', function() {
        searchText = $('.form-control').val().trim();
        searchBooking();
    });
    $('#btnCreate').on('click', function() {
        changeStatus();
    });
    renderEmptyData('#data-booking');
});