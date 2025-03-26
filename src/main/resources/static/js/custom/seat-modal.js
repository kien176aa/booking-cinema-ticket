let seats = [], defaultSeatColor = 'white', rows = 0, cols = 0;
let selectedSeat = [], totalAmount = 0, foods = [], promotions = [];

function fetchFoods() {
    toggleLoading(true);
    $.ajax({
        url: "/foods/get-active-food",
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            console.log('response: ', response);
            foods = response;
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching :", error);
            toggleLoading(false);
        }
    });
}
fetchFoods();

function showSeatModal() {
    // Xóa modal cũ nếu có
    $('#seatModal').remove();
    totalAmount = selectShowtime?.price ? selectShowtime?.price : 0;
    // Tạo modal HTML
    let modal = `
<div id="seatModal" style="position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); 
    z-index: 99; display: flex; align-items: center; justify-content: center;">
    <div style="background: #1a1a1a; border-radius: 8px; width: 85%; max-width: 1000px; color: #fff; padding: 0;
        max-height: 600px;">
        <h3 style="margin-bottom: 10px; margin-top: 20px">Mua vé xem phim</h3>
        <div style="width: 400px; height: 30px; background-color: #5d5d5d; margin: auto" class="text-center">Màn hình</div>
        <div id="seatMapContainer" style="height: 200px; overflow: auto; cursor: move;">
            <div id="seatMap" style="display: grid; grid-template-columns: repeat(18, 30px); gap: 5px; justify-content: center; 
                "></div>
        </div>
        <div id="seatTypeList" class="row ms-4 w-75 d-flex justify-content-evenly" style="margin-top: 20px"></div>
        <div style="background-color: #fff; margin-top: 20px; color: #333; border-radius: 0 0 8px 8px; padding: 10px">
          <h5 style="margin-bottom: 10px;" class="text-start">${selectShowtime?.movieTitle}</h5>
          <p style="margin-bottom: 10px; color: #FF5722;" class="text-start">
            ${formatTime(selectShowtime?.startTime)} ~ ${formatTime(selectShowtime?.endTime)} · ${formatDateWithoutHour(selectShowtime?.startTime)}
             · ${selectShowtime?.roomName} · ${selectShowtime?.roomRoomType} 
          </p>
          <div class="row border-top" style="margin-bottom: 10px; padding-top: 10px">
            <div class="col-md-6 text-start">
                Chỗ ngồi
            </div>
            <div class="col-md-6">
                 <div class="text-end">
                 <button type="button" class="btn btn-outline-secondary me-2">
                    <span id="selectedSeat"></span>
                    <span id="btnRemoveSeat" style="color: black" class="badge badge-center ms-1">X</span>
                  </button>
                </div>
            </div>
          </div>
          <div class="row border-top" style="margin-bottom: 10px; padding-top: 10px">
          </div>
          <div class="row">
          <div class="col-md-6 text-start">
            Tạm tính: <span id="seatsPrice" style="font-weight: bold; font-size: 1.5em;">${totalAmount.toLocaleString()}</span><span>đ</span>
          </div>
          <div class="col-md-6 text-end">
          <button id="closeSeatModal" class="btn btn-outline-secondary">
            Đóng
          </button>
          <button id="confirmSeats" class="btn btn-primary">
            Mua vé
          </button>
</div>
</div>
        </div>
    </div>
</div>`;

    $('body').append(modal);
    resizeEventSeatMap();
    if(selectShowtime.roomSeatMap){
        seats = JSON.parse(selectShowtime.roomSeatMap);
        rows = Number(selectShowtime.roomRowNums);
        cols = Number(selectShowtime.roomColNums);
        generateSeats();
        renderSeatType();
    }

    $('#btnRemoveSeat').on('click', function () {
       selectedSeat = [];
       renderSelectedSeat();
        generateSeats();
        $('#seatsPrice').text(selectShowtime?.price ? selectShowtime?.price : 0);
    });

    // Nút xác nhận
    $('#confirmSeats').on('click', function () {
        if(selectedSeat.length === 0){
            showErrorToast('Vui lòng chọn ít nhất 1 ghế');
            return;
        }
        showFoodModal();
    });

    // Đóng modal
    $('#closeSeatModal').on('click', function () {
        selectedSeat = [];
        $('#seatModal').remove();
    });
}
let scale = 1;
const scaleStep = 0.1;
const minScale = 0.3;
const maxScale = 1.3;
let isDragging = false;
let offsetX, offsetY;

