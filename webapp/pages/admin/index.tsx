import dynamic from "next/dynamic";

const AdminPage = dynamic(
  () => import("../../components/admin-layout"),
  {ssr: false}
)

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default AdminPage;
