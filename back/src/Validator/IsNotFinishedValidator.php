<?php

declare(strict_types=1);

namespace App\Validator;

use App\Entity\Competition;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class IsNotFinishedValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof IsNotFinished) {
            throw new UnexpectedTypeException($constraint, IsNotFinished::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Competition) {
            throw new UnexpectedTypeException($value, Competition::class);
        }

        if ($value->getIsFinished()) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
