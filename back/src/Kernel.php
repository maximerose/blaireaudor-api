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
        if ($this->getEnvironment() === 'dev') {
            return '/tmp/blaireau_cache/' . $this->getEnvironment();
        }

        return parent::getCacheDir();
    }

    public function getLogDir(): string
    {
        if ($this->getEnvironment() === 'dev') {
            return '/tmp/blaireau_logs';
        }

        return parent::getLogDir();
    }
}
