import TodoItem from "./TodoItem";

const TodoList = (props) => {
  return (
    <>
      <ul>
        {props.list.map((item) => (
          <TodoItem
            description={item.description}
            date={item.date}
            key={item.id}
            id={item.id}
            onDelete={props.onDelete}
            onEdit={props.onEdit}
          />
        ))}
      </ul>
    </>
  );
};

export default TodoList;
