<?php

declare(strict_types=1);

namespace App\Utils;

use App\Constants\AppConstants;

class DateUtils
{
    public static function getLocalTimezone(): \DateTimeZone
    {
        return new \DateTimeZone(AppConstants::TIMEZONE);
    }

    public static function toLocalImmutable(\DateTimeInterface $date): \DateTimeImmutable
    {
        return \DateTimeImmutable::createFromInterface($date)
            ->setTimezone(self::getLocalTimezone());
    }
}
