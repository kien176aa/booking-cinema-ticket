let cachedMovies = [];
let branchesCache = [];
let branchId = -1;
let showtimesRes = [];
let seatTypes = [];
let selectShowtime = {};
let carouselContainer = $('#carousel-container');
let actorData = {}, roles = [];

$(document).ready(function () {
    fetchMovie();
    fetchBranches('');
    fetchRoles();
});

function fetchRoles() {
    toggleLoading(true);
    $.ajax({
        url: "/roles/get-active-role",
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            console.log('response: ', response);
            roles = response;
            fetchMoviePersons();
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function fetchMoviePersons() {
    toggleLoading(true);
    const url = window.location.pathname;
    const id = url.split('/').pop();
    $.ajax({
        url: `/movies/search-movie-person`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            condition: {
                movieId: Number(id),
            },
            pageIndex: 1,
            pageSize: 9999
        }),
        success: function(response) {
            console.log('response: ', response);
            actorData = response;
            carouselContainer.empty();
            let hasData = false;
            roles.forEach(function (item) {
                let arr = response[`${item.name}`];
                if(arr && arr.length > 0){
                    hasData = true;
                    renderCarousel(item.name, arr);
                }
            });
            if(!hasData){
                renderEmptyData('#carousel-container');
            }
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching :", error);
            toggleLoading(false);
        }
    });
}

function renderCarousel(roleName, actors) {
    const carouselId = `carousel-${roleName.replace(' ', '-').toLowerCase()}`;

    const carouselHTML = `
        <div class="divider text-start">
            <div style="font-weight: bold" class="divider-text">${roleName}</div>
        </div>
        <div id="${carouselId}" class="carousel carousel-dark slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-inner" id="carousel-inner-${carouselId}"></div>
            <a class="carousel-control-prev" href="#${carouselId}" role="button" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </a>
            <a class="carousel-control-next" href="#${carouselId}" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </a>
        </div>
    `;

    carouselContainer.append(carouselHTML);

    let currentIndex = 0;
    const chunkSize = 5;

    while (currentIndex < actors.length) {
        const chunk = actors.slice(currentIndex, currentIndex + chunkSize);
        renderCarouselItem(carouselId, chunk, currentIndex === 0);
        currentIndex += chunkSize;
    }
}

function renderCarouselItem(carouselId, actors, isActive) {
    const carouselItem = $('<div class="carousel-item"></div>');
    if (isActive) {
        carouselItem.addClass('active');
    }

    const row = $('<div class="d-flex justify-content-sm-evenly mt-3"></div>');

    actors.forEach(actor => {
        let roleIds = actor.roleArr.split(',').map(Number);
        let roleNames = roleIds.map(id => roles.find(role => role.roleId === id)?.name).filter(Boolean).join(',');
        const actorDiv = $('<div class="text-center" style="position:relative;"></div>');
        const img = $(`<img class="rounded-circle" src="${getImageUrl(actor.personImageUrl)}" 
                        type="button"
                        data-bs-toggle="popover"
                        data-bs-placement="top"
                        title="Tên: ${actor.personName}\nNhân vật: ${actor.characterName}\nVai trò: ${roleNames}"
                        alt="${actor.personName}" width="80" height="80">`);
        const name = $(`<div class="mt-2 text-truncate" style="max-width: 150px;" title="${actor.personName}">${actor.personName}</div>`);
        const character = $(`<div class="text-truncate" style="max-width: 150px;" title="${actor.characterName}">${actor.characterName}</div>`);

        actorDiv.append(img, name, character);
        row.append(actorDiv);

    });

    carouselItem.append(row);
    $(`#carousel-inner-${carouselId}`).append(carouselItem);
}

// ========== MOVIE ==========
function fetchMovie() {
    toggleLoading(true);
    $.ajax({
        url: '/home/get-top-movie',
        method: 'GET',
        success: function (data) {
            cachedMovies = data || [];
            renderMovieCarousel(cachedMovies);
        },
        complete: function () {
            toggleLoading(false);
        }
    });
}

function renderMovieCarousel(data) {
    if (!data || data.length === 0) return;

    let chunkSize = 5;
    let html = '';

    for (let i = 0; i < data.length; i += chunkSize) {
        let chunk = data.slice(i, i + chunkSize);
        html += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <div class="row justify-content-center">
        `;
        chunk.forEach((movie, index) => {
            html += `
                <div class="col-md-2 movie-card position-relative" data-movie-id="${movie.movieId}">
                    <div class="movie-rank">${i + index + 1}</div>
                    <div class="image-wrapper position-relative">
                        <img class="img-fluid movie-img" src="${movie.posterUrl || commonDefaultImgUrl}" alt="${movie.title}">
                        <button data-movie-id="${movie.movieId}" class="play-icon" 
                            data-bs-toggle="modal" data-bs-target="#trailerModal" data-video="${movie.trailerUrl || ''}">
                            <i class="ri-play-circle-line"></i>
                        </button>
                    </div>
                    <a href="/movie/${movie.movieId}" style="text-decoration: none;">
                        <h5 class="mt-2 text-white" title="${movie.title}">
                            ${truncateText(movie.title, 20)}
                        </h5>
                    </a>
                    <p class="text-white" title="${movie.genre}">${truncateText(movie.genre, 15)}</p>
                    <small class="text-warning">⭐ ${movie.rating != null ? movie.rating : 0}</small>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    $('#movieCarousel .carousel-inner').html(html);
}

// ========== BRANCHES ==========
function fetchBranches(query) {
    toggleLoading(true);
    $.get(`/branches/search?name=${query}`, function (branches) {
        branchesCache = branches;
        renderBranchList(branches);
        if (branches.length > 0) {
            branchId = branches[0]?.branchId;
            $('#branchAddress').text(`${branches[0].name} - ${branches[0].address}`);
            selectBranch();
            fetchSeatTypes();
        }
    }).always(() => toggleLoading(false));
}

function renderBranchList(branches) {
    let html = `
        <button class="btn btn-outline-secondary dropdown-toggle movie-schedule__location-btn" type="button" data-bs-toggle="dropdown">
          <i class="fas fa-map-marker-alt me-1"></i> <span id="currentBranchName">${branches[0]?.name}</span>
        </button><ul class="dropdown-menu">`;
    branches.forEach(branch => {
        html += `<li><a class="dropdown-item branch__item" data-branchid="${branch.branchId}">${branch.name}</a></li>`;
    });
    html += `</ul>`;

    $('#branchDropdown').html(html);

    $('.branch__item').off('click').on('click', function () {
       branchId = Number($(this).data('branchid'));
       let b = branchesCache.find(item => item.branchId == branchId);
       $('#currentBranchName').text($(this).text());
       $('#branchAddress').text(`${b.name} - ${b.address}`);
    });
}

// ========== SHOWTIMES ==========

function getShowtimeById(id) {
    toggleLoading(true);
    $.get(`/showtimes/${id}`, function (response) {
        selectShowtime = response;
        showSeatModal();
    }).always(() => toggleLoading(false));
}

function loadShowtimes(date) {
    let formattedDate = null;
    console.log('aa ', date, formattedDate);
    if(date){
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
    }
    toggleLoading(true);
    $.get('/home/get-showtimes-by-date', { date: formattedDate, branchId: branchId }, function (showtimes) {
        let html = '';

        if (showtimes.length === 0) {
            html = `
            <div class="text-center text-muted py-5">
                <i class="ri-archive-2-line" style="font-size: 2rem;"></i>
                <p class="mt-2 mb-0">Không có dữ liệu</p>
            </div>`;
            showtimesRes = [];
        } else {
            let grouped = {};
            showtimesRes = showtimes;
            showtimes.forEach(s => {
                if (!grouped[s.movieTitle]) {
                    grouped[s.movieTitle] = {
                        movieTitle: s.movieTitle,
                        branchName: s.branchName,
                        roomName: s.roomName,
                        posterUrl: s.moviePosterUrl,
                        showtimes: []
                    };
                }
                grouped[s.movieTitle].showtimes.push(s);
            });

            Object.values(grouped).forEach(group => {
    //             html += `
    // <div class="d-flex mb-4 showtime-block">
    //     <img src="${group.posterUrl || commonDefaultImgUrl}"
    //         class="me-3 rounded" width="100" height="160" alt="Poster">
    //     <div>
    //         <h5>${group.movieTitle}</h5>`;

                // Nhóm các showtimes theo roomName
                const showtimesByRoom = {};
                group.showtimes.forEach(s => {
                    if (!showtimesByRoom[s.roomName]) {
                        showtimesByRoom[s.roomName] = [];
                    }
                    showtimesByRoom[s.roomName].push(s);
                });

                // html += `<div class="d-flex flex-wrap gap-3">`;

                // Duyệt qua từng roomName và render các showtimes tương ứng
                Object.entries(showtimesByRoom).forEach(([roomName, showtimes]) => {
                    let bName = '', bAddress = '', roomType = '';
                    if(showtimes[0]){
                        bName = showtimes[0].branchName;
                        bAddress = showtimes[0].branchAddress;
                        roomType = showtimes[0].roomRoomType;
                        console.log(bName, bAddress);
                    }
                    html += `
                    <div class="movie-schedule__cinema-item">
                    <div class="movie-schedule__showtime-category">${roomName} - ${roomType}</div>
                    <div>`;

                    showtimes.forEach(s => {
                        html += `
                            <span data-showtime-id="${s.showtimeId}" class="movie-schedule__showtime-btn">
                            <i class="far fa-clock me-1"></i>${formatTime(s.startTime)} ~ ${formatTime(s.endTime)}</span>`;
                    });

                    html += `</div></div>`;
                });

                // html += `</div></div></div>`;
            });

        }

        $('#showtime-container').html(html);
        $('.movie-schedule__showtime-btn').off('click').on('click', function () {
            let id = $(this).data('showtime-id');
            getShowtimeById(id);
        })
    }).always(() => toggleLoading(false));
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
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

// ========== EVENTS ==========

// Play trailer
$(document).on('click', '.play-icon', function () {
    const movieId = $(this).data('movie-id');
    const movie = cachedMovies.find(m => m.movieId == movieId);
    if (movie) {
        $('#trailerModal iframe').attr('src', movie.trailerUrl || "https://www.youtube.com/embed/2LqzF5WauAw");
        $('#trailerModal img').attr('src', movie.posterUrl || commonDefaultImgUrl);
        $('#trailerModal h5').text(movie.title);
        $('#trailerModal small')
            .text(truncateText(movie.genre, 100))
            .attr('title', movie.genre)
            .tooltip({ placement: 'top' });
        $('#trailerModal .small').text(movie.description || 'Không có mô tả cho phim này.');
    }
});

// ========== UTILS ==========
function selectBranch() {
    loadShowtimes(activeDate);
    fetchSeatTypes();
}

function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function formatTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Hàm xử lý rạp gần bạn
function fetchNearbyBranches() {
    if (navigator.geolocation) {
        toggleLoading(true);
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Sử dụng cache branches đã có tọa độ
            if (branchesCache.length > 0) {
                const updatedCinemas = branchesCache.map(cinema => {
                    // Tính khoảng cách giữa vị trí người dùng và tọa độ của rạp trong cache
                    const distance = haversineDistance(userLat, userLon, cinema.lat, cinema.lng); // Sửa lại dùng lng thay vì lon
                    return { ...cinema, distance };
                });

                // Sắp xếp các rạp theo khoảng cách gần nhất
                updatedCinemas.sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                });

                renderNearbyList(updatedCinemas);
                toggleLoading(false);
            } else {
                alert('Không có dữ liệu về các rạp. Vui lòng thử lại sau!');
                toggleLoading(false);
            }
        }, () => {
            toggleLoading(false);
            alert('Không thể lấy vị trí của bạn.');
        });
    } else {
        alert('Trình duyệt không hỗ trợ GPS');
    }
}

