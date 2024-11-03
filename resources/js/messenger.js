// --------------------------------------------
// Global Variables
// --------------------------------------------

// const { data } = require("autoprefixer");

var temporaryMsgId = 0;
const messageForm = $(".message-form"),
    messageInput = $(".message-input"),
    messageBoxContainer = $(".wsus__chat_area_body"),
    csrfToken = $("meta[name=csrf-token]").attr("content");
const getMessengerId = () => $("meta[name=id]").attr("content");
const setMessengerId = (id) => $("meta[name=id]").attr("content", id);

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

    // click event on user chat list
    $("body").on("click", ".messenger-list-item", function () {
        // const dataId = $(this).data("id");
        const dataId = $(this).attr("data-id");
        setMessengerId(dataId);
        idInfo(dataId);
    });

    $(".message-form").on("submit", function (e) {
        e.preventDefault();
        sendMessage();
    });
});

// --------------------------------------------
// Send Message Function
// --------------------------------------------

function sendMessage() {
    temporaryMsgId++;
    let tempId = `temp_${temporaryMsgId}`;
    const inputValue = messageInput.val();
    if (inputValue.length > 0) {
        const formData = new FormData($(".message-form")[0]);
        formData.append("id", getMessengerId());
        formData.append("temporaryMsgId", tempId);
        formData.append("_token", csrfToken);
        $.ajax({
            method: "POST",
            url: "/messenger/send-message",
            dataType: "JSON",
            processData: false,
            contentType: false,
            data: formData,
            beforeSend: function () {
                messageBoxContainer.append(
                    sendTempMessageCard(inputValue, tempId)
                );
            },
            success: function (data) {
                console.log(data);
            },
            error: function (xhr, status, error) {
                console.error(error);
            },
        });
    } else {
        alert("Please enter some message");
    }
}

function sendTempMessageCard(message, tempId) {
    return `<div class="wsus__single_chat_area" data-id="${tempId}">
                            <div class="wsus__single_chat chat_right">
                                <p class="messages">${message}</p>
                                <span class="far fa-clock"> Now </span>
                                <a class="action" href="#"><i class="fas fa-trash"></i></a>
                            </div>
                        </div>`;
    // $(messageCard).appendTo(".message-list");
    // $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
}

// Image Preview Function
function imagePreview(input, selector) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(selector).attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function enableChatBoxLoader() {
    $(".wsus__message_paceholder").removeClass("d-none");
}
function disableChatBoxLoader() {
    $(".wsus__message_paceholder").addClass("d-none");
}

// Fetch ID data of uder and update the chat view
function idInfo(id) {
    $.ajax({
        method: "GET",
        url: "/messenger/id-info",
        data: {
            id: id,
        },
        beforeSend: function () {
            NProgress.start();
            enableChatBoxLoader();
        },
        success: function (data) {
            $(".messenger-header").find("img").attr("src", data.fetch.avatar);
            $(".messenger-header").find("h4").text(data.fetch.name);
            $(".messenger-info-view .user_photo")
                .find("img")
                .attr("src", data.fetch.avatar);
            $(".messenger-info-view").find(".user_name").text(data.fetch.name);
            $(".messenger-info-view")
                .find(".user_unique_name")
                .text(data.fetch.user_name);
            $(".messenger-info-view")
                .find(".user_unique_email")
                .text(data.fetch.email);
            NProgress.done();
            disableChatBoxLoader();
        },
        error: function (xhr, status, error) {
            console.error(error);
            disableChatBoxLoader();
        },
    });
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
