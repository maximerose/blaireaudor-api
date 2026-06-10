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
        if ('dev' === $this->getEnvironment()) {
            return '/var/cache/'.$this->getEnvironment();
        }

        return parent::getCacheDir();
    }

    public function getLogDir(): string
    {
        if ('dev' === $this->getEnvironment()) {
            return '/var/log';
        }

        return parent::getLogDir();
    }
}
