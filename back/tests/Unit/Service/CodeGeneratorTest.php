<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service;

use App\Service\Helper\CodeGenerator;
use PHPUnit\Framework\TestCase;

class CodeGeneratorTest extends TestCase
{
  public function testGenerateRandomCodeHasCorrectLength(): void
  {
    $generator = new CodeGenerator();
    $length = 8;
    $code = $generator->generateRandomCode($length);

    $this->assertEquals($length, strlen($code));
  }

  public function testGenerateRandomCodeUsesSpecificAlphabet(): void
    {
        $generator = new CodeGenerator();
        $code = $generator->generateRandomCode(200);

        $this->assertMatchesRegularExpression('/^[ABCDEFGHJKMNPQRSTUVWXYZ2-9]+$/', $code);
    }
}