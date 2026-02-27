import './Button.css';

export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Button({ children, onClick, type = 'button', disabled }: ButtonProps) {
  return (
    <button type={type} className="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