function resizeEventSeatMap(){
    const $seatMap = $('#seatMap');
    // Add wheel event for zoom functionality
    $seatMap.on('wheel', function(e) {
        e.preventDefault(); // Prevent page scrolling

        // Determine zoom direction
        if (e.originalEvent.deltaY < 0) {
            // Zoom in
            scale = Math.min(scale + scaleStep, maxScale);
        } else {
            // Zoom out
            scale = Math.max(scale - scaleStep, minScale);
        }

        // Apply the new scale
        $seatMap.css('transform', `scale(${scale})`);
    });

    const $div1 = $("#seatMapContainer");

    // Khi nhấn chuột vào div2
    $seatMap.on("mousedown", function (event) {
        isDragging = true;
        offsetX = event.clientX - $seatMap.offset().left;
        offsetY = event.clientY - $seatMap.offset().top;
    });

    // Khi di chuyển chuột
    $(document).on("mousemove", function (event) {
        if (isDragging) {
            // Lấy kích thước của div1 và div2
            let div1Rect = $div1[0].getBoundingClientRect();
            let div2Rect = $seatMap[0].getBoundingClientRect();

            // Tính toán vị trí mới của div2
            let newX = event.clientX - offsetX;
            let newY = event.clientY - offsetY;

            // Kiểm tra nếu vị trí mới nằm trong phạm vi div1
            let withinXBounds = newX >= div1Rect.left && newX + div2Rect.width <= div1Rect.right;
            let withinYBounds = newY >= div1Rect.top && newY + div2Rect.height <= div1Rect.bottom;

            if (withinXBounds && withinYBounds) {
                // Cập nhật vị trí nếu còn trong phạm vi
                $seatMap.css({
                    left: `${newX - div1Rect.left}px`,
                    top: `${newY - div1Rect.top}px`
                });

            }
        }
    });

    // Khi thả chuột ra
    $(document).on("mouseup", function () {
        isDragging = false;
    });
}

function generateSeats() {
    let isUpdate = seats && seats.length > 0;
    defaultSeatColor = seatTypes.find(item => item.isDefault)?.color;
    if(!defaultSeatColor && seatTypes && seatTypes.length > 0){
        defaultSeatColor = seatTypes[0]?.color;
    }
    $('#seatMap').empty();
    $('#seatMap').css('grid-template-columns', `repeat(${cols}, 40px)`);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const seat = $('<div></div>'); // Tạo div cho ghế
            let rowLabel = getSeatRowLabel(r);
            let seatId = rowLabel + (c + 1);

            if (isUpdate) {
                let eSeat = seats.find(item => item.seatNumber === seatId);
                if (eSeat) {
                    let isBooked = selectShowtime?.bookedSeat && selectShowtime?.bookedSeat.includes(eSeat.seatNumber);
                    if(!isBooked){
                        seat.css('background-color', eSeat.color ? eSeat.color : defaultSeatColor);
                    }
                    seat.addClass(`seat regular ${isBooked ? 'booked' : ''}`);
                    seat.data('row', rowLabel);
                    seat.data('col', c + 1);
                    seat.text(seatId);

                    // Thêm sự kiện click cho ghế
                    seat.on('click', function () {
                        if($(this).hasClass('booked'))
                            return false;
                        $(this).toggleClass('selected');
                        let isSelected = $(this).hasClass('selected');
                        $(this).css('outline', isSelected ? '2px solid #fff' : 'none');
                        let seatText = $(this).text();
                        if (isSelected) {
                            selectedSeat.push(seatText);
                            calcPrice(seatText, true);
                        } else {
                            let index = selectedSeat.indexOf(seatText);
                            if (index !== -1) {
                                selectedSeat.splice(index, 1);
                                calcPrice(seatText, false);
                            }
                        }
                        renderSelectedSeat();
                    });
                } else {
                    // seat.addClass('hidden');
                    seat.css('background-color', '');
                    seat.text('');
                }
            }

            seat.css('font-size', adjustFontSize(rowLabel));


            $('#seatMap').append(seat); // Thêm ghế vào seatMap
        }
    }
}

