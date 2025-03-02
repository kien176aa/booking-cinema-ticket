let searchText = '', currentPageIndex = 1, currentPageSize = 7;
let dataArr = [];
const btnCheckbox = $('#defaultCheck1');
const inputBId = $('#bId');
const inputName = $('#nameLarge');
const inputImg = $('#foodImg');
const defaultImg = $('#oldImg');
const previewImg = $("#preview");
const inputPrice = $('#price');
const inputQuantity = $('#quantity');
const modalDialog = $('#largeModal');
const defaultImgUrl = '/assets/img/empty_img.jfif';
function fetchFoods(req) {
    toggleLoading(true);
    $.ajax({
        url: "/foods/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            dataArr = response.data;
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
            renderPagination(response, '#foods-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching :", error);
            toggleLoading(false);
        }
    });
}

function changePageIndex(totalRecords, newPage, pageSize){
    fetchFoods({condition: searchText, pageSize: pageSize, pageIndex: newPage});
}

fetchFoods({condition: null, pageSize: currentPageSize, pageIndex: 1});


function renderTableRow(item) {
    return `
        <tr id="food-tr-${item.foodId}">
            <td>
                <img src="${(!item.image || item.image.trim().length === 0) ? defaultImgUrl : item.image }" alt class="w-px-50 h-auto rounded" />
            </td>
            <td>${item.foodName}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Đang bán' : 'Dừng bán'}
                </span>
            </td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editFood, '${item.foodId}')">
                        <i class="ri-pencil-line me-1"></i> Cập nhật
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function setContentModal(modalType, callbackFunc, id) {
    if (modalType === 'edit') {
        const item = dataArr.find(item => item.foodId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật thông tin đồ ăn/uống');
        btnCheckbox.prop('checked', item.status);
        btnCheckbox.prop('disabled', false);

        inputBId.val(item.foodId);
        inputName.val(item.foodName);
        defaultImg.val(item.image ? item.image : defaultImgUrl);
        inputPrice.val(item.price);
        inputQuantity.val(item.quantity);
        previewImg.attr("src", item.image ? item.image : defaultImgUrl).show();
    } else {
        $('#exampleModalLabel3').text('Tạo mới đồ ăn/uống');
        btnCheckbox.prop('checked', true);
        btnCheckbox.prop('disabled', true);
        inputBId.val('');
        inputName.val('');
        defaultImg.val(defaultImgUrl);
        inputPrice.val('');
        inputQuantity.val('');
        previewImg.attr("src", defaultImg.val()).show();
    }
    modalDialog.find('[id*="error"]').text('');
    inputImg.val(null);
    $('#largeModal .btn-primary').off('click').on('click', function() {
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    if (modalType === 'edit')
        modalDialog.modal('show');
}

function getFoodInfo(type){
    let isValid = hasValue('#nameLarge', 'Tên đồ ăn/uống') && checkLength('#nameLarge', 'Tên đồ ăn/uống', 0, 255);
    isValid = hasValue('#price', 'Giá đồ ăn/uống') && isPositiveNumber('#price', 'Giá đồ ăn/uống') && isValid;
    isValid = hasValue('#quantity', 'Số lượng') && isPositiveNumber('#quantity', 'Số lượng') && isValid;
    if(isValid) {
        let fileInput = inputImg[0].files[0];
        let formData = new FormData();
        if(type === 'edit')
            formData.append("foodId", inputBId.val());
        formData.append("foodName", inputName.val());
        formData.append("price", inputPrice.val());
        formData.append("quantity", inputQuantity.val());
        formData.append("status", type === 'add' ? true : btnCheckbox.prop("checked"));
        if (fileInput) {
            console.log('have image file', fileInput);
            formData.append("file", fileInput);
        }
        return formData;
    }
    return false;
}

function createFood(){
    toggleLoading(true);
    const req = getFoodInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }

    $.ajax({
        url: "/foods",
        type: "POST",
        processData: false,
        contentType: false,
        data: req,
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchFoods({ condition: searchText, pageSize: currentPageSize, pageIndex: 1 });
        },
        error: function(error) {
            console.error("Error creating food:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editFood(){
    toggleLoading(true);
    const req = getFoodInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }

    $.ajax({
        url: `/foods/${inputBId.val()}`,
        type: "PUT",
        processData: false,
        contentType: false,
        data: req,
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchFoods({condition: searchText, pageSize: currentPageSize, pageIndex: currentPageIndex});
        },
        error: function(error) {
            console.error("Error fetching food:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}
$(document).ready(function() {
    $('#button-addon2').on('click', function() {
        searchText = $('.form-control').val().trim();
        fetchFoods({condition: searchText, pageSize: currentPageSize, pageIndex: 1});
    });
    $('#create-branch').on('click', function() {
        setContentModal('add', createFood);
    });
    $("#foodImg").change(function(event) {
        let file = event.target.files[0];

        if (file) {
            let fileType = file.type;
            let validImageTypes = ["image/jpeg", "image/png"];

            if (!validImageTypes.includes(fileType)) {
                $("#foodImg-error").text("Chỉ chấp nhận định dạng ảnh JPG, PNG!");
                $("#preview").attr("src", defaultImg.val()).show();
                return;
            }

            let reader = new FileReader();
            reader.onload = function(e) {
                $("#preview").attr("src", e.target.result).show();
                $("#foodImg-error").text("");
            };
            reader.readAsDataURL(file);
        } else {
            $("#preview").attr("src", defaultImg.val()).show();
        }
    });
});