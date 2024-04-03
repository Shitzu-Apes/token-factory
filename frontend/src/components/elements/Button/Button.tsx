// import styles from './Button.module.css';

const Button = ({
  className,
  onClick = () => {},
  text = '',
  backgroundColor = '#262626',
  textColor = '#ffffff',
  disabled = false,
  width,
  height
}: {
  className?: string;
  onClick?: () => void;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  width?: number;
  height?: number;
}) => {
  return (
    <button
      className={`${className}`}
      onClick={onClick}
      style={{ backgroundColor: backgroundColor, color: textColor, width: width, height: height }}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
