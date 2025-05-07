import UnauthorizedPage from "@/components/custom/unauthorized/unauthorized";


export default function Page() {
  return <UnauthorizedPage />;
}

export const metadata = {
  title: 'Unauthorized Access',
  description: 'You do not have permission to access this page',
}