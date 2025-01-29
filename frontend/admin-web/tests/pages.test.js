import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '@/app/page.js'

describe('Page Rendering', () => {
    it('renders the Home page without crashing', () => {
        const { getByText } = render(<Home />);
        expect(getByText('Dashboard')).toBeInTheDocument(); // Adjust to match your content
    });
});
