<?php

declare(strict_types=1);

namespace App\Service;

class CodeGenerator
{
    public function generateRandomCode(int $length = 6): string
    {
        return strtoupper(substr(bin2hex(random_bytes($length)), 0, $length));
    }
}