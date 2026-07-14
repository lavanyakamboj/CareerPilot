import React from "react";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const getChartCoordinates = (progress) => {
  if (!progress?.length) {
    return [];
  }

  const chartWidth = 440;
  const chartHeight = 180;
  const horizontalPadding = 20;
  const verticalPadding = 20;

  const usableWidth = chartWidth - horizontalPadding * 2;
  const usableHeight = chartHeight - verticalPadding * 2;

  const maximumScore = 100;
  const step =
    progress.length > 1 ? usableWidth / (progress.length - 1) : 0;

  return progress.map((item, index) => {
    const safeScore = Math.min(Math.max(item.score, 0), maximumScore);

    return {
      ...item,
      x: horizontalPadding + step * index,
      y:
        chartHeight -
        verticalPadding -
        (safeScore / maximumScore) * usableHeight,
    };
  });
};

const ProgressChart = ({ progress = [] }) => {
  const points = getChartCoordinates(progress);

  const polylinePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const latestScore = progress.at(-1)?.score ?? 0;
  const firstScore = progress.at(0)?.score ?? 0;
  const improvement = latestScore - firstScore;

  return (
    <article className="dashboard-panel progress-chart">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">
            Score history
          </span>

          <h3>Resume progress</h3>
        </div>

        <Link
          to="/dashboard/analysis"
          className="dashboard-panel__link"
        >
          View history
          <FiArrowRight />
        </Link>
      </div>

      <div className="progress-chart__summary">
        <div>
          <strong>{latestScore}</strong>
          <span>Latest score</span>
        </div>

        <span className="progress-chart__change">
          <FiTrendingUp />
          {improvement >= 0 ? "+" : ""}
          {improvement} points overall
        </span>
      </div>

      <div className="progress-chart__canvas">
        <div className="progress-chart__labels">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        <div className="progress-chart__graph">
          <span className="progress-chart__grid-line progress-chart__grid-line--one" />
          <span className="progress-chart__grid-line progress-chart__grid-line--two" />
          <span className="progress-chart__grid-line progress-chart__grid-line--three" />
          <span className="progress-chart__grid-line progress-chart__grid-line--four" />
          <span className="progress-chart__grid-line progress-chart__grid-line--five" />

          <svg
            viewBox="0 0 440 180"
            role="img"
            aria-label="Resume score progress chart"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="progressAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#7c5ce5" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#7c5ce5" stopOpacity="0" />
              </linearGradient>
            </defs>

            {points.length > 1 && (
              <>
                <polygon
                  points={`20,160 ${polylinePoints} 420,160`}
                  fill="url(#progressAreaGradient)"
                />

                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="#7657dd"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {points.map((point) => (
              <g key={point.name}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="7"
                  fill="#ffffff"
                  stroke="#7657dd"
                  strokeWidth="4"
                />

                <title>
                  {point.name}: {point.score}
                </title>
              </g>
            ))}
          </svg>

          <div className="progress-chart__x-axis">
            {progress.map((item) => (
              <span key={item.name}>{item.name}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProgressChart;