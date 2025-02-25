function toggleLoading(isLoading) {
    if (isLoading) {
        if ($('.loading').length === 0) {
            $('body').append('<div class="loading">Loading&#8230;</div>');
        }
    } else {
        $('.loading').remove();
    }
}

function hasValue(id, fieldName) {
    let value = $(id).val().trim();
    let errorSpan = $(id + '-error');

    if (!value || value.length === 0) {
        errorSpan.text(fieldName + ' không được để trống').css('color', 'red');
        return false;
    } else {
        errorSpan.text('');
        return true;
    }
}