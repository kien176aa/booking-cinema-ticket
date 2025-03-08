let searchText = '', currentPageIndex = 1, currentPageSize = 7, videoUrl = null;
let dataArr = [];
const inputBId = $('#movieId');
const modalDialog = $('#largeModal');
const defaultImgUrl = '/assets/img/empty_img.jfif';

let inputTitle = $('#title');
let inputDescription = $('#description');
let inputDuration = $('#duration');
let inputGenre = $('#genre');
let inputReleaseDate = $('#releaseDate');
let inputCountry = $('#country');
let inputLanguage = $('#language');
let inputStatus = $('#status');
let inputPoster = $('#posterUrl');
let previewPoster = $('#previewPoster');
let inputTrailer = $('#trailerUrl');
let previewTrailer = $('#previewTrailer');
let vidContainer = $('#vid-container');

function fetchMovies(req) {
    toggleLoading(true);
    $.ajax({
        url: "/movies/search",
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
                                    <td colspan="7" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#movies-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching :", error);
            toggleLoading(false);
        }
    });
}

function changePageIndex(totalRecords, newPage, pageSize){
    fetchMovies({condition: searchText, pageSize: pageSize, pageIndex: newPage});
}

fetchMovies({condition: null, pageSize: currentPageSize, pageIndex: 1});
fetchCountries('#country');
fetchMovieGenres('#genre');
fetchLanguages('#language');

function renderTableRow(item) {
    return `
        <tr id="movie-tr-${item.movieId}">
            <td>
                ${item.title}
            </td>
            <td title="${item.genre}" style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.genre}</td>
            <td>${item.country}</td>
            <td>${item.duration}</td>
            <td>${formatDateWithoutHour(item.releaseDate)}</td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Đang chiếu' : 'Dừng chiếu'}
                </span>
            </td>
            <td>
               <div class="dropdown text-center">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="ri-more-2-line"></i>
                </button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" onclick="setContentModal('edit', editMovie, '${item.movieId}')"
                    ><i class="ri-pencil-line me-1"></i> Cập nhật</a
                  >
                  <a class="dropdown-item" href="/movie-detail/${item.movieId}"
                    ><i class="ri-information-line"></i> Chi tiết</a
                  >
                </div>
              </div>
            </td>
        </tr>
    `;
}

