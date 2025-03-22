let searchText = '', branchId = null, startDate = null, endDate = null, currentPageIndex = 1, currentPageSize = 7;
let status = null, roomId = null, rooms = [];
let showtimes = [], branches = [], seatTypes = [], seats = [], selectedIds = [];
let selectElement = $("#exampleFormControlSelect1");
let showtimeArr = [];
let inputPrice = $('#price');
let roomSelectModal = $("#roomSelectModal");
const modalDialog2 = $('#largeModal2');
let roomSelect = $('#selectRoom');
let checkboxAll = $('#showtime-selectAll');
let deleteType = "";
let deleteId = null;
let showtimesData = [];
function fetchShowtimes(req) {
    toggleLoading(true);
    $.ajax({
        url: "/showtimes/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            showtimes = response.data;
            currentPageIndex = response.pageIndex;
            checkboxAll.prop('checked', false);
            selectedIds = [];
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="5" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            addCheckedEvent();
            renderPagination(response, '#showtime-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}
function fetchBranches(){
    toggleLoading(true);
    $.ajax({
        url: "/branches/search?name=",
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            console.log('response: ', response);
            selectElement.empty();
            if(response.length > 0){
                branchId = response[0].branchId;
            }
            response.forEach((branch, idx) => {
                let option = `<option value="${branch.branchId}" ${idx === 0 ? 'selected="selected"' : ''}>${branch.name}</option>`;
                selectElement.append(option);
            });
            branches = response;
            movieId = $('#movieId').val();
            fetchShowtimes({
                condition:{
                    branchId: branchId,
                    movieId: movieId,
                },
                pageSize: currentPageSize, pageIndex: 1});
            fetchRooms();
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching promotions:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function fetchRooms() {
    toggleLoading(true);
    $.ajax({
        url: "/rooms/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: {
            branchId: branchId
            }, pageSize: 9999, pageIndex: 1 }),
        success: function(response) {
            console.log('response: ', response);
            rooms = response.data;
            roomSelectModal.empty();
            roomSelect.empty();
            roomSelect.append('<option value="-1">Tất cả phòng chiếu</option>');
            response.data.forEach((r) => {
                let option = `<option value="${r.roomId}">${r.name}</option>`;
                roomSelect.append(option);
                roomSelectModal.append(option);
            });
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}


fetchBranches();
function changePageIndex(totalRecords, newPage, pageSize){
    fetchShowtimes({condition: {
            status: searchText,
            branchId: branchId,
            roomId: roomId === '-1' ? null : roomId,
            movieId: movieId,
            startTime: startDate,
            endTime: endDate
        }, pageSize: pageSize, pageIndex: newPage});
}

function renderTableRow(item) {
    let checkBox = `<input class="form-check-input" type="checkbox" id="inlineCheckbox-${item.showtimeId}" value="${item.showtimeId}" />`;
    if(!item.canEdit)
        checkBox = '';
    return `
        <tr id="showtime-tr-${item.showtimeId}">
            <td>
                ${checkBox}
            </td>
            <td>${item.roomName}</td>
            <td>${formatDate(item.startTime)} - ${formatDate(item.endTime)}</td>
            <td>${item.price}</td>
            <td>${item.status}</td>
        </tr>
    `;
}

function addCheckedEvent(){
    $('.form-check-input').on('change', function() {
        const showtimeId = $(this).val();

        if ($(this).prop('checked')) {
            if(!isNaN(showtimeId))
                selectedIds.push(showtimeId);
        } else {
            selectedIds = selectedIds.filter(id => id !== showtimeId);
        }
    });
}

function getBranchName(id){
    return branches.find(item => item.branchId === id)?.name;
}

function setContentModal(modalType, callbackFunc, id) {
    $('#exampleModalLabel32').text('Cập nhật suất chiếu - Chi nhánh: ' + getBranchName(branchId));
    modalDialog2.find('[id*="error"]').text('');
    modalDialog2.find('[id*="overlapMessage"]').text('');
    fetchShowtimesToModal();
    $('#largeModal2 #btnSave2').off('click').on('click', function() {
        checkOverlappingShowtimes();
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    if (modalType === 'edit')
        modalDialog2.modal('show');
}

function fetchShowtimesToModal(){
    toggleLoading(true);
    $.ajax({
        url: "/showtimes/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: {
                branchId: branchId,
                movieId: movieId,
                roomId: roomSelectModal.val()
            }, pageSize: 9999, pageIndex: 1 }),
        success: function(response) {
            console.log('response: ', response);
            let minDate = null, maxDate = null;
            let price = response.data[0]?.price;
            if(price)
                inputPrice.val(price);
            showtimesData = [];
            response.data.sort((a, b) => {
                const startA = new Date(a.startTime);
                const startB = new Date(b.startTime);

                return startB - startA;
            }).forEach(show => {
                let startTime = new Date(show.startTime).toTimeString().substring(0, 5);
                let endTime = new Date(show.endTime).toTimeString().substring(0, 5);
                if (!minDate || show.startTime < minDate) {
                    minDate = show.startTime;
                }
                if (!maxDate || show.endTime > maxDate) {
                    maxDate = show.endTime;
                }
                showtimesData.push({
                    id: String(show.showtimeId),
                    startDate: show.startTime.split('T')[0],
                    endDate: show.endTime.split('T')[0],
                    startTime: startTime,
                    endTime: endTime
                });
            });
            if(minDate) {
                $("#showDate").val(minDate.split('T')[0]);
                $("#startTime").val(new Date(minDate).toTimeString().substring(0, 5));
            } else{
                $("#showDate").val(null);
                $("#startTime").val(null);
            }
            if(maxDate)
                $("#endDate").val(maxDate.split('T')[0]);
            else
                $("#endDate").val(null);
            try {
                if (showtimesData && showtimesData.length > 0)
                    renderShowtimes();
                else
                    $("#showtimesContainer").empty();
            }catch (e) {
                console.log('render ex ', e);
            } finally {
                toggleLoading(false);
            }
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function generateShowtimesData() {
    let showCount = parseInt($("#showCount").val());
    let movieDuration = parseInt($("#movieDuration").val());
    let startDate = new Date($("#showDate").val());
    let endDate = new Date($("#endDate").val());
    let startTime = $("#startTime").val();

    if (!showCount || !movieDuration || !startTime || !startDate || !endDate) {
        showErrorToast("Vui lòng nhập đầy đủ thông tin");
        return;
    }
    let currentDate = new Date();

    if (startDate.getTime() < currentDate.getTime()) {
        showErrorToast("Suất chiếu không thể trước thời gian hiện tại");
        return;
    }

    showtimesData = [];

    let totalDuration = movieDuration + 20;

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        let currentTime = new Date(date.toISOString().split('T')[0] + `T${startTime}:00`);

        for (let i = 0; i < showCount; i++) {
            let endTime = new Date(currentTime.getTime() + totalDuration * 60000);
            if (endTime.getDate() !== currentTime.getDate()) {
                break;
            }
            showtimesData.push({
                id: crypto.randomUUID(),
                startDate: date.toISOString().split('T')[0],
                endDate: date.toISOString().split('T')[0],
                startTime: currentTime.toTimeString().substring(0, 5),
                endTime: endTime.toTimeString().substring(0, 5),
            });

            currentTime = new Date(endTime);
        }
    }

    renderShowtimes();
}

function updateShowDate(oldDate, newDate, inputElement) {
    // Kiểm tra nếu ngày mới đã tồn tại
    if (showtimesData.some(show => show.startDate === newDate)) {
        alert("Ngày chiếu đã tồn tại! Vui lòng chọn ngày khác.");
        inputElement.val(oldDate); // Đặt lại ngày cũ
        return;
    }

    // Cập nhật ngày chiếu cho các suất chiếu thuộc ngày cũ
    showtimesData.forEach(show => {
        if (show.startDate === oldDate) {
            show.startDate = newDate;
        }
    });

    // Cập nhật giao diện
    renderShowtimes();
}

function addNewDateShowTime() {
    // let showCount = parseInt($("#showCount").val());
    let movieDuration = parseInt($("#movieDuration").val());
    let startDate = new Date($("#showDate").val());
    let endDate = new Date($("#endDate").val());
    let startTime = $("#startTime").val();

    if (!movieDuration || !startTime || !startDate || !endDate) {
        showErrorToast("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00
    console.log('cur', currentDate);

    let newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1); // Set ngày mới là ngày hôm sau
    console.log('new ', newDate);

    if (showtimesData && showtimesData.length > 0) {
        let maxDate = null;

        showtimesData.forEach(item => {
            if (!maxDate || new Date(maxDate) < new Date(item.startDate)) {
                maxDate = item.startDate;
            }
        });

        let maxDateObj = new Date(maxDate);
        if (maxDateObj >= currentDate) {
            console.log('1');
            newDate = new Date(maxDateObj);
            newDate.setDate(newDate.getDate() + 1);
        }
        console.log('2', newDate);
    }
    let formattedDate = newDate.toLocaleDateString("en-CA");
    console.log('forr', formattedDate);

    addShowtime(formattedDate);
}

function addShowtime(date) {
    let lastShow = showtimesData
        .filter(show => show.startDate === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .pop();

    let lastEndTime = lastShow ? lastShow.endTime : $('#startTime').val();
    let newStartTime = lastEndTime;
    let duration = Number($('#movieDuration').val()) + 20;
    let newEndTime = calculateEndTime(newStartTime, duration);

    if (!newEndTime) {
        showErrorToast("Không thể thêm suất chiếu vì thời gian kết thúc vượt quá ngày hiện tại.");
        return;
    }
    let newShowtime = {
        id: crypto.randomUUID(),
        startDate: date,
        startTime: newStartTime,
        endTime: newEndTime
    };

    showtimesData.unshift(newShowtime);
    renderShowtimes();
}

function calculateEndTime(startTime, duration) {
    let [hours, minutes] = startTime.split(":").map(Number);
    let endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    let timeLeftInMinutes = (endOfDay - startDate) / 60000;

    if (timeLeftInMinutes < duration) {
        return false;
    }
    let endMinutes = minutes + duration;
    let endHours = hours + Math.floor(endMinutes / 60);
    endMinutes = endMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}

function renderShowtimes() {
    let showtimesContainer = $("#showtimesContainer");
    showtimesContainer.empty();

    let groupedByDate = showtimesData.reduce((acc, show) => {
        if (!acc[show.startDate]) acc[show.startDate] = [];
        acc[show.startDate].push(show);
        return acc;
    }, {});

    let uniqueDates = new Set([...Object.keys(groupedByDate), ...showtimesData.map(s => s.startDate)]);
    let currentDate = new Date();
    let formattedCurrentDate = currentDate.toISOString().split('T')[0];
    uniqueDates.forEach(date => {
        let divEdit = `<div class="col-md-2 d-flex align-items-center">
                <i style="cursor: pointer; font-size: 20px" class="ri-add-circle-line me-2 ms-2 text-primary" onclick="addShowtime('${date}')"></i>
                <i style="cursor: pointer; font-size: 20px" class="ri-close-circle-line text-danger" onclick="confirmDelete('day', '${date}')"></i>
            </div>`;
        let inputDate = `<input type="date" class="form-control showTimeDate" value="${date}" data-old-date="${date}">`;
        if(formattedCurrentDate > date){
            divEdit = '';
            inputDate = `<input type="date" disabled="disabled" class="form-control showTimeDate" value="${date}" data-old-date="${date}">`;
        }
        let dayBlock = $(`
          <div class="day-block mt-2 row">
            <div class="col-md-4">
                ${inputDate}
            </div>
            ${divEdit}
            <div id="day-${date}"></div>
            <div class="divider"></div>
          </div>
        `);

        dayBlock.find(".showTimeDate").off("change").on("change", function () {
            let oldDate = $(this).data("old-date");
            let newDate = $(this).val();
            updateShowDate(oldDate, newDate, $(this));
        });

        (groupedByDate[date] || []).forEach(show => {
            let disableAttr = ``;
            let deleteIcon = `<i style="cursor: pointer" class="ri-close-circle-line text-danger" onclick="confirmDelete('showtime', '${show.id}')"></i>`;
            if(formattedCurrentDate > date){
                disableAttr = `disabled="disabled"`;
                deleteIcon = ``;
            }
            let showtimeInput = $(`
              <div class="row mt-3" id="show-${show.id}">
                <input type="date" class="form-control" hidden="hidden" value="${date}" data-show-id="${show.id}" data-date="${date}">
                <div class="col-md-5">
                  <input type="time" class="form-control" ${disableAttr} value="${show.startTime}" data-show-id="${show.id}">
                </div>
                <div class="col-md-5">
                  <input type="time" class="form-control" ${disableAttr} value="${show.endTime}" data-show-id="${show.id}">
                </div>
                <div class="col-md-2 d-flex align-items-center justify-content-center">
                    <span style="margin-right: 10px" id="minutes-${show.id}">
                        ${calculateMinutesBetween(show.startTime, show.endTime)} phút
                    </span>
                    ${deleteIcon}
                </div>
                <span class="text-danger" id="overlapMessage-${show.id}"></span>
              </div>
            `);
            dayBlock.find(`#day-${date}`).append(showtimeInput);
        });

        showtimesContainer.append(dayBlock);
    });
}


function calculateMinutesBetween(startTime, endTime) {
    let startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);

    return endMinutes - startMinutes;
}

function updateShowtimeDuration(showId) {
    let startTime = $(`#show-${showId} input[type="time"]`).eq(0).val();
    let endTime = $(`#show-${showId} input[type="time"]`).eq(1).val();

    if (startTime && endTime) {
        let startMinutes = timeToMinutes(startTime);
        let endMinutes = timeToMinutes(endTime);
        let duration = endMinutes - startMinutes;

        if (duration > 0) {
            $(`#minutes-${showId}`)
                .text(`${duration} phút`)
                .removeClass("text-danger")
                .addClass("text-gray");

            let showtime = showtimesData.find(show => show.id == showId);
            if (showtime) {
                showtime.startTime = startTime;
                showtime.endTime = endTime;
            }
        } else {
            $(`#minutes-${showId}`)
                .text("Không hợp lệ")
                .removeClass("text-gray")
                .addClass("text-danger");
        }
    }
}

$(document).on("input", 'input[type="time"]', function () {
    let showId = $(this).data("show-id");
    updateShowtimeDuration(showId);
});

function confirmDelete(type, id) {
    deleteType = type;
    deleteId = id;
    $("#confirmDeleteModal").modal("show");
}

function deleteConfirmed() {
    if (deleteType === "showtime") {
        showtimesData = showtimesData.filter(show => show.id !== deleteId);
    } else if (deleteType === "day") {
        showtimesData = showtimesData.filter(show => show.startDate !== deleteId);
    }
    $("#confirmDeleteModal").modal("hide");
    renderShowtimes();
}

function timeToMinutes(timeStr) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
}

function checkOverlappingShowtimes() {
    let overlapping = false;
    showtimeArr = [];
    let movieDuration = parseInt($("#movieDuration").val());
    let totalDuration = movieDuration + 20;

    $('[id*="show-"]').each(function () {
        let date = $(this).find(".form-control").eq(0).data('date');
        let startTime = $(this).find(".form-control").eq(1).val();
        let endTime = $(this).find(".form-control").eq(2).val();
        let showId = $(this).find(".form-control").eq(1).data('show-id');

        if (startTime && endTime && date) {
            let start = new Date(`${date}T${startTime}:00`);
            let end = new Date(`${date}T${endTime}:00`);
            let startMinutes = timeToMinutes(startTime);
            let endMinutes = timeToMinutes(endTime);

            if (endMinutes - startMinutes < totalDuration) {
                $(`#overlapMessage-${showId}`).text("Thời lượng suất chiếu ngắn hơn thời lượng phim");
                overlapping = true;
            } else {
                $(`#overlapMessage-${showId}`).text("");
            }
            for (let prevShow of showtimeArr) {
                if (
                    (start >= prevShow.start && start < prevShow.end) ||
                    (end > prevShow.start && end <= prevShow.end) ||
                    (start <= prevShow.start && end >= prevShow.end)
                ) {
                    let prevStartTime = `${prevShow.start.getHours().toString().padStart(2, '0')}:${prevShow.start.getMinutes().toString().padStart(2, '0')}`;
                    let prevEndTime = `${prevShow.end.getHours().toString().padStart(2, '0')}:${prevShow.end.getMinutes().toString().padStart(2, '0')}`;

                    let overlapMessageId = `#overlapMessage-${showId}`;
                    $(overlapMessageId).text(`Lịch này bị trùng với suất chiếu từ ${prevStartTime} đến ${prevEndTime}`);
                    overlapping = true;
                    // return false;
                }
            }

            showtimeArr.push({ start, end, id: showId });
        }
    });

    return overlapping;
}

function getShowtimeId(id) {
    if(id && typeof id === 'number')
        return id;
    if (id && !isNaN(id) && !id.includes("-")) {
        return parseFloat(id);
    }
    return null;
}

function getShowtimeInfo(type) {
    let isValid = isPositiveNumber('#price', 'Giá vé');
    isValid = hasValue('#showDate', 'Ngày chiếu') && isValid;
    let overlapping = checkOverlappingShowtimes();
    if(overlapping || !isValid){
        return false;
    }
    return {
        showtimeDTOs: showtimeArr.map(item => ({
            showtimeId: getShowtimeId(item.id),
            price: inputPrice.val(),
            status: 'Còn vé',
            startTime: convertToVietnamTime(item.start),
            endTime: convertToVietnamTime(item.end)
        })),
        branchId: branchId,
        roomId: roomSelectModal.val(),
        movieId: $('#movieId').val()
    };
}


function updateShowtime(){
    toggleLoading(true);
    const req = getShowtimeInfo('add');
    console.log('update', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: "/showtimes/update",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog2.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchShowtimes({condition: {
                    status: searchText,
                    branchId: branchId,
                    roomId: roomId === '-1' ? null : roomId,
                    movieId: movieId,
                    startTime: startDate,
                    endTime: endDate
                }, pageSize: currentPageSize, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error updating showtime:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function showUpdatePriceModal(){
    if(!selectedIds || selectedIds.length === 0){
        showErrorToast('Vui lòng chọn ít nhất một suất chiếu');
        return;
    }
    $('#updatePriceList').empty();
    $('#newPrice').val('');
    $('#newPrice-error').text('');
    selectedIds.forEach(id => {
       let s = showtimes.find(item => item.showtimeId == id);
       if(s){
           $('#updatePriceList').append(`
                <p>${s.roomName}: ${formatTime(s.startTime)} ~ ${formatTime(s.endTime)} · ${formatDateWithoutHour(s.startTime)}</p>
           `);
       }
    });

    $('#updatePriceModal').modal('show');
}
function updatePrice(){
    let isValid = isPositiveNumber('#newPrice', 'Giá mới');
    if(!isValid)
        return;
    let price = $('#newPrice').val();
    toggleLoading(true);
    $.ajax({
        url: "/showtimes/update-price",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ ids: selectedIds, price: price }),
        success: function(response) {
            console.log('response: ', response);
            $('#updatePriceModal').modal('hide');
            showSuccessToast('Cập nhật giá suất chiếu thành công');
            fetchShowtimes({condition: {
                    status: searchText,
                    branchId: branchId,
                    roomId: roomId === '-1' ? null : roomId,
                    movieId: movieId,
                    startTime: startDate,
                    endTime: endDate
                }, pageSize: currentPageSize, pageIndex: 1});
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error update price:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function formatTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

$(document).ready(function() {
    $('#button-addon22').on('click', function() {
        searchText = $('.form-control').val().trim();
        fetchShowtimes({condition: {
                status: searchText,
                branchId: branchId,
                roomId: roomId === '-1' ? null : roomId,
                movieId: movieId,
                startTime: startDate,
                endTime: endDate
            }, pageSize: currentPageSize, pageIndex: 1});
    });
    $('#btnCreate2').on('click', function() {
        setContentModal('add', updateShowtime);
    });

    $('#btnUpdatePrice').on('click', function () {
       showUpdatePriceModal();
    });

    $('#createSingleBtn').on('click', function () {
        addNewDateShowTime();
    });

    checkboxAll.on('change', function () {
        let checked = $(this).prop('checked');
        $('[id^="inlineCheckbox-"]').prop('checked', checked);
        selectedIds = [];
        if (checked) {
            $('[id^="inlineCheckbox-"]:checked').each(function() {
                let value = $(this).val();
                if (!isNaN(value)) {
                    selectedIds.push(value);
                }
            });
        }
        console.log('selectedIds ', selectedIds);
    });

    roomSelectModal.on('change', function () {
        fetchShowtimesToModal();
    });

    selectElement.on('change', function(){
        branchId = Number($(this).val());
        fetchShowtimes({
            condition:{
                status: searchText,
                branchId: branchId,
                roomId: roomId === '-1' ? null : roomId,
                movieId: $('#movieId').val(),
                startTime: startDate,
                endTime: endDate
            },
            pageSize: currentPageSize, pageIndex: 1});
    });

    roomSelect.on('change', function () {
       roomId = $(this).val();
    });

    $('#advanceSearch2').on('click', function(){
        startDate = $('#startDate1').val();
        endDate = $('#endDate1').val();
        startDate = startDate ? new Date(startDate).toISOString() : null;
        endDate = endDate ? new Date(endDate).toISOString() : null;
        console.log('searching...', startDate, endDate);
        fetchShowtimes({
            condition:{
                status: searchText,
                branchId: branchId,
                roomId: roomId === '-1' ? null : roomId,
                movieId: $('#movieId').val(),
                startTime: startDate,
                endTime: endDate
            },
            pageSize: currentPageSize, pageIndex: 1});
    });
});