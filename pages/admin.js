import { useRouter } from "next/router";
import styles from "../styles/AdminUserPage.module.css";

const AdminUserPage = ({ users }) => {
  const router = useRouter();
  const adminLookupHandler = (username) => {
    router.push(`/${username}`);
  };

  const hideAdminPage = () => {
    router.push("/");
  };

  return (
    <>
      <h6>Welcome Admin</h6>
      <div className={styles.AdminUserPage}>
        {users.map((user) => (
          <div
            key={user.login}
            onClick={() => adminLookupHandler(user.login)}
            className={styles.UserBox}
          >
            {user.login}
          </div>
        ))}
      </div>
      <button className="logoutBtn" onClick={hideAdminPage}>
        Logout
      </button>
    </>
  );
};

export default AdminUserPage;

export async function getServerSideProps() {
  const response = await fetch(
    `https://todolist-763c4-default-rtdb.europe-west1.firebasedatabase.app/users.json`
  );

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  const data = await response.json();

  const loadedUsers = [];

  for (const key in data) {
    if (data[key].login !== "Admin") {
      loadedUsers.push({
        login: key,
        list: data[key].list,
      });
    }
  }

  return {
    props: {
      users: loadedUsers,
    },
  };
}
