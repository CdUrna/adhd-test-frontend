export type TestErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
