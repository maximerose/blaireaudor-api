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
        // On ne surcharge que si la variable est définie (serveur o2switch)
        if ($hostingUser = $_ENV['HOSTING_USER'] ?? $_SERVER['HOSTING_USER'] ?? null) {
            return (string) '/home2/'.$hostingUser.'/tmp/blaireaudor/cache/'.$this->getEnvironment();
        }

        return parent::getCacheDir();
    }

    public function getLogDir(): string
    {
        if ($hostingUser = $_ENV['HOSTING_USER'] ?? $_SERVER['HOSTING_USER'] ?? null) {
            return (string) '/home2/'.$hostingUser.'/tmp/blaireaudor/log';
        }

        return parent::getLogDir();
    }
}
