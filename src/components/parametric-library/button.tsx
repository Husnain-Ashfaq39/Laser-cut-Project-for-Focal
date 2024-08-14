import { FunctionComponent, useMemo, type CSSProperties } from "react";

export type ButtonType = {
  className?: string;
  button?: string;

  /** Style props */
  propBackgroundColor?: CSSProperties["backgroundColor"];
  propBoxShadow?: CSSProperties["boxShadow"];
  propColor?: CSSProperties["color"];
  propMinWidth?: CSSProperties["minWidth"];
};

const Button: FunctionComponent<ButtonType> = ({
  className = "",
  propBackgroundColor,
  propBoxShadow,
  button,
  propColor,
  propMinWidth,
}) => {
  const buttonStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: propBackgroundColor,
      boxShadow: propBoxShadow,
    };
  }, [propBackgroundColor, propBoxShadow]);

  const button1Style: CSSProperties = useMemo(() => {
    return {
      color: propColor,
      minWidth: propMinWidth,
    };
  }, [propColor, propMinWidth]);

  return (
    <button
      className={`cursor-pointer [border:none] py-[6px] px-[12px] bg-[#000] rounded-[100px] overflow-hidden flex flex-row items-start justify-start z-[1] hover:bg-[#333] ${className}`}
      style={buttonStyle}
    >
      <div
        className="relative text-[14px] tracking-[0.02em] leading-[20px] font-medium font-secondary text-[#fff] text-left inline-block min-w-[33px]"
        style={button1Style}
      >
        {button}
      </div>
    </button>
  );
};

export default Button;
