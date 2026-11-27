import { FC, SVGProps } from 'react';

export const GoogleSheetsIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox='0 0 48 64' {...props}>
    <path fill='#0F9D58' d='M29.5 0H4.4A4.4 4.4 0 0 0 0 4.4v55.2A4.4 4.4 0 0 0 4.4 64h39.2a4.4 4.4 0 0 0 4.4-4.4V18.5L29.5 0Z' />
    <path fill='#087F45' d='M48 18.5 29.5 0v14.1a4.4 4.4 0 0 0 4.4 4.4H48Z' opacity='.35' />
    <path fill='#87CEAC' d='M29.5 0v14.1a4.4 4.4 0 0 0 4.4 4.4H48L29.5 0Z' />
    <path fill='none' stroke='#F1F1F1' strokeWidth='2.8' d='M12.4 31.4h23.2v17.2H12.4ZM12.4 37.1h23.2M12.4 42.9h23.2M22 31.4v17.2' />
  </svg>
);
