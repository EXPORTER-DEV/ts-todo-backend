import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = Symbol();
export const Public = () => SetMetadata(IS_PUBLIC, true);