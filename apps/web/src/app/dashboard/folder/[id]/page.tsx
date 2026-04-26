import FolderClient from "./_components/FolderClient";

const FolderPage = async ({ params }: { params: Promise<{ id?: string }> }) => {
  const { id } = await params;
  return <FolderClient folderId={id || null} />;
};

export default FolderPage;
