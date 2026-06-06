/**
 * Tests for apps/irent/src/app/tenants/new/page.tsx
 *
 * Covers the PR changes:
 * - loading and message state added
 * - handleInvite replaced alert() with real Edge Function fetch call
 * - Session token passed as Authorization header
 * - Success → setMessage('Invitation sent successfully!') + redirect after 2s
 * - Error from result.error → setMessage(`Error: ${error.message}`)
 * - Error thrown during fetch → setMessage(`Error: ${error.message}`)
 * - loading state controls button disabled + label ('Sending...' vs 'Send Invitation')
 * - message paragraph rendered conditionally
 * - required attributes on all form inputs
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';

// ──────────────────────────────────────────────────────────────────
// Hoisted mocks – must be declared with vi.hoisted() so they are
// available when vi.mock factories are evaluated (which happens
// before module initialisation).
// ──────────────────────────────────────────────────────────────────

const { mockPush, mockGetSession, mockSelect, mockFrom } = vi.hoisted(() => {
  const mockSelect = vi.fn();
  return {
    mockPush: vi.fn(),
    mockGetSession: vi.fn(),
    mockSelect,
    mockFrom: vi.fn(() => ({ select: mockSelect })),
  };
});

const mockFetch = vi.fn();

const mockRooms = [
  { id: 'room-1', name: 'Room A' },
  { id: 'room-2', name: 'Room B' },
];

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getSession: mockGetSession,
    },
  },
}));

// ──────────────────────────────────────────────────────────────────
// Imports after mocks
// ──────────────────────────────────────────────────────────────────

import NewTenantPage from '../app/tenants/new/page';

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function setupSessionMock(accessToken = 'test-access-token') {
  mockGetSession.mockResolvedValue({
    data: { session: { access_token: accessToken } },
  });
}

function setupFetchSuccess(responseBody = {}) {
  mockFetch.mockResolvedValue({
    json: () => Promise.resolve(responseBody),
  });
}

function setupFetchError(errorMessage: string) {
  mockFetch.mockResolvedValue({
    json: () => Promise.resolve({ error: errorMessage }),
  });
}

function setupFetchThrows(errorMessage: string) {
  mockFetch.mockRejectedValue(new Error(errorMessage));
}

/** Fills all required form fields and submits. */
async function fillAndSubmitForm({
  fullName = 'Jane Doe',
  email = 'jane@example.com',
  roomId = 'room-1',
  moveIn = '2026-06-01',
} = {}) {
  fireEvent.change(screen.getByPlaceholderText('Full Name'), {
    target: { value: fullName },
  });
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: roomId },
  });
  const dateInput = document.querySelector('input[type="date"]')!;
  fireEvent.change(dateInput, { target: { value: moveIn } });

  fireEvent.submit(screen.getByRole('button').closest('form')!);
}

// ──────────────────────────────────────────────────────────────────
// Setup / teardown
// ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example.com';

  // Default: rooms query resolves with two rooms
  mockSelect.mockResolvedValue({ data: mockRooms, error: null });
});

afterEach(() => {
  vi.useRealTimers();
});

// ──────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────

