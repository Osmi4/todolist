import TodoList from "../components/TodoList";
import { useRouter } from "next/router";
import {
  UserButton,
  useUser,
  useAuth,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import TodoForm from "@/components/TodoForm";
import styles from "../styles/Home.module.css";
import { useState } from "react";

const UserPage = (props) => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState({
    description: "",
    date: "",
    id: "",
  });

  const router = useRouter();

  const { user, isLoaded, isLoading, isSignedIn } = useUser();

  const { userId } = useAuth();
  if (!isLoaded) return;
  const deleteItemHandler = async (id) => {
    // const user =
    //   loggedInUser.login === "Admin" ? viewedUser : loggedInUser.login;

    const response = await fetch(
      `https://todolist-763c4-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/list/${id}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw Error("Could not post data");
    }
    router.push(`./`);
  };

  const editItemHandler = async (id) => {
    const response = await fetch(
      `https://todolist-763c4-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/list/${id}.json`
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await response.json();
    setEditData(data);
    setShowForm(true);
  };

  // const sortListHandler = () => {
  //   // const newTodos = list.sort(function (a, b) {
  //   //   return new Date(a.date) - new Date(b.date);
  //   // });
  //   // list = newTodos;
  //   router.push(`./`);
  // };

  const addEvent = () => {
    setShowForm(true);
  };

  const hideForm = () => {
    setShowForm(false);
    setEditData({
      description: "",
      date: "",
      id: "",
    });
    router.push(`./`);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>Todo List</div>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <div>
            <SignInButton className="loginBtn" />
            &nbsp;
            <SignUpButton />
          </div>
        )}
      </header>
      {isLoading ? (
        <></>
      ) : (
        <>
          {isSignedIn ? (
            <>
              <div className={styles.label}>Welcome {user.firstName}!</div>
              <TodoList
                list={props.__clerk_ssr_state.todos}
                onDelete={deleteItemHandler}
                onEdit={editItemHandler}
              />
              {showForm && (
                <TodoForm
                  onClose={hideForm}
                  title={editData.id === "" ? "New Todo" : "Edit Todo"}
                  date={editData.date}
                  description={editData.description}
                  id={editData.id}
                  username={userId}
                />
              )}
              <button onClick={addEvent}>Add New Todo</button>
              {/* <button
                disabled={props.__clerk_ssr_state.todos.length === 0}
                onClick={sortListHandler}
              >
                Sort by date
              </button> */}
            </>
          ) : (
            <div className={styles.label}>
              Sign in to create your todo list!
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserPage;

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);

  const response = await fetch(
    `https://todolist-763c4-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/list.json`
  );

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  const data = await response.json();

  const todos = [];
  for (const key in data) {
    todos.push({
      id: data[key].id,
      description: data[key].description,
      date: data[key].date,
    });
  }

  return {
    props: { ...buildClerkProps(context.req, { todos }) },
  };
}
