export const preventDefault =
  (action: () => void) => (e: React.SubmitEvent) => {
    e.preventDefault();
    action();
  };
