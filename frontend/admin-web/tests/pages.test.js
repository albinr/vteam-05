import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '@/app/page.js'
import About from '../pages/about'; // Example: Import another page

describe('Page Rendering', () => {
    it('renders the Home page without crashing', () => {
        const { getByText } = render(<Home />);
        expect(getByText('Dashboard')).toBeInTheDocument(); // Adjust to match your content
    });

    it('renders the About page without crashing', () => {
        const { getByText } = render(<About />);
        expect(getByText('About Us')).toBeInTheDocument(); // Adjust to match your content
    });
});
