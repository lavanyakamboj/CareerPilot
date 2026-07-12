import { FiTrendingUp } from "react-icons/fi";

function formatActivityDate(date) {
  if (!date) {
    return "Recently";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RecentActivity({
  activities = [],
}) {
  return (
    <article className="career-card min-h-[410px] p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="career-eyebrow">
            Recent activity
          </span>

          <h3 className="mt-2 font-heading text-[29px] font-normal text-career-text">
            Your latest progress
          </h3>
        </div>

        <span className="flex items-center gap-2 rounded-button border border-career-lavender bg-career-surfaceSoft px-3 py-1.5 text-[11px] text-career-purpleDark">
          <span className="h-1.5 w-1.5 rounded-full bg-career-purple" />
          Live
        </span>
      </div>

      {activities.length > 0 ? (
        <div className="mt-7">
          {activities.slice(0, 4).map((activity, index) => (
            <div
              key={activity._id || `${activity.title}-${index}`}
              className="relative grid min-h-20 grid-cols-[18px_1fr] gap-3"
            >
              {index !==
                Math.min(activities.length, 4) - 1 && (
                <span className="absolute bottom-0 left-[5px] top-4 w-px bg-career-border" />
              )}

              <span className="relative z-10 mt-1 h-3 w-3 rounded-full border-[3px] border-career-purpleLight bg-career-purple" />

              <div>
                <h4 className="font-heading text-lg font-normal text-career-text">
                  {activity.title ||
                    activity.type ||
                    "Career activity"}
                </h4>

                <p className="mb-0 mt-1 text-xs leading-5 text-career-muted">
                  {activity.description ||
                    "Your career workspace was updated."}
                </p>

                <span className="mt-1.5 block text-[10px] text-[#9891A7]">
                  {formatActivityDate(activity.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-career-lavender p-6">
          <FiTrendingUp className="shrink-0 text-2xl text-career-purple" />

          <div>
            <h4 className="font-medium text-career-text">
              Your timeline is quiet
            </h4>

            <p className="mb-0 mt-1 text-xs leading-5 text-career-muted">
              Resume analyses and generated career tools will appear here.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export default RecentActivity;