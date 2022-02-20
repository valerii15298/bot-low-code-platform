import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientPos } from "../../types/helpers";
import { flowType } from "../../types/reduxStoreState";
import {
  actions,
  getDefaultProcessEntitiesPayload,
  selectActiveDrawflow,
} from "../drawflowSlice";
import { cache } from "../../graphql/apollo";
import gql from "graphql-tag";
import { TemplateNodeFragmentDoc } from "../../generated/graphql-request";
import { node, pureTemplateNode } from "../../types/node.types";
import { getId } from "../getId";
import handler, { exclude } from "../../models/tools";
import { portType } from "../../spacing";
import { sdk, undoThunk } from "../api";
import { getDefaultFlowNode } from "../../models/getDefaultFlowNode";

export const addNewNodeThunk = createAsyncThunk(
  "addNewNodeThunk",
  (mouseBlockDragPos: clientPos, { getState, dispatch }) => {
    const { clientX, clientY } = mouseBlockDragPos;
    const appState = getState() as flowType;
    const state = selectActiveDrawflow(appState);

    const { dragTemplate } = appState;
    if (typeof dragTemplate !== "number") return;
    const templateNode = cache.readFragment({
      id: `TemplateNode:${dragTemplate}`,
      fragment: gql`
        fragment templateDrag on TemplateNode {
          ...templateNode
        }
        ${TemplateNodeFragmentDoc}
      `,
      fragmentName: "templateDrag",
    });
    if (!templateNode) {
      throw new TypeError("Fragment not found");
    }
    const { info, NodeProps } = templateNode as pureTemplateNode;
    if (!appState.canvas) {
      throw new TypeError("Canvas shape is not available");
    }

    const data = getDefaultProcessEntitiesPayload();

    // use template to get data for node
    const id = getId();
    const node: node = {
      ...getDefaultFlowNode(),
      NodeProps,
      info,
      id,
    };

    node.pos = handler.getPos(
      clientX,
      clientY,
      state.config.zoom.value,
      appState.canvas
    );

    data.drawflow.add.push(node);

    data.ports.add.push(
      {
        id: getId(),
        type: portType.in,
        nodeId: id,
        portId: 1,
        pos: {
          x: 0,
          y: 0,
        },
      },
      {
        id: getId(),
        type: portType.out,
        nodeId: id,
        portId: 1,
        pos: {
          x: 0,
          y: 0,
        },
      },
      {
        id: getId(),
        type: portType.out,
        nodeId: id,
        portId: 2,
        pos: {
          x: 0,
          y: 0,
        },
      }
    );

    const execute = () => {
      dispatch(actions.processEntities({ data, pushToUndoRedo: true }));
      dispatch(
        actions.setState({
          mouseBlockDragPos,
          select: {
            type: "node",
            selectId: id,
          },
          config: { drag: true },
        })
      );
    };

    if (state.isDraft || state.live) {
      execute();
    }
    if (state.live) {
      const type = node.NodeProps.type;
      const propsKey = `Node${type}Props` as const;
      const props = node.NodeProps[propsKey];
      sdk
        .createFlowNode({
          data: {
            flow: { connect: { id: appState.version } },
            NodeProps: { create: { type, [propsKey]: props } },
            info: { create: exclude(node.info, "id") },
            ports: {
              createMany: {
                data: data.ports.add.map((port) => ({
                  id: port.id,
                  index: port.portId + Number(port.type === portType.out),
                })),
              },
            },
          },
        })
        .then(console.log)
        .catch((err) => {
          console.log({ err });
          dispatch(undoThunk());
        });
    }
  }
);
