<?php

namespace App\Traits;

trait MessengerTrait
{

    //calculate human readable time
    public function timeAgo($timestamp)
    {
        $timeDifference = time() - strtotime($timestamp);
        $seconds = $timeDifference;
        $minutes = round($timeDifference / 60);
        $hours = round($timeDifference / 3600);
        $days = round($timeDifference / 86400);

        if ($seconds <= 60) {
            return "$seconds\s ago";
        } elseif ($minutes <= 60) {
            return "$minutes\m minutes ago";
        } elseif ($hours <= 24) {
            return "$hours\h hours ago";
        } else {
            return date('j M y', strtotime($timestamp));
        }
    }
}
