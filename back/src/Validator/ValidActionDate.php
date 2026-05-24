<?php

declare(strict_types=1);

namespace App\Validator;

use App\Constants\ErrorMessages;
use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 * @Target({"CLASS", "ANNOTATION"})
 */
#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::IS_REPEATABLE)]
final class ValidActionDate extends Constraint
{
    public string $message = ErrorMessages::ACTION_DATE_OUT_OF_RANGE;

    public function getTargets(): string|array
    {
        return self::CLASS_CONSTRAINT;
    }
}
