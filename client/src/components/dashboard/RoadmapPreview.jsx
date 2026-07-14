import React from "react";
import {
  FiArrowRight,
  FiCheck,
  FiCircle,
  FiClock,
  FiMap,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const RoadmapPreview = ({ roadmap }) => {
  const progress = Math.min(Math.max(roadmap?.progress ?? 0, 0), 100);
  const tasks = roadmap?.tasks || [];

  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <article className="dashboard-panel roadmap-preview">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">
            Personalized plan
          </span>

          <h3>Career roadmap</h3>
        </div>

        <Link
          to="/dashboard/roadmap"
          className="dashboard-panel__link"
        >
          Open roadmap
          <FiArrowRight />
        </Link>
      </div>

      <div className="roadmap-preview__phase">
        <span className="roadmap-preview__phase-icon">
          <FiMap />
        </span>

        <div className="roadmap-preview__phase-content">
          <span>
            Phase {roadmap?.currentPhase || 1} of{" "}
            {roadmap?.totalPhases || 1}
          </span>

          <strong>
            {roadmap?.title || "Your personalized career roadmap"}
          </strong>

          <small>
            <FiClock />
            {roadmap?.duration || "Duration not available"}
          </small>
        </div>

        <div className="roadmap-preview__progress-value">
          <strong>{progress}%</strong>
          <span>completed</span>
        </div>
      </div>

      <div className="roadmap-preview__progress-bar">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="roadmap-preview__task-summary">
        <span>
          {completedTasks} of {tasks.length} tasks completed
        </span>

        <strong>{tasks.length - completedTasks} remaining</strong>
      </div>

      <div className="roadmap-preview__tasks">
        {tasks.slice(0, 4).map((task) => (
          <div
            key={task.id}
            className={`roadmap-preview__task ${
              task.completed ? "roadmap-preview__task--completed" : ""
            }`}
          >
            <span className="roadmap-preview__task-status">
              {task.completed ? <FiCheck /> : <FiCircle />}
            </span>

            <span>{task.title}</span>
          </div>
        ))}
      </div>
    </article>
  );
};

export default RoadmapPreview;