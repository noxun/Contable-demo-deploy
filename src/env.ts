import {createEnv} from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_TRAZO_URL: z.string().url().min(1),
    NEXT_PUBLIC_BACKEND_URL: z.string().url().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_TRAZO_URL: process.env.NEXT_PUBLIC_TRAZO_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  }
})