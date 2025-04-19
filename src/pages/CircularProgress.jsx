
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgress = ({ progress, size = 120, color = "#4caf50", children }) => {
  const safeProgress = Math.min(100, Math.round(progress));

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <CircularProgressbar
        value={safeProgress}
        text={children ? "" : `${safeProgress}%`}  // Hide % text if children exist
        styles={buildStyles({
          textColor: "#000",
          pathColor: color,
          trailColor: "#d6d6d6",
        })}
      />
      {children && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "14px",
            color: "#000",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;