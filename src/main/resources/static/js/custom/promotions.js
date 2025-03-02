let searchText = '', branchId = null, startDate = null, endDate = null, currentPageIndex = 1, currentPageSize = 7;
let promotions = [], branches = [], seatTypes = [], seats = [];
let selectElement = $("#exampleFormControlSelect1");
let inputPromotionId = $("#promotionId");
let inputTitle = $("#title");
let inputDescription = $("#description");
let inputDiscountAmount = $("#discountAmount");
let inputDiscountPercent = $("#discountPercent");
let inputStartDate = $("#startDate");
let inputEndDate = $("#endDate");
let inputMinPurchase = $("#minPurchase");
// let inputMaxDiscount = $("#maxDiscount");
let inputNumberOfItems = $("#numberOfItems");
let inputStatus = $("#status");
const modalDialog = $('#largeModal');

function fetchPromotions(req) {
    toggleLoading(true);
    $.ajax({
        url: "/promotions/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            promotions = response.data;
            currentPageIndex = response.pageIndex;
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="7" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#promotion-pagination', changePageIndex);
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
            fetchPromotions({
                condition:{
                    name: searchText,
                    branchId: branchId
                },
                pageSize: currentPageSize, pageIndex: 1});
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching promotions:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

fetchBranches();

function changePageIndex(totalRecords, newPage, pageSize){
    fetchPromotions({condition: {
            name: searchText,
            branchId: branchId,
            startDate: startDate,
            endDate: endDate
        }, pageSize: pageSize, pageIndex: newPage});
}

function renderTableRow(item) {
    return `
        <tr id="promotion-tr-${item.promotionId}">
            <td>
                <span>${item.title}</span>
            </td>
            <td>${item.discountAmount || item.discountPercent + '%'}</td>
            <td>${item.minPurchase}</td>
            <td>${formatDate(item.startDate)}</td>
            <td>${formatDate(item.endDate)}</td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Sử dụng' : 'Dừng sử dụng'}
                </span>
            </td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editPromotion, '${item.promotionId}')">
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
        const item = promotions.find(item => item.promotionId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật thông tin khuyến mãi - Chi nhánh: ' + getBranchName(branchId));
        inputStatus.prop('checked', item.status);
        inputStatus.prop('disabled', false);

        inputPromotionId.val(item.promotionId);
        inputTitle.val(item.title);
        inputDescription.val(item.description);
        inputDiscountPercent.val(item.discountPercent);
        inputDiscountAmount.val(item.discountAmount);
        inputStartDate.val(item.startDate);
        inputEndDate.val(item.endDate);
        inputMinPurchase.val(item.minPurchase);
        // inputMaxDiscount.val(item.maxDiscount);
        inputNumberOfItems.val(item.numberOfItems);
    } else {
        $('#exampleModalLabel3').text('Tạo mới khuyến mãi - Chi nhánh: ' + getBranchName(branchId));
        inputStatus.prop('checked', true);
        inputStatus.prop('disabled', true);
        inputPromotionId.val(null);
        inputTitle.val('');
        inputDescription.val('');
        inputDiscountPercent.val('');
        inputDiscountAmount.val('');
        inputStartDate.val(new Date());
        inputEndDate.val(new Date());
        inputMinPurchase.val('');
        // inputMaxDiscount.val('');
        inputNumberOfItems.val(10);
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

function getPromotionInfo(type) {
    let isValid = hasValue('#title', 'Tiêu đề khuyến mãi') &&
        checkLength('#title', 'Tiêu đề khuyến mãi', 1, 255);
    isValid = checkNeedOneOfTwo('#discountAmount', '#discountPercent', 'Số tiền giảm', 'Phần trăm giảm') && isValid;
    isValid = hasValue('#startDate', 'Ngày bắt đầu') && hasValue('#endDate', 'Ngày kết thúc')
        && checkValidStartAndEndDate('#startDate', '#endDate', 'Ngày bắt đầu', 'Ngày kết thúc') && isValid;
    isValid = hasValue('#minPurchase', 'Giá trị đơn hàng tối thiểu') && isValid;
    isValid = isPositiveNumber('#numberOfItems', 'Số lượng vé áp dụng') && isValid;
    isValid = checkLength('#description', 'Mô tả', 0, 255) && isValid;

    if (isValid) {
        return {
            promotionId: type === 'edit' ? inputPromotionId.val() : null,
            title: inputTitle.val(),
            description: inputDescription.val(),
            discountAmount: parseFloat(inputDiscountAmount.val()) || null,
            discountPercent: parseFloat(inputDiscountPercent.val()) || null,
            startDate: inputStartDate.val(),
            endDate: inputEndDate.val(),
            minPurchase: parseFloat(inputMinPurchase.val()) || null,
            // maxDiscount: parseFloat(inputMaxDiscount.val()) || 0,
            numberOfItems: parseInt(inputNumberOfItems.val()) || null,
            status: inputStatus.is(":checked"),
            branchBranchId: branchId
        };
    }
    return false;
}


function createPromotion(){
    toggleLoading(true);
    const req = getPromotionInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: "/promotions",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchPromotions({condition: {
                    name: searchText,
                    branchId: branchId,
                    startDate: startDate,
                    endDate: endDate
                }, pageSize: currentPageSize, pageIndex: 1});
        },
        error: function(error) {
            console.error("Error fetching promotions:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editPromotion(){
    toggleLoading(true);
    const req = getPromotionInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    $.ajax({
        url: `/promotions/${req.promotionId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchPromotions({condition: {
                    name: searchText,
                    branchId: branchId,
                    startDate: startDate,
                    endDate: endDate
                }, pageSize: currentPageSize, pageIndex: currentPageIndex});
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
        fetchPromotions({
            condition:{
                name: searchText,
                branchId: branchId,
                startDate: startDate,
                endDate: endDate
            },
            pageSize: currentPageSize, pageIndex: 1});
    });
    $('#btnCreate').on('click', function() {
        setContentModal('add', createPromotion);
    });

    selectElement.on('change', function(){
        branchId = Number($(this).val());
        fetchPromotions({
            condition:{
                name: searchText,
                branchId: branchId,
                startDate: startDate,
                endDate: endDate
            },
            pageSize: currentPageSize, pageIndex: 1});
    });

    $('#advanceSearch').on('click', function(){
        startDate = $('#startDate1').val();
        endDate = $('#endDate1').val();
        startDate = startDate ? new Date(startDate).toISOString() : null;
        endDate = endDate ? new Date(endDate).toISOString() : null;
        console.log('searching...', startDate, endDate);
        fetchPromotions({
            condition:{
                name: searchText,
                branchId: branchId,
                startDate: startDate,
                endDate: endDate
            },
            pageSize: currentPageSize, pageIndex: 1});
    });
});