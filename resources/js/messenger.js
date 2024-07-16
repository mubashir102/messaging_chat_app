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

// On document Load
$(document).ready(function () {
    // Image Preview
    $("#select_file").change(function () {
        imagePreview(this, ".profile-image-preview");
    });
});
