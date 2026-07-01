import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock de Request y Response globales requeridos por Next.js internals en entorno JSDOM
global.Request = global.Request || globalThis.Request || class RequestMock {}
global.Response = global.Response || globalThis.Response || class ResponseMock {}

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  redirect(url) {
    return url;
  }
}));

// Mock de Supabase Client para evitar llamadas a la red durante los tests
const mockClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
  storage: {
    from: () => ({
      upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'http://test-url.com' } })
    })
  }
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => mockClient)
}));

// Mock de Supabase Server
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => Promise.resolve({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  }))
}));

// Mock de React Hook Form para slots dinámicos si fuera necesario, o Mock general
// Evitamos que fallen componentes al cargar Next/Font, etc.
