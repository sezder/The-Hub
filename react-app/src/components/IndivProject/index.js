import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getAllProjects } from "../../store/project";
import { getLists } from "../../store/list";
import { getMessages } from "../../store/message";
import PreviewLists from "./PreviewLists";
import PreviewMessages from "./PreviewMessages";
import "./IndivProject.css";

const IndivProject = () => {
  let { projectId } = useParams();
  projectId = Number(projectId);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getLists(projectId));
    dispatch(getMessages(projectId));
  }, [dispatch, projectId]);

  const currProject = useSelector((state) => state.projects?.[projectId]);
  const lists = useSelector((state) => state.lists);
  let listArr = Object.values(lists);
  if (listArr.length > 3) listArr = listArr.slice(0, 3);

  const messages = useSelector((state) => state.messages);
  let msgsArr = Object.values(messages);
  if (msgsArr.length > 3) msgsArr = msgsArr.slice(0, 3);

  return (
    <main className="indiv_project_page">
      <h1 className="light_large">{currProject?.name}</h1>
      <p>{currProject?.description}</p>

      {/* Membership */}
      <div className="users_projects_div">
        <div className="user_circle"></div>
        <div className="user_circle"></div>
        <div className="user_circle"></div>
        <button>Add People</button>
      </div>

      <div className="messages_lists_div">
        <NavLink to={`/projects/${projectId}/messages`}>
          <section>
            <h2 className="light_medium">Message Board</h2>
            {msgsArr.map((message) => {
              return <PreviewMessages key={message?.id} message={message} />;
            })}
          </section>
        </NavLink>

        <NavLink to={`/projects/${projectId}/lists`}>
          <section>
            <h2 className="light_medium">Recent To-dos</h2>
            {listArr.map((list) => (
              <PreviewLists key={list?.id} list={list} />
            ))}
          </section>
        </NavLink>
      </div>
    </main>
  );
};

export default IndivProject;
