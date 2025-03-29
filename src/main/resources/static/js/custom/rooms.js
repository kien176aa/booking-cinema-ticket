let searchText = '', branchId = null, currentPageIndex = 1, currentPageSize = 7;
let rooms = [], branches = [], seatTypes = [], seats = [];
const btnCheckbox = $('#defaultCheck1');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputRoomType = $('#roomType');
const modalDialog = $('#largeModal');
let selectElement = $("#exampleFormControlSelect1");
let selectSeatType = $("#seatType");
let listSeatType = $("#list-seat-type");
function fetchRooms(req) {
    toggleLoading(true);
    $.ajax({
        url: "/rooms/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            rooms = response.data;
            currentPageIndex = response.pageIndex;
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="5" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#rooms-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function fetchSeatTypes() {
    toggleLoading(true);
    $.ajax({
        url: "/seat-types/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: {
                branchId: branchId,
                status: true
            }, pageSize: 9999, pageIndex: 1 }),
        success: function(response) {
            console.log('response: ', response);
            seatTypes = response.data;
            selectSeatType.empty();
            listSeatType.empty();
            listSeatType.append(`
                <div class="d-flex align-items-center mb-2">
                    <div class="rounded me-2" style="width: 20px; height: 20px; background-color: black;"></div>
                    <span class="text-dark">Không có ghế</span>
                </div>
            `);
            seatTypes.forEach((seatType, idx) => {
                let option = `<option value="${seatType.color}" ${seatType.isDefault ? 'selected="selected"' : ''}>${seatType.typeName}</option>`;
                selectSeatType.append(option);
                listSeatType.append(`
                    <div class="d-flex align-items-center mb-2">
                        <div class="rounded me-2" style="width: 20px; height: 20px; background-color: ${seatType.color};"></div>
                        <span class="text-dark">${seatType.typeName}</span>
                    </div>
                `);
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
            fetchRooms({
                condition:{
                    name: searchText,
                    branchId: branchId
                },
                pageSize: currentPageSize, pageIndex: 1});
            fetchSeatTypes();
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
    fetchRooms({condition: {
            name: searchText,
            branchId: branchId
        }, pageSize: pageSize, pageIndex: newPage});
}

function renderTableRow(item) {
    return `
        <tr id="room-tr-${item.roomId}">
            <td>
                <span>${item.name}</span>
            </td>
            <td>${item.capacity}</td>
            <td>${item.roomType}</td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Hoạt động' : 'Dừng hoạt động'}
                </span>
            </td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editRoom, '${item.roomId}')">
                        <i class="ri-pencil-line me-1"></i> Cập nhật
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function getBranchName(id){
    return branches.find(item => item.branchId === id)?.name;
}

function setContentModal(modalType, callbackFunc, id) {
    if (modalType === 'edit') {
        const item = rooms.find(item => item.roomId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật phòng chiếu - Chi nhánh: ' + getBranchName(branchId));
        btnCheckbox.prop('checked', item.status);
        btnCheckbox.prop('disabled', false);

        inputBId.val(item.roomId);
        numRowsInput.value = item.rowNums;
        numColsInput.value = item.colNums;
        inputName.val(item.name);
        inputRoomType.val(item.roomType);
        generateSeats(JSON.parse(item.seatMap));
    } else {
        $('#exampleModalLabel3').text('Tạo mới phòng chiếu - Chi nhánh: ' + getBranchName(branchId));
        btnCheckbox.prop('checked', true);
        btnCheckbox.prop('disabled', true);
        inputBId.val('');
        inputName.val('');
        numRowsInput.value = 6;
        numColsInput.value = 8;
        generateSeats(null);
    }
    modalDialog.find('[id*="error"]').text('');

    $('#largeModal #btnSave').off('click').on('click', function() {
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    if (modalType === 'edit')
        modalDialog.modal('show');
}

function getRoomInfo(type){
    let isValid = hasValue('#nameLarge', 'Tên phòng chiếu') && checkLength('#nameLarge', 'Tên phòng chiếu', 0, 255);
    let seatMap = getSeatMap();
    if(isValid)
        return {
            roomId: type === 'edit' ? inputBId.val() : null,
            name: inputName.val(),
            roomType: inputRoomType.val(),
            status: type === 'add' ? true : btnCheckbox.prop("checked"),
            branchBranchId: branchId,
            rowNums: numRowsInput.value,
            colNums: numColsInput.value,
            seatMap: JSON.stringify(seatMap),
            capacity: seatMap.length
        }
    return false;
}

function createBranch(){
    toggleLoading(true);
    const req = getRoomInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: "/rooms",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchRooms({condition: {
                    name: searchText,
                    branchId: branchId
                }, pageSize: currentPageSize, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editRoom(){
    toggleLoading(true);
    const req = getRoomInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: `/rooms/${req.roomId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchRooms({condition: {
                    name: searchText,
                    branchId: branchId
                }, pageSize: currentPageSize, pageIndex: currentPageIndex});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

let scale = 1;
const minScale = 0.3;
const maxScale = 1.25;
$(document).ready(function() {
    $('#button-addon2').on('click', function() {
        searchText = $('.form-control').val().trim();
        fetchRooms({
            condition:{
                name: searchText,
                branchId: branchId
            },
            pageSize: currentPageSize, pageIndex: 1});
    });
    $('#create-room').on('click', function() {
        setContentModal('add', createBranch);
    });

    selectElement.on('change', function(){
       branchId = Number($(this).val());
        fetchRooms({
            condition:{
                name: searchText,
                branchId: branchId
            },
            pageSize: currentPageSize, pageIndex: 1});
        fetchSeatTypes();
    });


    $("#seatMap").on("wheel", function (event) {
        if (event.shiftKey) { // Chỉ zoom nếu giữ Shift
            event.preventDefault(); // Ngăn chặn cuộn ngang/dọc mặc định

            if (event.originalEvent.deltaY < 0) {
                // Cuộn lên => Zoom in
                scale = Math.min(scale + 0.1, maxScale);
            } else {
                // Cuộn xuống => Zoom out
                scale = Math.max(scale - 0.1, minScale);
            }

            $(this).css("transform", `scale(${scale})`);
        }
    });
});
