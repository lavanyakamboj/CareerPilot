import {
  FiArrowRight,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ResumeScoreCard({
  resume,
}) {
  const navigate = useNavigate();

  const score = Number(resume?.latestScore || 0);
  const difference = Number(
    resume?.scoreTrend?.difference || 0
  );

  const trend =
    resume?.scoreTrend?.trend || "Start analysing";

  const resumeName =
    resume?.latestResume?.originalName ||
    "No resume selected";

  const summary =
    resume?.latestSummary ||
    "Analyse your resume to receive a clear and practical career verdict.";

  return (
    <article className="career-card flex min-h-[420px] flex-col p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <span className="career-eyebrow">
            Resume verdict
          </span>

          <h3 className="mt-2 break-all font-heading text-2xl font-normal text-career-text sm:text-[30px]">
            {resumeName}
          </h3>
        </div>

        <span className="w-fit rounded-button border border-[#D6CDF4] bg-[#F3EFFF] px-3 py-1.5 text-[11px] text-career-purpleDark">
          Latest draft
        </span>
      </div>

      <div className="mt-9 flex items-end">
        <span className="font-heading text-[90px] leading-[0.75] text-career-text sm:text-[112px]">
          {score}
        </span>

        <div className="ml-3 flex flex-col gap-3 pb-1">
          <span className="text-sm text-career-muted">
            / 100
          </span>

          <span className="flex items-center gap-1.5 text-xs text-career-purpleDark">
            <FiTrendingUp />

            {difference > 0
              ? `+${difference} points`
              : trend}
          </span>
        </div>
      </div>

      <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#E7E2F0]">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-[#6543D0] via-[#8D73E3] to-[#C3B7F5]"
          style={{
            width: `${Math.min(Math.max(score, 0), 100)}%`,
          }}
        />
      </div>

      <p className="my-7 max-w-3xl font-heading text-xl italic leading-8 text-career-muted">
        {summary}
      </p>

      <button
        type="button"
        onClick={() => navigate("/resume-analysis")}
        className="career-text-button mt-auto w-fit"
      >
        Read complete analysis
        <FiArrowRight />
      </button>
    </article>
  );
}

export default ResumeScoreCard;