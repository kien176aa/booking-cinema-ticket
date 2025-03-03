let searchText = '', branchId = null, currentPageIndex = 1, currentPageSize = 7;
let roles = [], branches = [];
const btnCheckbox = $('#defaultCheck1');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputDescription = $('#description');
const modalDialog = $('#largeModal');
let selectElement = $("#exampleFormControlSelect1");
function fetchRoles(req) {
    toggleLoading(true);
    $.ajax({
        url: "/roles/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            roles = response.data;
            currentPageIndex = response.pageIndex;
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="3" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#role-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}
fetchRoles({condition: searchText, pageSize: currentPageSize, pageIndex: 1});

function changePageIndex(totalRecords, newPage, pageSize){
    fetchRoles({condition: searchText, pageSize: pageSize, pageIndex: newPage});
}

function renderTableRow(item) {
    return `
        <tr id="role-tr-${item.roleId}">
            <td>
                <span>${item.name}</span>
            </td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Sử dụng' : 'Dừng sử dụng'}
                </span>
            </td>
            <td title="${item.description}" 
                style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.description}</td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editRole, '${item.roleId}')">
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
        const item = roles.find(item => item.roleId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật vai trò');
        btnCheckbox.prop('checked', item.status);
        btnCheckbox.prop('disabled', false);
        inputBId.val(item.roleId);
        inputName.val(item.name);
        inputDescription.val(item.description);
    } else {
        $('#exampleModalLabel3').text('Tạo mới vai trò');
        btnCheckbox.prop('checked', true);
        btnCheckbox.prop('disabled', true);
        inputBId.val('');
        inputName.val('');
        inputDescription.val('');
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

function getRoleInfo(type){
    let isValid = hasValue('#nameLarge', 'Vai trò') && checkLength('#nameLarge', 'Vai trò', 0, 255);
    isValid = checkLength('#description', 'Mô tả', 0, 255) && isValid;
    if(isValid)
        return {
            roleId: type === 'edit' ? inputBId.val() : null,
            name: inputName.val(),
            description: inputDescription.val(),
            status: type === 'add' ? true : btnCheckbox.prop("checked")
        }
    return false;
}

function createRole(){
    toggleLoading(true);
    const req = getRoleInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: "/roles",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchRoles({
                condition: searchText,
                pageSize: currentPageSize, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editRole(){
    toggleLoading(true);
    const req = getRoleInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: `/roles/${req.roleId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchRoles({
                condition: searchText,
                pageSize: currentPageSize, pageIndex: 1});
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
        fetchRoles({
            condition: searchText,
            pageSize: currentPageSize, pageIndex: 1});
    });
    $('#btnCreate').on('click', function() {
        setContentModal('add', createRole);
    });
});