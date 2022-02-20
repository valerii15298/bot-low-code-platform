import { FC } from "react";
import { capitalize, mapKeyToDisplayName } from "../../models/tools";
import { Details, ListSettingsDiv, StyledSummary } from "./StyledComponents";
import { ObjectKeys } from "../../types/helpers";

export const FormSettings = ({
  path,
  obj,
  RenderElement,
}: {
  path: Array<string>;
  obj: any;
  RenderElement: FC<{ path: any }>;
}) => {
  if (typeof obj !== "object" || obj === null) {
    return <RenderElement path={path} />;
  }

  const items = ObjectKeys(obj as Record<any, unknown>).map((key) => {
    const value = obj[key];
    return (
      <FormSettings
        key={[...path, key].join(".")}
        path={[...path, key]}
        obj={value}
        RenderElement={RenderElement}
      />
    );
  });
  const key = path[path.length - 1];
  const keyName =
    // @ts-ignore
    mapKeyToDisplayName[key] ?? capitalize(key.replace(/_/g, " "));
  return (
    <Details>
      <StyledSummary>{keyName}</StyledSummary>
      <ListSettingsDiv>{items}</ListSettingsDiv>
    </Details>
  );
};
