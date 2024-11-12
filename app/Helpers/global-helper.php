<?php

//calculate human readable time
if (!function_exists('timeAgo')) {
    function timeAgo($timestamp)
    {
        $timeDifference = time() - strtotime($timestamp);
        $seconds = $timeDifference;
        $minutes = round($timeDifference / 60);
        $hours = round($timeDifference / 3600);
        $days = round($timeDifference / 86400);

        if ($seconds <= 60) {
            return "Just now";
        } elseif ($minutes <= 60) {
            if ($minutes == 1) {
                return "1 minute ago";
            } else {
                return "$minutes minutes ago";
            }
        } elseif ($hours <= 24) {
            if ($hours == 1) {
                return "1 hour ago";
            } else {
                return "$hours hours ago";
            }
        } else {
            if ($days == 1) {
                return "1 day ago";
            } else {
                return "$days days ago";
            }
        }
    }
}