function calcPrice(seatText, isAdd){
    let s = seats.find(item => item.seatNumber === seatText);
    let currPriceTxt = $('#seatsPrice').text();
    let price = selectShowtime?.price ? selectShowtime?.price : 0;
    if(currPriceTxt && currPriceTxt.length > 0){
        price = Number(currPriceTxt.replace(/[^0-9.-]+/g, ""));
    }
    if(s){
        price = isAdd ? (price + s.price) : (price - s.price);
    }
    totalAmount = price;
    $('#seatsPrice').text(price.toLocaleString());
}

function renderSelectedSeat() {
    if (selectedSeat.length === 0) {
        $('#selectedSeat').text(''); // Nếu mảng rỗng, set là 'empty'
    } else {
        $('#selectedSeat').text(selectedSeat.join(', ')); // Nối các phần tử trong mảng với dấu ',' và set vào #selectedSeat
    }
}


function getSeatRowLabel(index) {
    let label = "";
    while (index >= 0) {
        label = String.fromCharCode(65 + (index % 26)) + label;
        index = Math.floor(index / 26) - 1;
    }
    return label;
}

function adjustFontSize(rowLabel) {
    return `${Math.max(16 - rowLabel.length * 2, 10)}px`;
}

function renderSeatType(){
    if(!seatTypes || seatTypes.length === 0){
        $('#seatTypeList').empty();
        return;
    }
    seatTypes.forEach((seatType, idx) => {
        $('#seatTypeList').append(`
            <div class="col-md-4 d-flex justify-content-start mb-2">
                <div class="rounded" style="width: 20px; height: 20px; margin-right: 10px; background-color: ${seatType.color};"></div>
                <span class="text-white">${seatType.typeName}</span>
            </div>
        `);
    });
    $('#seatTypeList').append(`
        <div class="col-md-4 d-flex justify-content-start mb-2">
            <div class="rounded" style="width: 20px; height: 20px; margin-right: 10px; background-color: black; outline: 2px solid #fff;"></div>
            <span class="text-white">Ghế bạn chọn</span>
        </div>
    `);
    $('#seatTypeList').append(`
        <div class="col-md-4 d-flex justify-content-start mb-2">
            <div class="rounded" style="width: 20px; height: 20px; margin-right: 10px; background-color: gray;"></div>
            <span class="text-white">Đã đặt</span>
        </div>
    `);
}

function showFoodModal() {
    $('#foodModal').remove();

    // Generate food items HTML
    let foodItemsHtml = '';

    foods.forEach(food => {
        foodItemsHtml += `
        <div class="food-item" data-id="${food.foodId}" data-price="${food.price}" style="display: flex; padding: 20px; border-bottom: 1px solid #e0e0e0;">
            <div style="margin-right: 15px;">
                <img src="${food.image || commonDefaultImgUrl}" alt="${food.foodName}" width="80" height="80" style="border-radius: 50%;">
            </div>
            <div style="flex-grow: 1;">
                <h5 style="margin: 0 0 5px 0; font-weight: bold;">${food.foodName} - ${food.price}đ</h5>
                <div style="display: flex; align-items: center;">
                    <button class="btn-decrease" style="width: 30px; height: 30px; border-radius: 50%; background-color: #f0f0f0; border: none; color: #888; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-right: 10px;">-</button>
                    <input type="text" class="food-quantity" value="0" style="width: 40px; border: none; text-align: center; font-size: 16px; background: transparent;" readonly>
                    <button class="btn-increase" style="width: 30px; height: 30px; border-radius: 50%; background-color: #d91b71; border: none; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-left: 10px;">+</button>
                </div>
            </div>
        </div>`;
    });

    // Create modal HTML
    let modal = `
    <!-- Tạo modal HTML -->
    <div id="foodModal" style="position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); 
        z-index: 990; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; border-radius: 8px; width: 85%; max-width: 600px; color: black; padding: 0; overflow: hidden;">
            <!-- Header with back button and title -->
            <div style="background-color: #d91b71; color: white; padding: 15px; position: relative; display: flex; align-items: center;">
                <div id="btnCloseFoodModal" style="position: absolute; left: 15px;">
                    <span style="font-size: 44px; cursor: pointer;">&#8249;</span>
                </div>
                <div style="text-align: center; width: 100%; font-size: 18px; font-weight: bold;">
                    Đồ ăn/uống
                </div>
            </div>
            
            <!-- Food Items Container -->
            <div id="foodItemsContainer" style="max-height: 400px; overflow-y: auto">
                ${foodItemsHtml}
            </div>
            
            <!-- Total and Continue button -->
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="font-weight: bold;">Tổng cộng</span>
                    <span id="totalPrice" style="font-weight: bold;">0đ</span>
                </div>
                <button id="nextStepPay" style="width: 100%; padding: 12px; background-color: #d91b71; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Tiếp tục</button>
            </div>
        </div>
    </div>`;

    $('body').append(modal);

    // Set up event handlers
    $('#btnCloseFoodModal').on('click', function () {
        $('#foodModal').remove();
    });

    $('#nextStepPay').on('click', function () {
        // Collect selected items
        const selectedItems = [];
        let totalFoodPrice = 0;
        $('.food-item').each(function() {
            const quantity = parseInt($(this).find('.food-quantity').val());
            if (quantity > 0) {
                let price = parseFloat($(this).data('price'));
                totalFoodPrice += price * quantity;
                selectedItems.push({
                    id: $(this).data('id'),
                    name: $(this).find('h5').text().split(' - ')[0],
                    price: price,
                    quantity: quantity
                });
            }
        });

        fetchPromotions((totalFoodPrice + totalAmount), selectedItems);
    });

    // Add quantity change handlers
    $('.btn-decrease').on('click', function() {
        const input = $(this).siblings('.food-quantity');
        let value = parseInt(input.val());
        if (value > 0) {
            input.val(value - 1);
            updateTotal();
        }
    });

    $('.btn-increase').on('click', function() {
        const input = $(this).siblings('.food-quantity');
        let value = parseInt(input.val());
        input.val(value + 1);
        updateTotal();
    });

    // Function to update the total price
    function updateTotal() {
        let total = 0;
        $('.food-item').each(function() {
            const quantity = parseInt($(this).find('.food-quantity').val());
            const price = $(this).data('price');
            total += quantity * price;
        });
        $('#totalPrice').text(total.toLocaleString() + 'đ');
    }
}

