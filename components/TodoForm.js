import { useRef, useState } from "react";
import classes from "../styles/TodoForm.module.css";
import Modal from "./Modal.js";

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const TodoForm = (props) => {
  const descriptionInputRef = useRef();
  const dateInputRef = useRef();

  const [enteredDescr, setEnteredDescr] = useState(props.description);
  const [enteredDescrTouched, setEnteredDescrTouched] = useState(false);

  const enteredDescrIsValid = enteredDescr.trim() !== "";
  const descrInputIsInvalid = !enteredDescrIsValid && enteredDescrTouched;

  const [enteredDate, setEnteredDate] = useState(props.date);
  const [enteredDateTouched, setEnteredDateTouched] = useState(false);

  const enteredDateIsValid = enteredDate.trim() !== "";
  const dateInputIsInvalid = !enteredDateIsValid && enteredDateTouched;

  let formIsValid = false;

  if (enteredDescrIsValid && enteredDateIsValid) {
    formIsValid = true;
  }

  const descrInputChangeHandler = (event) => {
    setEnteredDescr(event.target.value);
  };

  const descrInputBlurHandler = (event) => {
    setEnteredDescrTouched(true);
  };

  const dateInputChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  };

  const dateInputBlurHandler = (event) => {
    setEnteredDateTouched(true);
  };

  const submitFormHandler = async (event, { id, description, date }) => {
    event.preventDefault();

    setEnteredDescrTouched(true);
    setEnteredDateTouched(true);

    if (!enteredDateIsValid || !enteredDescrIsValid) {
      return;
    }

    const modifyData = async (item) => {
      // const user =
      //   ctx.loggedInUser.login === "Admin"
      //     ? ctx.viewedUser
      //     : ctx.loggedInUser.login;
      const response = await fetch(
        `https://todolist-763c4-default-rtdb.europe-west1.firebasedatabase.app/users/${props.username}/list/${item.id}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );
      if (!response.ok) {
        throw Error("Could not post data");
      }
    };

    const newItem = { description, date, id: id ? id : makeid(7) };
    // ctx.setTodos((prevState) => [...prevState, newItem]);

    modifyData(newItem);

    setEnteredDescrTouched(false);
    setEnteredDateTouched(false);
    props.onClose();
  };

  return (
    <Modal title={props.title} onClose={props.onClose}>
      <form
        onSubmit={(event) =>
          submitFormHandler(event, {
            id: props.id === "" ? null : props.id,
            description: descriptionInputRef.current.value,
            date: dateInputRef.current.value,
          })
        }
      >
        <label htmlFor="description">Description</label>
        <input
          className={descrInputIsInvalid ? "invalid" : ""}
          ref={descriptionInputRef}
          type="text"
          name="description"
          id="description"
          onChange={descrInputChangeHandler}
          onBlur={descrInputBlurHandler}
          value={enteredDescr}
        />
        {descrInputIsInvalid && (
          <p className="error-text">Description must not be empty.</p>
        )}
        <label htmlFor="date">Date</label>
        <input
          className={dateInputIsInvalid ? "invalid" : ""}
          ref={dateInputRef}
          type="date"
          name="date"
          id="date"
          onChange={dateInputChangeHandler}
          onBlur={dateInputBlurHandler}
          value={enteredDate}
        />
        {dateInputIsInvalid && (
          <p className="error-text">Date must not be empty.</p>
        )}
        <button disabled={!formIsValid} className={classes.submitBtn}>
          Submit
        </button>
        <button
          type="button"
          onClick={props.onClose}
          className={classes.closeBtn}
        >
          Close
        </button>
      </form>
    </Modal>
  );
};

export default TodoForm;
