<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 * @Target({"CLASS", "ANNOTATION"})
 */
#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::IS_REPEATABLE)]
final class ValidActionDate extends Constraint
{
    public string $message = "L'action doit obligatoirement se dérouler pendant la période active de la compétition.";

    public function getTargets(): string|array
    {
        return self::CLASS_CONSTRAINT;
    }
}