describe('NewTenantPage', () => {
  // ----------------------------------------------------------------
  // Rendering
  // ----------------------------------------------------------------
  describe('initial render', () => {
    it('renders the page heading', () => {
      render(<NewTenantPage />);
      expect(screen.getByText('Invite New Tenant')).toBeInTheDocument();
    });

    it('renders the Full Name input', () => {
      render(<NewTenantPage />);
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    it('renders the Email input', () => {
      render(<NewTenantPage />);
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    it('renders the room select with default option', () => {
      render(<NewTenantPage />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select a room')).toBeInTheDocument();
    });

    it('renders the submit button with correct initial label', () => {
      render(<NewTenantPage />);
      expect(screen.getByRole('button', { name: 'Send Invitation' })).toBeInTheDocument();
    });

    it('button is enabled on initial render', () => {
      render(<NewTenantPage />);
      expect(screen.getByRole('button', { name: 'Send Invitation' })).not.toBeDisabled();
    });

    it('does not show a message paragraph on initial render', () => {
      render(<NewTenantPage />);
      // The message <p> is only rendered when message !== ''
      expect(
        screen.queryByText(/invitation sent/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/^Error:/)
      ).not.toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // Room loading (useEffect)
  // ----------------------------------------------------------------
  describe('room fetching on mount', () => {
    it('populates room options from supabase after mount', async () => {
      render(<NewTenantPage />);
      await waitFor(() => {
        expect(screen.getByText('Room A')).toBeInTheDocument();
        expect(screen.getByText('Room B')).toBeInTheDocument();
      });
    });

    it('calls supabase.from("rooms") on mount', async () => {
      render(<NewTenantPage />);
      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('rooms');
      });
    });

    it('calls select("id, name") to fetch room fields', async () => {
      render(<NewTenantPage />);
      await waitFor(() => {
        expect(mockSelect).toHaveBeenCalledWith('id, name');
      });
    });
  });

  // ----------------------------------------------------------------
  // Form validation – required attributes
  // ----------------------------------------------------------------
  describe('form field required attributes', () => {
    it('Full Name input has required attribute', () => {
      render(<NewTenantPage />);
      expect(screen.getByPlaceholderText('Full Name')).toHaveAttribute('required');
    });

    it('Email input has required attribute', () => {
      render(<NewTenantPage />);
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('required');
    });

    it('room select has required attribute', () => {
      render(<NewTenantPage />);
      expect(screen.getByRole('combobox')).toHaveAttribute('required');
    });

    it('Email input has type="email"', () => {
      render(<NewTenantPage />);
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
    });

    it('date input has type="date" and required attribute', () => {
      render(<NewTenantPage />);
      const dateInput = document.querySelector('input[type="date"]');
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute('required');
    });
  });

  // ----------------------------------------------------------------
  // Successful invitation flow
  // ----------------------------------------------------------------
  describe('handleInvite – success path', () => {
    it('calls Edge Function with correct URL', async () => {
      setupSessionMock();
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://supabase.example.com/functions/v1/invite-tenant',
          expect.any(Object)
        );
      });
    });

    it('sends POST method', async () => {
      setupSessionMock();
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        const [, options] = mockFetch.mock.calls[0];
        expect(options.method).toBe('POST');
      });
    });

    it('sends Authorization header with session access token', async () => {
      setupSessionMock('my-secret-token');
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        const [, options] = mockFetch.mock.calls[0];
        expect(options.headers['Authorization']).toBe('Bearer my-secret-token');
      });
    });

    it('sends Content-Type: application/json header', async () => {
      setupSessionMock();
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        const [, options] = mockFetch.mock.calls[0];
        expect(options.headers['Content-Type']).toBe('application/json');
      });
    });

    it('sends correct JSON body with form field values', async () => {
      setupSessionMock();
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => {
        await fillAndSubmitForm({
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          roomId: 'room-1',
          moveIn: '2026-06-01',
        });
      });

      await waitFor(() => {
        const [, options] = mockFetch.mock.calls[0];
        const body = JSON.parse(options.body);
        expect(body).toEqual({
          email: 'jane@example.com',
          fullName: 'Jane Doe',
          roomId: 'room-1',
          moveIn: '2026-06-01',
        });
      });
    });

    it('shows success message after successful invite', async () => {
      setupSessionMock();
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        expect(screen.getByText('Invitation sent successfully!')).toBeInTheDocument();
      });
    });

    it('redirects to /tenants after 2 seconds on success', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      setupSessionMock();
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() =>
        expect(screen.getByText('Invitation sent successfully!')).toBeInTheDocument()
      );

      // Before 2s no redirect
      expect(mockPush).not.toHaveBeenCalled();

      act(() => { vi.advanceTimersByTime(2000); });
      expect(mockPush).toHaveBeenCalledWith('/tenants');
    });
  });

  // ----------------------------------------------------------------
  // Error path – Edge Function returns error field
  // ----------------------------------------------------------------
  describe('handleInvite – Edge Function returns error', () => {
    it('shows error message when result.error is set', async () => {
      setupSessionMock();
      setupFetchError('Unauthorized');
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        expect(screen.getByText('Error: Unauthorized')).toBeInTheDocument();
      });
    });

    it('does not redirect when result.error is set', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      setupSessionMock();
      setupFetchError('Unauthorized');
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() =>
        expect(screen.getByText('Error: Unauthorized')).toBeInTheDocument()
      );

      act(() => { vi.advanceTimersByTime(2000); });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // Error path – fetch throws
  // ----------------------------------------------------------------
  describe('handleInvite – fetch throws', () => {
    it('shows error message when fetch rejects', async () => {
      setupSessionMock();
      setupFetchThrows('Network error');
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        expect(screen.getByText('Error: Network error')).toBeInTheDocument();
      });
    });

    it('does not redirect when fetch throws', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      setupSessionMock();
      setupFetchThrows('Network error');
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() =>
        expect(screen.getByText('Error: Network error')).toBeInTheDocument()
      );

      act(() => { vi.advanceTimersByTime(2000); });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // Loading state
  // ----------------------------------------------------------------
  describe('loading state', () => {
    it('disables the button and shows "Sending..." while request is pending', async () => {
      setupSessionMock();
      let resolveRequest!: (v: unknown) => void;
      mockFetch.mockReturnValue(
        new Promise((resolve) => { resolveRequest = resolve; })
      );

      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      // Start the submission (do NOT await it – request is pending)
      act(() => { fillAndSubmitForm(); });

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button')).toHaveTextContent('Sending...');
      });

      // Unblock the fetch so the component finishes and doesn't leak
      resolveRequest({ json: () => Promise.resolve({}) });
      await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled());
    });

    it('re-enables the button and shows normal label after success', async () => {
      setupSessionMock();
      setupFetchSuccess({});
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        const btn = screen.getByRole('button', { name: 'Send Invitation' });
        expect(btn).not.toBeDisabled();
      });
    });

    it('re-enables the button after an error', async () => {
      setupSessionMock();
      setupFetchError('Bad request');
      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        const btn = screen.getByRole('button', { name: 'Send Invitation' });
        expect(btn).not.toBeDisabled();
      });
    });
  });

  // ----------------------------------------------------------------
  // Message display
  // ----------------------------------------------------------------
  describe('message display', () => {
    it('clears previous error when a new submission starts', async () => {
      setupSessionMock();
      // First call fails, second succeeds
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve({ error: 'First error' }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({}) });

      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      // First submit – error
      await act(async () => { await fillAndSubmitForm(); });
      await waitFor(() => screen.getByText('Error: First error'));

      // Second submit – success; error message should no longer be visible
      await act(async () => { await fillAndSubmitForm(); });
      await waitFor(() =>
        expect(screen.getByText('Invitation sent successfully!')).toBeInTheDocument()
      );
      expect(screen.queryByText('Error: First error')).not.toBeInTheDocument();
    });

    it('passes Bearer undefined when session is null', async () => {
      // Session returns null (unauthenticated)
      mockGetSession.mockResolvedValue({
        data: { session: null },
      });
      setupFetchSuccess({});

      render(<NewTenantPage />);
      await waitFor(() => screen.getByText('Room A'));

      await act(async () => { await fillAndSubmitForm(); });

      await waitFor(() => {
        const [, options] = mockFetch.mock.calls[0];
        // session?.access_token → undefined when session is null
        expect(options.headers['Authorization']).toBe('Bearer undefined');
      });
    });
  });
});