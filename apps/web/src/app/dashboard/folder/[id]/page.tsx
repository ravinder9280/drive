import FolderClient from "./_components/FolderClient";


const FolderPage = async ({ params }: { params: { id?: string } }) => {
  const id = params.id || null;
  return <FolderClient id={id} />;
};

export default FolderPage;