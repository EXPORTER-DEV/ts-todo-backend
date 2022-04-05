import { SetMetadata } from '@nestjs/common';

export const IS_GUEST = Symbol();
export const Guest = () => SetMetadata(IS_GUEST, true);