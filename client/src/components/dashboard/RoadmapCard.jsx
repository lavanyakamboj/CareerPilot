import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { roadmapBars } from "../../data/dashboardData";

function RoadmapCard({
  roadmap,
}) {
  const navigate = useNavigate();

  const title =
    roadmap?.targetRole || "Your career roadmap";

  const level =
    roadmap?.currentLevel || "Getting started";

  const currentFocus =
    roadmap?.phases?.[0]?.focus ||
    "Complete your first resume analysis";

  return (
    <article className="career-card flex min-h-[420px] flex-col bg-career-card p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <span className="career-eyebrow">
            Twelve-month direction
          </span>

          <h3 className="mt-2 font-heading text-[28px] font-normal text-career-text">
            {title}
          </h3>
        </div>

        <span className="w-fit rounded-button border border-[#D6CDF4] bg-white/55 px-3 py-1.5 text-[11px] text-career-purpleDark">
          {level}
        </span>
      </div>

      <div className="mt-11 flex h-32 items-end gap-2">
        {roadmapBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="min-w-1 flex-1 rounded-t-lg bg-gradient-to-t from-[#A88EEF] to-[#6443CF]"
            style={{
              height: `${height}%`,
            }}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-[10px] text-career-muted">
        <span>Now</span>
        <span>Month 4</span>
        <span>Month 8</span>
        <span>Month 12</span>
      </div>

      <div className="my-7 rounded-2xl border border-career-border bg-white/55 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-career-muted">
          Current focus
        </span>

        <p className="mb-0 mt-2 font-heading text-xl text-career-text">
          {currentFocus}
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/roadmap")}
        className="career-text-button mt-auto w-fit"
      >
        Open your roadmap
        <FiArrowRight />
      </button>
    </article>
  );
}

export default RoadmapCard;