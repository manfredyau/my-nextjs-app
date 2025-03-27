import Image from "next/image";
import { getCurrentSession } from "@/actions/auth";

export default async function Home() {
  const { user } = await getCurrentSession();
  return (
    <div>
      {user ? (
        JSON.stringify(user)
      ) : (
        <p className={"text-center text-2xl font-bold -tracking-tighter"}>
          Please log in first.
        </p>
      )}
    </div>
  );
}