function showPayModal(selectedFoods) {
    console.log('foods', selectedFoods);
    $('#payModal').remove();

    // Generate HTML for food items
    let foodItemsHtml = '';
    let foodTotalPrice = 0;

    if (selectedFoods && selectedFoods.length > 0) {
        foodItemsHtml += `
        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
            <p style="color: #777; margin: 0 0 10px 0; font-size: 14px;">ĐỒ ĂN & NƯỚC UỐNG</p>`;

        selectedFoods.forEach(food => {
            const itemTotal = food.price * food.quantity;
            foodTotalPrice += itemTotal;

            foodItemsHtml += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <p style="margin: 0; font-size: 14px; font-weight: bold;">${food.name} x${food.quantity}</p>
                <p style="margin: 0; font-size: 14px;">${itemTotal.toLocaleString()}đ</p>
            </div>`;
        });

        foodItemsHtml += `</div>`;
    }

    // Generate HTML for promotions
    let promotionsHtml = '';
    let discountTotal = 0;

    if (promotions && promotions.length > 0) {
        promotionsHtml += `
        <div style="padding: 15px 0; border-top: 1px solid #eee;">
            <p style="color: #777; margin: 0 0 10px 0; font-size: 14px;">Ưu đãi (nếu có) sẽ được áp dụng ở bước thanh toán.</p>`;

        promotions.forEach(promo => {
            // Calculate discount amount based on promotion type
            let type = 'percent';
            if (!promo.discountPercent || promo.discountPercent === 0) {
                type = 'fixed';
            }

            promotionsHtml += `
  <div class="promotion-item">
    <div class="promo-radio-container">
      <input type="radio" id="promo-${promo.promotionId}" name="promotion" value="${promo.promotionId}" class="promo-radio">
      <label for="promo-${promo.promotionId}" class="promo-label">
        <div class="promo-content">
          <span class="promo-code">${promo.title}</span>
          <span class="promo-value ${type === 'percent' ? 'percent' : 'amount'}">${type === 'percent' ? '-' + promo.discountPercent + '%' : '-' + promo.discountAmount.toLocaleString() + 'đ'}</span>
        </div>
      </label>
    </div>
  </div>
`;
        });

        promotionsHtml += `</div>`;
    }

    // Calculate final total
    const subtotal = totalAmount + foodTotalPrice;

    // Tạo modal HTML
    let modal = `
<div id="payModal" style="position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); 
    z-index: 990; display: flex; align-items: center; justify-content: center;">
    <div style="background: white; width: 100%; max-width: 970px; display: flex; overflow: hidden;">
        <!-- Left side - Ticket information -->
        <div style="flex: 1; padding: 20px; box-sizing: border-box; position: relative; max-height: 600px; overflow-y: auto">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="background-color: #9e2828; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-right: 10px;"><i class="ri-movie-2-line"></i></div>
                <h4 style="margin: 0; font-weight: bold;">${selectShowtime?.movieTitle || 'Nhà Giả Tiên'}</h4>
            </div>

            <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 15px 0; display: flex; justify-content: space-between;">
                <div>
                    <p style="color: #777; margin: 0 0 5px 0; font-size: 14px;">THỜI GIAN</p>
                    <p style="font-weight: bold; margin: 0; font-size: 16px;">${formatTime(selectShowtime?.startTime) || '11:30'} ~ ${formatTime(selectShowtime?.endTime) || '13:27'}</p>
                </div>
                <div>
                    <p style="color: #777; margin: 0 0 5px 0; font-size: 14px;">NGÀY CHIẾU</p>
                    <p style="font-weight: bold; margin: 0; font-size: 16px;">${formatDateWithoutHour(selectShowtime?.startTime) || '23/03/2025'}</p>
                </div>
            </div>

            <div style="padding: 15px 0;">
                <p style="color: #777; margin: 0 0 5px 0; font-size: 14px;">Địa điểm</p>
                <p style="font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">${selectShowtime?.branchName}</p>
                <p style="margin: 0; color: #555; font-size: 14px;">${selectShowtime?.branchAddress}</p>
            </div>

            <div style="padding: 15px 0; border-top: 1px solid #eee; display: flex; justify-content: space-between;">
                <div>
                    <p style="color: #777; margin: 0 0 5px 0; font-size: 14px;">PHÒNG CHIẾU</p>
                    <p style="font-weight: bold; margin: 0; font-size: 16px;">${selectShowtime?.roomName || 'P5'}</p>
                </div>
                <div>
                    <p style="color: #777; margin: 0 0 5px 0; font-size: 14px;">ĐỊNH DẠNG</p>
                    <p style="font-weight: bold; margin: 0; font-size: 16px;">${selectShowtime?.roomRoomType || '2D Phụ đề'}</p>
                </div>
            </div>

            <div style="padding: 15px 0; border-top: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div>
                        <p style="color: #777; margin: 0 0 5px 0; font-size: 14px;">GHẾ</p>
                        <p style="font-weight: bold; margin: 0; font-size: 16px;">${selectedSeat?.join(', ')}</p>
                    </div>
                    <p style="font-weight: bold; margin: 0; font-size: 18px;">${totalAmount.toLocaleString()}đ</p>
                </div>
                <!-- Đồ ăn section -->
                ${foodItemsHtml}
            </div>

            <div style="padding: 15px 0; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-weight: bold; margin: 0; font-size: 18px;">Tạm tính</p>
                </div>
                <p style="font-weight: bold; margin: 0; font-size: 18px;">${subtotal.toLocaleString()}đ</p>
            </div>
            
            <!-- Promotion section -->
            ${promotionsHtml}
            
            <!-- Final total if discounts applied -->
            ${discountTotal > 0 ? `
            <div style="padding: 15px 0; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-weight: bold; margin: 0; font-size: 18px;">Tổng cộng</p>
                </div>
                <p style="font-weight: bold; margin: 0; font-size: 18px; color: #d91b71;">${subtotal.toLocaleString()}đ</p>
            </div>` : ''}
        </div>

        <!-- Right side - Payment information (Stripe instead of MoMo) -->
        <div style="width: 45%; background-color: #d91b71; color: white; padding: 20px; box-sizing: border-box; position: relative;">
            <div id="closePayModal" style="position: absolute; top: 20px; right: 20px; cursor: pointer; font-size: 24px;">&times;</div>
            
            <h4 style="text-align: center; margin-top: 40px; margin-bottom: 30px;">Thanh toán bằng Stripe</h4>
            
            <form id="payment-form">
                <div style="background: white; border-radius: 10px; padding: 20px; margin: 0 auto; width: 100%;">
                    <!-- Stripe Elements will be inserted here -->
                    <div id="card-element" class="form-control" style="border: 1px solid #ddd; padding: 12px; border-radius: 4px;"></div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <p style="margin: 0;"><i class="ri-bank-card-line me-3"></i>Sử dụng Stripe để thanh toán an toàn</p>
                    </div>
                </div>
                
                <div style="margin-top: 40px; text-align: center;">
                    <button id="submit" type="submit" class="btn btn-primary" style="background-color: white; color: #d91b71; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; width: 80%;">Thanh toán ngay</button>
                    <button id="btnClosePay" type="button" class="btn btn-outline-secondary" style="display: none;">Đóng</button>
                    <p id="card-errors" class="text-danger mt-2" style="color: white;"></p>
                </div>
            </form>
        </div>
    </div>
</div>`;

    $('body').append(modal);

    // Event handlers
    $('#btnClosePay, #closePayModal').on('click', function () {
        $('#payModal').remove();
    });

    var stripe = Stripe("pk_test_51R2w4ERtHPK7YGbtmDrLj3AUZ5m6NY7tFF1nFuBgDlRpMv7guB0iScQMP8UntGBKuxtI2ImWvxBHwQRaxAN1fcvf00Bii45oVq"); // Thay YOUR_PUBLISHABLE_KEY bằng khóa API công khai của bạn
    var elements = stripe.elements();

    var card = elements.create("card");
    card.mount("#card-element");

    var form = document.getElementById("payment-form");
    var errorElement = document.getElementById("card-errors");

    // Form submission handler
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        toggleLoading(true);
        // Disable the submit button to prevent multiple submissions
        document.getElementById('submit').disabled = true;
        let promoId = $('input[name="promotion"]:checked').val();
        let amountToCharge = subtotal;
        if(promoId){
            let promo = promotions.find(item => item.promotionId == promoId);
            if(!promo.discountPercent || promo.discountPercent === 0){
                amountToCharge -= promo.discountAmount;
            } else{
                amountToCharge = Math.round(amountToCharge * (1 - promo.discountPercent / 100));
            }
        }

        try {
            const response = await fetch(`/payment/create?amount=${amountToCharge}&showtimeId=${selectShowtime?.showtimeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.error) {
                errorElement.textContent = data.error;
                document.getElementById('submit').disabled = false;
            } else {
                const { clientSecret } = data;

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: 'Test User'
                        }
                    }
                });

                if (result.error) {
                    // Display error message
                    errorElement.textContent = result.error.message;
                    document.getElementById('submit').disabled = false;
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        processSaveBooking(selectedFoods, promoId, amountToCharge);
                    }
                }
            }
        } catch (error) {
            // Handle network or other errors
            showErrorToast('Có lỗi xảy ra trong quá trình thanh toán');
            errorElement.textContent = 'Có lỗi xảy ra trong quá trình thanh toán';
            document.getElementById('submit').disabled = false;
        } finally {
            toggleLoading(false);
        }
    });
}

