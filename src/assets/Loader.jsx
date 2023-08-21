export const Loader = () => {
  return (
    <svg
      id="load"
      width="25%"
      height="25%"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        margin: "auto",
        display: "block"
      }}
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="gold"
        strokeWidth="10"
        r="40"
        strokeDasharray="90 90"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          keyTimes="0;1"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
    </svg>
  );
};
