import { Suspense } from "react";
import AdminSignInForm from "./AdminSignInForm";

export default function AdminSignInPage() {
  return (
    <Suspense>
      <AdminSignInForm />
    </Suspense>
  );
}
