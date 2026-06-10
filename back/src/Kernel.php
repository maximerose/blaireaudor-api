<?php

declare(strict_types=1);

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function getCacheDir(): string
    {
        return '/home2/'.$this->getHostingUser().'/tmp/blaireaudor/cache/'.$this->getEnvironment();
    }

    public function getLogDir(): string
    {
        return '/home2/'.$this->getHostingUser().'/tmp/blaireaudor/log';
    }

    private function getHostingUser(): string
    {
        if ($user = $_ENV['HOSTING_USER'] ?? $_SERVER['HOSTING_USER'] ?? null) {
            return $user;
        }

        if (\function_exists('posix_getpwuid') && \function_exists('posix_geteuid')) {
            return posix_getpwuid(posix_geteuid())['name'] ?? 'nobody';
        }

        return 'nobody';
    }
}
