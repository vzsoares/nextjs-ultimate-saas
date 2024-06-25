import { z } from 'zod';

export const ClientSchema = z.enum(['foo', 'bar', 'baz']);