function setContentModal(modalType, callbackFunc, id) {
    if (modalType === 'edit') {
        const item = dataArr.find(item => item.movieId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật thông tin bộ phim');
        inputStatus.prop('checked', item.status);
        inputStatus.prop('disabled', false);
        vidContainer.empty();
        if(item.trailerUrl && item.trailerUrl.length > 0){
            videoUrl = item.trailerUrl;
            previewTrailer.hide();
            vidContainer.show();
            vidContainer.append(`
                <iframe src="${item.trailerUrl}" allowfullscreen></iframe>
            `);
        } else {
            videoUrl = null;
            previewTrailer.show();
            previewTrailer.attr('src', '');
            vidContainer.hide();
        }
        previewPoster.attr("src", item.posterUrl ? item.posterUrl : defaultImgUrl).show();
        inputTitle.val(item.title);
        inputBId.val(item.movieId);
        inputDescription.val(item.description);
        inputDuration.val(item.duration);
        // inputGenre.val(item.genre);
        if(item.genre) {
            console.log('update genres: ', item.genre);
            updateSelectedOptions('genre', 'Chọn thể loại', item.genre.split(',').map(g => ({
                value: g,
                label: g
            })), genreDatas);
        }
        inputReleaseDate.val(item.releaseDate);
        inputCountry.val(item.country);
        inputLanguage.val(item.language);
    } else {
        $('#exampleModalLabel3').text('Tạo mới phim');
        inputStatus.prop('checked', true);
        inputStatus.prop('disabled', true);
        previewPoster.attr("src", defaultImgUrl).show();
        inputTitle.val('');
        inputDescription.val('');
        inputDuration.val(1);
        // inputGenre.val('');
        updateSelectedOptions('genre', 'Chọn thể loại', [], genreDatas);
        inputReleaseDate.val('');
        // inputLanguage.val('');
        vidContainer.empty();
        previewTrailer.show();
        previewTrailer.attr('src', '');
        vidContainer.hide();
        videoUrl = null;
    }
    modalDialog.find('[id*="error"]').text('');
    inputPoster.val(null);
    inputTrailer.val(null);
    $('#largeModal #btnSave').off('click').on('click', function() {
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    if (modalType === 'edit')
        modalDialog.modal('show');
}

function getMovieInfo(type){
    let mGenres = getSelectedData('genre');
    console.log('aaa', mGenres);
    let isValid = hasValue('#title', 'Tiêu đề') && checkLength('#title', 'Tiêu đề', 0, 255);
    isValid = hasValue('#duration', 'Thời lượng') && isPositiveNumber('#duration', 'Thời lượng') && isValid;
    isValid = hasValue2('#genre', mGenres, 'Thể loại') && checkLength2('#genre', mGenres, 'Thể loại', 0, 500) && isValid;
    isValid = hasValue('#releaseDate', 'Ngày phát hành') && isValid;
    isValid = checkLength('#country', 'Quốc gia', 0, 255) && isValid;
    isValid = checkLength('#language', 'Ngôn ngữ', 0, 255) && isValid;
    // isValid = checkLength('#description', 'Mô tả', 0, 255) && isValid;
    if(isValid) {
        let fileInput = inputPoster[0].files[0];
        let video = inputTrailer[0].files[0];
        let formData = new FormData();
        if(type === 'edit')
            formData.append("movieId", inputBId.val());
        formData.append("title", inputTitle.val());
        formData.append("duration", inputDuration.val());
        formData.append("genre", mGenres.join(","));
        formData.append("releaseDate", inputReleaseDate.val());
        formData.append("country", inputCountry.val());
        formData.append("language", inputLanguage.val());
        formData.append("description", inputDescription.val());
        formData.append("status", type === 'add' ? true : inputStatus.prop("checked"));
        if (fileInput) {
            console.log('have image file', fileInput);
            formData.append("file", fileInput);
        }
        if (video) {
            console.log('have video file', video);
            formData.append("video", video);
        }
        return formData;
    }
    return false;
}

function createMovie(){
    toggleLoading(true);
    const req = getMovieInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }

    $.ajax({
        url: "/movies",
        type: "POST",
        processData: false,
        contentType: false,
        data: req,
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchMovies({ condition: searchText, pageSize: currentPageSize, pageIndex: 1 });
            if (response.videoId && response.videoId.length > 0) {
                checkJobLog(response.videoId)
                    .then(message => {
                        console.log("Job log success:", message);
                    })
                    .catch(error => {
                        console.error("Job log error:", error);
                    });
            }
        },
        error: function(error) {
            console.error("Error creating movie:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}
function checkJobLog(videoId) {
    return new Promise((resolve, reject) => {
        let interval = setInterval(function () {
            $.ajax({
                url: `/job-log?videoId=${videoId}`,
                type: "GET",
                success: function (logResponse) {
                    if (logResponse && logResponse.message) {
                        if(logResponse.isSuccess) {
                            showSuccessToast(logResponse.message);
                        }else{
                            showErrorToast(logResponse.message);
                        }
                        clearInterval(interval);
                        resolve(logResponse.message);
                    }
                },
                error: function (error) {
                    console.error("Error checking job log:", error);
                    clearInterval(interval);
                    reject("Error checking job log");
                }
            });
        }, 5000);
    });
}

function editMovie(){
    toggleLoading(true);
    const req = getMovieInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }

    $.ajax({
        url: `/movies/${inputBId.val()}`,
        type: "PUT",
        processData: false,
        contentType: false,
        data: req,
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchMovies({condition: searchText, pageSize: currentPageSize, pageIndex: currentPageIndex});
            if (response.videoId && response.videoId.length > 0) {
                checkJobLog(response.videoId)
                    .then(message => {
                        console.log("Job log success:", message);
                    })
                    .catch(error => {
                        console.error("Job log error:", error);
                    });
            }
        },
        error: function(error) {
            console.error("Error fetching movie:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

$(document).ready(function() {

    $('#button-addon2').on('click', function() {
        searchText = $('.form-control').val().trim();
        fetchMovies({condition: searchText, pageSize: currentPageSize, pageIndex: 1});
    });
    $('#btnCreate').on('click', function() {
        setContentModal('add', createMovie);
    });
    inputPoster.on('change', function (event) {
        let file = event.target.files[0];
        if (file) {
            const allowedTypes = ["image/png", "image/jpeg"];
            if (!allowedTypes.includes(file.type)) {
                $('#posterUrl-error').text("Chỉ chấp nhận file PNG hoặc JPG.");
                this.value = "";
            }
            let reader = new FileReader();
            reader.onload = function (e) {
                previewPoster.attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    inputTrailer.on('change', function (event) {
        let file = event.target.files[0];
        if (file) {
            previewTrailer.show();
            vidContainer.hide();
            let reader = new FileReader();
            reader.onload = function (e) {
                previewTrailer.attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        } else if(videoUrl) {
            previewTrailer.hide();
            vidContainer.show();
        }
    });
});
