import AppShell from "../layout/AppShell";
import EstimatorLayout from "../layout/EstimatorLayout";
import EstimatorHome from "../../../tools/estimator/ui/EstimatorHome";

export default function EstimatorPage() {
  return (
    <AppShell>
      <EstimatorLayout>
        <EstimatorHome />
      </EstimatorLayout>
    </AppShell>
  );
}
