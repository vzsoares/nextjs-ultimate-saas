import { z } from 'zod';

export const ClientsArray = ['foo', 'bar', 'baz', 'default'] as const;
export const ClientSchema = z.enum(ClientsArray);
