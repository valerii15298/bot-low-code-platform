import { actions } from "../redux/drawflowSlice";
import { useAppDispatch } from "../redux/hooks";
import { usePathIsSelected } from "../redux/selectors";
import { StyledPath, Svg } from "./StyledComponents";

type Props = {
  id?: number;
  d: string;
};

export const Path = (props: Props) => {
  const { id, d } = props;
  const selected = usePathIsSelected(id);
  const dispatch = useAppDispatch();

  return (
    <Svg>
      <title>{id}</title>
      <StyledPath
        id={`path${id}`}
        selected={selected}
        d={d}
        onMouseDown={(e) => {
          if (id === undefined) return;
          e.stopPropagation();
          // if (editLock) return;
          dispatch(
            actions.select({
              type: "path",
              selectId: id,
            })
          );
        }}
      />
      {import.meta.env.DEV && (
        <text>
          <textPath
            href={`#path${id}`}
            startOffset="50%"
            textAnchor="middle"
            fontSize={"1.2em"}
            fill={"violet"}
            fontWeight="bold"
          >
            {id}
          </textPath>
        </text>
      )}
    </Svg>
  );
};
