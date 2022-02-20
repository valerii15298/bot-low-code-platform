import Toggle from "react-toggle";
import settingsPng from "../assets/flowsettings.png";
import { setStateAction } from "../redux/actions";
import { postFlow } from "../redux/api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { SelectFlowVersion } from "./SelectFlowVersion";
import { ToggleSidebar } from "./Sidebar";
import {
  ActiveLabel,
  Controls,
  DeleteFlowButton,
  FlowSubtitle,
  FlowTitle,
  HeaderSection,
  InfoDiv,
  SaveFlowButton,
  ToggleButton,
} from "./StyledComponents";
import { FormControlLabel, Switch } from "@mui/material";
import { actions, selectActiveDrawflow } from "../redux/drawflowSlice";
import { mainWindow, sideWindow } from "../spacing";

export const Header = () => {
  const dispatch = useAppDispatch();
  const isLive = useAppSelector((s) => selectActiveDrawflow(s).live);
  const isDraft = useAppSelector((s) => selectActiveDrawflow(s).isDraft);

  const sidebarVisible = useAppSelector((s) => s.sidebarVisible) ?? true;
  const mainId = useAppSelector((s) => s.windowConfig.mainId);

  // TODO get data from apollo
  const { flow_name, flow_description, flow_active } = {
    flow_description: "desc",
    flow_name: "name",
    flow_active: true,
  };
  // console.log({ flow_active });

  return (
    <HeaderSection>
      <Controls>
        {!sidebarVisible ? <ToggleSidebar /> : null}
        {/*<CircleSpan>*/}
        {/*  <Arrow height={14} />*/}
        {/*</CircleSpan>*/}
        <InfoDiv>
          <FlowTitle>{flow_name || "Loading ..."}</FlowTitle>
          <FlowSubtitle>{flow_description || "Loading ..."}</FlowSubtitle>
        </InfoDiv>
      </Controls>

      <Controls>
        <ToggleButton
          onClick={() =>
            dispatch(
              setStateAction({
                windowConfig: { mainId: mainWindow.mainFlow },
              })
            )
          }
        >
          Diagram view
        </ToggleButton>
        <ToggleButton
          onClick={() =>
            dispatch(
              setStateAction({
                windowConfig: { mainId: mainWindow.codeEditor },
              })
            )
          }
        >
          Code editor
        </ToggleButton>
        <ToggleButton>
          <ActiveLabel>
            <span>Active</span>
            <Toggle
              checked={!!flow_active}
              icons={{
                checked: null,
                unchecked: null,
              }}
              onChange={(e) => console.log("toggle")}
            />
          </ActiveLabel>
        </ToggleButton>
        <ToggleButton
          onClick={() =>
            dispatch(
              setStateAction({
                windowConfig: { sideId: sideWindow.flowSettings },
              })
            )
          }
        >
          <img src={settingsPng} alt="" />
        </ToggleButton>
      </Controls>
      {mainId === mainWindow.mainFlow && (
        <Controls>
          <FormControlLabel
            disabled={isDraft}
            control={
              <Switch
                checked={isLive}
                onChange={(e) => {
                  dispatch(actions.setState({ live: e.target.checked }));
                }}
              />
            }
            label="Live:"
            labelPlacement={"start"}
            sx={{ mr: 2 }}
          />
          <SelectFlowVersion />
        </Controls>
      )}

      <Controls>
        <DeleteFlowButton>Delete flow</DeleteFlowButton>
        <SaveFlowButton onClick={() => dispatch(postFlow())}>
          Save flow
        </SaveFlowButton>
      </Controls>
    </HeaderSection>
  );
};
