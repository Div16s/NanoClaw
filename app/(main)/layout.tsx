import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const {userId, has} = await auth();
    if(!userId) {
        redirect("/sign-in");
    }

    const clerkUser = await currentUser();


    const isPaidUser = has({ plan: "pro_plan"});
  return (
    <div className="layout-wrapper">
        <aside className="sidebar-container">
            <div className="sidebar-inner">
                
            </div>
        </aside>
        {children}
        {isPaidUser ? (
            <div className="pro-badge">
                Pro User
            </div>
        ) : (
            <div className="free-badge">
                Free User
            </div>
        )}
    </div>
  );
}