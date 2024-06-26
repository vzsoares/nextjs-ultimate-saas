import { z } from 'zod';

export const ClientsArray = ['foo', 'bar', 'baz'] as const;
export const ClientSchema = z.enum(ClientsArray);
