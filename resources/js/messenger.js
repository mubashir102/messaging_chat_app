// Reusable functions for the messenger
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

function searchUsers(query) {
    $.ajax({
        method: "GET",
        url: "/messenger/search",
        data: {
            query: query,
        },
        success: function (data) {
            // $("#search-results").html(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        },
    });
}

// On document Load
$(document).ready(function () {
    // Image Preview
    $("#select_file").change(function () {
        imagePreview(this, ".profile-image-preview");
    });

    // Search Users
    $(".user_search").on("keyup", function () {
        let query = $(this).val();
        searchUsers(query);
    });
});
