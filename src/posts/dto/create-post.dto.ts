import { IsNotEmpty, Length, Validate } from 'class-validator';
import { UserExistsRule } from '../../pipes/user-exists-validation.decorator';

export class CreatePostDto {
  @IsNotEmpty()
  @Length(0, 30, {
    message: 'Incorrect title length! Must be max 30 ch.',
  })
  title: string;
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect shortDescription length! Must be max 100 ch.',
  })
  shortDescription: string;
  @IsNotEmpty()
  @Length(0, 1000, {
    message: 'Incorrect content length! Must be max 1000 ch.',
  })
  content: string;
  @IsNotEmpty()
  @Validate(UserExistsRule)
  @Length(0, 100, {
    message: 'Incorrect blogId length! Must be max 100 ch.',
  })
  blogId: string;
}
