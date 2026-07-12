import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { quickActions } from "../../data/dashboardData";

function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="pt-20">
      <div className="mb-7 grid items-end gap-6 xl:grid-cols-[1fr_0.55fr]">
        <div>
          <span className="career-eyebrow">
            Your toolkit
          </span>

          <h2 className="mt-3 font-heading text-[42px] font-normal leading-none text-career-text sm:text-[56px]">
            One workspace.{" "}

            <em className="font-normal text-career-purple">
              Honest tools.
            </em>
          </h2>
        </div>

        <p className="m-0 text-sm leading-7 text-career-muted">
          Choose your next step based on what you are preparing
          for today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const alternate = index % 2 !== 0;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => navigate(action.path)}
              className={`
                group flex min-h-[260px] flex-col justify-between rounded-card
                border border-career-border p-6 text-left shadow-soft
                transition duration-200 hover:-translate-y-1 hover:border-career-lavender hover:shadow-card
                ${
                  alternate
                    ? "bg-career-surfaceSoft/75"
                    : "bg-white/75"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-career-lavender font-mono text-[11px] text-career-purpleDark">
                  {action.number}
                </span>

                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-career-purpleLight text-xl text-career-purpleDark">
                  <Icon />
                </span>
              </div>

              <div className="my-8">
                <h3 className="font-heading text-[29px] font-normal text-career-text">
                  {action.title}
                </h3>

                <p className="mb-0 mt-2 text-[13px] leading-6 text-career-muted">
                  {action.description}
                </p>
              </div>

              <span className="flex items-center gap-2 text-xs font-semibold text-career-text">
                Open tool

                <FiArrowRight className="transition group-hover:translate-x-1" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;