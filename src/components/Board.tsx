import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import DraggableCard from "./DraggableCard";
import { ITodo, toDoState } from "../Atoms";
import { useSetRecoilState } from "recoil";

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}
interface IForm {
  toDo: string;
}

const Board = ({ toDos, boardId }: IBoardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      console.log("newTodo : ", newTodo);
      return {
        ...allBoards,
        [boardId]: [newTodo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };

  return (
    <Wrapper>
      <Title>{boardId.toUpperCase()}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add Task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                toDoId={toDo.id}
                toDoText={toDo.text}
                index={index}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};
export default Board;

const Wrapper = styled.div`
  padding: 30px 10px 20px;
  border-radius: 4px;
  min-height: 500px;
  background: ${(props) => props.theme.boardColor};
  display: flex;
  flex-direction: column;
`;
const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
    padding: 10px 0 10px 10px;
    border: none;
    margin-bottom: 10px;
  }
`;
const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background: ${(props) =>
    props.isDraggingOver
      ? "#42f5bf"
      : props.isDraggingFromThis
      ? "#ffbb63"
      : "#ccc"};
  flex-grow: 1;
  transition: background 0.2s ease-in-out;
  border-radius: 4px;
`;
