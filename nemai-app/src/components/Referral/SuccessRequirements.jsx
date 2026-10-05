const DEFAULT_REQUIREMENTS = [
  { id: "chat", title: "Chat with AI", description: "Start a conversation with NEM AI.", completed: false },
  { id: "phd", title: "Set up Basic PhD", description: "Complete your Basic PhD profile.", completed: false },
  { id: "puff", title: "Earn 25 Puff Points", description: "Reach at least 25 Puff Points.", completed: false }
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="m5 12 5 5 9-10" />
  </svg>
);

function SuccessRequirements({ requirements = DEFAULT_REQUIREMENTS }) {
  const completedCount = requirements.filter((requirement) => requirement.completed).length;
  const allCompleted = requirements.length > 0 && requirements.every((requirement) => requirement.completed);
  const outcomeStatus = allCompleted ? "achieved" : "pending";

  return (
    <section className="success-requirements" aria-labelledby="success-req-title">
      <header className="success-requirements__header">
        <p className="success-requirements__eyebrow">SUCCESS REQUIREMENTS</p>
        <h2 id="success-req-title">Complete <em>all 3 steps</em> to make your referral successful.</h2>
      </header>

      <div className="success-requirements__flow">
        <ol className="success-requirements__steps">
          {requirements.map((requirement, index) => {
            const status = requirement.completed ? "done" : "todo";

            return (
              <li className="success-requirements__tile" data-status={status} key={requirement.id}>
                <span className="success-requirements__badge" aria-hidden="true">
                  {requirement.completed ? <CheckIcon /> : index + 1}
                </span>
                <h3>{requirement.title}</h3>
                <p>{requirement.description}</p>
                <span className="success-requirements__sr-only">
                  {requirement.completed ? "Completed" : "Not completed"}
                </span>
              </li>
            );
          })}
        </ol>

        <span className="success-requirements__arrow" aria-hidden="true">→</span>

        <div className="success-requirements__outcome" data-status={outcomeStatus}>
          <span className="success-requirements__seal" aria-hidden="true"><CheckIcon /></span>
          <h3>Referral Successful</h3>
          <small>{allCompleted ? "All requirements met" : "When all 3 are done"}</small>
        </div>
      </div>

      <p className="success-requirements__sr-only" aria-live="polite">
        {completedCount} of 3 requirements completed
      </p>
    </section>
  );
}

export default SuccessRequirements;