function processSaveBooking(selectedFoods, promoId, amountToCharge){
    let tickets = [], foodOrders = [];
    selectedSeat.forEach(function (seatNumber) {
        let seat = seats.find(s => s.seatNumber === seatNumber);
        if (seat) {
            // seat.isBooked = true;
            tickets.push({
                showtimeId: selectShowtime?.showtimeId,
                price: seat.price,
                seatNumber: seat.seatNumber,
                seatTypeId: seat.seatTypeSeatTypeId,
                roomId: selectShowtime?.roomRoomId
            });
        }
    });

    let booking = {
        totalAmount: amountToCharge,
        tickets: tickets,
        foodOrders: selectedFoods.map(item => ({
            ...item,
            foodId: item.id
        })),
        promotion: {
            promotionId: promoId
        }
    };
    console.log('book ', booking);
    $.ajax({
        url: '/booking',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(booking),
        success: function(data) {
            document.getElementById('submit').disabled = false;
            $('#seatModal').remove();
            $('#foodModal').remove();
            $('#payModal').remove();
            showSuccessToast('Thanh toán thành công');
        },
        error: function(xhr, status, error) {
            console.error('Booking failed:', error);
        }
    });
}

function fetchPromotions(price, selectedItems) {
    toggleLoading(true);
    $.ajax({
        url: `/promotions/get-current?price=${price}`,
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            console.log('response: ', response);
            promotions = response;
            showPayModal(selectedItems);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            toggleLoading(false);
        }
    });
}