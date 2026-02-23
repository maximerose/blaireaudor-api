<?php

namespace App\Trait;

use Symfony\Component\String\Slugger\SluggerInterface;

trait SluggerTrait
{
    private function slugify(SluggerInterface $slugger, string $text): string
    {
        return $slugger->slug($text)->lower()->toString();
    }
}
