import React from "react";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    nutritionPartitionBar: {
      display: "inline-block",
      borderRadius: theme.spacing(1),
      width: theme.spacing(0.75),
      height: theme.spacing(6),
      marginRight: theme.spacing(1),
    },
    barContainer: {
      position: "relative",
      height: "100%",
      borderRadius: theme.spacing(1.5),
      backgroundColor: "#f0f0f0",
      overflow: "hidden",
    },
    progressBar: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      transition: "height 0.3s ease-in-out",
    },
  };
});

interface NutritionPartitionBarProps {
  value: number;
  total: number;
  color: string;
}

export const NutritionPartitionBar: React.FC<NutritionPartitionBarProps> = ({
  value,
  total,
  color,
}) => {
  const { classes } = useStyles();
  const normalizedProgress = Math.min(100, Math.max(0, (value / total) * 100));
  const barStyle = {
    height: `${normalizedProgress}%`,
    backgroundColor: color,
  };

  return (
    <div className={classes.nutritionPartitionBar}>
      <div className={classes.barContainer}>
        <div className={classes.progressBar} style={barStyle}></div>
      </div>
    </div>
  );
};
