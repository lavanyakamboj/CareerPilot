import {
  FiArrowRight,
  FiBriefcase,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function RecommendedRoles({
  roles = [],
}) {
  const navigate = useNavigate();

  return (
    <article className="career-card min-h-[410px] p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="career-eyebrow">
            Role direction
          </span>

          <h3 className="mt-2 font-heading text-[29px] font-normal text-career-text">
            Roles worth preparing for
          </h3>
        </div>

        <button
          type="button"
          aria-label="Open job recommendations"
          onClick={() => navigate("/jobs")}
          className="career-icon-button shrink-0"
        >
          <FiArrowRight />
        </button>
      </div>

      {roles.length > 0 ? (
        <div className="mt-7">
          {roles.slice(0, 3).map((role, index) => (
            <div
              key={`${role.role}-${index}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-career-border py-4"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-career-purpleLight font-mono text-[11px] text-career-purpleDark">
                0{index + 1}
              </span>

              <div className="min-w-0">
                <h4 className="truncate font-heading text-xl font-normal text-career-text">
                  {role.role || "Recommended role"}
                </h4>

                <p className="mt-1 text-[11px] text-career-muted">
                  {role.priority || "Suggested priority"}
                </p>
              </div>

              <strong className="font-heading text-3xl font-normal text-career-purpleDark">
                {role.matchPercentage || 0}%
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-career-lavender p-6">
          <FiBriefcase className="shrink-0 text-2xl text-career-purple" />

          <div>
            <h4 className="font-medium text-career-text">
              No roles generated yet
            </h4>

            <p className="mb-0 mt-1 text-xs leading-5 text-career-muted">
              Generate job recommendations from your latest resume analysis.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export default RecommendedRoles;