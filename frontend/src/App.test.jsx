import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

function mockFetchSequence(responses) {
  let call = 0;
  global.fetch = vi.fn(() => {
    const response = responses[Math.min(call, responses.length - 1)];
    call += 1;
    return Promise.resolve({
      ok: true,
      status: response.status ?? 200,
      json: () => Promise.resolve(response.body),
    });
  });
}

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('renders todos fetched from the API', async () => {
    mockFetchSequence([{ body: [{ id: 1, title: 'Learn CI/CD', done: false }] }]);
    render(<App />);
    expect(await screen.findByText('Learn CI/CD')).toBeInTheDocument();
  });

  test('adds a new todo', async () => {
    mockFetchSequence([
      { body: [] },
      { body: { id: 2, title: 'Write docs', done: false }, status: 201 },
    ]);
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    await user.type(screen.getByLabelText('New todo title'), 'Write docs');
    await user.click(screen.getByText('Add'));

    expect(await screen.findByText('Write docs')).toBeInTheDocument();
  });
});