// Hàm tính khoảng cách giữa 2 điểm theo latitude và longitude (sử dụng Haversine formula)
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // bán kính trái đất (km)
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // khoảng cách km
}

// Hàm chuyển đổi độ sang radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Render danh sách rạp gần nhất
function renderNearbyList(cinemas) {
    let html = `
        <button class="btn btn-outline-secondary dropdown-toggle movie-schedule__location-btn" type="button" data-bs-toggle="dropdown">
          <i class="fas fa-map-marker-alt me-1"></i> 
          <span id="currentBranchName">${cinemas[0]?.name}
          ${cinemas[0].distance === null ? 'Không rõ' : `[${cinemas[0].distance.toFixed(2)} km]`}
          </span>
        </button><ul class="dropdown-menu">`;
    cinemas.forEach(c => {
        const distanceText = c.distance === null ? 'Không rõ' : `[${c.distance.toFixed(2)} km]`;
        html += `
            <li><a class="dropdown-item branch__item" data-branchid="${c.branchId}">${c.name} ${distanceText}</a></li>`;
    });
    html += `</ul>`;

    $('#branchDropdown').html(html);

    $('.branch__item').off('click').on('click', function () {
        branchId = Number($(this).data('branchid'));
        let b = branchesCache.find(item => item.branchId == branchId);
        $('#currentBranchName').text($(this).text());
        $('#branchAddress').text(`${b.name} - ${b.address}`);
        selectBranch();
    });

}

$('#btn-nearby').on('click', function () {
    fetchNearbyBranches();
});
