import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Form } from "./form";

const OrganizationIdPage = async () => {
  const boards = await db.board.findMany();
  return (
    <div className="flex flex-col space-y-4">
      <Form />
    </div>
  );
};

export default OrganizationIdPage;
