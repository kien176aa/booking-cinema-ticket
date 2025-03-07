let searchText = '', currentPageIndex = 1, currentPageSize = 7;
let branches = [];
const btnCheckbox = $('#defaultCheck1');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputRole = $('#role');
const inputEmail = $('#emailLarge');
const inputPhone = $('#phone');
const modalDialog = $('#largeModal');
function fetchAccounts(req) {
    toggleLoading(true);
    $.ajax({
        url: "/accounts/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            branches = response.data;
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
            renderPagination(response, '#accounts-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching account:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function changePageIndex(totalRecords, newPage, pageSize){
    fetchAccounts({condition: searchText, pageSize: pageSize, pageIndex: newPage});
}

fetchAccounts({condition: null, pageSize: currentPageSize, pageIndex: 1});


function renderTableRow(item) {
    return `
        <tr id="account-tr-${item.accountId}">
            <td>
                <span>${item.fullName}</span>
            </td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>${item.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</td>
            <td>
                <span class="badge rounded-pill ${item.active ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.active ? 'Hoạt động' : 'Dừng hoạt động'}
                </span>
            </td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editAccount, '${item.accountId}')">
                        <i class="ri-pencil-line me-1"></i> Cập nhật
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function setContentModal(modalType, callbackFunc, id) {
    if (modalType === 'edit') {
        const item = branches.find(item => item.accountId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật thông tin người dùng');
        btnCheckbox.prop('checked', item.status);
        btnCheckbox.prop('disabled', false);

        inputBId.val(item.accountId);
        inputName.val(item.fullName);
        inputRole.val(item.role);
        inputEmail.val(item.email);
        inputPhone.val(item.phone);
    } else {
        $('#exampleModalLabel3').text('Tạo mới người dùng');
        btnCheckbox.prop('checked', true);
        btnCheckbox.prop('disabled', true);
        inputBId.val('');
        inputName.val('');
        // inputRole.val('');
        inputEmail.val('');
        inputPhone.val('');
    }
    modalDialog.find('[id*="error"]').text('');

    $('#largeModal .btn-primary').off('click').on('click', function() {
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    if (modalType === 'edit')
        modalDialog.modal('show');
}

function getAccountInfo(type){
    let isValid = hasValue('#nameLarge', 'Họ và tên') && checkLength('#nameLarge', 'Họ và tên', 0, 255);
    // isValid = hasValue('#address', 'Địa chỉ') && checkLength('#address', 'Địa chỉ', 0, 255) && isValid;
    isValid = hasValue('#emailLarge', 'Email') && checkLength('#emailLarge', 'Email', 0, 255) && isValid;
    isValid = hasValue('#phone', 'Số điện thoại') && checkLength('#phone', 'Số điện thoại', 10, 11) && isValid;
    if(isValid)
        return {
            accountId: type === 'edit' ? inputBId.val() : null,
            fullName: inputName.val(),
            role: inputRole.val(),
            email: inputEmail.val(),
            phone: inputPhone.val(),
            active: type === 'add' ? true : btnCheckbox.prop("checked")
        }
    return false;
}

function createAccount(){
    toggleLoading(true);
    const req = getAccountInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: "/accounts",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchAccounts({condition: searchText, pageSize: currentPageSize, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editAccount(){
    toggleLoading(true);
    const req = getAccountInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: `/accounts/${req.accountId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchAccounts({condition: searchText, pageSize: currentPageSize, pageIndex: currentPageIndex});
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
        fetchAccounts({condition: searchText, pageSize: currentPageSize, pageIndex: 1});
    });
    $('#btnCreate').on('click', function() {
        setContentModal('add', createAccount);
    });
});