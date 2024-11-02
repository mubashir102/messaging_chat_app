// Reusable functions for the messenger

// On document Load
$(document).ready(function () {
    // Image Preview
    $("#select_file").change(function () {
        imagePreview(this, ".profile-image-preview");
    });

    // Search Users or search action on keyup
    const debounceSearch = debounce(function () {
        const value = $(".user_search").val();
        searchUsers(value);
    }, 500);
    $(".user_search").on("keyup", function () {
        let query = $(this).val();
        // searchUsers(query);
        if (query.length >= 1) {
            debounceSearch();
        }
    });

    // search pagination
    actionOnScroll(".user_search_list_result", function () {
        let value = $(".user_search").val();
        searchUsers(value);
    });
});

// Image Preview Function
// Dependencies: jQuery, bootstrap
function imagePreview(input, selector) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(selector).attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Search User Functionality
let searchPage = 1;
let noMoreDataSearch = false;
let searchTempVal = "";
let setSearchLoading = false;
function searchUsers(query) {
    if (query != searchTempVal) {
        searchPage = 1;
        noMoreDataSearch = false;
    }
    searchTempVal = query;

    if (!setSearchLoading && !noMoreDataSearch) {
        $.ajax({
            method: "GET",
            url: "/messenger/search",
            data: {
                query: query,
                page: searchPage,
            },
            beforeSend: function () {
                setSearchLoading = true;
                $(".user_search_list_result").html(
                    '<div class="text-center search-loader"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>'
                );
            },
            success: function (data) {
                $(".search-loader").remove();
                setSearchLoading = false;
                if (searchPage < 2) {
                    $(".user_search_list_result").html(data.records);
                } else {
                    $(".user_search_list_result").append(data.records);
                }
                noMoreDataSearch = searchPage >= data?.last_page;
                if (!noMoreDataSearch) {
                    searchPage++;
                }
            },
            error: function (xhr, status, error) {
                setSearchLoading = false;
                $(".search-loader").remove();
                console.error(error);
            },
        });
    }
}

function actionOnScroll(selector, callback, topScroll = false) {
    $(selector).on("scroll", function () {
        let element = $(this).get(0);
        const condition = topScroll
            ? element.scrollTop === 0
            : element.scrollTop + element.clientHeight >= element.scrollHeight;
        if (condition) {
            callback();
        }
    });
}

function debounce(callback, delay) {
    let timerId;
    return function (...args) {
        timerId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}
