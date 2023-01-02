import { IsNotEmpty, Length } from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect userId length! Must be max 100 ch.',
  })
  userId: string;
  @IsNotEmpty()
  @Length(0, 50, {
    message: 'Incorrect deviceId length! Must be max 50 ch.',
  })
  deviceId: string;
  @IsNotEmpty()
  @Length(0, 11, {
    message: 'Incorrect iat length! Must be max 11 ch.',
  })
  iat: number;
  @IsNotEmpty()
  @Length(0, 11, {
    message: 'Incorrect exp length! Must be max 11 ch.',
  })
  exp: number;
}
