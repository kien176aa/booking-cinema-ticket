let searchText = '', currentPageIndex = 1;
let branches = [];
const btnCheckbox = $('#defaultCheck1');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputAddress = $('#address');
const inputEmail = $('#emailLarge');
const inputPhone = $('#phone');
const modalDialog = $('#largeModal');
function fetchBranches(req) {
    $.ajax({
        url: "/branches/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            branches = response.data;
            currentPageIndex = response.pageIndex;
            response.data.forEach(item => {
                tableBody.append(renderTableRow(item));
            });
            renderPagination(response, '#branches-pagination', changePageIndex);
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
        }
    });
}

function changePageIndex(totalRecords, newPage, pageSize){
    fetchBranches({condition: searchText, pageSize: pageSize, pageIndex: newPage});
}

fetchBranches({condition: null, pageSize: 10, pageIndex: 1});


function renderTableRow(item) {
    return `
        <tr id="branch-tr-${item.branchId}">
            <td>
                <i title="${item.address}" class="ri-information-line ri-22px"></i>
                <span>${item.name}</span>
            </td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Hoạt động' : 'Dừng hoạt động'}
                </span>
            </td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="ri-more-2-line"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="javascript:void(0);" onclick="setContentModal('edit', editBranch, '${item.branchId}')">
                            <i class="ri-pencil-line me-1"></i> Edit
                        </a>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="deleteItem('${item.branchId}')">
                            <i class="ri-delete-bin-6-line me-1"></i> Delete
                        </a>
                    </div>
                </div>
            </td>
        </tr>
    `;
}

function setContentModal(modalType, callbackFunc, id) {
    if (modalType === 'edit') {
        const item = branches.find(item => item.branchId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật chi nhánh');
        btnCheckbox.prop('checked', item.status);
        btnCheckbox.prop('disabled', false);

        inputBId.val(item.branchId);
        inputName.val(item.name);
        inputAddress.val(item.address);
        inputEmail.val(item.email);
        inputPhone.val(item.phone);
    } else {
        $('#exampleModalLabel3').text('Tạo mới chi nhánh');
        btnCheckbox.prop('checked', true);
        btnCheckbox.prop('disabled', true);
        inputBId.val('');
        inputName.val('');
        inputAddress.val('');
        inputEmail.val('');
        inputPhone.val('');
    }

    $('#largeModal .btn-primary').off('click').on('click', function() {
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    if (modalType === 'edit')
        modalDialog.modal('show');
}

function getBranchInfo(type){
    return {
        branchId: type === 'edit' ? inputBId.val() : null,
        name: inputName.val(),
        address: inputAddress.val(),
        email: inputEmail.val(),
        phone: inputPhone.val(),
        status: type === 'add' ? true : btnCheckbox.prop("checked")
    }
}

function createBranch(){
    const req = getBranchInfo('add');
    console.log('create', req);
    $.ajax({
        url: "/branches",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            fetchBranches({condition: searchText, pageSize: 10, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
        }
    });
}

function editBranch(){
    const req = getBranchInfo('edit');
    console.log('edit', req);
    $.ajax({
        url: `/branches/${req.branchId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            fetchBranches({condition: searchText, pageSize: 10, pageIndex: currentPageIndex});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
        }
    });
}
$(document).ready(function() {
    $('#button-addon2').on('click', function() {
        searchText = $('.form-control').val().trim();
        fetchBranches({condition: searchText, pageSize: 10, pageIndex: 1});
    });
    $('#create-branch').on('click', function() {
        setContentModal('add', createBranch);
    });
});