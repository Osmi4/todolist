import classes from "../styles/TodoItem.module.css";
import { IconButton } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";

const TodoItem = (props) => {
  const deleteItemHandler = () => {
    props.onDelete(props.id);
  };

  const editItemHandler = () => {
    props.onEdit(props.id);
  };

  return (
    <>
      <li className={classes.item} key={props.key}>
        <div>{props.description}</div>
        <div>{props.date}</div>
        <IconButton
          icon={<TrashIcon />}
          className={classes.iconBtn}
          onClick={deleteItemHandler}
        />
        <IconButton
          icon={<EditIcon />}
          className={classes.iconBtn}
          onClick={editItemHandler}
        />
      </li>
    </>
  );
};

export default TodoItem;
