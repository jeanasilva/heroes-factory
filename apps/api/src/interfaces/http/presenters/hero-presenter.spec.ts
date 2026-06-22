import { describe, expect, it } from 'vitest';
import { formatDateTime } from './hero-presenter.js';

describe('HeroPresenter formatDateTime', () => {
  it('formats dates in UTC without timezone drift', () => {
    const date = new Date('2024-06-15T14:30:45.000Z');

    expect(formatDateTime(date)).toBe('2024-06-15 14:30:45');
  });
});
