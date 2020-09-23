import React, { useEffect, useRef, useState } from 'react';
import Statistic, { StatisticProps } from './Statistic';
import { formatCountdown, countdownValueType, FormatConfig } from './utils';
import { cloneElement } from '../_util/reactNode';
import { useInterval } from '../_hook/'

const REFRESH_INTERVAL = 1000 / 30;

interface CountdownProps extends StatisticProps {
  value?: countdownValueType;
  format?: string;
  onFinish?: () => void;
}

function getTime(value?: countdownValueType) {
  return new Date(value as any).getTime();
}

const Countdown :React.FC<CountdownProps> = (props) => {
  const { value, format, onFinish } = props;
  let [formatter, setFormatter] = useState(value);

  const timestamp = getTime(value);

  const countdownRef = useRef();

  countdownRef.current = (value) => {
    const formatterData = formatCountdown(value, format)
    console.log(formatterData)
    setFormatter(formatterData);
  };

  useEffect(() => {
    let id
    console.log(timestamp)
    if( timestamp >= Date.now()){
      id = setInterval(() => {
        countdownRef.current(value);
      }, REFRESH_INTERVAL);
    }
    return () => {
      if (onFinish && timestamp < Date.now()) {
        onFinish();
      }
      return clearInterval(id)
    };
  }, []);

  // Countdown do not need display the timestamp
  const valueRender = (node: React.ReactElement<HTMLDivElement>) =>
    cloneElement(node, {
      title: undefined,
  });

  return (
    <Statistic valueRender={valueRender} {...props} formatter={() => formatter} />
  );
}

Countdown.defaultProps = {
  format: 'HH:mm:ss',
};

export default Countdown;
