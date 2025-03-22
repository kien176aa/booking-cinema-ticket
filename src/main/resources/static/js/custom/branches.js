let searchText = '', currentPageIndex = 1, currentPageSize = 7;
let branches = [];
const btnCheckbox = $('#defaultCheck1');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputAddress = $('#address');
const inputEmail = $('#emailLarge');
const inputPhone = $('#phone');
const modalDialog = $('#largeModal');
function fetchBranches(req) {
    toggleLoading(true);
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
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="5" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#branches-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function changePageIndex(totalRecords, newPage, pageSize){
    fetchBranches({condition: searchText, pageSize: pageSize, pageIndex: newPage});
}

fetchBranches({condition: null, pageSize: currentPageSize, pageIndex: 1});


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
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editBranch, '${item.branchId}')">
                        <i class="ri-pencil-line me-1"></i> Cập nhật
                    </button>
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
        if(item.lat && item.lng){
            if (marker) marker.remove();
            marker = new mapboxgl.Marker()
                .setLngLat([item.lng, item.lat])
                .addTo(map);

            map.flyTo({
                center: [item.lng, item.lat],
                zoom: 14, // zoom level tùy chỉnh
                speed: 1.2 // tốc độ bay tới điểm
            });

            $('#lat').val(item.lat);
            $('#lng').val(item.lng);
        }


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
        $('#lat').val('');
        $('#lng').val('');
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

function getBranchInfo(type){
    let isValid = hasValue('#nameLarge', 'Tên chi nhánh') && checkLength('#nameLarge', 'Tên chi nhánh', 0, 255);
    isValid = hasValue('#address', 'Địa chỉ') && checkLength('#address', 'Địa chỉ', 0, 255) && isValid;
    isValid = hasValue('#emailLarge', 'Email') && checkLength('#emailLarge', 'Email', 0, 255) && isValid;
    isValid = hasValue('#phone', 'Số điện thoại') && checkLength('#phone', 'Số điện thoại', 10, 11) && isValid;
    if(isValid)
        return {
            branchId: type === 'edit' ? inputBId.val() : null,
            name: inputName.val(),
            address: inputAddress.val(),
            email: inputEmail.val(),
            phone: inputPhone.val(),
            lat: $('#lat').val(),
            lng: $('#lng').val(),
            status: type === 'add' ? true : btnCheckbox.prop("checked")
        }
    return false;
}

function createBranch(){
    toggleLoading(true);
    const req = getBranchInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: "/branches",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchBranches({condition: searchText, pageSize: currentPageSize, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error fetching branches:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editBranch(){
    toggleLoading(true);
    const req = getBranchInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: `/branches/${req.branchId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchBranches({condition: searchText, pageSize: currentPageSize, pageIndex: currentPageIndex});
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
        fetchBranches({condition: searchText, pageSize: currentPageSize, pageIndex: 1});
    });
    $('#create-branch').on('click', function() {
        setContentModal('add', createBranch);
    });
    $('#largeModal').on('shown.bs.modal', function () {
        map.resize();
    });
});