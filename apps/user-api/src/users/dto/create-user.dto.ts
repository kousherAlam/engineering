import { z } from 'nestjs-zod/z';
import { ApiPropertyOptions } from '@nestjs/swagger';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(200).describe('User name'),
  email: z
    .string()
    .email('Provide a valid email address')
    .describe('Email address'),
});

const openapi = zodToOpenAPI(CreateUserSchema);

export const userOpenAPIDef = {
  ...openapi,
} as unknown as ApiPropertyOptions;

export class CreateUserDto extends createZodDto(CreateUserSchema) { }
