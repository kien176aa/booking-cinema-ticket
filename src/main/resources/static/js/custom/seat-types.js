let searchText = '', branchId = null, currentPageIndex = 1, currentPageSize = 7;
let seatTypes = [], branches = [];
const btnCheckbox = $('#defaultCheck1');
const checkboxIsDefault = $('#defaultCheck2');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputPrice = $('#price');
const inputColor = $('#color');
const modalDialog = $('#largeModal');
let selectElement = $("#exampleFormControlSelect1");
function fetchSeatTypes(req) {
    toggleLoading(true);
    $.ajax({
        url: "/seat-types/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            seatTypes = response.data;
            currentPageIndex = response.pageIndex;
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="6" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#seat-type-pagination', changePageIndex);
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
            fetchSeatTypes({
                condition:{
                    name: searchText,
                    branchId: branchId
                },
                pageSize: currentPageSize, pageIndex: 1});
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
    fetchSeatTypes({condition: {
            name: searchText,
            branchId: branchId
        }, pageSize: pageSize, pageIndex: newPage});
}

function renderTableRow(item) {
    return `
        <tr id="seat-type-tr-${item.seatTypeId}">
            <td>
                <span>${item.typeName}</span>
            </td>
            <td>
                <div class="rounded" style="width: 20px; height: 20px; background-color: ${item.color}"></div>
            </td>
            <td>${item.price}</td>
            <td>${item.isDefault ? 'Có' : 'Không'}</td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Sử dụng' : 'Dừng sử dụng'}
                </span>
            </td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editSeatType, '${item.seatTypeId}')">
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
        const item = seatTypes.find(item => item.seatTypeId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật loại ghế - Chi nhánh: ' + getBranchName(branchId));
        btnCheckbox.prop('checked', item.status);
        btnCheckbox.prop('disabled', false);

        inputBId.val(item.seatTypeId);
        inputName.val(item.typeName);
        inputPrice.val(item.price);
        inputColor.val(item.color);
        checkboxIsDefault.prop('checked', item.isDefault);
    } else {
        $('#exampleModalLabel3').text('Tạo mới loại ghế - Chi nhánh: ' + getBranchName(branchId));
        btnCheckbox.prop('checked', true);
        btnCheckbox.prop('disabled', true);
        inputBId.val('');
        inputName.val('');
        inputPrice.val('');
        inputColor.val('');
        checkboxIsDefault.prop('checked', false);
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

function getSeatTypeInfo(type){
    let isValid = hasValue('#nameLarge', 'Tên loại ghế');
    isValid = hasValue('#price', 'Giá ghế') && isPositiveNumber('#price', 'Giá ghế') && isValid;
    isValid = blockColor('#color') && isValid;
    if(isValid)
        return {
            seatTypeId: type === 'edit' ? inputBId.val() : null,
            typeName: inputName.val(),
            price: inputPrice.val(),
            color: inputColor.val(),
            isDefault: checkboxIsDefault.prop("checked"),
            status: type === 'add' ? true : btnCheckbox.prop("checked"),
            branchBranchId: branchId
        }
    return false;
}

function createSeatType(){
    toggleLoading(true);
    const req = getSeatTypeInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: "/seat-types",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchSeatTypes({
                condition:{
                    name: searchText,
                    branchId: branchId
                },
                pageSize: currentPageSize, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editSeatType(){
    toggleLoading(true);
    const req = getSeatTypeInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: `/seat-types/${req.seatTypeId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchSeatTypes({
                condition:{
                    name: searchText,
                    branchId: branchId
                },
                pageSize: currentPageSize, pageIndex: currentPageIndex});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}
$(document).ready(function() {
    $('#button-addon2').on('click', function() {
        searchText = $('.form-control').val().trim();
        fetchSeatTypes({
            condition:{
                name: searchText,
                branchId: branchId
            },
            pageSize: currentPageSize, pageIndex: 1});
    });
    $('#create-seat-type').on('click', function() {
        setContentModal('add', createSeatType);
    });

    selectElement.on('change', function(){
        branchId = Number($(this).val());
        fetchSeatTypes({
            condition:{
                name: searchText,
                branchId: branchId
            },
            pageSize: currentPageSize, pageIndex: 1});
    });
});