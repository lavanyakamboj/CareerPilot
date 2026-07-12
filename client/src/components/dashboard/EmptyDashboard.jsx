import {
  FiArrowRight,
  FiUploadCloud,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function EmptyDashboard() {
  const navigate = useNavigate();

  return (
    <section className="career-card grid min-h-[520px] items-center gap-12 overflow-hidden bg-career-card p-7 sm:p-10 xl:grid-cols-[1.15fr_0.72fr] xl:p-14">
      <div>
        <span className="career-eyebrow">
          Your workspace is ready
        </span>

        <h2 className="mt-3 font-heading text-[48px] font-normal leading-[0.98] text-career-text sm:text-[66px]">
          Begin with your resume.
          <br />

          <em className="font-normal text-career-purple">
            We will organise the rest.
          </em>
        </h2>

        <p className="mb-6 mt-5 max-w-2xl text-sm leading-7 text-career-muted">
          Upload your resume to unlock ATS analysis, job matching,
          interview questions and a personalised career roadmap.
        </p>

        <button
          type="button"
          onClick={() => navigate("/upload-resume")}
          className="career-primary-button w-full sm:w-auto"
        >
          <FiUploadCloud />
          Upload first resume
          <FiArrowRight />
        </button>
      </div>

      <div className="rounded-card border border-career-lavender bg-white/75 p-6 shadow-card sm:p-8">
        <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-career-muted">
          <span>Resume verdict</span>
          <span>Waiting</span>
        </div>

        <div className="my-8 font-heading text-[84px] leading-none text-career-text">
          —
        </div>

        <div className="space-y-3">
          <div className="h-2 w-full rounded-full bg-[#E7E2EF]" />
          <div className="h-2 w-3/4 rounded-full bg-[#E7E2EF]" />
          <div className="h-2 w-1/2 rounded-full bg-[#E7E2EF]" />
        </div>

        <div className="mt-7 rounded-2xl bg-career-purpleLight p-4 text-xs text-career-purpleDark">
          Your first analysis will appear here.
        </div>
      </div>
    </section>
  );
}

export default EmptyDashboard;