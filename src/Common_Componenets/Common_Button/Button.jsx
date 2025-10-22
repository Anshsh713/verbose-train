import React, { useId } from "react";

const Button = React.forwardRef(function Button(
  { title, className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <div className="Button-container">
      <button
        id={id}
        ref={ref}
        {...props}
        className={`Button-field ${className}`}
      >
        {title}
      </button>
    </div>
  );
});

export default Button;
