import createContext from './utils/createContext';
import translateDOMPositionXY from './utils/translateDOMPositionXY';
import isRTL from './utils/isRTL';

export interface Props {
  rtl: boolean;
  hasCustomTreeCol: boolean;
  isTree: boolean;
  translateDOMPositionXY: (style: React.CSSProperties, x: number, y: number) => void;
}

const TableContext = createContext<Props>({
  rlt: isRTL(),
  hasCustomTreeCol: false,
  isTree: false,
  translateDOMPositionXY,
});

export default TableContext;
