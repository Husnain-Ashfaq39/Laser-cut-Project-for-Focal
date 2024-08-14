import { FunctionComponent } from "react";

export type InputType = {
  className?: string;
};

const Input: FunctionComponent<InputType> = ({ className = "" }) => {
  return (
    <div
      className={`self-stretch flex flex-row items-start justify-start pt-[28px] px-[0px] pb-[0px] box-border max-w-full z-[2] text-left text-[14px] text-[#a1a9b8] font-[Inter] ${className}`}
    >
      <div className="h-[32px] flex-1 relative shadow-[0px_1px_2px_rgba(0,_0,_0,_0.06),_0px_0px_0px_1px_rgba(134,_143,_160,_0.16)] rounded-[6px] bg-[#fff] overflow-hidden max-w-full">
        <div className="absolute w-[calc(100%_-_24px)] top-[6px] left-[12px] leading-[20px] hidden items-center">
          Search
        </div>
        <img
          className="absolute right-[4px] bottom-[4px] rounded-[1px] w-[8px] h-[8px] hidden"
          alt=""
          src="/vector.svg"
        />
      </div>
      <div className="h-[20px] w-[38px] hidden flex-row items-center justify-center gap-[6px] text-[#000]">
        <div className="self-stretch w-[53px] relative tracking-[0.02em] leading-[20px] font-medium hidden items-center">
          Bracket
        </div>
        <img
          className="h-[16px] w-[16px] relative hidden"
          alt=""
          src="/info.svg"
        />
      </div>
    </div>
  );
};

export default Input;
