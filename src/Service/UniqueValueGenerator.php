<?php

namespace App\Service;

use App\Trait\SluggerTrait;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\String\Slugger\SluggerInterface;

class UniqueValueGenerator
{
    use SluggerTrait;

    public function __construct(private SluggerInterface $slugger) {}

    public function generateUniqueValue(string $inputValue, array $existingValues): string
    {
        $baseSlug = $this->slugify($this->slugger, $inputValue);
        $currentValue = $baseSlug;
        $i = 1;

        while (in_array($currentValue, $existingValues)) {
            $currentValue = $baseSlug . '-' . $i;
            $i++;
        }

        return $currentValue;
    }

    public function prepareBaseSlugs(array $names): array
    {
        $slugs = [];

        foreach ($names as $name) {
            $slug = $this->slugify($this->slugger, $name);

            if (!empty($slug)) {
                $slugs[] = $slug;
            }
        }

        return array_unique($slugs);
    }

    public function generateRandomCode(int $length = 6): string
    {
        return strtoupper(substr(bin2hex(random_bytes($length)), 0, $length));
    }
}