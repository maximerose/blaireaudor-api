<?php

declare(strict_types=1);

namespace App\Validator;

use App\Entity\Action;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class ValidActionDateValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof ValidActionDate) {
            throw new UnexpectedTypeException($constraint, ValidActionDate::class);
        }

        if (!$value instanceof Action) {
            return;
        }

        $competition = $value->getCompetition();
        if (!$competition) {
            return;
        }

        $actionDate = $value->getDateAction();
        $startDate = $competition->getStartDate();
        $endDate = $competition->getEndDate();

        if ($actionDate < $startDate) {
            $this->context->buildViolation($constraint->message)
            ->atPath('dateAction')
            ->addViolation();

            return;
        }

        if (null !== $endDate && $actionDate > $endDate) {
            $this->context->buildViolation($constraint->message)
            ->atPath('dateAction')
            ->addViolation();
        }
    }
}
