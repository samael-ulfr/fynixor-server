import React from 'react';

type PrimaryBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: any;
};

function PrimaryBtn({ label, ...props }: PrimaryBtnProps) {
  return <button {...props}>{label}</button>;
}

export default PrimaryBtn;
