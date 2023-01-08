import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class JWTPayloadDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100, {
    message: 'Incorrect refreshToken length! Must be max 100 ch.',
  })
  userId: string;
  @IsNotEmpty()
  @IsString()
  @Length(3, 100, {
    message: 'Incorrect refreshToken length! Must be max 100 ch.',
  })
  deviceId: string;
  @IsNotEmpty()
  @IsNumber()
  @Length(0, 10, {
    message: 'Incorrect iat length! Must be max 10 ch.',
  })
  iat: number;
  @IsNotEmpty()
  @IsNumber()
  @Length(0, 10, {
    message: 'Incorrect exp length! Must be max 10 ch.',
  })
  exp: number;
}
