import { FC, SVGProps } from 'react';

const GRID = ['M...M', 'MM.MM', 'M.M.M', 'M...M', 'M...M'];
const STEP = 16;
const RADIUS = 6;

export const MetabaseIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox='0 0 76 76' {...props}>
    {GRID.flatMap((line, row) =>
      [...line].map((cell, column) => (
        <circle
          key={`${column},${row}`}
          cx={RADIUS + column * STEP}
          cy={RADIUS + row * STEP}
          r={RADIUS}
          fill='#509EE3'
          opacity={cell === 'M' ? 1 : 0.25}
        />
      )),
    )}
  </svg>
);
