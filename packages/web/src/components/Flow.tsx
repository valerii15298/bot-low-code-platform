import "jsoneditor/dist/jsoneditor.css";
import { useEffect } from "react";

import "react-toggle/style.css";
import styled from "styled-components";
import { Chat } from "../chat/Chat";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { CodeEditor } from "./CodeEditor";
import { Drawflow } from "./Drawflow";
import { FlowInfoSettings } from "./FlowInfoSettings";
import { GroupsSettings } from "./GroupsSettings";
import { Header } from "./Header";
import { NodeSettings } from "./NodeSettings/NodeSettings";
import { TemplateNodeSettings } from "./NodeSettings/TemplateNodeSettings";
import { Sidebar, ToggleSidebar } from "./Sidebar";
import { FlowDiv, Main, MainDiv } from "./StyledComponents";
import { mainWindow, sideWindow } from "../spacing";
import { fetchBotFlowThunk } from "../redux/thunks/fetchBotFlow";

const AppCodeEditor = () => {
  const json = useAppSelector((s) => s);
  return <CodeEditor values={json} setValues={() => null} />;
};

const MainFlow = () => {
  return (
    <FlowDiv>
      <Drawflow />
    </FlowDiv>
  );
};

const MainTab = () => {
  const dispatch = useAppDispatch();
  const sidebarVisible = useAppSelector((s) => s.sidebarVisible) ?? true;
  const mainId = useAppSelector((s) => s.windowConfig.mainId);
  const id = useAppSelector((s) => s.windowConfig.id);
  const version = useAppSelector((s) => s.version);

  if (mainId === mainWindow.templateNodeSettings) {
    return (
      <>
        <TemplateNodeSettings key={id} id={id} />
      </>
    );
  }

  if (mainId === mainWindow.nodeSettings) {
    return <>{<NodeSettings key={id} id={id} />}</>;
  }

  if (mainId === mainWindow.mainFlow) {
    return <MainFlow key={version} />;
  }

  if (mainId === mainWindow.codeEditor) {
    return (
      <>
        <span
          style={{
            position: "absolute",
            zIndex: 2,
            backgroundColor: "white",
            top: -8,
          }}
        >
          {!sidebarVisible && <ToggleSidebar />}
        </span>
        <AppCodeEditor />
      </>
    );
  }
  return null;
};

const RightBar = () => {
  const sideId = useAppSelector((s) => s.windowConfig.sideId);

  if (sideId === sideWindow.flowSettings) {
    return <FlowInfoSettings />;
  }
  if (sideId === sideWindow.groupSettings) {
    return <GroupsSettings />;
  }

  return null;
};

const AppWrapperDiv = styled.div`
  flex: 1;
  //width: calc(100vw - 408px);
  //border-right: 2px solid lightgray;
`;

export const Flow = () => {
  // console.log("Render Flow");

  const dispatch = useAppDispatch();
  useEffect(() => {
    // dispatch(fetchFlow());
    dispatch(fetchBotFlowThunk());
    // dispatch(fetchGroups());
    // dispatch(fetchTemplateNodes());
    // dispatch(initFlow());
  }, []);

  return (
    <MainDiv>
      <AppWrapperDiv>
        <Header />
        <Main>
          <Sidebar />
          <MainTab />
          <RightBar />
        </Main>
      </AppWrapperDiv>
      {/*<Chat />*/}
    </MainDiv>
  );
};
