import { FC } from 'react';

const SIZE = 176;
const CENTER = SIZE / 2;
const ORBIT_RADIUS = 66;
const ORBIT_PATH = `M${CENTER - ORBIT_RADIUS} ${CENTER} a${ORBIT_RADIUS} ${ORBIT_RADIUS} 0 1 0 ${ORBIT_RADIUS * 2} 0 a${ORBIT_RADIUS} ${ORBIT_RADIUS} 0 1 0 ${-ORBIT_RADIUS * 2} 0`;
const SATELLITES = [
  { dur: '7s', begin: '0s', r: 2.5 },
  { dur: '7s', begin: '-3.5s', r: 1.5 },
  { dur: '11s', begin: '-2s', r: 2 },
];
const SPIN_CLASSES = 'origin-center [transform-box:fill-box]';

export const AssistantOrb: FC = () => (
  <div className='relative' style={{ width: SIZE, height: SIZE }}>
    <span className='bg-primary/30 animate-breathe absolute inset-10 rounded-full blur-2xl' />
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className='relative' aria-hidden>
      <defs>
        <radialGradient id='assistant-orb' cx='35%' cy='30%'>
          <stop offset='0%' stopColor='white' />
          <stop offset='35%' stopColor='var(--primary-soft)' />
          <stop offset='100%' stopColor='var(--primary)' />
        </radialGradient>
      </defs>
      <circle cx={CENTER} cy={CENTER} r={84} className='stroke-primary/20 fill-primary/5' />
      <g className={`animate-spin-slow ${SPIN_CLASSES}`}>
        <circle cx={CENTER} cy={CENTER} r={76} fill='none' strokeDasharray='1 5' className='stroke-primary-soft/40' />
      </g>
      <circle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS} fill='none' className='stroke-primary-soft/10' />
      <g className={`animate-spin-reverse ${SPIN_CLASSES}`}>
        <circle cx={CENTER} cy={CENTER} r={48} fill='none' strokeWidth={2} strokeDasharray='70 80' className='stroke-primary' />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={48}
          fill='none'
          strokeWidth={2}
          strokeDasharray='12 290'
          strokeDashoffset='-150'
          className='stroke-primary-soft'
        />
      </g>
      {SATELLITES.map(({ dur, begin, r }) => (
        <circle key={begin} r={r} className='fill-primary-soft drop-shadow-[0_0_4px_var(--primary-soft)]'>
          <animateMotion dur={dur} begin={begin} repeatCount='indefinite' path={ORBIT_PATH} />
        </circle>
      ))}
      <circle cx={CENTER} cy={CENTER} r={30} className='fill-background stroke-primary/40 drop-shadow-[0_0_16px_var(--primary)]' />
      <circle cx={CENTER} cy={CENTER} r={15} fill='url(#assistant-orb)' className={`animate-breathe ${SPIN_CLASSES}`} />
    </svg>
  </div>
);
